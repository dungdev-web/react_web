const express = require('express');
const router = express();
const UserModel = require('../model/user.model');
const AddressModel = require("../model/address.model");
const CartModel = require("../model/cart.model");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const moment = require("moment");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const SECRET_KEY = process.env.JWT_SECRET || "mysecretkey";
const generateOTP=()=>{
  return Math.floor(100000 + Math.random() * 900000).toString();
}
const pendingUsers = {};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});
router.use("/api/avatar", express.static("public/avatar"));


const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/avatar"); // kiểm tra kỹ đường dẫn này có tồn tại và đúng chưa
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `avatar_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload1 = multer({ storage: storage1 });

router.post(
  "/api/change-avatar/:userId",
  upload1.single("avatar"),
  async (req, res) => {
    try {
      const user_id = Number(req.params.userId);
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "Không có file được tải lên" });
      }

      const avatarFileName = file.filename;

      const [updated] = await UserModel.update(
        { avatar: avatarFileName },
        { where: { user_id } }
      );

      if (updated) {
        const updatedUser = await UserModel.scope(null).findOne({
          where: { user_id },
        });

        res.json({
          message: "Cập nhật avatar thành công",
          avatar: updatedUser.avatar,
          avatarUrl: `http://localhost:3001/avatar/${updatedUser.avatar}`,
        });
      } else {
        res
          .status(404)
          .json({ message: "Không tìm thấy user", userId: user_id });
      }
    } catch (error) {
      console.error("Lỗi khi đổi avatar:", error);
      res.status(500).json({ message: "Lỗi server", error });
    }
  }
);
router.put("/api/user/:userId", async (req, res) => {
  try {
    const user_id = Number(req.params.userId);
    const { name, email, phone } = req.body;

    // Kiểm tra xem số điện thoại có tồn tại trong hệ thống không
    if (phone) {
      const existingUser = await UserModel.findOne({ where: { phone } });
      // Nếu số điện thoại chưa tồn tại, thêm mới
      if (!existingUser) {
        // Bạn có thể thêm số điện thoại vào cơ sở dữ liệu nếu cần
        await UserModel.create({ phone });
      }
    }

    // Cập nhật thông tin người dùng
    const [updated] = await UserModel.update(
      { name, email, phone },
      { where: { user_id } }
    );

    if (updated) {
      const updatedUser = await UserModel.findOne({ where: { user_id } });
      res.json({
        message: "Cập nhật thông tin người dùng thành công",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ message: "Không tìm thấy người dùng", user_id });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
});
router.get("/api/nguoidung/", async (req, res) => {
  // Lấy tham số page và limit từ query params
  let page = parseInt(req.query.page) || 1; // Nếu không có page, mặc định là trang 1
  let limit = parseInt(req.query.limit) || 10; // Nếu không có limit, mặc định là 10

  // Kiểm tra nếu page hoặc limit không hợp lệ
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;

  // Tính toán offset
  const offset = (page - 1) * limit;

  try {
    // Lấy danh sách người dùng với phân trang
    const { count, rows } = await UserModel.findAndCountAll({
      include: [
        {
          model: AddressModel,
          where: {
            is_default: 1,
          },
          required: false,
          attributes: ["address"],
        },
      ],
      limit: limit,
      offset: offset,
    });

    // Tính tổng số trang
    const totalPages = Math.ceil(count / limit);

    // Trả về dữ liệu phân trang
    res.json({
      data: rows,
      totalItems: count,
      currentPage: page,
      pageSize: limit,
      totalPages: totalPages,
    });
  } catch (err) {
    console.error("Lỗi truy vấn:", err);
    res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu." });
  }
});
router.put("/api/user/update-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Lấy giá trị trạng thái mới từ body

    // Tìm người dùng theo ID
    const user = await UserModel.findOne({ where: { user_id: id } });

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Cập nhật trạng thái của người dùng
    user.status = status;
    await user.save();

    res.json({
      message: status ? "Tài khoản đã bị khóa" : "Tài khoản đã được mở khóa",
    });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});
router.put("/api/user/update-role/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["customer", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Vai trò không hợp lệ" });
    }

    const user = await UserModel.findOne({ where: { user_id: id } });

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    user.role = role;
    await user.save();

    const message =
      role === "admin"
        ? "Tài khoản đã được cấp quyền quản trị"
        : "Tài khoản đã được đặt lại là khách hàng";

    res.json({ message });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});
