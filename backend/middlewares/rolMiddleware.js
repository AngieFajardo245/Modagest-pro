const verificarRol = (...rolesPermitidos) => {
  const rolesNormalizados = rolesPermitidos.map((rol) =>
    String(rol).toLowerCase().trim(),
  );

  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    const rolUsuario = String(req.usuario.rol || "")
      .toLowerCase()
      .trim();

    if (!rolUsuario) {
      return res.status(403).json({
        message: "Usuario sin rol asignado",
      });
    }

    if (!rolesNormalizados.includes(rolUsuario)) {
      return res.status(403).json({
        message: "Acceso denegado",
      });
    }

    return next();
  };
};

module.exports = verificarRol;
