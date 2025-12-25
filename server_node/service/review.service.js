const express = require("express");
const router = express();
const ReviewModel = require("../model/review.model");
const UserModel = require("../model/user.model");
const CartItemModel = require("../model/cartitem.model");
const CartModel = require("../model/cart.model");
const ProductModel = require("../model/product.model");
const { Op } = require("sequelize");
router.post("/api/thembinhluan/:product_id", async (req, res) => {
  const { user_id, comment, rating } = req.body;
  const product_id = req.params.product_id;
  try {
    // Kiểm tra dữ liệu đầu vào
    if (!product_id || !user_id || !comment) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
    }

    // Kiểm tra user có tồn tại không
    const user = await UserModel.findOne({ where: { user_id: user_id } });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const hasPurchased = await CartItemModel.findOne({
      include: {
        model: CartModel,
        as: "cart",
        where: {
          user_id,
        },
      },
      where: {
        status: 1,
        added_at: { [Op.gte]: thirtyDaysAgo },
      },
    });

    if (!hasPurchased) {
      return res
        .status(403)
        .json({
          message:
            "Bạn chỉ có thể bình luận nếu đã mua sản phẩm trong vòng 30 ngày!",
        });
    }
    // Thêm bình luận vào database
    const binhluanModel = await ReviewModel.create({
      product_id,
      user_id,
      comment,
      rating: rating || null, // Rating có thể null
    });

    res.status(201).json({ message: "Bình luận thành công!", binhluanModel });
  } catch (error) {
    console.error("Lỗi khi thêm bình luận:", error);
    res.status(500).json({ message: "Lỗi hệ thống!", error: error.message });
  }
});
router.get("/api/binhluan/:product_id", async (req, res) => {
  const product_id = Number(req.params.product_id);

  try {
    // Kiểm tra product_id có hợp lệ không
    if (isNaN(product_id)) {
      return res.status(400).json({ message: "Product ID không hợp lệ!" });
    }

    // Tìm tất cả bình luận của sản phẩm
    const binhluans = await ReviewModel.findAll({
      where: { product_id: product_id }, // Lấy tất cả bình luận theo product_id
      include: [
        {
          model: UserModel,
          as: "review_user",
          attributes: ["name", "email"],
        },
      ],
      order: [["created_at", "DESC"]], // Sắp xếp theo thời gian mới nhất
    });

    // Nếu không có bình luận nào
    if (binhluans.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy bình luận nào!" });
    }

    res.json({ message: "Lấy bình luận thành công!", binhluans });
  } catch (error) {
    console.error("Lỗi khi lấy bình luận:", error);
    res.status(500).json({ message: "Lỗi hệ thống!", error: error.message });
  }
});
router.get("/api/admin/comments", async (req, res) => {
  try {
    const comments = await ReviewModel.findAll({
      include: [
        { model: ProductModel, as: "products" }, // Sửa alias ở đây
        { model: UserModel, as: "review_user" },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json({ message: "Dữ liệu bình luận!", comments });
  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu bình luận:", error);
    res.status(500).json({ message: "Lỗi hệ thống!", error: error.message });
  }
});
router.delete("/api/admin/comments/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const comment = await ReviewModel.destroy({ where: { review_id: id } });
    res.json({ message: "Bình luận đã được xóa!" });
  } catch (error) {
    console.error("❌ Lỗi khi xóa bình luận:", error);
    res.status(500).json({ message: "Lỗi hệ thống!", error: error.message });
  }
});
module.exports = router;