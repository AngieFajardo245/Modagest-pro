const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const [tipo, token] = authHeader.trim().split(/\s+/);

  if (tipo?.toLowerCase() !== "bearer" || !token) {
    return res.status(401).json({
      message: "Formato inválido. Use Bearer token",
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET no definido");
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (!decoded.id || !decoded.rol) {
      return res.status(401).json({ message: "Token inválido" });
    }

    req.usuario = {
      id: decoded.id,
      rol: decoded.rol,
    };

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Sesión expirada" });
    }

    return res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = verificarToken;
