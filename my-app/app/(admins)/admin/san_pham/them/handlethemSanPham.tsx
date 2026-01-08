"use server";

import { API_URL } from "@/app/(client)/config/config";

export default async function handleThemSanPham(formData: FormData) {
  // Lấy giá trị từ formData
  const sp = {
    name: formData.get("name"),
    img: formData.get("img") || null,  
    price: formData.get("price"),
    discount_price: formData.get("discount_price"),
    description: formData.get("description"),
    category_id: formData.get("category_id"),
    stock: formData.get("stock"),
    hot: formData.get("hot")? true : false,
  };

  // Kiểm tra nếu name là rỗng
  if (!sp.name) {
    console.error("Name is required!");
    return;
  }

  // Cấu hình request
  const opt = {
    method: "POST",
    body: JSON.stringify(sp),
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    // Gửi request và xử lý phản hồi
    const res = await fetch(`${API_URL}/api/admin/themsanpham`, opt);

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const data = await res.json();
    console.log("Kết quả thêm loại:", data);

  } catch (error) {
    console.error("Error occurred while adding category:", error);
  }

  console.log("Thông tin loại:", sp);
}
