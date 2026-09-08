const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");

const productosPath = path.join(__dirname, "../uploads/productos");

fs.mkdirSync(productosPath, { recursive: true });

const tiposPermitidos = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productosPath);
  },

  filename: (req, file, cb) => {
    const extension = tiposPermitidos[file.mimetype];
    cb(null, `${randomUUID()}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const extensionEsperada = tiposPermitidos[file.mimetype];

  if (!extensionEsperada || extension !== extensionEsperada) {
    return cb(new Error("Solo se permiten imágenes JPG, PNG o WEBP"), false);
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
});

module.exports = upload;
