const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Carrito = sequelize.define(
  "Carrito",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,

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
  },
  {
    tableName: "carrito",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["usuarioId", "productoId"],
        name: "carrito_unico",
      },
    ],
  },
);

module.exports = Carrito;
