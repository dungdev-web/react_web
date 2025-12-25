const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const ReviewModel = sequelize.define('review',
  {
    review_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "user_id" },
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
    rating: { type: DataTypes.INTEGER },
    comment: { type: DataTypes.TEXT },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
    },
  },
  { timestamps: false, tableName: "review" }

);
module.exports =  ReviewModel ;