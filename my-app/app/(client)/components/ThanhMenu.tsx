"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ILoai } from "./cautrucdata";
import { API_URL } from "../config/config";
import { ICart } from "../components/cautrucdata";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
export default function ThanhMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [dataLoai, setDataLoai] = useState<ILoai[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const cartItems: ICart[] = useSelector(
    (state: RootState) => state.cart.listSp
  );
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.so_luong, 0);

  useEffect(() => {
    const fetchLoaiSanPham = async () => {
      try {
        const resLoai = await fetch(`${API_URL}/loai`);
        const data = await resLoai.json();
        setDataLoai(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchLoaiSanPham();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Đóng sidebar và khóa scroll body
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  return (
    <>
      <style jsx>{`
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: #333;
          font-size: 24px;
          cursor: pointer;
          padding: 8px 12px;
          margin-right: 15px;
        }

        .mobile-menu-btn:hover {
          opacity: 0.7;
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .mobile-sidebar {
          position: fixed;
          top: 0;
          left: -300px;
          width: 280px;
          height: 100%;
          background: white;
          z-index: 999;
          transition: left 0.3s ease;
          overflow-y: auto;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }

        .mobile-sidebar.active {
          left: 0;
        }

        .sidebar-header {
          background: #c10a28;
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
        }

        .sidebar-close {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-content {
          padding: 0;
        }

        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-menu > li {
          border-bottom: 1px solid #eee;
        }

        .sidebar-menu > li > a,
        .sidebar-menu > li > button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 20px;
          color: #333;
          text-decoration: none;
          transition: background 0.2s ease;
          width: 100%;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          font-size: 15px;
        }

        .sidebar-menu > li > a:hover,
        .sidebar-menu > li > button:hover {
          background: #f5f5f5;
        }

        .sidebar-submenu {
          list-style: none;
          padding: 0;
          margin: 0;
          background: #f9f9f9;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .sidebar-submenu.open {
          max-height: 500px;
        }

        .sidebar-submenu li {
          border-bottom: 1px solid #e0e0e0;
        }

        .sidebar-submenu li:last-child {
          border-bottom: none;
        }

        .sidebar-submenu a {
          display: block;
          padding: 12px 20px 12px 35px;
          color: #555;
          text-decoration: none;
          font-size: 14px;
        }

        .sidebar-submenu a:hover {
          background: #efefef;
        }

        .submenu-toggle {
          transition: transform 0.3s ease;
        }

        .submenu-toggle.open {
          transform: rotate(90deg);
        }

        .logo-wrapper-mobile {
          padding: 15px;
          text-align: center;
          background: #f9f9f9;
          border-bottom: 1px solid #eee;
        }

        .logo-wrapper-mobile img {
          max-width: 120px;
          height: auto;
        }
          .li-cart2{
          display:none;}
        @media (max-width: 820px) {
          .mobile-menu-btn {
            display: block;
          }
        }
      `}</style>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar Mobile */}
      <div className={`mobile-sidebar ${isSidebarOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <h3>MENU</h3>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <i className="fa fa-times"></i>
          </button>
        </div>

        {/* Logo trong sidebar */}
        <div className="logo-wrapper-mobile">
          <Link href="/" onClick={toggleSidebar}>
            <img
              src="//bizweb.dktcdn.net/100/310/257/themes/801944/assets/logo.png?1676001091788"
              alt="logo"
            />
          </Link>
        </div>

        <div className="sidebar-content">
          <ul className="sidebar-menu">
            <li>
              <Link href="/" onClick={toggleSidebar}>
                Trang chủ
              </Link>
            </li>

            <li>
              <Link href="/gioi-thieu" onClick={toggleSidebar}>
                Giới thiệu
              </Link>
            </li>

            <li>
              <SidebarMenuItem
                label="Thực đơn"
                dataLoai={dataLoai}
                onClose={toggleSidebar}
              />
            </li>

            <li>
              <Link href="/blog" onClick={toggleSidebar}>
                Tin tức
              </Link>
            </li>

            <li>
              <Link href="/lien_he" onClick={toggleSidebar}>
                Liên hệ
              </Link>
            </li>

            <li>
              <Link href="/gioi-thieu" onClick={toggleSidebar}>
                Nhượng quyền
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Menu Desktop - Giữ nguyên */}
      <div className="hidden-sm hidden-xs">
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          <i className="fa fa-bars"></i>
        </button>
        <nav className="text-left nav-left">
          <ul className="nav">
            {/* Nút Menu Hamburger */}
            <li className="nav-item" style={{ marginRight: "10px" }}></li>

            <li className="nav-item active">
              <Link className="nav-link" href="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/gioi-thieu">
                Giới thiệu
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/sp">
                Thực đơn <i className="fa fa-angle-down"></i>
              </Link>

              <ul className="dropdown-menu">
                {dataLoai
                  .filter((loai) => loai.parent_id === null)
                  .map((loaiCha) => {
                    const hasChildren = dataLoai.some(
                      (loai) => loai.parent_id === loaiCha.category_id
                    );
                    return (
                      <li
                        key={loaiCha.category_id}
                        className={`nav-item-lv2 ${
                          hasChildren ? "dropdown-submenu" : ""
                        }`}
                      >
                        <Link
                          className="nav-link"
                          href={`/sptrongloai/${loaiCha.category_id}`}
                        >
                          {loaiCha.name}{" "}
                          {hasChildren && <i className="fa fa-angle-right"></i>}
                        </Link>

                        {hasChildren && (
                          <ul className="dropdown-menu">
                            {dataLoai
                              .filter(
                                (loai) => loai.parent_id === loaiCha.category_id
                              )
                              .map((loaiCon) => (
                                <li
                                  key={loaiCon.category_id}
                                  className="nav-item-lv3"
                                >
                                  <Link
                                    className="nav-link"
                                    href={`/sptrongloai/${loaiCon.category_id}`}
                                  >
                                    {loaiCon.name}
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>

      <div className="col-md-2">
        <div className="text-center">
          <div className="logo inline-block">
            <Link href="/" className="logo-wrapper">
              <img
                src="//bizweb.dktcdn.net/100/310/257/themes/801944/assets/logo.png?1676001091788"
                alt="logo"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden-sm hidden-xs">
        <li className="li-cart li-cart2">
          <div className="top-cart-contain">
            <div className="mini-cart text-xs-center">
              <div className="heading-cart text-white">
                <Link href="/gio_hang">
                  <div className="icon text-white">
                    <i className="fa fa-shopping-basket"></i>
                  </div>

                  <div className="right-content">
                    <span className="cartCount2 text-[#000]">
                      ({totalQuantity})
                    </span>
                  </div>
                </Link>
              </div>
              <div className="top-cart-content">
                <ul id="cart-sidebar" className="mini-products-list count_li">
                  <div className="no-item" style={{ display: "none" }}>
                    <p>Không có sản phẩm nào trong giỏ hàng.</p>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </li>
        <nav className="nav-right">
          <ul className="nav">
            <li className="nav-item">
              <Link className="nav-link" href="/blog">
                Tin tức
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/lien_he">
                Liên hệ
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/gioi-thieu">
                Nhượng quyền
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

// Component phụ để xử lý menu có submenu
function SidebarMenuItem({
  label,
  dataLoai,
  onClose,
}: {
  label: string;
  dataLoai: ILoai[];
  onClose: () => void;
}) {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const toggleSubmenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  const loaiCha = dataLoai.filter((loai) => loai.parent_id === null);

  return (
    <>
      <button onClick={toggleSubmenu}>
        {label}
        <i
          className={`fa fa-angle-right submenu-toggle ${
            isSubmenuOpen ? "open" : ""
          }`}
        ></i>
      </button>

      <ul className={`sidebar-submenu ${isSubmenuOpen ? "open" : ""}`}>
        {loaiCha.map((loai) => {
          const hasChildren = dataLoai.some(
            (l) => l.parent_id === loai.category_id
          );

          return (
            <li key={loai.category_id}>
              {hasChildren ? (
                <NestedSubmenu
                  loai={loai}
                  dataLoai={dataLoai}
                  onClose={onClose}
                />
              ) : (
                <Link
                  href={`/sptrongloai/${loai.category_id}`}
                  onClick={onClose}
                >
                  {loai.name}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

// Component cho submenu lồng nhau (level 3)
function NestedSubmenu({
  loai,
  dataLoai,
  onClose,
}: {
  loai: ILoai;
  dataLoai: ILoai[];
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const children = dataLoai.filter((l) => l.parent_id === loai.category_id);

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        style={{
          width: "100%",
          textAlign: "left",
          background: "none",
          border: "none",
          padding: "12px 20px 12px 35px",
          color: "#555",
          fontSize: "14px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {loai.name}
        <i
          className={`fa fa-angle-right submenu-toggle ${isOpen ? "open" : ""}`}
          style={{ fontSize: "12px" }}
        ></i>
      </button>

      {isOpen && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            background: "#efefef",
          }}
        >
          {children.map((child) => (
            <li key={child.category_id}>
              <Link
                href={`/sptrongloai/${child.category_id}`}
                onClick={onClose}
                style={{
                  display: "block",
                  padding: "10px 20px 10px 50px",
                  color: "#666",
                  fontSize: "13px",
                  textDecoration: "none",
                }}
              >
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
