const jwt = require("jsonwebtoken");

require("dotenv").config();

const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token requerido",
      });
    }

    const partes = authHeader.split(" ");

    if (partes.length !== 2 || partes[0].toLowerCase() !== "bearer") {
      return res.status(401).json({
        message: "Formato inválido. Use Bearer token",
      });
    }

    const token = partes[1];

    if (!token || token.trim() === "") {
      return res.status(401).json({
        message: "Token vacío",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET no definido");

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id || !decoded.rol) {
      return res.status(401).json({
        message: "Token inválido",
      });
    }

    req.usuario = {
      id: decoded.id,
      rol: decoded.rol,
    };

    next();
  } catch (error) {
    console.error("Error verificando token:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Sesión expirada",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Token inválido",
      });
    }

    return res.status(401).json({
      message: "No autorizado",
    });
  }
};

module.exports = verificarToken;
