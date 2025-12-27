const express = require('express');
const ProductModel = require('../model/product.model');
const FoodDetailModel = require('../model/fooddetail.model');
const ThumbnailModel = require('../model/thumbnail.model');
const CartItemModel = require("../model/cartitem.model");
const categoryModel = require('../model/category.model');
const router = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Sequelize, OP, Op } = require("sequelize");
const moment = require("moment");

const uploadPath = path.join(__dirname, "../my-app/public/img");

// Tạo thư mục nếu chưa có
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});
const upload = multer({ storage });
router.use("/img", express.static("public/img"));

// Create a new product
//lấy tất cả sản phẩm có phân trang
router.get("/api/sanpham", async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || "";

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const offset = (page - 1) * limit;

    // 👉 Tạo điều kiện tìm kiếm
    const whereCondition = search
        ? {
            name: {
                [Op.like]: `%${search}%`,
            },
        }
        : {};

    try {
        const { count, rows } = await ProductModel.findAndCountAll({
            where: whereCondition, // áp dụng điều kiện search
            limit: limit,
            offset: offset,
            include: [
                {
                    model: categoryModel,
                    as: "category",
                    attributes: ["name"],
                    required: false
                }
            ]
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            data: rows,
            totalItems: count,
            currentPage: page,
            pageSize: limit,
            totalPages: totalPages
        });

    } catch (err) {
        console.error("Lỗi truy vấn:", err);
        res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu." });
    }
});
router.get("/api/admin/sanpham/:id", async (req, res) => {
    const loai = await ProductModel.findByPk(req.params.id)
    res.json(loai);
})
//thêm sản phẩm
router.post("/api/admin/themsanpham", async (req, res) => {
    try {
        const { name, img, price, discount_price, description, category_id, stock, hot } = req.body;

        // Kiểm tra và xác nhận giá trị của trường `hot`
        const isHot = hot === 'on' || hot === true; // Kiểm tra nếu `hot` là 'on' (checkbox checked) hoặc true

        const product = await ProductModel.create({
            name: name,
            img: img,
            price: price,
            discount_price: discount_price,
            description: description,
            category_id: category_id,
            stock: stock,
            hot: isHot // Sử dụng giá trị đã xác nhận của `hot`
        });

        res.json(product);
    } catch (err) {
        console.error("Lỗi thêm sản phẩm:", err);
        res.status(500).json({ error: "Lỗi thêm sản phẩm." });
    }
});
router.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Không có file" });

    // Trả lại đường dẫn public từ Next.js
    const fileUrl = `${req.file.filename}`;
    res.json({ url: fileUrl });
});
router.put("/api/admin/suasanpham/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { name, img, price, discount_price, description, category_id, stock, hot } = req.body;

        // Kiểm tra và cập nhật thông tin sản phẩm
        const updatedProduct = await ProductModel.findByPk(id);

        // Nếu sản phẩm không tồn tại, trả về lỗi 404
        if (!updatedProduct) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại" });
        }

        // Cập nhật thông tin sản phẩm
        updatedProduct.name = name;
        updatedProduct.img = img;
        updatedProduct.price = price;
        updatedProduct.discount_price = discount_price;
        updatedProduct.description = description;
        updatedProduct.category_id = category_id;
        updatedProduct.stock = stock;

        // Chuyển đổi giá trị boolean của hot thành 1 hoặc 0
        updatedProduct.hot = hot ? 1 : 0;

        // Lưu sản phẩm sau khi cập nhật
        await updatedProduct.save();

        // Trả về sản phẩm đã cập nhật
        res.json(updatedProduct);
    } catch (err) {
        console.error("Lỗi sửa sản phẩm:", err);
        res.status(500).json({ error: "Lỗi sửa sản phẩm." });
    }
});
//xóa sản phẩm
router.delete("/api/admin/xoasanpham/:id", async (req, res) => {
    const id = req.params.id;
    const loai = await ProductModel.findByPk(id);
    if (loai) {
        await loai.destroy();
        res.json({ message: "Xóa sản phẩm thành công" });
    } else {
        res.json({ message: "Sản phẩm không tồn tại" });
    }
})
router.delete("/api/admin/xoanhieusanpham", async (req, res) => {
    const ids = req.body.ids;

    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    try {
        const loai = await ProductModel.destroy({
            where: { product_id: { [Op.in]: ids } }
        });

        if (loai > 0) {
            res.json({ message: "Xóa sản phẩm thành công" });
        } else {
            res.status(404).json({ message: "Không tìm thấy sản phẩm nào để xóa" });
        }
    } catch (error) {
        res.status(500).json({ message: "Có lỗi xảy ra khi xóa sản phẩm", error: error.message });
    }
});
router.get("/api/sphot/:sosp?", async (req, res) => {
    const sosp = Number(req.params.sosp) || 12
    const sp_arr = await ProductModel.findAll({
        where: { hot: 1 },

        offset: 0, limit: sosp,
    })
    res.json(sp_arr);
})
router.get("/api/spmoi/:sosp?", async (req, res) => {
    const sosp = Number(req.params.sosp) || 6
    const sp_arr = await ProductModel.findAll({

        offset: 0, limit: sosp,
    })
    res.json(sp_arr);
})

