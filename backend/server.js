require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");

const sequelize = require("./config/database");

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
const upload = require("./middlewares/upload");

const app = express();

const origenesPermitidos = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map((origen) => origen.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin(origen, callback) {
      if (!origen || origenesPermitidos.includes(origen)) {
        return callback(null, true);
      }

      return callback(new Error("Origen no permitido por CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

app.use("/uploads", express.static(uploadPath));
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

Usuario.hasMany(Venta, {
  foreignKey: "empleadoId",
  as: "VentasEmpleado",
});

Venta.belongsTo(Usuario, {
  foreignKey: "empleadoId",
  as: "Empleado",
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

app.get("/", (req, res) => {
  res.send("✅ ModaGest Pro API funcionando");
});

app.post("/auth/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const existe = await Usuario.findOne({
      where: {
        email: emailNormalizado,
      },
    });

    if (existe) {
      return res.status(400).json({
        message: "El email ya existe",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre: nombre.trim(),
      email: emailNormalizado,
      password: hashed,
      rol: "cliente",
    });

    res.status(201).json(usuario);
  } catch (error) {
    console.error("Error registrando usuario:", error);

    res.status(500).json({
      message: "Error registrando usuario",
    });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son obligatorios",
      });
    }

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
    console.error("Error iniciando sesión:", error);

    res.status(500).json({
      message: "Error iniciando sesión",
    });
  }
});

app.get(
  "/cliente/direcciones",
  verificarToken,
  verificarRol("cliente"),
  async (req, res) => {
    try {
      const direcciones = await Direccion.findAll({
        where: {
          clienteId: req.usuario.id,
        },
        order: [["createdAt", "DESC"]],
      });

      res.json(direcciones);
    } catch (error) {
      console.error("Error obteniendo direcciones:", error);

      res.status(500).json({
        message: "Error obteniendo las direcciones",
      });
    }
  },
);

app.post(
  "/cliente/direcciones",
  verificarToken,
  verificarRol("cliente"),
  async (req, res) => {
    try {
      const { direccion, ciudad, telefono } = req.body;

      if (
        typeof direccion !== "string" ||
        typeof ciudad !== "string" ||
        typeof telefono !== "string" ||
        !direccion.trim() ||
        !ciudad.trim() ||
        !telefono.trim()
      ) {
        return res.status(400).json({
          message: "La dirección, la ciudad y el teléfono son obligatorios",
        });
      }

      const nuevaDireccion = await Direccion.create({
        clienteId: req.usuario.id,
        direccion: direccion.trim(),
        ciudad: ciudad.trim(),
        telefono: telefono.trim(),
      });

      res.status(201).json({
        message: "Dirección creada correctamente",
        direccion: nuevaDireccion,
      });
    } catch (error) {
      console.error("Error creando dirección:", error);

      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          message: error.errors[0]?.message || "Datos de dirección inválidos",
        });
      }

      res.status(500).json({
        message: "Error creando la dirección",
      });
    }
  },
);

app.put(
  "/cliente/direcciones/:id",
  verificarToken,
  verificarRol("cliente"),
  async (req, res) => {
    try {
      const { direccion, ciudad, telefono } = req.body;

      if (
        typeof direccion !== "string" ||
        typeof ciudad !== "string" ||
        typeof telefono !== "string" ||
        !direccion.trim() ||
        !ciudad.trim() ||
        !telefono.trim()
      ) {
        return res.status(400).json({
          message: "La dirección, la ciudad y el teléfono son obligatorios",
        });
      }

      const direccionEncontrada = await Direccion.findOne({
        where: {
          id: req.params.id,
          clienteId: req.usuario.id,
        },
      });

      if (!direccionEncontrada) {
        return res.status(404).json({
          message: "Dirección no encontrada",
        });
      }

      direccionEncontrada.direccion = direccion.trim();
      direccionEncontrada.ciudad = ciudad.trim();
      direccionEncontrada.telefono = telefono.trim();

      await direccionEncontrada.save();

      res.json({
        message: "Dirección actualizada correctamente",
        direccion: direccionEncontrada,
      });
    } catch (error) {
      console.error("Error actualizando dirección:", error);

      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          message: error.errors[0]?.message || "Datos de dirección inválidos",
        });
      }

      res.status(500).json({
        message: "Error actualizando la dirección",
      });
    }
  },
);

