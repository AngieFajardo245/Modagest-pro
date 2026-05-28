const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Venta = sequelize.define(
"Venta",
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
      msg: "clienteId debe ser un número entero"
    }
  }
},

total: {
  type: DataTypes.DECIMAL(10, 2),
  allowNull: false,

  validate: {
    min: {
      args: [0],
      msg: "El total no puede ser negativo"
    }
  },

  get() {

    const value =
      this.getDataValue("total");

    return value
      ? parseFloat(value)
      : 0;

  }
}


},

{
tableName: "ventas",
timestamps: true
}
);

module.exports = Venta;
