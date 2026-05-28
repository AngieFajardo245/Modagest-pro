require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const path = require("path");
const fs = require("fs");

const multer = require("multer");

const sequelize = require("./config/database");

/* ================= MODELOS ================= */

const Usuario = require("./models/Usuario");
const Producto = require("./models/Producto");
const Venta = require("./models/Venta");
const Categoria = require("./models/Categoria");
const Carrito = require("./models/Carrito");
const Direccion = require("./models/Direccion");
const Pago = require("./models/Pago");
const DetalleVenta = require("./models/DetalleVenta");

/* ================= MIDDLEWARES ================= */

const verificarToken = require("./middlewares/authMiddleware");
const verificarRol = require("./middlewares/rolMiddleware");

const app = express();

/* ========================================================= */
/* ======================= MIDDLEWARES ====================== */
/* ========================================================= */

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

/* ========================================================= */
/* ========================= UPLOADS ======================== */
/* ========================================================= */

const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {

  fs.mkdirSync(uploadPath, {
    recursive: true
  });

}

app.use(
  "/uploads",
  express.static(uploadPath)
);

/* ================= MULTER ================= */

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, uploadPath);

  },

  filename: (req, file, cb) => {

  const extension = path.extname(
    file.originalname
  );

  const nombreLimpio = path
    .basename(file.originalname, extension)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

  cb(
    null,
    `${nombreLimpio}${extension}`
  );

}

});

const upload = multer({ storage });

/* ========================================================= */
/* ======================== RELACIONES ====================== */
/* ========================================================= */

Categoria.hasMany(Producto, {
  foreignKey: "categoriaId"
});

Producto.belongsTo(Categoria, {
  foreignKey: "categoriaId"
});

Usuario.hasMany(Venta, {
  foreignKey: "clienteId"
});

Venta.belongsTo(Usuario, {
  foreignKey: "clienteId",
  as: "Cliente"
});

Venta.hasMany(DetalleVenta, {
  foreignKey: "ventaId",
  as: "Detalles"
});

DetalleVenta.belongsTo(Venta, {
  foreignKey: "ventaId"
});

Producto.hasMany(DetalleVenta, {
  foreignKey: "productoId"
});

DetalleVenta.belongsTo(Producto, {
  foreignKey: "productoId",
  as: "Producto"
});

Usuario.hasMany(Carrito, {
  foreignKey: "usuarioId"
});

Carrito.belongsTo(Usuario, {
  foreignKey: "usuarioId"
});

Producto.hasMany(Carrito, {
  foreignKey: "productoId"
});

Carrito.belongsTo(Producto, {
  foreignKey: "productoId"
});

Usuario.hasMany(Direccion, {
  foreignKey: "clienteId"
});

Direccion.belongsTo(Usuario, {
  foreignKey: "clienteId"
});

Venta.hasOne(Pago, {
  foreignKey: "ventaId"
});

Pago.belongsTo(Venta, {
  foreignKey: "ventaId"
});

/* ========================================================= */
/* ========================== ROOT ========================== */
/* ========================================================= */

app.get("/", (req, res) => {

  res.send("✅ ModaGest Pro API funcionando");

});

/* ========================================================= */
/* =========================== AUTH ========================= */
/* ========================================================= */

app.post("/auth/register", async (req, res) => {

  try {

    const {
      nombre,
      email,
      password
    } = req.body;

    const existe = await Usuario.findOne({
      where: {
        email: email.trim().toLowerCase()
      }
    });

    if (existe) {

      return res.status(400).json({
        message: "El email ya existe"
      });

    }

    const hashed = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({

      nombre,
      email: email.trim().toLowerCase(),
      password: hashed,
      rol: "cliente"

    });

    res.status(201).json(usuario);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

});

/* ================= LOGIN ================= */

app.post("/auth/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({
      where: {
        email: email.trim().toLowerCase()
      }
    });

    if (!usuario) {

      return res.status(401).json({
        message: "Credenciales inválidas"
      });

    }

    const valido = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!valido) {

      return res.status(401).json({
        message: "Credenciales inválidas"
      });

    }

    const token = jwt.sign(

      {
        id: usuario.id,
        rol: usuario.rol
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1h"
      }

    );

    res.json({

      token,

      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

});

