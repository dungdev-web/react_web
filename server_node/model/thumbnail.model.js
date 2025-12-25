const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
// model mô tả table thumbnail
const ThumbnailModel = sequelize.define('thumbnail',
  {
    thumbnail_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "product", key: "product_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    },
    img1: { type: DataTypes.STRING },
    img2: { type: DataTypes.STRING },
    img3: { type: DataTypes.STRING },
    img4: { type: DataTypes.STRING }


  },
  { timestamps: false, tableName: "thumbnail" }

);
module.exports = ThumbnailModel ;