require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

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

const verificarToken = require("./middlewares/authMiddleware");
const verificarRol = require("./middlewares/rolMiddleware");

const app = express();

/* ======================= MIDDLEWARES ====================== */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

/* ========================= UPLOADS ======================== */

const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

app.use("/uploads", express.static(uploadPath));

/* ================= MULTER ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const nombreLimpio = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    cb(null, `${nombreLimpio}${extension}`);
  },
});

const upload = multer({ storage });

/* ======================== RELACIONES ====================== */

Categoria.hasMany(Producto, {
  foreignKey: "categoriaId",
});

Producto.belongsTo(Categoria, {
  foreignKey: "categoriaId",
});

Usuario.hasMany(Venta, {
  foreignKey: "clienteId",
});

Venta.belongsTo(Usuario, {
  foreignKey: "clienteId",
  as: "Cliente",
});

Venta.hasMany(DetalleVenta, {
  foreignKey: "ventaId",
  as: "Detalles",
});

DetalleVenta.belongsTo(Venta, {
  foreignKey: "ventaId",
});

Producto.hasMany(DetalleVenta, {
  foreignKey: "productoId",
});

DetalleVenta.belongsTo(Producto, {
  foreignKey: "productoId",
  as: "Producto",
});

Usuario.hasMany(Carrito, {
  foreignKey: "usuarioId",
});

Carrito.belongsTo(Usuario, {
  foreignKey: "usuarioId",
});

Producto.hasMany(Carrito, {
  foreignKey: "productoId",
});

Carrito.belongsTo(Producto, {
  foreignKey: "productoId",
});

Usuario.hasMany(Direccion, {
  foreignKey: "clienteId",
});

Direccion.belongsTo(Usuario, {
  foreignKey: "clienteId",
});

Venta.hasOne(Pago, {
  foreignKey: "ventaId",
});

Pago.belongsTo(Venta, {
  foreignKey: "ventaId",
});

/* ========================== ROOT ========================== */

app.get("/", (req, res) => {
  res.send("✅ ModaGest Pro API funcionando");
});

/* =========================== AUTH ========================= */

app.post("/auth/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existe = await Usuario.findOne({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (existe) {
      return res.status(400).json({
        message: "El email ya existe",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      email: email.trim().toLowerCase(),
      password: hashed,
      rol: "cliente",
    });

    res.status(201).json(usuario);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

/* ================= LOGIN ================= */

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (!usuario) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    const valido = await bcrypt.compare(password, usuario.password);

    if (!valido) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1h",
      },
    );

    res.json({
      token,

      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

/* ======================== CATEGORIAS ====================== */

app.get("/categorias", async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      order: [["nombre", "ASC"]],
    });

    res.json(categorias);
  } catch (error) {
    console.error("Error obteniendo categorías:", error);

    res.status(500).json({
      message: "Error obteniendo las categorías",
      error: error.message,
    });
  }
});

/* ================= CREAR CATEGORIA ================= */

app.post(
  "/categorias",

  verificarToken,
  verificarRol("administrador"),

  async (req, res) => {
    try {
      const { nombre } = req.body;

      /* ================= VALIDAR NOMBRE ================= */

      if (!nombre || !nombre.trim()) {
        return res.status(400).json({
          message: "El nombre de la categoría es obligatorio",
        });
      }

      const nombreCategoria = nombre.trim();

      /* ================= VERIFICAR DUPLICADO ================= */

      const existe = await Categoria.findOne({
        where: {
          nombre: nombreCategoria,
        },
      });

      if (existe) {
        return res.status(400).json({
          message: "La categoría ya existe",
        });
      }

      /* ================= CREAR ================= */

      const categoria = await Categoria.create({
        nombre: nombreCategoria,
      });

      res.status(201).json({
        message: "Categoría creada correctamente",
        categoria,
      });
    } catch (error) {
      console.error("Error creando categoría:", error);

      res.status(500).json({
        message: "Error creando la categoría",
        error: error.message,
      });
    }
  },
);

/* ================= EDITAR CATEGORIA ================= */