app.delete(
  "/cliente/direcciones/:id",
  verificarToken,
  verificarRol("cliente"),
  async (req, res) => {
    try {
      const direccion = await Direccion.findOne({
        where: {
          id: req.params.id,
          clienteId: req.usuario.id,
        },
      });

      if (!direccion) {
        return res.status(404).json({
          message: "Dirección no encontrada",
        });
      }

      await direccion.destroy();

      res.json({
        message: "Dirección eliminada correctamente",
      });
    } catch (error) {
      console.error("Error eliminando dirección:", error);

      res.status(500).json({
        message: "Error eliminando la dirección",
      });
    }
  },
);
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
    });
  }
});

app.post(
  "/categorias",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {
    try {
      const { nombre } = req.body;

      if (!nombre || !nombre.trim()) {
        return res.status(400).json({
          message: "El nombre de la categoría es obligatorio",
        });
      }

      const nombreCategoria = nombre.trim();

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
      });
    }
  },
);

app.put(
  "/categorias/:id",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {
    try {
      const { nombre } = req.body;

      if (!nombre || !nombre.trim()) {
        return res.status(400).json({
          message: "El nombre de la categoría es obligatorio",
        });
      }

      const categoria = await Categoria.findByPk(req.params.id);

      if (!categoria) {
        return res.status(404).json({
          message: "Categoría no encontrada",
        });
      }

      const nombreCategoria = nombre.trim();

      const existe = await Categoria.findOne({
        where: {
          nombre: nombreCategoria,
          id: {
            [Op.ne]: categoria.id,
          },
        },
      });

      if (existe) {
        return res.status(400).json({
          message: "Ya existe otra categoría con ese nombre",
        });
      }

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
      });
    }
  },
);

app.delete(
  "/categorias/:id",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {
    try {
      const categoria = await Categoria.findByPk(req.params.id);

      if (!categoria) {
        return res.status(404).json({
          message: "Categoría no encontrada",
        });
      }

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

      await categoria.destroy();

      res.json({
        message: "Categoría eliminada correctamente",
      });
    } catch (error) {
      console.error("Error eliminando categoría:", error);

      res.status(500).json({
        message: "Error eliminando la categoría",
      });
    }
  },
);

app.get("/productos", async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [
        {
          model: Categoria,
        },
      ],
      order: [["id", "ASC"]],
    });

    res.json(productos);
  } catch (error) {
    console.error("Error obteniendo productos:", error);

    res.status(500).json({
      message: "Error obteniendo productos",
    });
  }
});

