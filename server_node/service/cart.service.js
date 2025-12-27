const express = require("express");
const router = express();
const CartModel = require("../model/cart.model");
const CartItemModel = require("../model/cartitem.model");
const ProductModel = require("../model/product.model");
const UserModel = require("../model/user.model");
const AddressModel = require("../model/address.model");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { sequelize } = require("../database");
router.post("/api/luudonhang/", async (req, res) => {
  try {
    let { user_id, ghi_chu, email, payment, voucher, products, address } =
      req.body;

    if (
      !user_id ||
      !email ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res
        .status(400)
        .json({ thong_bao: "Thiếu user_id, email hoặc danh sách sản phẩm" });
    }

    // 🔎 Bước kiểm tra toàn bộ sản phẩm trước khi tạo đơn hàng
    for (let product of products) {
      let { id, so_luong, ten_sp } = product;
      const productData = await ProductModel.findOne({
        where: { product_id: id },
      });

      if (!productData || productData.stock < so_luong) {
        return res
          .status(400)
          .json({
            thong_bao: `❌ Sản phẩm "${ten_sp}" không đủ hàng trong kho!`,
          });
      }
    }

    // 🔹 Tạo mã đơn hàng ngẫu nhiên
    let ma_dh = crypto.randomBytes(2).toString("hex").toUpperCase();

    // 🔹 Bước 1: Tạo đơn hàng
    let newOrder = await CartModel.create({
      user_id,
      ghi_chu: ghi_chu || "",
      ma_dh,
      payment,
      voucher,
      address,
    });

    let cartItems = [];
    for (let product of products) {
      let { id, ten_sp, so_luong, gia_mua, hinh, size } = product;
      let product_id = id;
      let quantity = so_luong;
      let price = gia_mua;

      let cartItem = await CartItemModel.create({
        cart_id: newOrder.cart_id,
        product_id,
        quantity,
        price: quantity * price,
        size,
      });

      cartItems.push(cartItem);

      await ProductModel.update(
        { stock: sequelize.literal(`stock - ${quantity}`) },
        { where: { product_id } }
      );
    }

    console.log("🛒 Sản phẩm đã thêm vào giỏ hàng:", cartItems);

    // 🔹 Bước 3: Lấy danh sách sản phẩm đã thêm vào giỏ hàng
    let cartItemDetails = await CartItemModel.findAll({
      where: { cart_id: newOrder.cart_id },
      include: [
        {
          model: ProductModel,
          as: "product",
          attributes: ["name", "img", "price"],
        },
      ],
    });

    // 🔹 Tính tổng tiền và tạo danh sách sản phẩm
    let total = 0;
    let productListHTML = cartItemDetails
      .map((item) => {
        total += item.price;
        return `
                <tr>
                    <td><img src="http://localhost:3001/img/${
                      item.product.img
                    }" width="100" /></td>
                    <td>${item.product.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toLocaleString()} VND</td>
                </tr>
            `;
      })
      .join("");

    let emailContent = `
            <h2>Đơn hàng #${ma_dh} của bạn</h2>
            <p>Cảm ơn bạn đã đặt hàng! Dưới đây là thông tin đơn hàng của bạn:</p>
            <table border="1" cellspacing="0" cellpadding="5">
                <tr>
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                </tr>
                ${productListHTML}
            </table>
            <p><strong>Tổng tiền: ${total.toLocaleString()} VND</strong></p>
            <p>Ghi chú: ${ghi_chu || "Không có"}</p>
            <p>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!</p>
        `;

    // 🔹 Cấu hình mailer (dùng biến môi trường thay vì hardcode mật khẩu)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // ⚠️ bỏ kiểm tra chứng chỉ SSL
      },
    });

    let mailOptions = {
      from: '"Shop Online" <' + process.env.EMAIL_USER + ">",
      to: email,
      subject: `Xác nhận đơn hàng #${ma_dh}`,
      html: emailContent,
    };

    // 🔹 Gửi email
    await transporter.sendMail(mailOptions);

    console.log("📩 Đã gửi email xác nhận đơn hàng!");

    res.json({ thong_bao: "Đã tạo đơn hàng và gửi email", don_hang: newOrder });
  } catch (err) {
    console.error("❌ Lỗi khi tạo đơn hàng:", err);
    res.status(500).json({ thong_bao: "Lỗi tạo đơn hàng", err });
  }
});

router.get("/api/donhang", async (req, res) => {
  try {
    // Lấy thông tin phân trang từ query: /api/donhang?page=1&limit=10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Lấy tổng số đơn hàng
    const totalCount = await CartModel.count();

    // Lấy danh sách đơn hàng có phân trang
    const donhang = await CartModel.findAll({
      limit,
      offset,
      order: [["created_at", "DESC"]], // Sắp xếp theo ngày tạo mới nhất
      include: [
        {
          model: CartItemModel,
          as: "cartitem",
          attributes: ["price", "status", "quantity"],
          include: [{ model: ProductModel, as: "product" }],
        },
        {
          model: UserModel,
          as: "user",
          attributes: ["email", "name"],
          include: [
            {
              model: AddressModel,
              as: "addresses",
              where: {
                is_default: 1,
              },
              required: false,
              attributes: ["address"],
            },
          ],
        },
      ],
    });

    res.json({
      thong_bao: "Đã lấy đơn hàng",
      donhang,
      pagination: {
        currentPage: page,
        perPage: limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ thong_bao: "Lỗi lấy đơn hàng", err });
  }
});

router.get("/api/donhang/:id", async (req, res) => {
  try {
    const donhang = await CartModel.findOne({
      where: { cart_id: req.params.id },
      include: [
        {
          model: CartItemModel,
          as: "cartitem",
          include: [{ model: ProductModel, as: "product" }],
        },
        {
          model: UserModel,
          as: "user",
          attributes: ["email", "name"],
          include: [
            {
              model: AddressModel,
              as: "addresses",
              where: { is_default: 1 },
              required: false,
              attributes: ["address"],
            },
          ],
        },
      ],
    });

    res.json(donhang);
  } catch (err) {
    console.error(err);
    res.status(500).json({ thong_bao: "Lỗi", err });
  }
});

router.get("/api/donhang/user/:user_id", async (req, res) => {
  try {
    let userId = req.params.user_id; // Lấy user_id từ URL

    let donhang = await CartModel.findAll({
      // Sử dụng findAll để lấy nhiều đơn hàng
      where: { user_id: userId }, // Lọc theo user_id
      include: [
        {
          model: CartItemModel,
          as: "cartitem",
          attributes: ["quantity", "price", "status", "status_way"],
          include: [
            {
              model: ProductModel,
              as: "product",
              attributes: ["product_id", "name", "discount_price", "img"],
            },
          ],
        },
        {
          model: UserModel,
          as: "user",
          attributes: ["role"],
          include: [
            {
              model: AddressModel,
              as: "addresses",
              where: {
                is_default: 1,
              },
              required: false,
              attributes: ["address"],
            },
          ],
        },
      ],
    });

    if (!donhang || donhang.length === 0) {
      return res
        .status(404)
        .json({ thong_bao: "Không tìm thấy đơn hàng cho người dùng này" });
    }

    res.json({
      thong_bao: "Đã lấy danh sách đơn hàng",
      donhang: donhang,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ thong_bao: "Lỗi lấy đơn hàng", err });
  }
});
module.exports = router;