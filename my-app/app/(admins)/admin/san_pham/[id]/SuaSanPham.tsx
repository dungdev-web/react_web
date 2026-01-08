"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import UploadImage from "../them/suafile";
import handleSuaSanPham from "../them/handlesuaSanPham";
import { ILoai, ISanPham } from "@/app/(client)/components/cautrucdata";
import { API_URL } from "@/app/(client)/config/config";
interface SuaSanPhamProps {
  id: string;
}
export default function SuaSanPham({ id }: SuaSanPhamProps) {
   const productId = Number(id); // convert id sang number
  const [loai, setLoai] = useState<ILoai[]>([]);
  const [product, setProduct] = useState<ISanPham | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/loai`);
        const data = await res.json();
        setLoai(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/sanpham/${productId}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleImageChange = (newImage: string) => {
    setProduct((prev) => prev ? { ...prev, img: newImage } : prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const formData = new FormData();
    formData.append("id", String(product.product_id));
    formData.append("name", product.name);
    formData.append("price", String(product.price));
    formData.append("discount_price", String(product.discount_price));
    formData.append("description", product.description);
    formData.append("img", product.img);
    formData.append("category_id", String(product.category_id));
    formData.append("stock", String(product.stock));
    formData.append("hot", product.hot ? "1" : "0");

    handleSuaSanPham(formData);
    router.push("/admin/san_pham");
  };

  if (!product || !loai) return <div>Loading...</div>;

  return (
    <div className="form-tt">
      <h2 className="!text-left">Sửa sản phẩm</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            name="name"
            id="name"
            value={product.name || ""}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className=""
            required
            placeholder="Nhập tên sản phẩm"
          />
        </div>

        <div className="mb-4">
          <UploadImage name="img" onImageChange={handleImageChange} />
          <input type="hidden" name="img" value={product.img || ""} />
        </div>

        <div className="mb-4">
          <input
            type="number"
            name="price"
            id="price"
            value={product.price || ""}
            onChange={(e) =>
              setProduct({ ...product, price: Number(e.target.value) })
            }
            className=""
            required
            placeholder="Nhập giá sản phẩm"
          />
        </div>

        <div className="mb-4">
          <input
            type="number"
            name="discount_price"
            id="discount_price"
            value={product.discount_price || ""}
            onChange={(e) =>
              setProduct({ ...product, discount_price: Number(e.target.value) })
            }
            className=""
            required
            placeholder="Nhập giá km sản phẩm"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="description"
            id="description"
            value={product.description || ""}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            className=""
            required
            placeholder="Nhập mô tả sản phẩm"
          />
        </div>

        <div className="mb-4 text-left">
          <select
            className="bg-amber-500"
            name="category_id"
            id="category_id"
            value={product.category_id || ""}
            onChange={(e) =>
              setProduct({ ...product, category_id: Number(e.target.value) })
            }
          >
            <option value="">Chọn danh mục</option>
            {loai.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <input
            type="number"
            name="stock"
            id="stock"
            value={product.stock || ""}
            onChange={(e) =>
              setProduct({ ...product, stock: Number(e.target.value) })
            }
            className=""
            required
            placeholder="Nhập số lượng tồn hàng sản phẩm"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="hot"
            className="block text-lg font-semibold text-white text-left"
          >
            Độ hot
          </label>
          <input
            type="checkbox"
            name="hot"
            id="hot"
            checked={product?.hot || false} // Đảm bảo giá trị mặc định là false nếu product là null
            onChange={(e) => {
              setProduct((prevProduct) => {
                if (prevProduct) {
                  return {
                    ...prevProduct,
                    hot: e.target.checked, // e.target.checked sẽ là true hoặc false
                  };
                }
                return prevProduct;
              });
            }}
          />
        </div>

        <div className="m-3 flex justify-center">
          <button
            type="submit"
            className="bg-[#081028] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#0a1530] focus:outline-none focus:ring-2 focus:ring-[#081028] transition duration-300"
          >
            Sửa
          </button>
        </div>
      </form>
    </div>
  );
}
