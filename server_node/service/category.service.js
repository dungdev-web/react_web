const express = require('express');
const router = express();
const categoryModel = require('../model/category.model');
const ProductModel = require('../model/product.model');
router.get("/api/loai", async (req, res) => {
    const loai_arr = await categoryModel.findAll();
    res.json(loai_arr);
})
router.post("/api/admin/themloai", async (req, res) => {
    const { name, parent_id } = req.body;

    // Kiểm tra nếu không có parent_id thì gán giá trị null cho nó
    const newCategory = await categoryModel.create({
        name,
        parent_id: parent_id || null, // Nếu không có parent_id thì gán là null
    });

    res.json(newCategory); // Trả về thông tin loại mới đã tạo
});
//xóa loại
router.delete("/api/admin/xoaloai/:id", async (req, res) => {
    const id = req.params.id;
    const loai = await categoryModel.findByPk(id);
    if (loai) {
        await loai.destroy();
        res.json({ message: "Xóa loại thành công" });
    } else {
        res.json({ message: "Loại không tồn tại" });
    }
})
//xóa nhiều loại
router.delete("/api/admin/xoanhieuloai", async (req, res) => {
    const ids = req.body.ids;

    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    try {
        const loai = await categoryModel.destroy({
            where: { category_id: { [Op.in]: ids } }
        });

        if (loai > 0) {
            res.json({ message: "Xóa loại thành công" });
        } else {
            res.status(404).json({ message: "Không tìm thấy loại nào để xóa" });
        }
    } catch (error) {
        res.status(500).json({ message: "Có lỗi xảy ra khi xóa loại", error: error.message });
    }
});
//sửa loại
router.put("/api/admin/sualoai/:id", async (req, res) => {
    const id = req.params.id;
    const { name, parent_id } = req.body;
    const loai = await categoryModel.findByPk(id);
    if (loai) {
        loai.name = name;
        loai.parent_id = parent_id || null; // Nếu không có parent_id thì gán
        await loai.save();
        res.json(loai);
    } else {
        res.json({ message: "Loại không tồn tại" });
    }
});
router.get("/api/loai/:id", async (req, res) => {
    const loai = await categoryModel.findByPk(req.params.id)
    res.json(loai);
})
module.exports = router;