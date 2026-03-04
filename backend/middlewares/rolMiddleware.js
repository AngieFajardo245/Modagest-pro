const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    // Verificar autenticación previa
    if (!req.usuario) {
      return res.status(401).json({
        message: "Usuario no autenticado."
      });
    }

    const { rol } = req.usuario;

    // Verificar que el usuario tenga rol definido
    if (!rol) {
      return res.status(403).json({
        message: "Rol no definido. Acceso denegado."
      });
    }

    // Verificar permisos
    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({
        message: `Acceso denegado. Rol requerido: ${rolesPermitidos.join(" o ")}`
      });
    }

    next();
  };
};

module.exports = verificarRol;