const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");

const VouchersModel = sequelize.define('vouchers', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  discount_type: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: false,
  },
  discount_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  max_discount_value: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  min_order_value: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  used: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'vouchers',
  timestamps: false, // Nếu bạn không dùng Sequelize tự động timestamps
  underscored: true, // Để dùng kiểu snake_case cho field
});
module.exports = VouchersModel;