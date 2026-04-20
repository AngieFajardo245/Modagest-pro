const jwt = require("jsonwebtoken");
require("dotenv").config();

const verificarToken = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    /* ===============================
    VALIDAR HEADER
    ================================ */
    if (!authHeader) {
      return res.status(401).json({
        message: "Acceso denegado. Token requerido."
      });
    }

    /* ===============================
    VALIDAR FORMATO BEARER
    ================================ */
    const partes = authHeader.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
      return res.status(400).json({
        message: "Formato de token inválido. Use: Bearer <token>"
      });
    }

    const token = partes[1];

    /* ===============================
    VERIFICAR TOKEN
    ================================ */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* ===============================
    VALIDAR CONTENIDO DEL TOKEN
    ================================ */
    if (!decoded.id || !decoded.rol) {
      return res.status(401).json({
        message: "Token inválido (datos incompletos)"
      });
    }

    /* ===============================
    GUARDAR USUARIO EN REQUEST
    ================================ */
    req.usuario = {
      id: decoded.id,
      rol: decoded.rol
    };

    next();

  } catch (error) {

    console.error("Error verificando token:", error.message);

    /* ===============================
    ERRORES MÁS CLAROS
    ================================ */
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expirado"
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Token inválido"
      });
    }

    return res.status(500).json({
      message: "Error interno al validar el token"
    });

  }

};

module.exports = verificarToken;