app.post(
  "/productos",
  verificarToken,
  verificarRol("administrador"),
  upload.single("imagen"),
  async (req, res) => {
    try {
      const { nombre, descripcion, precio, stock, categoriaId } = req.body;

      if (!nombre || !nombre.trim()) {
        return res.status(400).json({
          message: "El nombre del producto es obligatorio",
        });
      }

      const precioNumerico = Number(precio);
      const stockNumerico = Number(stock);

      if (!Number.isFinite(precioNumerico) || precioNumerico < 1000) {
        return res.status(400).json({
          message:
            "El precio debe ser mínimo de $1.000 COP. Ejemplo: 18000 para $18.000.",
        });
      }

      if (!Number.isInteger(stockNumerico) || stockNumerico < 0) {
        return res.status(400).json({
          message: "El stock debe ser un número entero mayor o igual a 0",
        });
      }

      const categoria = await Categoria.findByPk(categoriaId);

      if (!categoria) {
        return res.status(400).json({
          message: "La categoría seleccionada no existe",
        });
      }

      const imagen = req.file ? req.file.filename : null;
      const imagenId = req.file?.fileId || null;

      const producto = await Producto.create({
        nombre: nombre.trim(),
        descripcion,
        precio: precioNumerico,
        stock: stockNumerico,
        categoriaId,
        imagen,
        imagenId,
      });

      res.status(201).json(producto);
    } catch (error) {
      console.error("Error creando producto:", error);

      res.status(500).json({
        message: "Error creando producto",
      });
    }
  },
);

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

      if (!nombre || !nombre.trim()) {
        return res.status(400).json({
          message: "El nombre del producto es obligatorio",
        });
      }

      const precioNumerico = Number(precio);
      const stockNumerico = Number(stock);

      if (!Number.isFinite(precioNumerico) || precioNumerico < 1000) {
        return res.status(400).json({
          message:
            "El precio debe ser mínimo de $1.000 COP. Ejemplo: 18000 para $18.000.",
        });
      }

      if (!Number.isInteger(stockNumerico) || stockNumerico < 0) {
        return res.status(400).json({
          message: "El stock debe ser un número entero mayor o igual a 0",
        });
      }

      const categoria = await Categoria.findByPk(categoriaId);

      if (!categoria) {
        return res.status(400).json({
          message: "La categoría seleccionada no existe",
        });
      }

      producto.nombre = nombre.trim();
      producto.descripcion = descripcion;
      producto.precio = precioNumerico;
      producto.stock = stockNumerico;
      producto.categoriaId = categoriaId;

      if (req.file) {
        if (producto.imagen) {
          await upload.eliminarImagen(producto.imagen, producto.imagenId);
        }

        producto.imagen = req.file.filename;
        producto.imagenId = req.file.fileId || null;
      }

      await producto.save();

      res.json(producto);
    } catch (error) {
      console.error("Error actualizando producto:", error);

      res.status(500).json({
        message: "Error actualizando producto",
      });
    }
  },
);

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

      const detallesAsociados = await DetalleVenta.count({
        where: {
          productoId: producto.id,
        },
      });

      if (detallesAsociados > 0) {
        return res.status(400).json({
          message:
            "No puedes eliminar este producto porque tiene ventas registradas en el historial.",
          ventasAsociadas: detallesAsociados,
        });
      }

      if (producto.imagen) {
        await upload.eliminarImagen(producto.imagen, producto.imagenId);
      }

      await producto.destroy();

      res.json({
        message: "Producto eliminado",
      });
    } catch (error) {
      console.error("Error eliminando producto:", error);

      res.status(500).json({
        message: "Error eliminando producto",
      });
    }
  },
);

