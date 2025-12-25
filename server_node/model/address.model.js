const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const AddressModel = sequelize.define('address',
  {
    address_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "user_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    },
    address: { type: DataTypes.STRING },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Tương ứng với 0
    }
  },
  { timestamps: false, tableName: "address" }
)
module.exports =  AddressModel ;