app.put(
  "/categorias/:id",

  verificarToken,
  verificarRol("administrador"),

  async (req, res) => {
    try {
      const { nombre } = req.body;

      /* ================= VALIDAR NOMBRE ================= */

      if (!nombre || !nombre.trim()) {
        return res.status(400).json({
          message: "El nombre de la categoría es obligatorio",
        });
      }

      const nombreCategoria = nombre.trim();

      /* ================= BUSCAR CATEGORIA ================= */

      const categoria = await Categoria.findByPk(req.params.id);

      if (!categoria) {
        return res.status(404).json({
          message: "Categoría no encontrada",
        });
      }

      /* ================= VERIFICAR DUPLICADO ================= */

      const existe = await Categoria.findOne({
        where: {
          nombre: nombreCategoria,
        },
      });

      if (existe && existe.id !== categoria.id) {
        return res.status(400).json({
          message: "Ya existe otra categoría con ese nombre",
        });
      }

      /* ================= ACTUALIZAR ================= */

      categoria.nombre = nombreCategoria;

      await categoria.save();

      res.json({
        message: "Categoría actualizada correctamente",
        categoria,
      });
    } catch (error) {
      console.error("Error actualizando categoría:", error);

      res.status(500).json({
        message: "Error actualizando la categoría",
        error: error.message,
      });
    }
  },
);

/* ================= ELIMINAR CATEGORIA ================= */

app.delete(
  "/categorias/:id",

  verificarToken,
  verificarRol("administrador"),

  async (req, res) => {
    try {
      /* ================= BUSCAR CATEGORIA ================= */

      const categoria = await Categoria.findByPk(req.params.id);

      if (!categoria) {
        return res.status(404).json({
          message: "Categoría no encontrada",
        });
      }

      /* ================= VERIFICAR PRODUCTOS ================= */

      const productosAsociados = await Producto.count({
        where: {
          categoriaId: categoria.id,
        },
      });

      if (productosAsociados > 0) {
        return res.status(400).json({
          message:
            "No puedes eliminar esta categoría porque tiene productos asociados",
          productosAsociados,
        });
      }

      /* ================= ELIMINAR ================= */

      await categoria.destroy();

      res.json({
        message: "Categoría eliminada correctamente",
      });
    } catch (error) {
      console.error("Error eliminando categoría:", error);

      res.status(500).json({
        message: "Error eliminando la categoría",
        error: error.message,
      });
    }
  },
);
/* ======================== PRODUCTOS ======================= */

app.get("/productos", async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [
        {
          model: Categoria,
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    res.json(productos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
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
      const { nombre, descripcion, precio, stock, categoriaId } = req.body;

      /* ================= VALIDAR PRECIO ================= */

      const precioNumerico = Number(precio);

      if (!Number.isFinite(precioNumerico) || precioNumerico < 1000) {
        return res.status(400).json({
          message:
            "El precio debe ser mínimo de $1.000 COP. Ingresa el valor completo en pesos colombianos. Ejemplo: 18000 para $18.000.",
        });
      }

      let imagen = null;

      if (req.file) {
        imagen = req.file.filename;
      }

      const producto = await Producto.create({
        nombre,
        descripcion,
        precio: precioNumerico,
        stock,
        categoriaId,
        imagen,
      });

      res.status(201).json(producto);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });
    }
  },
);

/* ================= EDITAR PRODUCTO ================= */
app.put(
  "/productos/:id",

  verificarToken,
  verificarRol("administrador"),

  upload.single("imagen"),

  async (req, res) => {
    try {
      const producto = await Producto.findByPk(req.params.id);

      if (!producto) {
        return res.status(404).json({
          message: "Producto no encontrado",
        });
      }

      const { nombre, descripcion, precio, stock, categoriaId } = req.body;

      /* ================= VALIDAR PRECIO ================= */

      const precioNumerico = Number(precio);

      if (!Number.isFinite(precioNumerico) || precioNumerico < 1000) {
        return res.status(400).json({
          message:
            "El precio debe ser mínimo de $1.000 COP. Ingresa el valor completo en pesos colombianos. Ejemplo: 18000 para $18.000.",
        });
      }

      producto.nombre = nombre;
      producto.descripcion = descripcion;
      producto.precio = precioNumerico;
      producto.stock = stock;
      producto.categoriaId = categoriaId;

      /* ================= NUEVA IMAGEN ================= */

      if (req.file) {
        /* AYUDAR A ELIMINAR IMAGEN ANTERIOR */

        if (producto.imagen) {
          const rutaImagenAnterior = path.join(uploadPath, producto.imagen);

          if (fs.existsSync(rutaImagenAnterior)) {
            fs.unlinkSync(rutaImagenAnterior);
          }
        }

        /* GUARDAR NUEVA IMAGEN */

        producto.imagen = req.file.filename;
      }

      await producto.save();

      res.json(producto);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });
    }
  },
);

