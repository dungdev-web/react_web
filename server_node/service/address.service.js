const express = require("express");
const router = express();
const AddressModel = require("../model/address.model");
const UserModel = require("../model/user.model");

router.get("/api/diachi/:user_id", async (req, res) => {
  try {
    let userId = req.params.user_id; // Lấy user_id từ URL

    let diaChi = await AddressModel.findAll({
      where: { user_id: userId }, // Lọc theo user_id
      include: [
        {
          model: UserModel,
          as: "address_user", // Đúng alias trong belongsTo()
          attributes: ["name", "email"], // Chỉ lấy thông tin cần thiết
        },
      ],
    });

    if (diaChi.length === 0) {
      return res
        .status(404)
        .json({ thong_bao: "Không tìm thấy địa chỉ cho user này" });
    }

    res.json({
      thong_bao: "Đã lấy danh sách địa chỉ",
      dia_chi: diaChi,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ thong_bao: "Lỗi lấy địa chỉ", err });
  }
});
//them dia chi
router.post("/api/diachi", async (req, res) => {
  try {
    let { address, user_id } = req.body; // Lấy thông tin từ request

    let newAddress = await AddressModel.create({
      address: address,
      user_id: user_id,
    });

    res.json({
      thong_bao: "Đã thêm địa chỉ",
      address: newAddress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ thong_bao: "Lỗi thêm địa chỉ", err });
  }
});
module.exports = router;