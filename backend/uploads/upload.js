const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ================= RUTA ================= */
const uploadPath = path.join(__dirname, "../uploads");

/* ================= CREAR CARPETA ================= */
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

/* ================= STORAGE ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    const nombreBase = file.originalname
      .replace(ext, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-"); // limpio

    const nombreFinal =
      Date.now() + "-" + nombreBase + ext;

    cb(null, nombreFinal);
  }
});

/* ================= VALIDACION ================= */
const fileFilter = (req, file, cb) => {

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  const ext = path.extname(file.originalname).toLowerCase();

  const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];

  if (
    allowedTypes.includes(file.mimetype) &&
    allowedExt.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes JPG, PNG o WEBP"), false);
  }
};

/* ================= CONFIG ================= */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});

module.exports = upload;