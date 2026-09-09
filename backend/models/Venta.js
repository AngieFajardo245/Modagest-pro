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
      references: {
        model: "usuarios",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },

    empleadoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "usuarios",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },

    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: "El total debe ser un valor numérico válido",
        },
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
    direccionEntrega: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: {
          args: [5, 255],
          msg: "La dirección de entrega debe tener entre 5 y 255 caracteres",
        },
      },
    },

    ciudadEntrega: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: {
          args: [2, 100],
          msg: "La ciudad de entrega debe tener entre 2 y 100 caracteres",
        },
      },
    },

    telefonoEntrega: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: {
          args: [7, 20],
          msg: "El teléfono de entrega debe tener entre 7 y 20 caracteres",
        },
      },
    },
  },
  {
    tableName: "ventas",
    timestamps: true,
  },
);

module.exports = Venta;
