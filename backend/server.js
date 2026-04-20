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

app.use(cors());
app.use(express.json());

/* ===============================
CREAR CARPETA UPLOADS SI NO EXISTE
=================================*/
const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

/* ===============================
SERVIR IMÁGENES
=================================*/
app.use("/uploads", express.static(uploadPath));

/* ===============================
RELACIONES
=================================*/
Venta.belongsTo(Producto, { foreignKey: "productoId" });

Venta.belongsTo(Usuario, {
  foreignKey: "clienteId",
  as: "Cliente"
});

/* ===============================
RUTA PRINCIPAL
=================================*/
app.get("/", (req, res) => {
  res.send("ModaGest Pro API funcionando 🚀");
});

/* ===============================
REGISTER
=================================*/
app.post("/auth/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios"
      });
    }

    const existe = await Usuario.findOne({ where: { email } });

    if (existe) {
      return res.status(400).json({
        message: "El email ya está registrado"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      email,
      password: hashed,
      rol: "cliente"
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      usuario
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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
      return res.status(401).json({
        message: "Credenciales inválidas"
      });
    }

    const valido = await bcrypt.compare(password, usuario.password);

    if (!valido) {
      return res.status(401).json({
        message: "Credenciales inválidas"
      });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, usuario });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/* ===============================
PRODUCTOS
=================================*/
app.get("/productos", verificarToken, async (req, res) => {
  try {
    const productos = await Producto.findAll({
      order: [["createdAt", "DESC"]]
    });

    res.json(productos);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/* ===============================
CREAR PRODUCTO CON IMAGEN
=================================*/
app.post("/productos",
  verificarToken,
  verificarRol("administrador"),
  upload.single("imagen"),
  async (req, res) => {

    try {

      const { nombre, descripcion, precio, stock } = req.body;

      if (!nombre || !precio) {
        return res.status(400).json({
          message: "Nombre y precio son obligatorios"
        });
      }

      const imagen = req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : null;

      const producto = await Producto.create({
        nombre,
        descripcion,
        precio: Number(precio),
        stock: Number(stock) || 0,
        imagen
      });

      res.status(201).json(producto);

    } catch (error) {
      console.error("Error crear producto:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

/* ===============================
ELIMINAR PRODUCTO
=================================*/
app.delete("/productos/:id",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {

    try {

      const producto = await Producto.findByPk(req.params.id);

      if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      // 🔥 ELIMINAR IMAGEN DEL DISCO
      if (producto.imagen) {
        const nombreArchivo = producto.imagen.split("/uploads/")[1];
        const ruta = path.join(uploadPath, nombreArchivo);

        if (fs.existsSync(ruta)) {
          fs.unlinkSync(ruta);
        }
      }

      await producto.destroy();

      res.json({ message: "Producto eliminado" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);

/* ===============================
ADMIN - USUARIOS
=================================*/
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
      res.status(500).json({ error: error.message });
    }
  }
);

app.delete("/admin/usuarios/:id",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {

    try {

      const usuario = await Usuario.findByPk(req.params.id);

      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (usuario.email === "admin@modagest.com") {
        return res.status(403).json({
          message: "No se puede eliminar el administrador principal"
        });
      }

      await usuario.destroy();

      res.json({ message: "Usuario eliminado" });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* ===============================
CAMBIAR ROL
=================================*/
app.put("/admin/usuarios/:id/rol",
  verificarToken,
  verificarRol("administrador"),
  async (req, res) => {

    try {

      const usuario = await Usuario.findByPk(req.params.id);

      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      usuario.rol = req.body.rol;
      await usuario.save();

      res.json({ message: "Rol actualizado" });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* ===============================
CLIENTE - COMPRAR
=================================*/
app.post("/cliente/comprar",
  verificarToken,
  verificarRol("cliente"),
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
        clienteId: req.usuario.id,
        cantidad,
        total
      });

      res.json({ message: "Compra realizada" });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* ===============================
CREAR ADMIN
=================================*/
const crearAdmin = async () => {

  const existe = await Usuario.findOne({
    where: { email: "admin@modagest.com" }
  });

  if (!existe) {

    const pass = await bcrypt.hash("123456", 10);

    await Usuario.create({
      nombre: "Administrador",
      email: "admin@modagest.com",
      password: pass,
      rol: "administrador"
    });

    console.log("Admin creado");
  }
};

/* ===============================
INICIAR SERVIDOR
=================================*/
sequelize.sync().then(async () => {

  console.log("Base de datos conectada");

  await crearAdmin();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });

});