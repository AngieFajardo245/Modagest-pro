const verificarRol = (...rolesPermitidos) => {

  /* ================= NORMALIZAR ROLES ================= */

  const rolesNormalizados =
    rolesPermitidos.map(rol =>

      String(rol)
        .toLowerCase()
        .trim()

    );

  return (req, res, next) => {

    try {

      /* ================= VALIDAR USUARIO ================= */

      if (!req.usuario) {

        return res.status(401).json({

          message:
            "Usuario no autenticado"

        });

      }

      /* ================= VALIDAR ROL ================= */

      const rolUsuario =
        req.usuario.rol;

      if (!rolUsuario) {

        return res.status(403).json({

          message:
            "Usuario sin rol asignado"

        });

      }

      const rolNormalizado =
        String(rolUsuario)
          .toLowerCase()
          .trim();

      /* ================= VALIDAR PERMISOS ================= */

      const tienePermiso =

        rolesNormalizados.includes(
          rolNormalizado
        );

      if (!tienePermiso) {

        return res.status(403).json({

          message:
            `Acceso denegado. Roles permitidos: ${rolesPermitidos.join(", ")}`

        });

      }

      /* ================= CONTINUAR ================= */

      next();

    } catch (error) {

      console.error(
        "❌ Error verificarRol:",
        error.message
      );

      return res.status(403).json({

        message:
          "No autorizado"

      });

    }

  };

};

module.exports = verificarRol;