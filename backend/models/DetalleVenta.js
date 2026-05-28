const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DetalleVenta = sequelize.define(
"DetalleVenta",
{
id: {
type: DataTypes.INTEGER,
autoIncrement: true,
primaryKey: true
},

ventaId: {
  type: DataTypes.INTEGER,
  allowNull: false,

  validate: {
    isInt: {
      msg: "ventaId debe ser numérico"
    }
  }
},

productoId: {
  type: DataTypes.INTEGER,
  allowNull: false,

  validate: {
    isInt: {
      msg: "productoId debe ser numérico"
    }
  }
},

cantidad: {
  type: DataTypes.INTEGER,
  allowNull: false,

  validate: {
    min: {
      args: [1],
      msg: "La cantidad mínima es 1"
    },

    isInt: {
      msg: "La cantidad debe ser un número entero"
    }
  }
},

precio: {
  type: DataTypes.DECIMAL(10, 2),
  allowNull: false,

  get() {

    const value =
      this.getDataValue("precio");

    return value
      ? parseFloat(value)
      : 0;

  }
},

subtotal: {
  type: DataTypes.DECIMAL(10, 2),
  allowNull: false,

  get() {

    const value =
      this.getDataValue("subtotal");

    return value
      ? parseFloat(value)
      : 0;

  }
}

},

{
tableName: "detalle_ventas",
timestamps: true
}
);

module.exports = DetalleVenta;
