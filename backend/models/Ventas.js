const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Venta = sequelize.define("Venta", {
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: "ventas",   // 👈 fuerza el nombre correcto
  freezeTableName: true  // 👈 evita pluralizaciones automáticas
});

module.exports = Venta;