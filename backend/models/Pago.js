const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pago = sequelize.define(
  "Pago",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    ventaId: {
      type: DataTypes.INTEGER,
      allowNull: false,

      validate: {
        isInt: {
          msg: "ventaId debe ser numérico",
        },
      },
    },

    metodoPago: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        notEmpty: {
          msg: "El método de pago es obligatorio",
        },
      },
    },

    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "aprobado",
    },

    referencia: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,

      validate: {
        min: {
          args: [0],
          msg: "El monto no puede ser negativo",
        },
      },

      get() {
        const value = this.getDataValue("monto");

        return value ? parseFloat(value) : 0;
      },
    },
  },
  {
    tableName: "pagos",
    timestamps: true,
  },
);

module.exports = Pago;
