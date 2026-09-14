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
      unique: true,
      references: {
        model: "ventas",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      validate: {
        isInt: {
          msg: "ventaId debe ser numérico",
        },
      },
    },

    metodoPago: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El método de pago es obligatorio",
        },
        isIn: {
          args: [["Tarjeta", "PSE", "Nequi", "Contra Entrega", "efectivo"]],
          msg: "El método de pago no es válido",
        },
      },
    },

    estado: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "aprobado",
      validate: {
        notEmpty: {
          msg: "El estado del pago es obligatorio",
        },
        isIn: {
          args: [["pendiente", "aprobado", "rechazado", "cancelado"]],
          msg: "El estado del pago no es válido",
        },
      },
    },

    referencia: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "El monto debe ser un valor numérico válido",
        },
        min: {
          args: [0],
          msg: "El monto no puede ser negativo",
        },
      },
      get() {
        const value = this.getDataValue("monto");

        return value !== null && value !== undefined ? Number(value) : 0;
      },
    },
  },
  {
    tableName: "pagos",
    timestamps: true,
  },
);

module.exports = Pago;