router.get("/api/sp/:id", async (req, res) => {
    const id = Number(req.params.id)
    const sp = await ProductModel.findOne({
        where: { product_id: id },
        include: [
            {
                model: FoodDetailModel,
                as: "food_detail",
            },
            {
                model: ThumbnailModel,
                as: "thumbnail",
            }
        ],
    })
    res.json(sp);
})
router.get("/api/sptrongloai/:id", async (req, res) => {
    const category_id = Number(req.params.id)
    const sp_arr = await ProductModel.findAll({
        where: { category_id: category_id },
        order: [['price', 'ASC']],
    })
    res.json(sp_arr);
})
router.get("/api/timkiem/:tu_khoa/:page?", async (req, res) => {
    let tu_khoa = req.params.tu_khoa;
    const page = Number(req.params.page) || 1;
    const pageSize = 4;
    const offset = (page - 1) * pageSize;

    try {
        // 1️⃣ Đếm tổng số sản phẩm tìm được
        const total = await ProductModel.count({
            where: {
                name: { [Op.substring]: `%${tu_khoa}%` },

            }
        });

        // 2️⃣ Lấy danh sách sản phẩm theo trang
        const sp_arr = await ProductModel.findAll({
            where: {
                name: { [Op.substring]: `%${tu_khoa}%` },

            },
            order: [['created_at', 'DESC'], ['price', 'ASC']],
            limit: pageSize,
            offset: offset
        });

        // 3️⃣ Trả về dữ liệu đúng chuẩn
        res.json({ total, data: sp_arr });

    } catch (error) {
        console.error("Lỗi khi truy vấn dữ liệu:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});
router.get("/api/phantrang", async (req, res) => {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const sortBy = req.query.sortby || "default"; // ✅ Lấy giá trị sắp xếp
    const offset = (page - 1) * pageSize;

    const sortOptions = {
        "alpha-asc": [["name", "ASC"]],
        "alpha-desc": [["name", "DESC"]],
        "price-asc": [["price", "ASC"]],
        "price-desc": [["price", "DESC"]],
        "created-desc": [["created_at", "DESC"]],
        "created-asc": [["created_at", "ASC"]],
    };

    try {
        const total = await ProductModel.count();
        const sp_arr = await ProductModel.findAll({
            order: sortOptions[sortBy] || [["created_at", "DESC"]],
            limit: pageSize,
            offset: offset,
        });

        res.json({ total, data: sp_arr || [] }); // ✅ Luôn trả về một mảng
    } catch (error) {
        console.error("Lỗi khi truy vấn dữ liệu:", error);
        res.status(500).json({ error: "Lỗi server", data: [] }); // ✅ Trả về mảng rỗng khi lỗi
    }
});
router.get("/api/sp-tuong-tu/:id", async (req, res) => {
    try {
        const product_id = Number(req.params.id);

        // Tìm sản phẩm hiện tại
        const spHienTai = await ProductModel.findByPk(product_id);
        if (!spHienTai) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        }

        // Lấy danh sách sản phẩm cùng loại (trừ sản phẩm hiện tại)
        const sp_arr = await ProductModel.findAll({
            where: {
                category_id: spHienTai.category_id,
                // an_hien: 1,
                product_id: { [Op.ne]: product_id } // Loại bỏ sản phẩm hiện tại
            },
            order: [["created_at", "DESC"], ["price", "ASC"]],
            limit: 6, // Giới hạn số sản phẩm tương tự
        });

        res.json(sp_arr);
    } catch (error) {
        console.error("Lỗi lấy sản phẩm tương tự:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});
router.get("/api/admin/product/sold", async (req, res) => {
  // Tháng hiện tại
  const startOfCurrentMonth = moment().startOf("month");
  const endOfCurrentMonth = moment(); // Kết thúc tháng hiện tại (hiện tại)

  // Tháng trước
  const startOfPreviousMonth = moment().subtract(1, "month").startOf("month");
  const endOfPreviousMonth = moment().subtract(1, "month").endOf("month");

  try {
    // Lấy tổng số lượng sản phẩm bán ra trong tháng hiện tại
    const currentMonthSales = await CartItemModel.findOne({
      where: {
        status: 1, // Chỉ lấy những đơn hàng đã thanh toán
        added_at: {
          [Op.between]: [
            startOfCurrentMonth.format("YYYY-MM-DD"),
            endOfCurrentMonth.format("YYYY-MM-DD HH:mm:ss"),
          ],
        },
      },
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalSold"], // Tính tổng số lượng bán ra
      ],
    });

    // Lấy tổng số lượng sản phẩm bán ra trong tháng trước
    const previousMonthSales = await CartItemModel.findOne({
      where: {
        status: 1, // Chỉ lấy những đơn hàng đã thanh toán
        added_at: {
          [Op.between]: [
            startOfPreviousMonth.format("YYYY-MM-DD"),
            endOfPreviousMonth.format("YYYY-MM-DD HH:mm:ss"),
          ],
        },
      },
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalSold"], // Tính tổng số lượng bán ra
      ],
    });

    // Lấy tổng số lượng bán ra của tháng hiện tại và tháng trước
    const currentMonthTotalSold = currentMonthSales
      ? currentMonthSales.dataValues.totalSold
      : 0;
    const previousMonthTotalSold = previousMonthSales
      ? previousMonthSales.dataValues.totalSold
      : 0;

    // Tính phần trăm thay đổi giữa tháng hiện tại và tháng trước
    let percentageChange = 0;
    if (previousMonthTotalSold > 0) {
      percentageChange =
        ((currentMonthTotalSold - previousMonthTotalSold) /
          previousMonthTotalSold) *
        100;
    }

    res.json({
      message: "Lấy sản phẩm đã bán thành công!",
      currentMonthTotalSold,
      previousMonthTotalSold,
      percentageChange,
    });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm đã bán:", error);
    res.status(500).json({
      message: "Lỗi hệ thống!",
      error: error.message,
    });
  }
});
module.exports = router;