import mongoose from "mongoose";

const databaseConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Mongo conectado correctamente 😃");
    })
    .catch((error) => {
      console.log("Fallo la conexion ❌" + error);
    });
};

export default databaseConnection;
