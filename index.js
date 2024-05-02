import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./utils/database.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

dotenv.config({
  path: ".env",
});

// CONEXION A BASE DE DATOS
databaseConnection();

// IMPORTACIONES DE RUTAS
import userRouter from "./routes/user.routes.js";

const corsOption = {
  origin: "https://clonnetflix.netlify.app",
  credentials: true,
};

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOption));

//USO DE RUTAS
app.get("/", async (req, res) => {
  try {
    return res.status(200).json({
      message: "Bienvenido a la API de netflix",
    });
  } catch (error) {
    console.log(error);
  }
});

app.use("/api/v1/auth", userRouter);

// PUERTO
const PORT = 4000 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT} 😈`);
});
