const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Producto = sequelize.define(
  "Producto",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El nombre es obligatorio",
        },
        len: {
          args: [2, 150],
          msg: "El nombre debe tener entre 2 y 150 caracteres",
        },
      },
      set(value) {
        this.setDataValue("nombre", value?.trim());
      },
    },

    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [1000],
          msg: "El precio debe ser mínimo de $1.000 COP",
        },
      },
      get() {
        const value = this.getDataValue("precio");
        return value !== null ? Number(value) : 0;
      },
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "El stock no puede ser negativo",
        },
        isInt: {
          msg: "El stock debe ser un número entero",
        },
      },
      get() {
        const value = this.getDataValue("stock");
        return value !== null ? Number(value) : 0;
      },
    },

    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    imagen: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "productos",
    timestamps: true,
  },
);

module.exports = Producto;
