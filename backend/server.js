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

app.use(
  cors({
    origin: "http://localhost:5173",
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const nombreLimpio = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    cb(null, `${nombreLimpio || "imagen"}-${Date.now()}${extension}`);
  },
});

const upload = multer({ storage });

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
      error: error.message,
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
      error: error.message,
    });
  }
});

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
        error: error.message,
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
        error: error.message,
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
        error: error.message,
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
      order: [["createdAt", "DESC"]],
    });

    res.json(productos);
  } catch (error) {
    console.error("Error obteniendo productos:", error);

    res.status(500).json({
      message: "Error obteniendo productos",
      error: error.message,
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

      const producto = await Producto.create({
        nombre: nombre.trim(),
        descripcion,
        precio: precioNumerico,
        stock: stockNumerico,
        categoriaId,
        imagen,
      });

      res.status(201).json(producto);
    } catch (error) {
      console.error("Error creando producto:", error);

      res.status(500).json({
        message: "Error creando producto",
        error: error.message,
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
          const rutaImagenAnterior = path.join(uploadPath, producto.imagen);

          if (fs.existsSync(rutaImagenAnterior)) {
            fs.unlinkSync(rutaImagenAnterior);
          }
        }

        producto.imagen = req.file.filename;
      }

      await producto.save();

      res.json(producto);
    } catch (error) {
      console.error("Error actualizando producto:", error);

      res.status(500).json({
        message: "Error actualizando producto",
        error: error.message,
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

      if (producto.imagen) {
        const rutaImagen = path.join(uploadPath, producto.imagen);

        if (fs.existsSync(rutaImagen)) {
          fs.unlinkSync(rutaImagen);
        }
      }

      await producto.destroy();

      res.json({
        message: "Producto eliminado",
      });
    } catch (error) {
      console.error("Error eliminando producto:", error);

      res.status(500).json({
        message: "Error eliminando producto",
        error: error.message,
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
      const { productoId, cantidad, metodoPago } = req.body;

      const cantidadCompra = Number(cantidad);

      if (
        !productoId ||
        !Number.isInteger(cantidadCompra) ||
        cantidadCompra < 1
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
          message: "Producto no encontrado",
        });
      }

      const precioProducto = Number(producto.precio);
      const stockActual = Number(producto.stock);

      if (!Number.isFinite(precioProducto) || precioProducto < 1000) {
        await transaction.rollback();

        return res.status(400).json({
          message: "El precio del producto no es válido",
        });
      }

      if (stockActual < cantidadCompra) {
        await transaction.rollback();

        return res.status(400).json({
          message: "Stock insuficiente",
        });
      }

      const total = precioProducto * cantidadCompra;

      const venta = await Venta.create(
        {
          clienteId: req.usuario.id,
          empleadoId: null,
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
          cantidad: cantidadCompra,
          precio: precioProducto,
          subtotal: total,
        },
        {
          transaction,
        },
      );

      producto.stock = stockActual - cantidadCompra;

      await producto.save({
        transaction,
      });

      await Pago.create(
        {
          ventaId: venta.id,
          metodoPago: metodoPago || "efectivo",
          estado: "aprobado",
          referencia: "REF-" + Date.now(),
          monto: total,
        },
        {
          transaction,
        },
      );

      await transaction.commit();

      res.status(201).json({
        message: "Compra realizada correctamente",
        venta,
      });
    } catch (error) {
      await transaction.rollback();

      console.error("Error realizando compra:", error);

      res.status(500).json({
        message: "Error realizando la compra",
        error: error.message,
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
        error: error.message,
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
        error: error.message,
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

      const cantidadVenta = Number(cantidad);

      if (
        !productoId ||
        !Number.isInteger(cantidadVenta) ||
        cantidadVenta < 1
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
          referencia: "EMP-" + Date.now(),
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
      await transaction.rollback();

      console.error("Error registrando venta del empleado:", error);

      res.status(500).json({
        message: "Error al registrar la venta",
        error: error.message,
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
        error: error.message,
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
        error: error.message,
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
        error: error.message,
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
      const { rol } = req.body;

      const rolesPermitidos = [
        "administrador",
        "empleado",
        "cliente",
      ];

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

      usuario.rol = rol;

      await usuario.save();

      res.json({
        message: "Rol actualizado",
        usuario,
      });
    } catch (error) {
      console.error("Error actualizando rol:", error);

      res.status(500).json({
        message: "Error actualizando rol",
        error: error.message,
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
      console.error("Error eliminando usuario:", error);

      res.status(500).json({
        message: "Error eliminando usuario",
        error: error.message,
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
      const totalUsuarios = await Usuario.count();
      const totalProductos = await Producto.count();
      const totalVentas = await Venta.count();
      const ingresos = await Venta.sum("total");

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

      const pagos = await Pago.findAll({
        attributes: ["metodoPago"],
      });

      const metodosPago = pagos.reduce((acumulador, pago) => {
        let metodo = String(
          pago.metodoPago || "Sin especificar",
        )
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
        } else if (
          metodo === "contra_entrega" ||
          metodo === "contra entrega"
        ) {
          metodo = "Contra Entrega";
        } else {
          metodo = "Sin especificar";
        }

        acumulador[metodo] =
          (acumulador[metodo] || 0) + 1;

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
        error: error.message,
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
      const [
        ventas,
        usuarios,
        productos,
        pagos,
      ] = await Promise.all([
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
        (a, b) =>
          new Date(b.fecha).getTime() -
          new Date(a.fecha).getTime(),
      );

      const actividadesRecientes = actividades
        .slice(0, 4)
        .map((actividad) => ({
          ...actividad,
          fecha: new Date(actividad.fecha).toISOString(),
        }));

      res.json(actividadesRecientes);
    } catch (error) {
      console.error("Error obteniendo actividad:", error);

      res.status(500).json({
        message: "Error obteniendo actividad reciente",
        error: error.message,
      });
    }
  },
);

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
    console.error("Error creando administrador:", error);
  }
};

sequelize
  .sync({
    alter: true,
    force: false,
  })
  .then(async () => {
    console.log("✅ Base de datos conectada");

    await crearAdmin();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `🚀 Servidor corriendo en puerto ${PORT}`,
      );
    });
  })
  .catch((error) => {
    console.error(
      "❌ Error conectando DB:",
      error,
    );
  });