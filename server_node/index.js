const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
var app = express(); //tạo ứng dụng nodejs
const port = 3000;
require("./model/associations");

const ProductService = require("./service/product.service");
const AddressService = require("./service/address.service");
const BlogService = require("./service/blog.service");
app.use(express.json()); 
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3001", // React chạy trên cổng này
    credentials: true, // Cho phép gửi cookie
  })
); 
app.use(cookieParser()); 
app
  .listen(port, () => {
    console.log(`Ung dung dang chay o port ${port}`);
  })
  .on("error", function (err) {
    console.log(`Loi xay ra khi chay ung dung ${err}`);
  });
app.use(ProductService);
app.use(AddressService);
app.use(BlogService);

