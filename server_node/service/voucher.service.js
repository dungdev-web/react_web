const express = require("express");
const router = express();
const VouchersModel = require("../model/voucher.model");
const { Op } = require("sequelize");
const sequelize = require("../database");
router.post("/api/voucher/routerly", async (req, res) => {
  const { code, order_total } = req.body;
  const voucher = await VouchersModel.findOne({ where: { code } });

  if (!voucher)
    return res
      .status(404)
      .json({ success: false, message: "Mã giảm giá không tồn tại" });

  if (voucher.expires_at && new Date() > new Date(voucher.expires_at))
    return res
      .status(400)
      .json({ success: false, message: "Mã giảm giá đã hết hạn" });

  if (voucher.quantity - voucher.used <= 0)
    return res
      .status(400)
      .json({ success: false, message: "Mã giảm giá đã hết lượt sử dụng" });

  if (order_total < voucher.min_order_value)
    return res
      .status(400)
      .json({
        success: false,
        message: `Đơn hàng tối thiểu ${voucher.min_order_value}`,
      });

  let discount = 0;
  if (voucher.discount_type === "percentage") {
    discount = (order_total * voucher.discount_value) / 100;
    if (voucher.max_discount_value)
      discount = Math.min(discount, voucher.max_discount_value);
  } else {
    discount = voucher.discount_value;
  }

  const final_total = order_total - discount;

  return res.json({
    success: true,
    discount,
    final_total,
    message: "Áp dụng mã giảm giá thành công",
  });
});
router.get("/api/voucher/list", async (req, res) => {
  try {
    const now = new Date();
    const vouchers = await VouchersModel.findAll({
      where: {
        expires_at: {
          [Op.or]: [
            null,
            { [Op.gt]: now }, // chưa hết hạn
          ],
        },
        quantity: {
          [Op.gt]: sequelize.col("used"), // còn lượt dùng
        },
      },
      attributes: ["code", "discount_value", "discount_type", "description"],
    });

    const result = vouchers.map((v) => ({
      code: v.code,
      discountValue:
        v.discount_type === "percentage"
          ? `${v.discount_value}%`
          : `${v.discount_value.toLocaleString()} VND`,
      description: v.description || "Mã khuyến mãi hấp dẫn!",
    }));

    res.json({ success: true, vouchers: result });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi lấy danh sách voucher" });
  }
});
module.exports = router;