const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const FoodDetailrModel = sequelize.define('food_detail',
  {
    food_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "product", key: "product_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    },
    ingredients: { type: DataTypes.TEXT },
    calories: { type: DataTypes.INTEGER },
    cooking_time: { type: DataTypes.INTEGER },
    instructions: { type: DataTypes.TEXT },
  },
  { timestamps: false, tableName: "food_detail" }
);
module.exports = FoodDetailrModel;