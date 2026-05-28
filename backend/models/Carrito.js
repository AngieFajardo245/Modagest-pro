const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Carrito = sequelize.define(
"Carrito",
{
id: {
type: DataTypes.INTEGER,
autoIncrement: true,
primaryKey: true
},

usuarioId: {
  type: DataTypes.INTEGER,
  allowNull: false
},

productoId: {
  type: DataTypes.INTEGER,
  allowNull: false
},

cantidad: {
  type: DataTypes.INTEGER,
  defaultValue: 1
}


},
{
tableName: "carrito",
timestamps: true
}
);

module.exports = Carrito;