//authentication
router.post("/api/login", async (req, res) => {
  try {
    console.log("Dữ liệu nhận được:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu!" });
    }

    // Tìm user theo email và status
    const user = await UserModel.findOne({
      where: { email },
      include: [
        {
          model: AddressModel,
          as: "addresses",
          attributes: ["address_id", "address"],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Email không tồn tại!" });
    }

    // Kiểm tra nếu user đã bị khóa (status = true)
    if (user.status === true) {
      return res.status(403).json({ message: "Tài khoản đã bị khóa!" });
    }
    const defaultAddress = await AddressModel.findOne({
      where: {
        is_default: true,
        user_id: user.user_id, // Thêm điều kiện lọc theo user_id
      },
    });

    // Cấu trúc address đưa vào token
    const addressPayload = defaultAddress
      ? {
          address_id: defaultAddress.address_id,
          address: defaultAddress.address,
        }
      : null;
    // Kiểm tra mật khẩu với bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng!" });
    }

    // Tạo token JWT
    const token = jwt.sign(
      {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: addressPayload,
        avatar: user.avatar,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Lưu token vào cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Chỉ bật `true` nếu dùng HTTPS
      sameSite: "Strict",
      maxAge: 3600000, // 1 giờ
    });

    res.json({ message: "Đăng nhập thành công!", token });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});
router.get("/api/check-auth", (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Lấy từ cookie hoặc header

  console.log("Cookie nhận được:", req.cookies);
  console.log("Header Authorization:", req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: "Chưa đăng nhập!" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: "Xác thực thành công!", user: decoded });
  } catch (error) {
    res.status(403).json({ message: "Token không hợp lệ!" });
  }
});
router.post("/api/signup", async (req, res) => {
  try {
    const { email, password, name, phone, role = "customer" } = req.body;

    // Kiểm tra xem email đã đăng ký chưa
    if (pendingUsers[email]) {
      return res
        .status(400)
        .json({
          error: "OTP đã được gửi. Vui lòng xác nhận trước khi đăng ký lại.",
        });
    }

    // Tạo OTP
    const otp = generateOTP();

    // Lưu thông tin tạm thời
    pendingUsers[email] = {
      email,
      password: await bcrypt.hash(password, 10),
      name,
      phone,
      role,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // Hết hạn sau 10 phút
    };

    // Gửi email OTP
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Xác nhận đăng ký tài khoản",
      text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 10 phút.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Mã OTP đã được gửi. Vui lòng xác nhận." });
  } catch (error) {
    console.error("Lỗi khi gửi OTP:", error);
    res.status(500).json({ error: "Lỗi server!", log: error.message });
  }
});
router.post("/api/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Kiểm tra xem có OTP chờ xác nhận không
    if (!pendingUsers[email]) {
      return res.status(400).json({ error: "Không tìm thấy yêu cầu đăng ký." });
    }

    const userData = pendingUsers[email];

    // Kiểm tra thời gian hết hạn OTP
    if (Date.now() > userData.expiresAt) {
      delete pendingUsers[email];
      return res
        .status(400)
        .json({ error: "OTP đã hết hạn. Vui lòng đăng ký lại." });
    }

    // Kiểm tra OTP hợp lệ không
    if (userData.otp !== otp) {
      return res.status(400).json({ error: "OTP không đúng!" });
    }

    // Tạo tài khoản trong database
    const user = await UserModel.create({
      email: userData.email,
      password: userData.password,
      name: userData.name,
      phone: userData.phone,
      role: userData.role,
    });

    // Xóa OTP sau khi xác nhận thành công
    delete pendingUsers[email];

    res
      .status(201)
      .json({ message: "Xác nhận thành công! Tài khoản đã được tạo.", user });
  } catch (error) {
    console.error("Lỗi xác nhận OTP:", error);
    res.status(500).json({ error: "Lỗi server!" });
  }
});
router.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ where: { email: email } }); // ✅

  if (!user) return res.status(404).json({ message: "Email không tồn tại!" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Tạo JWT chứa OTP, có hạn trong 10 phút
  const otpToken = jwt.sign({ otp, email }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });

  // Gửi email OTP (bỏ lưu OTP trong DB)
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Mã OTP đổi mật khẩu",
    text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 10 phút.`,
  });

  res.json({ message: "OTP đã được gửi!", otpToken });
});
router.post("/api/reset-password", async (req, res) => {
  const { otp, newPassword, otpToken } = req.body;

  try {
    // Giải mã OTP từ JWT
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.otp !== otp)
      return res.status(400).json({ message: "OTP không đúng!" });

    // Cập nhật mật khẩu
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.update(
      { password: hashedPassword },
      { where: { email: decoded.email } } // Điều kiện update
    );

    res.json({ message: "Mật khẩu đã được cập nhật!" });
  } catch (error) {
    res.status(400).json({ message: "OTP đã hết hạn!", log: error.message });
  }
});
router.post("/api/change-password", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Không có token!" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Kiểm tra đủ thông tin
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin!" });
    }

    // So khớp mật khẩu mới
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu mới không khớp!" });
    }

    const user = await UserModel.findOne({ where: { email: decoded.email } });
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại!" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu cũ không đúng!" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await UserModel.update(
      { password: hashed },
      { where: { email: decoded.email } }
    );

    res.json({ message: "Đổi mật khẩu thành công!" });
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn!" });
  }
});
router.post("/api/send-email", async (req, res) => {
  const { name, email, phone, message } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Yêu cầu liên hệ từ khách hàng",
    html: `
            <h3>Thông tin khách hàng</h3>
            <p><strong>Tên:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Số điện thoại:</strong> ${phone}</p>
            <p><strong>Ghi chú:</strong> ${message}</p>
            <p><strong>Hỗ trợ:</strong> Cảm ơn ${name} đã liên hệ với chúng tôi. Chúng tôi sẽ liên hệ lại cho bạn trong thời gian ngắn nhất mong bạn giữ máy để được phản hồi tốt nhất.</p>
            <p>Trân trọng cảm ơn.</p>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Email đã được gửi thành công!" });
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    res.status(500).json({ success: false, message: "Lỗi khi gửi email!" });
  }
});

