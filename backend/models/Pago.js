const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pago = sequelize.define(
  "Pago",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    ventaId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    metodoPago: {
      type: DataTypes.STRING,
      allowNull: false
    },

    estado: {
      type: DataTypes.STRING,
      defaultValue: "aprobado"
    },

    referencia: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: "pagos",
    timestamps: true
  }
);

module.exports = Pago;