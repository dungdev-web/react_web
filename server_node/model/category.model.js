const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");
const categoryModel = sequelize.define('category',
  {
    category_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    parent_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: "category", key: "category_id" } }
  },
  { timestamps: false, tableName: "category" }
);
module.exports =  categoryModel ;