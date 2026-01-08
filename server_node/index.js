const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
var app = express(); //tạo ứng dụng nodejs
const PORT = process.env.PORT || 3000;
require("./model/product.model");
require("./model/category.model");
require("./model/thumbnail.model");
require("./model/fooddetail.model");
require("./model/user.model");
require("./model/cart.model");
require("./model/cartitem.model");
require("./model/review.model");
require("./model/address.model");
require("./model/associations");

const { sequelize } = require("./database");
(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

await sequelize.sync({ alter: true });

 
    console.log("DB synced");

  } catch (err) {
    console.error("DB error:", err);
  }
})();

const ProductService = require("./service/product.service");
const AddressService = require("./service/address.service");
const BlogService = require("./service/blog.service");
const UserService = require("./service/user.service");
const CartService = require("./service/cart.service");
const cartItemService = require("./service/cartitem.service");
const CategoryService = require("./service/category.service");
const ReviewService = require("./service/review.service");
const VoucherService = require("./service/voucher.service");
app.use(express.json()); 
const cors = require("cors");
app.use(
  cors({
    credentials: true,
         origin: [
      "http://localhost:3000",
      "https://react-web-emhk.onrender.com",
    ],
 // Cho phép gửi cookie
  })
); 
app.use(cookieParser()); 

  app.use(AddressService);
  app.use(BlogService);
  app.use(ProductService);
  app.use(UserService);
  app.use(CartService);
  app.use(cartItemService);
  app.use(CategoryService);
  app.use(ReviewService);
  app.use(VoucherService);

app
  .listen(PORT, () => {
    console.log(`Ung dung dang chay o port ${PORT}`);
  })
  .on("error", function (err) {
    console.log(`Loi xay ra khi chay ung dung ${err}`);
  });