/* ================= ELIMINAR PRODUCTO ================= */

app.delete(
  "/productos/:id",

  verificarToken,
  verificarRol("administrador"),

  async (req, res) => {
    try {
      const producto = await Producto.findByPk(req.params.id);

      if (!producto) {
        return res.status(404).json({
          message: "Producto no encontrado",
        });
      }

      await producto.destroy();

      res.json({
        message: "Producto eliminado",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });
    }
  },
);

/* ==================== CLIENTE COMPRAR ==================== */

app.post(
  "/cliente/comprar",

  verificarToken,
  verificarRol("cliente"),

  async (req, res) => {
    try {
      const { productoId, cantidad, metodoPago } = req.body;

      const producto = await Producto.findByPk(productoId);

      if (!producto) {
        return res.status(404).json({
          message: "Producto no encontrado",
        });
      }

      /* ================= VALIDAR PRECIO ================= */

      const precioProducto = Number(producto.precio);

      if (!Number.isFinite(precioProducto) || precioProducto < 1000) {
        return res.status(400).json({
          message:
            "No se puede realizar la compra porque el precio del producto no es válido.",
        });
      }

      /* ================= VALIDAR STOCK ================= */

      if (producto.stock < cantidad) {
        return res.status(400).json({
          message: "Stock insuficiente",
        });
      }

      /* ================= CALCULAR TOTAL ================= */

      const total = precioProducto * Number(cantidad);
      const venta = await Venta.create({
        clienteId: req.usuario.id,

        total,
      });

      await DetalleVenta.create({
        ventaId: venta.id,

        productoId: producto.id,

        cantidad,

        precio: precioProducto,

        subtotal: total,
      });

      producto.stock = producto.stock - cantidad;

      await producto.save();

      await Pago.create({
        ventaId: venta.id,

        metodoPago: metodoPago || "efectivo",

        estado: "aprobado",

        referencia: "REF-" + Date.now(),

        monto: total,
      });

      res.json({
        message: "Compra realizada correctamente",

        venta,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });
    }
  },
);

/* ================= HISTORIAL DEL CLIENTE ===================== */

app.get(
  "/cliente/compras",

  verificarToken,
  verificarRol("cliente"),

  async (req, res) => {
    try {
      const compras = await Venta.findAll({
        where: {
          clienteId: req.usuario.id,
        },

        include: [
          {
            model: DetalleVenta,
            as: "Detalles",

            include: [
              {
                model: Producto,
                as: "Producto",
              },
            ],
          },

          {
            model: Pago,
          },
        ],

        order: [["createdAt", "DESC"]],
      });

      res.json(compras);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });
    }
  },
);

/* ======================== ADMIN VENTAS ==================== */

app.get(
  "/admin/ventas",

  verificarToken,
  verificarRol("administrador"),

  async (req, res) => {
    try {
      const { desde, hasta } = req.query;

      let where = {};

      if (desde && hasta) {
        where.createdAt = {
          [Op.between]: [
            new Date(`${desde} 00:00:00`),
            new Date(`${hasta} 23:59:59`),
          ],
        };
      }

      const ventas = await Venta.findAll({
        where,

        include: [
          {
            model: Usuario,
            as: "Cliente",
            attributes: ["id", "nombre", "email"],
          },

          {
            model: DetalleVenta,
            as: "Detalles",

            include: [
              {
                model: Producto,
                as: "Producto",
              },
            ],
          },

          {
            model: Pago,
          },
        ],

        order: [["createdAt", "DESC"]],
      });

      res.json(ventas);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });
    }
  },
);
/* ======================= ADMIN USERS ===================== */

app.get(
  "/admin/usuarios",

  verificarToken,
  verificarRol("administrador"),

  async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        attributes: ["id", "nombre", "email", "rol", "createdAt"],
      });

      res.json(usuarios);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });
    }
  },
);

/* ================= CREAR USUARIO ================= */