app.post(
  "/cliente/comprar",
  verificarToken,
  verificarRol("cliente"),
  async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const { productos, metodoPago, direccionId } = req.body;

      if (!Array.isArray(productos) || productos.length === 0) {
        await transaction.rollback();

        return res.status(400).json({
          message: "El carrito está vacío",
        });
      }

      const metodosPermitidos = ["Tarjeta", "PSE", "Nequi", "Contra Entrega"];

      if (!metodosPermitidos.includes(metodoPago)) {
        await transaction.rollback();

        return res.status(400).json({
          message: "El método de pago no es válido",
        });
      }
      const idDireccion = Number(direccionId);

      if (!Number.isInteger(idDireccion) || idDireccion < 1) {
        await transaction.rollback();

        return res.status(400).json({
          message: "Debes seleccionar una dirección de entrega",
        });
      }

      const direccionSeleccionada = await Direccion.findOne({
        where: {
          id: idDireccion,
          clienteId: req.usuario.id,
        },
        transaction,
      });

      if (!direccionSeleccionada) {
        await transaction.rollback();

        return res.status(404).json({
          message:
            "La dirección de entrega no existe o no pertenece al cliente",
        });
      }

      const detalles = [];
      let totalVenta = 0;

      for (const item of productos) {
        const productoId = Number(item.productoId);
        const cantidad = Number(item.cantidad);

        if (
          !Number.isInteger(productoId) ||
          !Number.isInteger(cantidad) ||
          cantidad < 1
        ) {
          await transaction.rollback();

          return res.status(400).json({
            message: "Producto o cantidad inválida",
          });
        }

        const producto = await Producto.findByPk(productoId, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (!producto) {
          await transaction.rollback();

          return res.status(404).json({
            message: `El producto con ID ${productoId} no existe`,
          });
        }

        const precio = Number(producto.precio);
        const stock = Number(producto.stock);

        if (!Number.isFinite(precio) || precio < 1000) {
          await transaction.rollback();

          return res.status(400).json({
            message: `El precio del producto "${producto.nombre}" no es válido`,
          });
        }

        if (stock < cantidad) {
          await transaction.rollback();

          return res.status(400).json({
            message: `Stock insuficiente para "${producto.nombre}". Disponible: ${stock}`,
          });
        }

        const subtotal = precio * cantidad;

        detalles.push({
          productoId: producto.id,
          cantidad,
          precio,
          subtotal,
        });

        totalVenta += subtotal;

        producto.stock = stock - cantidad;

        await producto.save({
          transaction,
        });
      }

      const venta = await Venta.create(
        {
          clienteId: req.usuario.id,
          empleadoId: null,
          total: totalVenta,
          direccionEntrega: direccionSeleccionada.direccion,
          ciudadEntrega: direccionSeleccionada.ciudad,
          telefonoEntrega: direccionSeleccionada.telefono,
        },
        {
          transaction,
        },
      );

      await DetalleVenta.bulkCreate(
        detalles.map((detalle) => ({
          ventaId: venta.id,
          productoId: detalle.productoId,
          cantidad: detalle.cantidad,
          precio: detalle.precio,
          subtotal: detalle.subtotal,
        })),
        {
          transaction,
        },
      );

      await Pago.create(
        {
          ventaId: venta.id,
          metodoPago,
          estado: "aprobado",
          referencia: `REF-${Date.now()}`,
          monto: totalVenta,
        },
        {
          transaction,
        },
      );

      await transaction.commit();

      res.status(201).json({
        message: "Compra realizada correctamente",
        venta: {
          id: venta.id,
          total: venta.total,
        },
      });
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback();
      }

      console.error("Error realizando compra:", error);

      res.status(500).json({
        message: "Error realizando la compra",
      });
    }
  },
);

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
      console.error("Error obteniendo compras:", error);

      res.status(500).json({
        message: "Error obteniendo compras",
      });
    }
  },
);

app.get(
  "/empleado/ventas",
  verificarToken,
  verificarRol("empleado"),
  async (req, res) => {
    try {
      const ventas = await Venta.findAll({
        where: {
          empleadoId: req.usuario.id,
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

      res.json(ventas);
    } catch (error) {
      console.error("Error obteniendo ventas del empleado:", error);

      res.status(500).json({
        message: "Error al obtener las ventas del empleado",
      });
    }
  },
);

app.post(
  "/empleado/vender",
  verificarToken,
  verificarRol("empleado"),
  async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const { productoId, cantidad } = req.body;

      const productoIdNumerico = Number(productoId);
      const cantidadVenta = Number(cantidad);

      if (
        !Number.isInteger(productoIdNumerico) ||
        !Number.isInteger(cantidadVenta) ||
        cantidadVenta < 1
      ) {
        await transaction.rollback();

        return res.status(400).json({
          message: "Producto o cantidad inválida",
        });
      }

      const producto = await Producto.findByPk(productoIdNumerico, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!producto) {
        await transaction.rollback();

        return res.status(404).json({
          message: "Producto no encontrado",
        });
      }

      const stockActual = Number(producto.stock);
      const precioProducto = Number(producto.precio);

      if (stockActual < cantidadVenta) {
        await transaction.rollback();

        return res.status(400).json({
          message: "Stock insuficiente",
        });
      }

      if (!Number.isFinite(precioProducto) || precioProducto < 1000) {
        await transaction.rollback();

        return res.status(400).json({
          message: "El precio del producto no es válido",
        });
      }

      const total = precioProducto * cantidadVenta;

      const venta = await Venta.create(
        {
          clienteId: null,
          empleadoId: req.usuario.id,
          total,
        },
        {
          transaction,
        },
      );

      await DetalleVenta.create(
        {
          ventaId: venta.id,
          productoId: producto.id,
          cantidad: cantidadVenta,
          precio: precioProducto,
          subtotal: total,
        },
        {
          transaction,
        },
      );

      producto.stock = stockActual - cantidadVenta;

      await producto.save({
        transaction,
      });

      await Pago.create(
        {
          ventaId: venta.id,
          metodoPago: "efectivo",
          estado: "aprobado",
          referencia: `EMP-${Date.now()}`,
          monto: total,
        },
        {
          transaction,
        },
      );

      await transaction.commit();

      res.status(201).json({
        message: "Venta registrada correctamente",
        venta,
      });
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback();
      }

      console.error("Error registrando venta del empleado:", error);

      res.status(500).json({
        message: "Error al registrar la venta",
      });
    }
  },
);

