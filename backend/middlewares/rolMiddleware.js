const verificarRol = (...rolesPermitidos) => {
  const rolesNormalizados = rolesPermitidos.map((rol) =>
    String(rol).toLowerCase().trim()
  );

  return (req, res, next) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          message: "Usuario no autenticado",
        });
      }

      const rolUsuario = req.usuario.rol;

      if (!rolUsuario) {
        return res.status(403).json({
          message: "Usuario sin rol asignado",
        });
      }

      const rolNormalizado = String(rolUsuario)
        .toLowerCase()
        .trim();

      if (!rolesNormalizados.includes(rolNormalizado)) {
        return res.status(403).json({
          message: `Acceso denegado. Roles permitidos: ${rolesPermitidos.join(", ")}`,
        });
      }

      next();
    } catch (error) {
      console.error("Error verificando rol:", error.message);

      return res.status(403).json({
        message: "No autorizado",
      });
    }
  };
};

module.exports = verificarRol;