const express = require("express");
const router = express();
const CartModel = require("../model/cart.model");
const CartItemModel = require("../model/cartitem.model");
router.post("/api/admin/donhang/updateStatusWay", async (req, res) => {
  try {
    const { cart_id, status_way } = req.body;

    // Kiểm tra xem các tham số có hợp lệ không
    if (cart_id == null || status_way == null) {
      return res
        .status(400)
        .json({ thong_bao: "Thiếu thông tin cần thiết: cart_id, status_way" });
    }

    // Kiểm tra xem trạng thái vận chuyển có hợp lệ không
    if (![0, 1, 2].includes(status_way)) {
      return res
        .status(400)
        .json({ thong_bao: "Trạng thái vận chuyển không hợp lệ" });
    }

    // Cập nhật status_way trong bảng CartItem
    const updatedItem = await CartItemModel.update(
      {
        status_way: status_way,
      },
      {
        where: {
          cart_id: cart_id,
        },
      }
    );

    // Kiểm tra xem có cập nhật được dữ liệu không
    if (updatedItem[0] === 0) {
      return res
        .status(404)
        .json({ thong_bao: "Không tìm thấy đơn hàng với cart_id " + cart_id });
    }

    res.json({
      thong_bao: "Cập nhật trạng thái vận chuyển thành công",
      cart_id,
      status_way,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái vận chuyển:", err);
    res
      .status(500)
      .json({ thong_bao: "Lỗi cập nhật trạng thái vận chuyển", err });
  }
});
router.post("/api/admin/donhang/updateStatusPayment", async (req, res) => {
  try {
    const { cart_id, status } = req.body;

    // Kiểm tra tham số đầu vào
    if (cart_id == null || status == null) {
      return res
        .status(400)
        .json({ thong_bao: "Thiếu thông tin cần thiết: cart_id, status" });
    }

    // Chỉ chấp nhận trạng thái 0 hoặc 1
    // if (![0, 1].includes(status)) {
    //     return res.status(400).json({ thong_bao: "Trạng thái thanh toán không hợp lệ" });
    // }

    // Tìm tất cả các item theo cart_id
    const items = await CartItemModel.findAll({ where: { cart_id } });

    if (items.length === 0) {
      return res
        .status(404)
        .json({ thong_bao: "Không tìm thấy đơn hàng với cart_id " + cart_id });
    }

    // Kiểm tra nếu tất cả các item đã có status đúng rồi => không cập nhật
    const allSame = items.every((item) => item.status === Boolean(status));

    if (allSame) {
      return res.status(200).json({
        thong_bao: "Trạng thái thanh toán đã đúng, không cần cập nhật lại",
        cart_id,
        status,
      });
    }

    // Thực hiện cập nhật
    const updated = await CartItemModel.update(
      { status: Boolean(status) },
      { where: { cart_id } }
    );

    res.status(200).json({
      thong_bao: "Cập nhật trạng thái thanh toán thành công",
      cart_id,
      status,
      updatedItem: updated,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái thanh toán:", err);
    res.status(500).json({
      thong_bao: "Lỗi cập nhật trạng thái thanh toán",
      err,
    });
  }
});
router.post("/api/huy-don-hang", async (req, res) => {
  try {
    const { cart_id } = req.body;

    if (!cart_id) {
      return res.status(400).json({ thong_bao: "Thiếu thông tin" });
    }

    // Cập nhật trạng thái đơn hàng thành 3 (đã huỷ)
    const [updatedRows] = await CartItemModel.update(
      { status: 3 }, // giá trị cập nhật
      { where: { cart_id: cart_id } } // điều kiện
    );

    if (updatedRows === 0) {
      return res.status(404).json({ thong_bao: "Không tìm thấy đơn hàng" });
    }

    res.json({ thong_bao: "Đã huỷ đơn hàng thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ thong_bao: "Lỗi server khi huỷ đơn hàng" });
  }
});
module.exports = router;