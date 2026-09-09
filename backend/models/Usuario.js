const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El nombre es obligatorio",
        },
        len: {
          args: [2, 100],
          msg: "El nombre debe tener entre 2 y 100 caracteres",
        },
      },
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: {
        msg: "El correo ya está registrado",
      },
      validate: {
        notEmpty: {
          msg: "El correo es obligatorio",
        },
        isEmail: {
          msg: "El correo no es válido",
        },
      },
      set(value) {
        this.setDataValue("email", String(value).trim().toLowerCase());
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La contraseña es obligatoria",
        },
      },
    },

    rol: {
      type: DataTypes.ENUM("administrador", "cliente", "empleado"),
      allowNull: false,
      defaultValue: "cliente",
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,
  },
);

Usuario.prototype.toJSON = function () {
  const usuario = { ...this.get() };
  delete usuario.password;
  return usuario;
};

module.exports = Usuario;