/* ========================================================= */
/* ======================== CATEGORIAS ====================== */
/* ========================================================= */

app.get("/categorias", async (req, res) => {

  try {

    const categorias = await Categoria.findAll();

    res.json(categorias);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

});

/* ========================================================= */
/* ======================== PRODUCTOS ======================= */
/* ========================================================= */

app.get("/productos", async (req, res) => {

  try {

    const productos = await Producto.findAll({

      include: [
        {
          model: Categoria
        }
      ],

      order: [
        ["createdAt", "DESC"]
      ]

    });

    res.json(productos);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

});

/* ================= CREAR PRODUCTO ================= */

app.post(
  "/productos",

  verificarToken,
  verificarRol("administrador"),

  upload.single("imagen"),

  async (req, res) => {

    try {

      const {
        nombre,
        descripcion,
        precio,
        stock,
        categoriaId
      } = req.body;

      let imagen = null;

      if (req.file) {

        imagen = req.file.filename;

      }

      const producto = await Producto.create({

        nombre,
        descripcion,
        precio,
        stock,
        categoriaId,
        imagen

      });

      res.status(201).json(producto);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: error.message
      });

    }

  }
);

/* ================= EDITAR PRODUCTO ================= */
 app.put(
  "/productos/:id",

  verificarToken,
  verificarRol("administrador"),

  upload.single("imagen"),

  async (req, res) => {

    try {

      const producto =
        await Producto.findByPk(req.params.id);

      if (!producto) {

        return res.status(404).json({
          message: "Producto no encontrado"
        });

      }

      const {
        nombre,
        descripcion,
        precio,
        stock,
        categoriaId
      } = req.body;

      producto.nombre = nombre;
      producto.descripcion = descripcion;
      producto.precio = precio;
      producto.stock = stock;
      producto.categoriaId = categoriaId;

      /* ================= NUEVA IMAGEN ================= */

      if (req.file) {

        /* ELIMINAR IMAGEN ANTERIOR */

        if (producto.imagen) {

          const rutaImagenAnterior = path.join(
            uploadPath,
            producto.imagen
          );

          if (
            fs.existsSync(rutaImagenAnterior)
          ) {

            fs.unlinkSync(
              rutaImagenAnterior
            );

          }

        }

        /* GUARDAR NUEVA IMAGEN */

        producto.imagen =
          req.file.filename;

      }

      await producto.save();

      res.json(producto);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: error.message
      });

    }

  }
);

/* ================= ELIMINAR PRODUCTO ================= */

app.delete(
  "/productos/:id",

  verificarToken,
  verificarRol("administrador"),

  async (req, res) => {

    try {

      const producto =
        await Producto.findByPk(req.params.id);

      if (!producto) {

        return res.status(404).json({
          message: "Producto no encontrado"
        });

      }

      await producto.destroy();

      res.json({
        message: "Producto eliminado"
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: error.message
      });

    }

  }
);

/* ========================================================= */
/* ==================== CLIENTE COMPRAR ==================== */
/* ========================================================= */

app.post(

  "/cliente/comprar",

  verificarToken,
  verificarRol("cliente"),

  async (req, res) => {

    try {

      const {
        productoId,
        cantidad,
        metodoPago
      } = req.body;

      const producto =
        await Producto.findByPk(productoId);

      if (!producto) {

        return res.status(404).json({
          message: "Producto no encontrado"
        });

      }

      if (producto.stock < cantidad) {

        return res.status(400).json({
          message: "Stock insuficiente"
        });

      }

      const total =
        Number(producto.precio) *
        Number(cantidad);

      const venta = await Venta.create({

        clienteId: req.usuario.id,

        total

      });

      await DetalleVenta.create({

        ventaId: venta.id,

        productoId: producto.id,

        cantidad,

        precio: producto.precio,

        subtotal: total

      });

      producto.stock =
        producto.stock - cantidad;

      await producto.save();

      await Pago.create({

        ventaId: venta.id,

        metodoPago:
          metodoPago || "efectivo",

        estado: "aprobado",

        referencia:
          "REF-" + Date.now(),

        monto: total

      });

      res.json({

        message:
          "Compra realizada correctamente",

        venta

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: error.message
      });

    }

  }

);

