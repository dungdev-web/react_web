const ProductModel = require("./product.model");
const CategoryModel = require("./category.model");
const ThumbnailModel = require("./thumbnail.model");
const FoodDetailModel = require("./foodDetail.model");
const UserModel = require("./user.model");
const CartModel = require("./cart.model");
const CartItemModel = require("./cartItem.model");
const ReviewModel = require("./review.model");
const AddressModel = require("./address.model");
ProductModel.belongsTo(CategoryModel, { foreignKey: 'category_id' });

// models/category.js
CategoryModel.hasMany(ProductModel, { foreignKey: 'category_id' });


ProductModel.hasOne(FoodDetailModel, { foreignKey: "product_id", onDelete: "CASCADE" });
FoodDetailModel.belongsTo(ProductModel, { foreignKey: "product_id" });
ProductModel.hasOne(ThumbnailModel, { foreignKey: "product_id", onDelete: "CASCADE" });
ThumbnailModel.belongsTo(ProductModel, { foreignKey: "product_id" });

UserModel.hasMany(CartModel, { foreignKey: "user_id", onDelete: "CASCADE" });
CartModel.belongsTo(UserModel, { foreignKey: "user_id", as: "user" });

CartModel.hasMany(CartItemModel, { foreignKey: "cart_id", as: "cartitem" });
CartItemModel.belongsTo(CartModel, { foreignKey: "cart_id", as: "cart" });
CartItemModel.belongsTo(ProductModel, { foreignKey: "product_id", as: "product" });

UserModel.hasMany(AddressModel, { foreignKey: "user_id" });
AddressModel.belongsTo(UserModel, { foreignKey: "user_id", as: "address_user" });

UserModel.hasMany(ReviewModel, { foreignKey: "user_id" });
ReviewModel.belongsTo(UserModel, { foreignKey: "user_id", as: "review_user" });

ProductModel.hasMany(ReviewModel, { foreignKey: "product_id", as: "products" });
ReviewModel.belongsTo(ProductModel, { foreignKey: "product_id", as: "products" });


ProductModel.hasMany(CartItemModel, {
  foreignKey: 'product_id',  // Khóa ngoại trong cart_items
  as: 'cartItems',           // Đặt tên alias cho mối quan hệ
});
CartItemModel.belongsTo(ProductModel, {
  foreignKey: 'product_id',   // Khóa ngoại trong cart_items
  as: 'products',              // Đặt tên alias cho mối quan hệ
});

module.exports = {ProductModel, CategoryModel, ThumbnailModel, FoodDetailModel, UserModel, CartModel, CartItemModel, ReviewModel, AddressModel};

