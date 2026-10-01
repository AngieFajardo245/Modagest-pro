const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");
const { v2: cloudinary } = require("cloudinary");

const uploadPath = path.join(__dirname, "../uploads");

fs.mkdirSync(uploadPath, { recursive: true });

const usarCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET,
);

if (usarCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

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
  storage: usarCloudinary ? multer.memoryStorage() : almacenamientoLocal,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
});

const subirACloudinary = (archivo) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "modagest-pro/productos",
        resource_type: "image",
      },
      (error, resultado) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(resultado);
      },
    );

    stream.end(archivo.buffer);
  });

const single = (campo) => {
  const procesarArchivo = multerUpload.single(campo);

  return (req, res, next) => {
    procesarArchivo(req, res, async (error) => {
      if (error) {
        next(error);
        return;
      }

      if (!req.file || !usarCloudinary) {
        next();
        return;
      }

      try {
        const resultado = await subirACloudinary(req.file);
        req.file.filename = resultado.secure_url;
        req.file.publicId = resultado.public_id;
        next();
      } catch (uploadError) {
        next(uploadError);
      }
    });
  };
};

const obtenerPublicId = (imagen) => {
  if (!imagen || !/^https?:\/\//i.test(imagen)) {
    return null;
  }

  try {
    const url = new URL(imagen);
    const marcador = "/upload/";
    const posicion = url.pathname.indexOf(marcador);

    if (posicion === -1) {
      return null;
    }

    return decodeURIComponent(url.pathname.slice(posicion + marcador.length))
      .replace(/^v\d+\//, "")
      .replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
};

const eliminarImagen = async (imagen) => {
  if (!imagen) {
    return;
  }

  const publicId = obtenerPublicId(imagen);

  if (usarCloudinary && publicId) {
    await cloudinary.uploader.destroy(publicId);
    return;
  }

  if (/^https?:\/\//i.test(imagen)) {
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
