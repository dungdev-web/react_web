"use client";
import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import "../sccc.css";
import Link from "next/link";
import { ISanPham } from "@/app/(client)/components/cautrucdata";
import { API_URL } from "@/app/(client)/config/config";
import { useCallback } from "react";
import Image from "next/image";
export default function Sanpham() {
  const [product, setProduct] = useState<ISanPham[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false); // Thêm state để quản lý search loading

  const fetchProduct = useCallback(
    async (page: number = 1, keyword: string = search) => {
      setIsSearching(true);
      // setLoading(true);

      try {
        const response = await fetch(
          `${API_URL}/api/sanpham?page=${page}&limit=10&search=${encodeURIComponent(
            keyword
          )}`
        );

        const data = await response.json();

        setProduct(data.data);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setLoading(false);
        setIsSearching(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
        setIsSearching(false);
      }
    },
    [search] // 👈 rất quan trọng
  );

  // Pagination
  useEffect(() => {
    fetchProduct(currentPage);
  }, [currentPage, fetchProduct]);

  // Search debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProduct(1, search);
    }, 800);

    return () => clearTimeout(timeout);
  }, [search, fetchProduct]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const toggleCheckbox = (productId: number) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const hamXoa = async (productId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa không?")) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/xoasanpham/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Xóa thành công!");
        fetchProduct(currentPage);
        setSelectedIds((prev) => prev.filter((id) => id !== productId));
      } else {
        const data = await res.json();
        alert(data.message || "Xóa thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Có lỗi xảy ra khi xóa.");
    }
  };

  const xoaNhieuSanPham = async () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để xóa.");
      return;
    }

    if (!confirm("Bạn có chắc chắn muốn xóa những sản phẩm đã chọn?")) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/xoanhieusanpham`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (res.ok) {
        alert("Xóa thành công!");
        fetchProduct(currentPage);
        setSelectedIds([]);
      } else {
        const data = await res.json();
        alert(data.message || "Xóa thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Có lỗi xảy ra khi xóa.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cards-3">
      <div className="table-card-head">
        <div className="head-left">
          <h2>Product</h2>
        </div>
        <div className="head-right">
          <div className="input">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search for"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="calendar">
            <p>Jan 2025</p>
            <i className="fa-solid fa-calendar-day"></i>
          </div>
          <button>
            <Link href="/admin/san_pham/them">Create product</Link>
          </button>
          <button
            onClick={xoaNhieuSanPham}
            className="btn-delete-selected"
            disabled={selectedIds.length === 0}
          >
            Xóa các sản phẩm đã chọn
          </button>
        </div>
      </div>
      <div className="table-card-body">
        {isSearching && <div className="spinner"></div>}{" "}
        {/* Hiển thị spinner khi search */}
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>
                <div className="flex">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === product.length &&
                      product.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Chọn tất cả
                        setSelectedIds(product.map((c) => c.product_id));
                      } else {
                        // Bỏ chọn tất cả
                        setSelectedIds([]);
                      }
                    }}
                  />
                  <p>ID</p>
                </div>
              </th>
              <th>
                <div className="flex">
                  <i className="fa-solid fa-user"></i>
                  <p>Name</p>
                </div>
              </th>
              <th>
                <div className="flex">
                  <i className="fa-solid fa-calendar-day"></i>
                  <p>Image</p>
                </div>
              </th>
              <th>
                <div className="flex">
                  <i className="fa-solid fa-calendar-day"></i>
                  <p>Price</p>
                </div>
              </th>
              <th>
                <div className="flex">
                  <i className="fa-solid fa-calendar-day"></i>
                  <p>Discount Price</p>
                </div>
              </th>
              <th>
                <div className="flex">
                  <i className="fa-solid fa-calendar-day"></i>
                  <p>Description</p>
                </div>
              </th>
              <th>
                <div className="flex">
                  <i className="fa-solid fa-calendar-day"></i>
                  <p>Stock</p>
                </div>
              </th>
              <th>
                <div className="flex">
                  <i className="fa-solid fa-calendar-day"></i>
                  <p>Hot</p>
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {product.map((p) => (
              <tr key={p.product_id}>
                <td>
                  <div className="flex">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p.product_id)}
                      onChange={() => toggleCheckbox(p.product_id)}
                    />
                    <p>#{p.product_id}</p>
                  </div>
                </td>
                <td>{p.name}</td>
                <td>
                  <Image src={`/img/${p.img}`} alt={p.name} width={50} />
                </td>
                <td>{p.price.toLocaleString("vi")}VNĐ</td>
                <td>{p.discount_price.toLocaleString("vi")}VNĐ</td>
                <td>{p.description}</td>
                <td>{p.stock}</td>
                <td>{p.hot ? "🔥" : ""}</td>
                <td>
                  <div className="flex">
                    <Link href={`/admin/san_pham/${p.product_id}`}>
                      <i className="fa-solid fa-pen"></i>
                    </Link>
                    <button onClick={() => hamXoa(p.product_id)}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <span className="flex items-center">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
