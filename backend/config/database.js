const { Sequelize } = require("sequelize");

require("dotenv").config();

/* ========================================================= */
/* ================= VALIDAR VARIABLES ENV ================= */
/* ========================================================= */

const variablesRequeridas = [

  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST"

];

variablesRequeridas.forEach((variable) => {

  if (!process.env[variable]) {

    console.error(
      `❌ Falta la variable de entorno: ${variable}`
    );

    process.exit(1);

  }

});

/* ========================================================= */
/* =================== CONFIGURAR SEQUELIZE ================= */
/* ========================================================= */

const sequelize = new Sequelize(

  process.env.DB_NAME,

  process.env.DB_USER,

  process.env.DB_PASSWORD,

  {

    host: process.env.DB_HOST,

    port: process.env.DB_PORT || 3306,

    dialect: "mysql",

    logging: false,

    timezone: "-05:00",

    dialectOptions: {

      charset: "utf8mb4"

    },

    define: {

      timestamps: true,

      underscored: false

      // ❌ ELIMINAMOS freezeTableName
      // porque estaba causando tablas duplicadas

    },

    pool: {

      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000

    },

    retry: {

      max: 3

    }

  }

);

/* ========================================================= */
/* =================== PROBAR CONEXIÓN DB ================== */
/* ========================================================= */

const conectarDB = async () => {

  try {

    await sequelize.authenticate();

    console.log(
      "✅ Conexión a MySQL establecida correctamente"
    );

  } catch (error) {

    console.error(
      "❌ Error conectando MySQL:"
    );

    console.error(error.message);

    process.exit(1);

  }

};

conectarDB();

/* ========================================================= */
/* ======================= EXPORTAR ======================== */
/* ========================================================= */

module.exports = sequelize;