require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExcelJS = require("exceljs");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");

const sequelize = require("./config/database");

const Usuario = require("./models/Usuario");
const Producto = require("./models/Producto");
const Venta = require("./models/Ventas");

const verificarToken = require("./middlewares/authMiddleware");
const verificarRol = require("./middlewares/rolMiddleware");
const upload = require("./uploads/upload");

const app = express();

/* ================= MIDDLEWARES ================= */
app.use(cors());
app.use(express.json());

/* ================= UPLOADS ================= */
const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

app.use("/uploads", express.static(uploadPath));

/* ================= RELACIONES ================= */
Venta.belongsTo(Producto, { foreignKey: "productoId" });
Venta.belongsTo(Usuario, { foreignKey: "clienteId", as: "Cliente" });

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("ModaGest Pro API funcionando 🚀");
});

/* ================= AUTH ================= */
app.post("/auth/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Campos obligatorios" });
    }

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) return res.status(400).json({ message: "Email ya existe" });

    const hashed = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      email,
      password: hashed,
      rol: "cliente"
    });

    res.status(201).json(usuario);

  } catch (error) {
    console.error("Error register:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(401).json({ message: "Credenciales inválidas" });

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token: `Bearer ${token}`,
      usuario
    });

  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ================= PRODUCTOS (PUBLICO) ================= */
app.get("/productos", async (req, res) => {
  try {
    const productos = await Producto.findAll({
      order: [["createdAt", "DESC"]]
    });

    res.json(productos);

  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ================= ADMIN - USUARIOS ================= */
app.get("/admin/usuarios",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {
    try {

      const usuarios = await Usuario.findAll({
        attributes: ["id", "nombre", "email", "rol"],
        order: [["createdAt", "DESC"]]
      });

      res.json(usuarios);

    } catch (error) {
      console.error("Error usuarios:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

/* ================= ADMIN - VENTAS ================= */
app.get("/admin/ventas",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {

    try {

      const { desde, hasta } = req.query;

      let where = {};

      if (desde && hasta) {
        where.createdAt = {
          [Op.between]: [new Date(desde), new Date(hasta)]
        };
      }

      const ventas = await Venta.findAll({
        where,
        include: [
          { model: Producto },
          { model: Usuario, as: "Cliente" }
        ],
        order: [["createdAt", "DESC"]]
      });

      res.json(ventas);

    } catch (error) {
      console.error("Error ventas:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

/* ================= ADMIN - ESTADISTICAS ================= */
app.get("/admin/estadisticas",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {

    try {

      const totalUsuarios = await Usuario.count();
      const totalProductos = await Producto.count();
      const totalVentas = await Venta.count();
      const ingresos = await Venta.sum("total");

      res.json({
        totalUsuarios,
        totalProductos,
        totalVentas,
        ingresosTotales: ingresos || 0
      });

    } catch (error) {
      console.error("Error estadisticas:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

/* ================= EXPORTAR EXCEL ================= */
app.get("/admin/exportar-ventas",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {

    try {

      const ventas = await Venta.findAll({
        include: [
          { model: Producto },
          { model: Usuario, as: "Cliente" }
        ]
      });

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Ventas");

      sheet.columns = [
        { header: "ID", key: "id" },
        { header: "Producto", key: "producto" },
        { header: "Cliente", key: "cliente" },
        { header: "Cantidad", key: "cantidad" },
        { header: "Total", key: "total" }
      ];

      ventas.forEach(v => {
        sheet.addRow({
          id: v.id,
          producto: v.Producto?.nombre,
          cliente: v.Cliente?.nombre,
          cantidad: v.cantidad,
          total: v.total
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
      console.error("Error exportar:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

/* ================= CLIENTE ================= */
app.post("/cliente/comprar",
  verificarToken,
  verificarRol("cliente"),
  async (req, res) => {

    try {

      const { productoId, cantidad } = req.body;

      const producto = await Producto.findByPk(productoId);

      if (!producto) return res.status(404).json({ message: "No existe" });
      if (producto.stock < cantidad) return res.status(400).json({ message: "Sin stock" });

      const total = producto.precio * cantidad;

      producto.stock -= cantidad;
      await producto.save();

      await Venta.create({
        productoId,
        clienteId: req.usuario.id,
        cantidad,
        total
      });

      res.json({ message: "Compra realizada" });

    } catch (error) {
      console.error("Error compra:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

app.get("/cliente/compras",
  verificarToken,
  verificarRol("cliente"),
  async (req, res) => {

    try {

      const compras = await Venta.findAll({
        where: { clienteId: req.usuario.id },
        include: [{ model: Producto }],
        order: [["createdAt", "DESC"]]
      });

      res.json(compras);

    } catch (error) {
      console.error("Error compras:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

/* ================= ADMIN DEFAULT ================= */
const crearAdmin = async () => {
  const existe = await Usuario.findOne({ where: { email: "admin@modagest.com" } });

  if (!existe) {
    const pass = await bcrypt.hash("123456", 10);

    await Usuario.create({
      nombre: "Administrador",
      email: "admin@modagest.com",
      password: pass,
      rol: "administrador"
    });

    console.log("✅ Admin creado");
  }
};

app.use((err, req, res, next) => {

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: "Error subiendo archivo",
      error: err.message
    });
  }

  if (err.message === "Solo se permiten imágenes JPG, PNG o WEBP") {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({
    message: "Error interno del servidor",
    error: err.message
  });
});

/* ================= SERVER ================= */
sequelize.sync().then(async () => {

  console.log("✅ DB conectada");

  await crearAdmin();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  });

});