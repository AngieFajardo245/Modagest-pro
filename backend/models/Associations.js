const Usuario = require("./Usuario");
const Producto = require("./Producto");
const Carrito = require("./Carrito");

// Usuario → Carrito
Usuario.hasMany(Carrito, {
  foreignKey: "usuarioId",
  as: "carritos",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Carrito.belongsTo(Usuario, {
  foreignKey: "usuarioId",
  as: "usuario",
});

// Producto → Carrito
Producto.hasMany(Carrito, {
  foreignKey: "productoId",
  as: "carritos",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Carrito.belongsTo(Producto, {
  foreignKey: "productoId",
  as: "producto",
});

module.exports = {
  Usuario,
  Producto,
  Carrito,
};
