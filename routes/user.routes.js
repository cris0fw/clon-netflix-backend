import express from "express";
import {
  UploadImage,
  addToFavorites,
  deleteToFavorites,
  editarPerfil,
  getMoviesFavorites,
  login,
  logout,
  register,
} from "../controllers/auth.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploads, userImgResieze } from "../middlewares/uploadImages.js";
const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/moviesFavorites", authMiddleware, getMoviesFavorites);
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/addFavorites", authMiddleware, addToFavorites);

userRouter.delete("/deleteAdd/:movieId", authMiddleware, deleteToFavorites);

userRouter.post(
  "/upload-image",
  authMiddleware,
  uploads.array("image", 10),
  userImgResieze,
  UploadImage
);

userRouter.put("/edit-profile", authMiddleware, editarPerfil);

export default userRouter;
