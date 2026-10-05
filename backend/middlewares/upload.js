const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");
const ImageKit = require("@imagekit/nodejs").default;
const { toFile } = require("@imagekit/nodejs");

const uploadPath = path.join(__dirname, "../uploads");

fs.mkdirSync(uploadPath, { recursive: true });

const usarImageKit = Boolean(process.env.IMAGEKIT_PRIVATE_KEY);

const imagekit = usarImageKit
  ? new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  })
  : null;

const extensionesPermitidas = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const extensionesFinales = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const almacenamientoLocal = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    callback(null, `${randomUUID()}${extensionesFinales[file.mimetype]}`);
  },
});

const fileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const extensiones = extensionesPermitidas[file.mimetype];

  if (!extensiones?.includes(extension)) {
    return callback(new Error("Solo se permiten imágenes JPG, PNG o WEBP"));
  }

  return callback(null, true);
};

const multerUpload = multer({
  storage: usarImageKit ? multer.memoryStorage() : almacenamientoLocal,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
});

const subirAImageKit = async (archivo) => {
  const nombreArchivo = `${randomUUID()}${extensionesFinales[archivo.mimetype]}`;
  const contenido = await toFile(archivo.buffer, nombreArchivo);

  return imagekit.files.upload({
    file: contenido,
    fileName: nombreArchivo,
    folder: "/modagest-pro/productos",
    useUniqueFileName: false,
  });
};

const single = (campo) => {
  const procesarArchivo = multerUpload.single(campo);

  return (req, res, next) => {
    procesarArchivo(req, res, async (error) => {
      if (error) {
        next(error);
        return;
      }

      if (!req.file || !usarImageKit) {
        next();
        return;
      }

      try {
        const resultado = await subirAImageKit(req.file);

        req.file.filename = resultado.url;
        req.file.fileId = resultado.fileId;

        next();
      } catch (uploadError) {
        next(uploadError);
      }
    });
  };
};

const eliminarImagen = async (imagen, imagenId) => {
  if (usarImageKit && imagenId) {
    await imagekit.files.delete(imagenId);
    return;
  }

  if (!imagen || /^https?:\/\//i.test(imagen)) {
    return;
  }

  const nombreImagen = path.basename(imagen);
  const rutaImagen = path.join(uploadPath, nombreImagen);

  if (fs.existsSync(rutaImagen)) {
    fs.unlinkSync(rutaImagen);
  }
};

module.exports = {
  single,
  eliminarImagen,
};