router.get("/api/admin/customers", async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year) : moment().year();
    let monthlyData = {};

    for (let month = 1; month <= 12; month++) {
      const startOfMonth = moment(`${year}-${month}-01`)
        .startOf("month")
        .toDate();
      const endOfMonth = moment(`${year}-${month}-01`).endOf("month").toDate();

      // 🔹 Tổng khách hàng đăng ký trong tháng
      const totalCustomers = await UserModel.count({
        where: {
          created_at: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      });

      // 🔹 Khách hàng mới (đăng ký trong tháng và thời gian đăng ký cách hiện tại <= 10 ngày)
      const newCustomers = await UserModel.count({
        where: {
          created_at: {
            [Op.between]: [startOfMonth, endOfMonth],
            [Op.gte]: moment().subtract(10, "days").toDate(),
          },
        },
      });

      // 🔹 Khách hàng có số đơn hàng nhiều nhất trong tháng
      const topCustomer = await CartModel.findAll({
        attributes: [
          "user_id",
          [Sequelize.fn("COUNT", Sequelize.col("cart_id")), "orderCount"],
        ],
        where: {
          created_at: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
        group: ["user_id"],
        order: [[Sequelize.literal("orderCount"), "DESC"]],
        limit: 1,
      });

      monthlyData[month] = {
        totalCustomers,
        newCustomers,
        topCustomerOrders: topCustomer.length
          ? topCustomer[0].dataValues.orderCount
          : 0,
      };
    }

    res.json({ message: "Dữ liệu khách hàng theo tháng!", monthlyData });
  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu khách hàng:", error);
    res.status(500).json({ message: "Lỗi hệ thống!", error: error.message });
  }
});
module.exports = router;