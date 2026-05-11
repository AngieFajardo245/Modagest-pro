const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Venta = sequelize.define(
  "Venta",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El producto es obligatorio",
        },
      },
    },

    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: true, // ✅ permitido para evitar error con datos antiguos
      // ❌ ELIMINAMOS validate.notNull
    },

    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "La cantidad debe ser mayor que 0",
        },
      },
    },

    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "El total no puede ser negativo",
        },
      },
    },
  },
  {
    tableName: "ventas",
    timestamps: true,
  }
);

module.exports = Venta;