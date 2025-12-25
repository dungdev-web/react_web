
const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");
const Sequelize = require("sequelize");
const ProductModel = sequelize.define('product',
  {
    product_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "category", key: "category_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    },
    name: { type: DataTypes.STRING },
    img: { type: DataTypes.STRING },
    price: { type: DataTypes.INTEGER },
    discount_price: { type: DataTypes.INTEGER },
    description: { type: DataTypes.TEXT },
    stock: { type: DataTypes.INTEGER },
    status: {
      type: DataTypes.ENUM('available', 'out_of_stock'),
      allowNull: false,
      defaultValue: 'available'
    },
    hot: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false // hoặc true tùy yêu cầu
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
    },
  },
  { timestamps: false, tableName: "product" }
);
module.exports = ProductModel;