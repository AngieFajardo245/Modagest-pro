const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Categoria = sequelize.define(
  "Categoria",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    nombre: {
      type: DataTypes.STRING(100),

      allowNull: false,

      unique: true,

      validate: {

        notEmpty: {
          msg:
            "El nombre de la categoría es obligatorio"
        },

        len: {
          args: [2, 100],
          msg:
            "La categoría debe tener entre 2 y 100 caracteres"
        }

      },

      set(value) {

        this.setDataValue(
          "nombre",
          value?.trim()
        );

      }
    },

    imagen: {

      type: DataTypes.STRING,

      allowNull: true

    }

  },

  {
    tableName: "categorias",

    timestamps: false
  }
);

module.exports = Categoria;
