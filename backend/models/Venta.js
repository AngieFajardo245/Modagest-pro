const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Venta = sequelize.define(
  "Venta",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    empleadoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,

      validate: {
        min: {
          args: [0],
          msg: "El total no puede ser negativo",
        },
      },

      get() {
        const value = this.getDataValue("total");

        return value !== null && value !== undefined ? parseFloat(value) : 0;
      },
    },
  },
  {
    tableName: "ventas",
    timestamps: true,
  },
);

module.exports = Venta;