app.get(
  "/admin/ventas",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {
    try {
      const { desde, hasta } = req.query;

      const where = {};

      if (desde && hasta) {
        const fechaDesde = new Date(`${desde}T00:00:00`);
        const fechaHasta = new Date(`${hasta}T23:59:59.999`);

        if (
          Number.isNaN(fechaDesde.getTime()) ||
          Number.isNaN(fechaHasta.getTime())
        ) {
          return res.status(400).json({
            message: "Las fechas proporcionadas no son válidas",
          });
        }

        if (fechaDesde > fechaHasta) {
          return res.status(400).json({
            message: "La fecha inicial no puede ser mayor que la fecha final",
          });
        }

        where.createdAt = {
          [Op.between]: [fechaDesde, fechaHasta],
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
            model: Usuario,
            as: "Empleado",
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
      console.error("Error obteniendo ventas:", error);

      res.status(500).json({
        message: "Error obteniendo ventas",
      });
    }
  },
);

app.get(
  "/admin/usuarios",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        attributes: ["id", "nombre", "email", "rol", "createdAt"],
        order: [["createdAt", "DESC"]],
      });

      res.json(usuarios);
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);

      res.status(500).json({
        message: "Error obteniendo usuarios",
      });
    }
  },
);

app.post(
  "/admin/usuarios",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {
    try {
      const { nombre, email, password, rol } = req.body;

      const rolesPermitidos = ["administrador", "empleado", "cliente"];

      if (!nombre || !email || !password || !rol) {
        return res.status(400).json({
          message: "Todos los campos son obligatorios",
        });
      }

      if (!rolesPermitidos.includes(rol)) {
        return res.status(400).json({
          message: "El rol seleccionado no es válido",
        });
      }

      const emailNormalizado = email.trim().toLowerCase();

      const existe = await Usuario.findOne({
        where: {
          email: emailNormalizado,
        },
      });

      if (existe) {
        return res.status(400).json({
          message: "El correo ya está registrado",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const nuevoUsuario = await Usuario.create({
        nombre: nombre.trim(),
        email: emailNormalizado,
        password: passwordHash,
        rol,
      });

      res.status(201).json({
        message: "Usuario creado correctamente",
        usuario: nuevoUsuario,
      });
    } catch (error) {
      console.error("Error creando usuario:", error);

      res.status(500).json({
        message: "Error creando usuario",
      });
    }
  },
);

app.put(
  "/admin/usuarios/:id/rol",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {
    try {
      const rol = String(req.body.rol || "")
        .trim()
        .toLowerCase();

      const rolesPermitidos = ["administrador", "empleado", "cliente"];

      if (!rolesPermitidos.includes(rol)) {
        return res.status(400).json({
          message: "El rol seleccionado no es válido",
        });
      }

      const usuario = await Usuario.findByPk(req.params.id);

      if (!usuario) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      if (
        Number(usuario.id) === Number(req.usuario.id) &&
        rol !== usuario.rol
      ) {
        return res.status(400).json({
          message: "No puedes cambiar tu propio rol",
        });
      }

      const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

      if (
        String(usuario.email || "")
          .trim()
          .toLowerCase() === adminEmail &&
        rol !== "administrador"
      ) {
        return res.status(400).json({
          message: "No puedes cambiar el rol del administrador principal",
        });
      }

      usuario.rol = rol;
      await usuario.save();

      return res.json({
        message: "Rol actualizado correctamente",
        usuario,
      });
    } catch (error) {
      console.error("Error actualizando rol:", error);

      return res.status(500).json({
        message: "Error actualizando rol",
      });
    }
  },
);

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

      if (Number(usuario.id) === Number(req.usuario.id)) {
        return res.status(400).json({
          message: "No puedes eliminar tu propia cuenta",
        });
      }

      const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

      if (
        String(usuario.email || "")
          .trim()
          .toLowerCase() === adminEmail
      ) {
        return res.status(400).json({
          message: "No puedes eliminar el administrador principal",
        });
      }

      const ventasAsociadas = await Venta.count({
        where: {
          [Op.or]: [{ clienteId: usuario.id }, { empleadoId: usuario.id }],
        },
      });

      if (ventasAsociadas > 0) {
        return res.status(400).json({
          message:
            "No puedes eliminar este usuario porque tiene ventas registradas en el historial",
          ventasAsociadas,
        });
      }

      await usuario.destroy();

      return res.json({
        message: "Usuario eliminado correctamente",
      });
    } catch (error) {
      console.error("Error eliminando usuario:", error);

      return res.status(500).json({
        message: "Error eliminando usuario",
      });
    }
  },
);

