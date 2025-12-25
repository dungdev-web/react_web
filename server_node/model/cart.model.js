const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const Sequelize = require("sequelize");
const CartModel = sequelize.define('cart',
  {
    cart_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "user", key: "user_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    },
    // total_price: { type: DataTypes.INTEGER },
    ghi_chu: { type: DataTypes.STRING },
    ma_dh: { type: DataTypes.STRING },
    payment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Tương ứng với 0
    },
    voucher:{type:DataTypes.STRING},
    address:{type:DataTypes.STRING},
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
    },
  },
  { timestamps: false, tableName: "cart" }
);
module.exports =  CartModel ;