const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Direccion = sequelize.define(
  "Direccion",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,

      validate: {
        notNull: {
          msg: "El cliente es obligatorio"
        },
        isInt: {
          msg: "clienteId debe ser numérico"
        }
      }
    },

    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false,

      validate: {
        notEmpty: {
          msg: "La dirección es obligatoria"
        },
        len: {
          args: [5, 255],
          msg: "La dirección es demasiado corta"
        }
      },

      set(value) {
        this.setDataValue(
          "direccion",
          value?.trim()
        );
      }
    },

    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: false,

      validate: {
        notEmpty: {
          msg: "La ciudad es obligatoria"
        }
      },

      set(value) {
        this.setDataValue(
          "ciudad",
          value?.trim()
        );
      }
    },

    telefono: {
      type: DataTypes.STRING(20),
      allowNull: false,

      validate: {
        notEmpty: {
          msg: "El teléfono es obligatorio"
        },
        len: {
          args: [7, 20],
          msg: "Teléfono inválido"
        }
      },

      set(value) {
        this.setDataValue(
          "telefono",
          value?.trim()
        );
      }
    }
  },

  {
    tableName: "direcciones",
    timestamps: true
  }
);

module.exports = Direccion;