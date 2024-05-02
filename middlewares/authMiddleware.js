import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);

        req.user = user;

        next();
      }
    } catch (error) {
      return res.status(401).json({
        message: "El token no autorizado ha caducado. Inicie sesión de nuevo",
        success: false,
      });
    }
  } else {
    return res.status(401).json({
      message: "no hay ningún token adjunto al encabezado",
      success: false,
    });
  }
});

export { authMiddleware };