app.post(
  "/admin/usuarios",

  verificarToken,
  verificarRol("administrador"),

  async (req, res) => {
    try {
      const { nombre, email, password, rol } = req.body;

      // Verificar que todos los campos existan
      if (!nombre || !email || !password || !rol) {
        return res.status(400).json({
          message: "Todos los campos son obligatorios",
        });
      }

      // Buscar si el correo ya existe
      const existe = await Usuario.findOne({
        where: {
          email: email.trim().toLowerCase(),
        },
      });

      if (existe) {
        return res.status(400).json({
          message: "El correo ya está registrado",
        });
      }

      // nos ayudara a encriptar la contraseña
      const passwordHash = await bcrypt.hash(password, 10);

      // Crear usuario
      const nuevoUsuario = await Usuario.create({
        nombre,
        email: email.trim().toLowerCase(),
        password: passwordHash,
        rol,
      });

      res.status(201).json({
        message: "Usuario creado correctamente",
        usuario: nuevoUsuario,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });
    }
  },
);

/* ================= CAMBIAR ROL ================= */

app.put(
  "/admin/usuarios/:id/rol",

  verificarToken,
  verificarRol("administrador"),

  async (req, res) => {
    try {
      const { rol } = req.body;

      const usuario = await Usuario.findByPk(req.params.id);

      if (!usuario) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      usuario.rol = rol;

      await usuario.save();

      res.json({
        message: "Rol actualizado",
        usuario,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });
    }
  },
);

/* ================= ELIMINAR USUARIO ================= */

app.delete(
  "/admin/usuarios/:id",

  verificarToken,
  verificarRol("administrador"),

  async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id);

      if (!usuario) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      // evitar borrar admin principal

      if (usuario.email === "admin@modagest.com") {
        return res.status(400).json({
          message: "No puedes eliminar el administrador principal",
        });
      }

      await usuario.destroy();

      res.json({
        message: "Usuario eliminado correctamente",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });
    }
  },
);
/* ==================== ADMIN ESTADISTICAS ================= */

