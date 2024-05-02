import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import tokenGenerate from "../config/generateToken.js";
import generateRefreshToken from "../config/refreshToken.js";
import { cloudinaryUploading } from "../utils/cloudinary.js";
import fs from "fs";
import Movie from "../models/movieModel.js";

const register = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(401).json({
        message: "Datos invalidos",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({
        message: "Este email ya existe",
        success: false,
      });
    }

    const savedDates = new User({ fullName, email, password });
    await savedDates.save();

    return res.status(201).json({
      message: "Cuenta creada satisfactoriamente",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Se produjo un error interno del servidor" + error,
      success: false,
    });
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "Datos invalidos",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    const refreshToken = await generateRefreshToken(user?._id);

    const updateUser = await User.findByIdAndUpdate(
      user?._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    if (!user) {
      return res.status(401).json({
        message: "credenciales invalidos",
        success: false,
      });
    }

    const resPassword = await user.comparePassword(password);

    if (!resPassword) {
      return res.status(401).json({
        message: "credenciales invalidos",
        success: false,
      });
    }

    return res.status(200).json({
      id: user?._id,
      nombre: user?.fullName,
      imagen: user?.images,
      cratedAt: user?.createdAt,
      updatedAt: user?.updatedAt,
      token: tokenGenerate(user?._id),
    });
  } catch (error) {
    console.log(error);
  }
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  try {
    if (!cookie?.refreshToken) {
      return res.status(401).json({
        message: "No hay refresh token en cookies",
        success: false,
      });
    }

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });

      return res.sendStatus(204);
    }

    await User.findByIdAndUpdate(
      { refreshToken: refreshToken },
      {
        refreshToken: "",
      }
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });

    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
  }
});

const editarPerfil = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    const { fullName, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        fullName,
        email,
      },
      {
        new: true,
      }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({
      message: `Error de servidor ${error.message}`,
    });
  }
});

const UploadImage = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploading(path);
    const urls = [];
    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not fount not exist",
      });
    }

    for (const file of req.files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }

    await User.findByIdAndUpdate(
      id,
      {
        images: urls,
      },
      { new: true }
    );

    return res.status(200).json(urls);
  } catch (error) {
    return res.status(500).json({
      message: `Error de servidor ${error.message}`,
    });
  }
});

const addToFavorites = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    const { title, popularity, image } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const addMovie = new Movie({ title, popularity, image });
    await addMovie.save();

    user.favorites.push(addMovie);
    await user.save();

    await user.populate("favorites");

    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

const deleteToFavorites = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    const movieId = req.params.movieId;

    const user = await User.findByIdAndUpdate(
      id,
      { $pull: { favorites: movieId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "usuario no encontrado",
      });
    }

    await Movie.findByIdAndDelete(movieId);

    return res
      .status(200)
      .json({ message: "Eliminado de la lista de favoritos" });
  } catch (error) {
    console.log(error);
  }
});

const getMoviesFavorites = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id).populate("favorites");

    if (!User) {
      return res.status(404).json({
        message: "usuario no encontrado",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
});

export {
  register,
  login,
  logout,
  editarPerfil,
  addToFavorites,
  deleteToFavorites,
  getMoviesFavorites,
  UploadImage,
};
