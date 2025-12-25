const {DataTypes} = require("sequelize");
const {sequelize} = require("../database");
const Sequelize = require("sequelize");
const BlogModel = sequelize.define('blog',
  {
    blog_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    content: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    view: { type: DataTypes.INTEGER },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
    },
  },
  { timestamps: false, tableName: "blog" }
);
module.exports =  BlogModel ;