app.get(
  "/admin/estadisticas",

  verificarToken,
  verificarRol("administrador"),

  async (req, res) => {
    try {
      /* ================= ESTADISTICAS GENERALES ================= */

      const totalUsuarios = await Usuario.count();

      const totalProductos = await Producto.count();

      const totalVentas = await Venta.count();

      const ingresos = await Venta.sum("total");

      /* ================= ESTADISTICAS DE HOY ================= */

      const ahora = new Date();

      const inicioHoy = new Date(
        ahora.getFullYear(),
        ahora.getMonth(),
        ahora.getDate(),
        0,
        0,
        0,
        0,
      );

      const finHoy = new Date(
        ahora.getFullYear(),
        ahora.getMonth(),
        ahora.getDate(),
        23,
        59,
        59,
        999,
      );

      const ventasHoy = await Venta.count({
        where: {
          createdAt: {
            [Op.between]: [inicioHoy, finHoy],
          },
        },
      });

      const ingresosHoy = await Venta.sum("total", {
        where: {
          createdAt: {
            [Op.between]: [inicioHoy, finHoy],
          },
        },
      });

      /* ================= ESTADISTICAS DEL MES ================= */

      const inicioMes = new Date(
        ahora.getFullYear(),
        ahora.getMonth(),
        1,
        0,
        0,
        0,
        0,
      );

      const finMes = new Date(
        ahora.getFullYear(),
        ahora.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      const ventasMes = await Venta.count({
        where: {
          createdAt: {
            [Op.between]: [inicioMes, finMes],
          },
        },
      });

      const ingresosMes = await Venta.sum("total", {
        where: {
          createdAt: {
            [Op.between]: [inicioMes, finMes],
          },
        },
      });
      /* ================= METODOS DE PAGO ================= */

      const pagos = await Pago.findAll({
        attributes: ["metodoPago"],
      });

      const metodosPago = pagos.reduce((acumulador, pago) => {
        let metodo = pago.metodoPago;

        if (!metodo) {
          metodo = "Sin especificar";
        }

        metodo = String(metodo).trim().toLowerCase();

        if (metodo === "tarjeta") {
          metodo = "Tarjeta";
        } else if (metodo === "efectivo") {
          metodo = "efectivo";
        } else if (metodo === "pse") {
          metodo = "PSE";
        } else if (metodo === "nequi") {
          metodo = "Nequi";
        } else if (metodo === "contra_entrega" || metodo === "contra entrega") {
          metodo = "Contra Entrega";
        } else if (metodo === "sin especificar") {
          metodo = "Sin especificar";
        }

        acumulador[metodo] = (acumulador[metodo] || 0) + 1;

        return acumulador;
      }, {});

      /* ================= DATOS PARA GRAFICA ================= */

      const ventasGrafica = await Venta.findAll({
        attributes: ["id", "total", "createdAt"],

        order: [["createdAt", "ASC"]],
      });

      /* ================= RESPUESTA ================= */

      res.json({
        totalUsuarios,

        totalProductos,

        totalVentas,

        ingresosTotales: ingresos || 0,

        ventasHoy,

        ingresosHoy: ingresosHoy || 0,

        ventasMes,

        ingresosMes: ingresosMes || 0,

        metodosPago,

        ventasGrafica,
      });
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);

      res.status(500).json({
        message: "Error obteniendo estadísticas",
        error: error.message,
      });
    }
  },
);
/* ==================== ADMIN ACTIVIDAD RECIENTE ================= */
app.get(
  "/admin/actividad",

  verificarToken,
  verificarRol("administrador"),

  async (req, res) => {
    try {
      const [ventas, usuarios, productos, pagos] = await Promise.all([
        Venta.findAll({
          order: [["createdAt", "DESC"]],
          limit: 5,
        }),

        Usuario.findAll({
          order: [["createdAt", "DESC"]],
          limit: 5,
        }),

        Producto.findAll({
          order: [["updatedAt", "DESC"]],
          limit: 5,
        }),

        Pago.findAll({
          order: [["createdAt", "DESC"]],
          limit: 5,
        }),
      ]);

      const actividades = [];

      /* ================= VENTAS ================= */

      ventas.forEach((venta) => {
        actividades.push({
          tipo: "venta",
          icon: "🛒",
          text: "Nueva venta registrada",
          fecha: venta.createdAt,
        });
      });

      /* ================= USUARIOS ================= */

      usuarios.forEach((usuario) => {
        actividades.push({
          tipo: "usuario",
          icon: "👤",
          text: "Nuevo usuario registrado",
          fecha: usuario.createdAt,
        });
      });

      /* ================= PRODUCTOS ================= */

      productos.forEach((producto) => {
        actividades.push({
          tipo: "producto",
          icon: "📦",
          text: "Producto actualizado",
          fecha: producto.updatedAt,
        });
      });

      /* ================= PAGOS ================= */

      pagos.forEach((pago) => {
        actividades.push({
          tipo: "pago",
          icon: "💳",
          text:
            pago.estado?.toLowerCase() === "aprobado"
              ? "Pago aprobado"
              : `Pago ${pago.estado || "registrado"}`,
          fecha: pago.createdAt,
        });
      });

      /* ================= ORDENAR POR FECHA ================= */

      actividades.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
      );

      /* ================= ÚLTIMAS 4 ACTIVIDADES ================= */

      const actividadesRecientes = actividades.slice(0, 4).map((actividad) => ({
        ...actividad,
        fecha: new Date(actividad.fecha).toISOString(),
      }));

      res.json(actividadesRecientes);
    } catch (error) {
      console.error("Error obteniendo actividad:", error);

      res.status(500).json({
        message: "Error obteniendo actividad reciente",
      });
    }
  },
);
/* ====================== CREAR ADMIN ====================== */

const crearAdmin = async () => {
  try {
    const pass = await bcrypt.hash("Admin2026*", 10);

    const admin = await Usuario.findOne({
      where: {
        email: "admin@modagest.com",
      },
    });

    if (admin) {
      admin.password = pass;

      admin.rol = "administrador";

      await admin.save();
    } else {
      await Usuario.create({
        nombre: "Administrador",

        email: "admin@modagest.com",

        password: pass,

        rol: "administrador",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

/* ========================== SERVER ======================== */

sequelize
  .sync({
    alter: false,
    force: false,
  })

  .then(async () => {
    console.log("✅ Base de datos conectada");

    await crearAdmin();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  })

  .catch((error) => {
    console.error("❌ Error conectando DB:", error);
  });
