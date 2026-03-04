const jwt = require("jsonwebtoken");
require("dotenv").config();

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verificar que exista el header
  if (!authHeader) {
    return res.status(401).json({
      message: "Acceso denegado. Token requerido."
    });
  }

  // Verificar formato Bearer
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      message: "Formato de token inválido. Use: Bearer <token>"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos los datos del usuario en la request
    req.usuario = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o expirado"
    });
  }
};

module.exports = verificarToken;