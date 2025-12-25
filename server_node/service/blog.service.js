const express = require("express");
const router = express();
const  BlogModel  = require("../model/blog.model");
router.get("/api/blog", async (req, res) => {
  try {
    const blogs = await BlogModel.findAll({
      order: [["created_at", "DESC"]],
    });
    res.json({ message: "Lấy blog thành công!", blogs });
  } catch (error) {
    console.error("Lỗi khi lấy blog:", error);
    res.status(500).json({
      message: "Lỗi hệ thống!",
      error: error.messag,
    });
  }
});
router.get("/api/blog/:blog_id", async (req, res) => {
  const blog_id = Number(req.params.blog_id);
  try {
    // Kiểm tra blog_id có hợp lệ không
    if (isNaN(blog_id)) {
      return res.status(400).json({ message: "Blog ID không hợp lệ!" });
    }
    // Tìm blog theo blog_id
    const blog = await BlogModel.findByPk(blog_id);
    if (!blog) {
      return res.status(404).json({ message: "Không tìm thấy blog!" });
    }
    res.json({ message: "Lấy blog thành công!", blog });
  } catch (error) {
    console.error("Lỗi khi lấy blog:", error);
    res.status(500).json({ message: "Lỗi hệ thống!", error: error.message });
  }
});
//tăng view khi truy cập blog
router.get("/api/blog/:blog_id/view", async (req, res) => {
  const blog_id = Number(req.params.blog_id);
  try {
    // Kiểm tra blog_id có hợp lệ không
    if (isNaN(blog_id)) {
      return res.status(400).json({ message: "Blog ID không hợp lệ!" });
    }
    // Tìm blog theo blog_id
    const blog = await BlogModel.findByPk(blog_id);
    if (!blog) {
      return res.status(404).json({ message: "Không tìm thấy blog!" });
    }
    // Tăng view
    await blog.increment("view");
    res.json({ message: "Tăng view thành công!" });
  } catch (error) {
    console.error("Lỗi khi tăng view:", error);
    res.status(500).json({ message: "Lỗi hệ thống!", error: error.message });
  }
});
module.exports = router;