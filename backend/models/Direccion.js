const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Direccion = sequelize.define(
  "Direccion",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,

      validate: {
        isInt: {
          msg: "clienteId debe ser un número entero",
        },
        min: {
          args: [1],
          msg: "clienteId debe ser mayor que 0",
        },
      },
    },

    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false,

      validate: {
        notEmpty: {
          msg: "La dirección es obligatoria",
        },

        len: {
          args: [5, 255],
          msg: "La dirección debe tener entre 5 y 255 caracteres",
        },
      },

      set(value) {
        this.setDataValue(
          "direccion",
          typeof value === "string" ? value.trim() : value,
        );
      },
    },

    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: false,

      validate: {
        notEmpty: {
          msg: "La ciudad es obligatoria",
        },

        len: {
          args: [2, 100],
          msg: "La ciudad debe tener entre 2 y 100 caracteres",
        },
      },

      set(value) {
        this.setDataValue(
          "ciudad",
          typeof value === "string" ? value.trim() : value,
        );
      },
    },

    telefono: {
      type: DataTypes.STRING(20),
      allowNull: false,

      validate: {
        notEmpty: {
          msg: "El teléfono es obligatorio",
        },

        len: {
          args: [7, 20],
          msg: "El teléfono debe tener entre 7 y 20 caracteres",
        },
      },

      set(value) {
        this.setDataValue(
          "telefono",
          typeof value === "string" ? value.trim() : value,
        );
      },
    },
  },
  {
    tableName: "direcciones",
    timestamps: true,
  },
);

module.exports = Direccion;
