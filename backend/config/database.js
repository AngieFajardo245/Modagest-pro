const { Sequelize } = require("sequelize");
require("dotenv").config();

const variablesRequeridas = [
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "JWT_SECRET",
];

variablesRequeridas.forEach((variable) => {
  if (!process.env[variable]) {
    console.error(`❌ Falta la variable de entorno: ${variable}`);
    process.exit(1);
  }
});

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
      charset: "utf8mb4",
      ...(process.env.DB_SSL === "true"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {}),
    },

    define: {
      timestamps: true,
      underscored: false,
    },

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

    retry: {
      max: 3,
    },
  },
);

const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL establecida correctamente");
  } catch (error) {
    console.error("❌ Error conectando MySQL:", error.message);
    process.exit(1);
  }
};

module.exports = sequelize;