app.get(
  "/admin/estadisticas",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {
    try {
      const [totalUsuarios, totalProductos, totalVentas, ingresos] =
        await Promise.all([
          Usuario.count(),
          Producto.count(),
          Venta.count(),
          Venta.sum("total"),
        ]);

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

      const [ventasHoy, ingresosHoy, ventasMes, ingresosMes] =
        await Promise.all([
          Venta.count({
            where: {
              createdAt: {
                [Op.between]: [inicioHoy, finHoy],
              },
            },
          }),

          Venta.sum("total", {
            where: {
              createdAt: {
                [Op.between]: [inicioHoy, finHoy],
              },
            },
          }),

          Venta.count({
            where: {
              createdAt: {
                [Op.between]: [inicioMes, finMes],
              },
            },
          }),

          Venta.sum("total", {
            where: {
              createdAt: {
                [Op.between]: [inicioMes, finMes],
              },
            },
          }),
        ]);

      const pagos = await Pago.findAll({
        attributes: ["metodoPago"],
      });

      const metodosPago = pagos.reduce((acumulador, pago) => {
        let metodo = String(pago.metodoPago || "Sin especificar")
          .trim()
          .toLowerCase();

        if (metodo === "tarjeta") {
          metodo = "Tarjeta";
        } else if (metodo === "efectivo") {
          metodo = "Efectivo";
        } else if (metodo === "pse") {
          metodo = "PSE";
        } else if (metodo === "nequi") {
          metodo = "Nequi";
        } else if (metodo === "contra_entrega" || metodo === "contra entrega") {
          metodo = "Contra Entrega";
        } else {
          metodo = "Sin especificar";
        }

        acumulador[metodo] = (acumulador[metodo] || 0) + 1;

        return acumulador;
      }, {});

      const ventasGrafica = await Venta.findAll({
        attributes: ["id", "total", "createdAt"],
        order: [["createdAt", "ASC"]],
      });

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
      });
    }
  },
);

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

      ventas.forEach((venta) => {
        actividades.push({
          tipo: "venta",
          icon: "🛒",
          text: "Nueva venta registrada",
          fecha: venta.createdAt,
        });
      });

      usuarios.forEach((usuario) => {
        actividades.push({
          tipo: "usuario",
          icon: "👤",
          text: "Nuevo usuario registrado",
          fecha: usuario.createdAt,
        });
      });

      productos.forEach((producto) => {
        actividades.push({
          tipo: "producto",
          icon: "📦",
          text: "Producto actualizado",
          fecha: producto.updatedAt,
        });
      });

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

      actividades.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
      );

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

const crearAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL y ADMIN_PASSWORD deben estar definidos");
    }

    if (password.length < 12) {
      throw new Error("ADMIN_PASSWORD debe tener al menos 12 caracteres");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await Usuario.findOne({
      where: { email },
    });

    if (admin) {
      admin.password = passwordHash;
      admin.rol = "administrador";
      await admin.save();
      return;
    }

    await Usuario.create({
      nombre: "Administrador",
      email,
      password: passwordHash,
      rol: "administrador",
    });
  } catch (error) {
    console.error("Error configurando administrador:", error.message);
    throw error;
  }
};
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
