import multer from "multer";
import sharp from "sharp";
import fs from "fs";

//Configuracion del Uploads (MULTER)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //Ponemos la ruta siempre terminando con un /
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()} - ${file.originalname}`);
  },
});

//Configuracion del Uploads (MULTER)
const multerFilter = (req, file, cb) => {
  //"image/jpg o image/png" proviene del formData key en este caso sera image
  //tiene que coincidir si o si
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb({
      message: "Formato de imagen incorrecto/incopatible",
    });
  }
};

// Configuracion de Multer y Sharp middleware de imagenes de user
const userImgResieze = async (req, res, next) => {
  if (!req.files) return next();

  await Promise.all(
    req.files.map(async (files) => {
      const { path, filename } = files;
      const fileExtension = filename.split(".").pop().toLowerCase();

      if (["jpeg", "png"].includes(fileExtension)) {
        await sharp(path)
          .resize(300, 300)
          .toFormat(fileExtension === "png" ? "png" : "jpeg")
          .jpeg({ quality: 90 })
          .png({ quality: 90 });
      } else {
        return res.status(401).json({
          message: `Formato de archivo no admitido ${fileExtension}`,
        });
      }
    })
  );

  next();
};

// Midleware de Uploads
const uploads = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { files: 2000000 },
});

export { uploads, userImgResieze };
