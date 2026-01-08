require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,   // 🔥 BẮT BUỘC PHẢI CÓ
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
    dialectOptions: {
      connectTimeout: 60000,
    },
  }
);

module.exports = { sequelize };
