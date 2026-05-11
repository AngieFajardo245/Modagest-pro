const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Producto = sequelize.define(
  "Producto",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("nombre", value.trim());
      },
      validate: {
        notEmpty: {
          msg: "El nombre del producto es obligatorio"
        },
        len: {
          args: [3, 100],
          msg: "El nombre debe tener entre 3 y 100 caracteres"
        }
      }
    },

    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    /* IMPORTANTE: que nos permitan convertir a número automáticamente */
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue("precio");
        return value ? parseFloat(value) : 0;
      },
      validate: {
        notNull: {
          msg: "El precio es obligatorio"
        },
        min: {
          args: [0],
          msg: "El precio no puede ser negativo"
        }
      }
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        notNull: {
          msg: "El stock es obligatorio"
        },
        min: {
          args: [0],
          msg: "El stock no puede ser negativo"
        }
      }
    },

    imagen: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "La imagen debe ser una URL válida"
        }
      }
    }
  },

  {
    tableName: "productos",
    timestamps: true
  }
);

module.exports = Producto;