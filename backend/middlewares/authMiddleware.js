const jwt = require("jsonwebtoken");

require("dotenv").config();

/* ================= VERIFICAR TOKEN ================= */

const verificarToken = (req, res, next) => {

  try {

    /* ================= HEADER ================= */

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({

        message:
          "Token requerido"

      });

    }

    /* ================= FORMATO ================= */

    const partes =
      authHeader.split(" ");

    if (

      partes.length !== 2 ||

      partes[0].toLowerCase() !== "bearer"

    ) {

      return res.status(401).json({

        message:
          "Formato inválido. Use Bearer token"

      });

    }

    const token = partes[1];

    /* ================= TOKEN VACIO ================= */

    if (!token || token.trim() === "") {

      return res.status(401).json({

        message:
          "Token vacío"

      });

    }

    /* ================= SECRET ================= */

    if (!process.env.JWT_SECRET) {

      console.error(
        "❌ JWT_SECRET no definido"
      );

      return res.status(500).json({

        message:
          "Error interno del servidor"

      });

    }

    /* ================= VERIFICAR ================= */

    const decoded = jwt.verify(

      token,

      process.env.JWT_SECRET

    );

    /* ================= VALIDAR DATA ================= */

    if (
      !decoded.id ||
      !decoded.rol
    ) {

      return res.status(401).json({

        message:
          "Token inválido"

      });

    }

    /* ================= GUARDAR USUARIO ================= */

    req.usuario = {

      id: decoded.id,

      rol: decoded.rol

    };

    next();

  } catch (error) {

    console.error(
      "❌ Error token:",
      error.message
    );

    /* ================= TOKEN EXPIRADO ================= */

    if (
      error.name === "TokenExpiredError"
    ) {

      return res.status(401).json({

        message:
          "Sesión expirada"

      });

    }

    /* ================= TOKEN INVALIDO ================= */

    if (
      error.name === "JsonWebTokenError"
    ) {

      return res.status(401).json({

        message:
          "Token inválido"

      });

    }

    /* ================= ERROR GENERAL ================= */

    return res.status(401).json({

      message:
        "No autorizado"

    });

  }

};

module.exports = verificarToken;