/* ========================================================= */
/* ================= CLIENTE HISTORIAL ===================== */
/* ========================================================= */

app.get(

  "/cliente/compras",

  verificarToken,
  verificarRol("cliente"),

  async (req, res) => {

    try {

      const compras = await Venta.findAll({

        where: {
          clienteId: req.usuario.id
        },

        include: [

          {
            model: DetalleVenta,
            as: "Detalles",

            include: [
              {
                model: Producto,
                as: "Producto"
              }
            ]
          },

          {
            model: Pago
          }

        ],

        order: [
          ["createdAt", "DESC"]
        ]

      });

      res.json(compras);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: error.message
      });

    }

  }

);

/* ========================================================= */
/* ======================== ADMIN VENTAS ==================== */
/* ========================================================= */

app.get(
  "/admin/ventas",

  verificarToken,
  verificarRol("administrador"),

  async (req, res) => {

    try {

      const ventas = await Venta.findAll({

        include: [

          {
            model: Usuario,
            as: "Cliente",
            attributes: [
              "id",
              "nombre",
              "email"
            ]
          },

          {
            model: DetalleVenta,
            as: "Detalles",

            include: [
              {
                model: Producto,
                as: "Producto"
              }
            ]
          },

          {
            model: Pago
          }

        ],

        order: [
          ["createdAt", "DESC"]
        ]

      });

      res.json(ventas);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: error.message
      });

    }

  }
);

/* ========================================================= */
/* ======================= ADMIN USERS ===================== */
/* ========================================================= */

app.get(
  "/admin/usuarios",

  verificarToken,
  verificarRol("administrador"),

  async (req, res) => {

    try {

      const usuarios = await Usuario.findAll({

        attributes: [
          "id",
          "nombre",
          "email",
          "rol",
          "createdAt"
        ]

      });

      res.json(usuarios);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: error.message
      });

    }

  }
);

/* ================= CAMBIAR ROL ================= */

app.put(
  "/admin/usuarios/:id/rol",

  verificarToken,
  verificarRol("administrador"),

  async (req, res) => {

    try {

      const { rol } = req.body;

      const usuario =
        await Usuario.findByPk(req.params.id);

      if (!usuario) {

        return res.status(404).json({
          message: "Usuario no encontrado"
        });

      }

      usuario.rol = rol;

      await usuario.save();

      res.json({
        message: "Rol actualizado",
        usuario
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: error.message
      });

    }

  }
);

/* ========================================================= */
/* ==================== ADMIN ESTADISTICAS ================= */
/* ========================================================= */

app.get(
  "/admin/estadisticas",

  verificarToken,
  verificarRol("administrador"),

  async (req, res) => {

    try {

      const totalUsuarios =
        await Usuario.count();

      const totalProductos =
        await Producto.count();

      const totalVentas =
        await Venta.count();

      const ingresos =
        await Venta.sum("total");

      res.json({

        totalUsuarios,
        totalProductos,
        totalVentas,

        ingresosTotales:
          ingresos || 0

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Error obteniendo estadísticas"
      });

    }

  }
);

/* ========================================================= */
/* ====================== CREAR ADMIN ====================== */
/* ========================================================= */

const crearAdmin = async () => {

  try {

    const pass = await bcrypt.hash(
      "Admin2026*",
      10
    );

    const admin = await Usuario.findOne({

      where: {
        email: "admin@modagest.com"
      }

    });

    if (admin) {

      admin.password = pass;

      admin.rol = "administrador";

      await admin.save();

    }

    else {

      await Usuario.create({

        nombre: "Administrador",

        email: "admin@modagest.com",

        password: pass,

        rol: "administrador"

      });

    }

  } catch (error) {

    console.error(error);

  }

};

/* ========================================================= */
/* ========================== SERVER ======================== */
/* ========================================================= */

sequelize.sync({

  alter: false,
  force: false

})

.then(async () => {

  console.log(
    "✅ Base de datos conectada"
  );

  await crearAdmin();

  const PORT =
    process.env.PORT || 5000;

  app.listen(PORT, () => {

    console.log(
      `🚀 Servidor corriendo en puerto ${PORT}`
    );

  });

})

.catch((error) => {

  console.error(
    "❌ Error conectando DB:",
    error
  );

});

