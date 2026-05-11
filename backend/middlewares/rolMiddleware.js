const verificarRol = (...rolesPermitidos) => {

  // Normalizar roles permitidos una sola vez
  const rolesNormalizados = rolesPermitidos.map(r =>
    r.toLowerCase().trim()
  );

  return (req, res, next) => {

    try {

      /* ===============================
      VALIDAR AUTENTICACIÓN
      ================================ */
      if (!req.usuario) {
        return res.status(401).json({
          message: "Usuario no autenticado"
        });
      }

      const { rol } = req.usuario;

      /* ===============================
      VALIDAR QUE EXISTA ROL
      ================================ */
      if (!rol) {
        return res.status(403).json({
          message: "El usuario no tiene rol asignado"
        });
      }

      const rolNormalizado = rol.toLowerCase().trim();

      /* ===============================
      VALIDAR PERMISOS
      ================================ */
      if (!rolesNormalizados.includes(rolNormalizado)) {

        return res.status(403).json({
          message: `Acceso denegado. Se requiere: ${rolesPermitidos.join(" o ")}`
        });
      }

      next();

    } catch (error) {

      console.error("Error en verificarRol:", error.message);

      return res.status(500).json({
        message: "Error interno en autorización"
      });

    }

  };

};

module.exports = verificarRol;