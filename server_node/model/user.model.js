const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const Sequelize = require("sequelize");
const UserModel = sequelize.define('users',
  {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    phone: { type: DataTypes.INTEGER },
    avatar:{type: DataTypes.STRING},
    role: {
      type: DataTypes.ENUM('customer', 'admin'),
      allowNull: false,
      defaultValue: 'customer'
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Tương ứng với 0
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
    },
  },
  { timestamps: false, tableName: "users" }
);
module.exports = UserModel;