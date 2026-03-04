require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sequelize = require("./config/database");
const Usuario = require("./models/Usuario");
const Producto = require("./models/Producto");
const Venta = require("./models/Ventas"); 

const verificarToken = require("./middlewares/authMiddleware");
const verificarRol = require("./middlewares/rolMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   RELACIONES
=================================*/
Venta.belongsTo(Producto, { foreignKey: "productoId" });
Venta.belongsTo(Usuario, { foreignKey: "empleadoId" });

/* ===============================
   RUTA PRINCIPAL
=================================*/
app.get("/", (req, res) => {
  res.send("ModaGest Pro API funcionando 🚀");
});

/* ===============================
   REGISTRO DE USUARIO
=================================*/
app.post("/auth/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios"
      });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } });

    if (usuarioExistente) {
      return res.status(400).json({
        message: "El email ya está registrado"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol: "cliente"
    });

    res.status(201).json({
      message: "Usuario registrado correctamente ✅",
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });

  } catch (error) {
    res.status(500).json({
      error: "Error al registrar usuario",
      detalle: error.message
    });
  }
});

/* ===============================
   LOGIN
=================================*/
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login exitoso ✅",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    res.status(500).json({
      error: "Error en el servidor",
      detalle: error.message
    });
  }
});

/* ===============================
   PERFIL
=================================*/
app.get("/perfil", verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ["id", "nombre", "email", "rol"],
    });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ===============================
   ADMIN - USUARIOS
=================================*/
app.get("/admin/usuarios",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {
    const usuarios = await Usuario.findAll({
      attributes: ["id", "nombre", "email", "rol"]
    });
    res.json(usuarios);
  }
);

app.delete("/admin/usuarios/:id",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await usuario.destroy();
    res.json({ message: "Usuario eliminado correctamente ✅" });
  }
);

app.put("/admin/usuarios/:id/rol",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    usuario.rol = req.body.rol;
    await usuario.save();
    res.json({ message: "Rol actualizado correctamente ✅" });
  }
);

/* ===============================
   PRODUCTOS
=================================*/
app.get("/productos", verificarToken, async (req, res) => {
  const productos = await Producto.findAll();
  res.json(productos);
});

app.post("/productos",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {
    const nuevoProducto = await Producto.create(req.body);
    res.status(201).json({
      message: "Producto creado ✅",
      producto: nuevoProducto
    });
  }
);

/* ===============================
   REGISTRAR VENTA (EMPLEADO)
=================================*/
app.post("/empleado/vender",
  verificarToken,
  verificarRol("empleado"),
  async (req, res) => {
    try {
      const { productoId, cantidad } = req.body;

      const producto = await Producto.findByPk(productoId);

      if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      if (producto.stock < cantidad) {
        return res.status(400).json({ message: "Stock insuficiente" });
      }

      const total = producto.precio * cantidad;

      producto.stock -= cantidad;
      await producto.save();

      await Venta.create({
        productoId,
        empleadoId: req.usuario.id,
        cantidad,
        total,
      });

      res.json({
        message: "Venta registrada correctamente ✅",
        stockRestante: producto.stock
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* ===============================
   HISTORIAL DE VENTAS (ADMIN)
=================================*/
const { Op } = require("sequelize");

app.get("/admin/ventas",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {
    try {
      const { desde, hasta } = req.query;

      let whereCondition = {};

      if (desde && hasta) {
        whereCondition.createdAt = {
          [Op.between]: [new Date(desde), new Date(hasta)]
        };
      }

      const ventas = await Venta.findAll({
        where: whereCondition,
        include: [Producto, Usuario],
        order: [["createdAt", "DESC"]]
      });

      res.json(ventas);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* ===============================
   ESTADÍSTICAS ADMIN (DEBUG)
=================================*/
app.get("/admin/estadisticas", verificarToken, async (req, res) => {
  try {
    console.log("===== DEBUG ESTADÍSTICAS =====");

    // Traer todas las ventas
    const todasLasVentas = await Venta.findAll();
    console.log("Ventas encontradas:", todasLasVentas.length);
    console.log("Datos completos:", todasLasVentas);

    // Contar ventas
    const totalVentas = await Venta.count();
    console.log("Total ventas:", totalVentas);

    // Sumar ingresos
    const ingresos = await Venta.sum("total");
    console.log("Suma total ingresos:", ingresos);

    // Ventas de hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const ventasHoy = await Venta.count({
      where: {
        createdAt: {
          [Op.gte]: hoy,
        },
      },
    });

    console.log("Ventas hoy:", ventasHoy);

    console.log("===== FIN DEBUG =====");

    res.json({
      totalVentas,
      ingresosTotales: ingresos || 0,
      ventasHoy,
    });

  } catch (error) {
    console.error("ERROR EN ESTADÍSTICAS:", error);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

/* ===============================
   VENTAS POR PRODUCTO
=================================*/
app.get("/admin/ventas-por-producto",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {
    try {
      const ventas = await Venta.findAll({
        include: [{ model: Producto }]
      });

      const resumen = {};

      ventas.forEach((venta) => {
        const nombreProducto = venta.Producto.nombre;

        if (!resumen[nombreProducto]) {
          resumen[nombreProducto] = 0;
        }

        resumen[nombreProducto] += venta.cantidad;
      });

      res.json(resumen);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* ===============================
   EXPORTAR VENTAS A EXCEL
=================================*/
const ExcelJS = require("exceljs");

app.get("/admin/exportar-ventas",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {
    try {

      const ventas = await Venta.findAll({
        include: [Producto, Usuario],
        order: [["createdAt", "DESC"]]
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Ventas");

      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Producto", key: "producto", width: 25 },
        { header: "Empleado", key: "empleado", width: 25 },
        { header: "Cantidad", key: "cantidad", width: 15 },
        { header: "Total", key: "total", width: 15 },
        { header: "Fecha", key: "fecha", width: 25 },
      ];

      ventas.forEach((venta) => {
        worksheet.addRow({
          id: venta.id,
          producto: venta.Producto?.nombre,
          empleado: venta.Usuario?.nombre,
          cantidad: venta.cantidad,
          total: venta.total,
          fecha: venta.createdAt,
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=ventas.xlsx"
      );

      await workbook.xlsx.write(res);
      res.end();

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
/* ===============================
   CREAR ADMIN AUTOMÁTICO
=================================*/
const crearAdminAutomatico = async () => {
  const adminExistente = await Usuario.findOne({
    where: { email: "admin@modagest.com" }
  });

  if (!adminExistente) {
    const hashedPassword = await bcrypt.hash("123456", 10);

    await Usuario.create({
      nombre: "Administrador",
      email: "admin@modagest.com",
      password: hashedPassword,
      rol: "administrador"
    });

    console.log("Administrador creado automáticamente ✅");
  }
};

/* ===============================
   SINCRONIZAR BASE
=================================*/
sequelize.sync()
  .then(async () => {
    console.log("Tablas sincronizadas correctamente ✅");

    await crearAdminAutomatico();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ✅ ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al sincronizar ❌:", error);
  });