const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DetalleVenta = sequelize.define(
  "DetalleVenta",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    ventaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "productos",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      validate: {
        isInt: {
          msg: "productoId debe ser numérico",
        },
      },
    },

    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "La cantidad debe ser un número entero",
        },
        min: {
          args: [1],
          msg: "La cantidad mínima es 1",
        },
      },
    },

    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "El precio debe ser un valor numérico válido",
        },
        min: {
          args: [0],
          msg: "El precio no puede ser negativo",
        },
      },
      get() {
        const value = this.getDataValue("precio");

        return value !== null && value !== undefined ? Number(value) : 0;
      },
    },

    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "El subtotal debe ser un valor numérico válido",
        },
        min: {
          args: [0],
          msg: "El subtotal no puede ser negativo",
        },
      },
      get() {
        const value = this.getDataValue("subtotal");

        return value !== null && value !== undefined ? Number(value) : 0;
      },
    },
  },
  {
    tableName: "detalle_ventas",
    timestamps: true,
  },
);

module.exports = DetalleVenta;
