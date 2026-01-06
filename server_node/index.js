const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
var app = express(); //tạo ứng dụng nodejs
const PORT = process.env.DB_PORT;
require("./model/associations");

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
    credentials: true, // Cho phép gửi cookie
  })
); 
app.use(cookieParser()); 
app
  .listen(PORT, () => {
    console.log(`Ung dung dang chay o port ${PORT}`);
  })
  .on("error", function (err) {
    console.log(`Loi xay ra khi chay ung dung ${err}`);
  });
  app.use(AddressService);
  app.use(BlogService);
  app.use(ProductService);
  app.use(UserService);
  app.use(CartService);
  app.use(cartItemService);
  app.use(CategoryService);
  app.use(ReviewService);
  app.use(VoucherService);

