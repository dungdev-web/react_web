const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const Sequelize = require("sequelize");
const CartItemModel = sequelize.define('cart_items',
  {
    item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "cart", key: "cart_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "product", key: "product_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    },
    quantity: { type: DataTypes.INTEGER },
    price: { type: DataTypes.INTEGER },
    size: { type: DataTypes.STRING },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Tương ứng với 0
    },
    status_way: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Tương ứng với 0
    },
    

    added_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
    }

  },
  { timestamps: false, tableName: "cart_items" }
);
module.exports = CartItemModel ;