"use client";
import { useState, useEffect } from "react";
import Show1SP from "../components/Show1SP";
import { ISanPham } from "../components/cautrucdata";
import "../style/sanpham.css";
import { API_URL } from "../config/config";
export default function SanPham() {
  const [sp, setSp] = useState<ISanPham[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState("default"); // ✅ State lưu kiểu sắp xếp

  const pageSize = 8; // Số sản phẩm mỗi lần tải

  const fetchSanPham = async (pageNum: number, sortBy: string) => {
    try {
      const res = await fetch(
        `${API_URL}/api/phantrang?page=${pageNum}&limit=${pageSize}&sortby=${sortBy}`
      );
      const data = await res.json();
  
      if (!data || !data.data) {
        console.error("Lỗi: Không có dữ liệu trả về từ API.");
        return;
      }
  
      if (pageNum === 1) {
        setSp(data.data || []); // ✅ Reset danh sách khi đổi sortBy
      } else {
        setSp((prev) => [...prev, ...(data.data || [])]); // ✅ Gộp dữ liệu mới
      }
  
      if ((sp.length || 0) + (data.data.length || 0) >= (data.total || 0)) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
    }
  };
  
  

  useEffect(() => {
    setSp([]); // ✅ Reset danh sách khi đổi sortBy
    setPage(1); // ✅ Quay về trang đầu khi đổi sortBy
    fetchSanPham(1, sortBy); // ✅ Gọi lại API với sortBy mới
  }, [sortBy]);

  useEffect(() => {
    fetchSanPham(page, sortBy); // ✅ Gọi lại API khi đổi page
  }, [page]);

  const handleSort = (sortValue: string) => {
    setSortBy(sortValue);
    setPage(1); // ✅ Reset về trang đầu khi đổi cách sắp xếp
    setHasMore(true);
  };


  return (
    <div >
      <section className="bread-crumb">
        <div className="container1">
          <div className="rows">
            <div className="col-xs-12">

              <div className="breadcrumb-title"><b> Tất cả sản phẩm</b></div>

              <ul className="breadcrumb">

                <li className="home">
                  <a href="/"><span>Trang chủ</span></a>
                  <span> / </span>
                </li>


                <li><strong><span> Tất cả sản phẩm</span></strong></li>


              </ul>
            </div>
          </div>
        </div>
      </section>
      <p className="text-lg text-gray-500 text-center mb-8">
        Khám phá các sản phẩm hot nhất hiện nay.
      </p>
      <div className="container1">
        <div className="rows">
          <section className="main_container collection col-lg-12">
            <div className="category-product">
              <div className="sortPagiBar">
                <div className="rows">

                  <div className="col-xs-12 col-sm-12 col-md-12 text-xs-left text-sm-right">
                    <div className="bg-white clearfix sort_box">

                      <div className="collection-icon dl-menu-collec">
                        <div className="title dl-click-mn">
                          <i className="fa fa-bars"></i> Danh mục
                        </div>
                        <div id="sort-by">
                          <ul>
                            <li>
                              <span className="fixtt">Sắp xếp</span>
                              <i className="fa fa-sort-down"></i>
                              <ul>
                                <li><button onClick={() => handleSort("default")}>Mặc định</button></li>
                                <li><button onClick={() => handleSort("alpha-asc")}>A → Z</button></li>
                                <li><button onClick={() => handleSort("alpha-desc")}>Z → A</button></li>
                                <li><button onClick={() => handleSort("price-asc")}>Giá tăng dần</button></li>
                                <li><button onClick={() => handleSort("price-desc")}>Giá giảm dần</button></li>
                                <li><button onClick={() => handleSort("created-desc")}>Hàng mới nhất</button></li>
                                <li><button onClick={() => handleSort("created-asc")}>Hàng cũ nhất</button></li>
                              </ul>
                            </li>
                          </ul>
                        </div>



                        <aside id="dl_no" className="aside-item sidebar-category collection-category"
                          style={{ display: "none" }}>
                          <div className="aside-content">
                            <div className="nav-category navbar-toggleable-md">
                              <ul className="nav navbar-pills">




                                <li className="nav-item dl-lv-1">
                                  <a className="nav-link" href="/">Trang chủ</a>
                                </li>





                                <li className="nav-item dl-lv-1">
                                  <a className="nav-link" href="/gioi-thieu">Giới thiệu</a>
                                </li>





                                <li className="nav-item okactive dl-lv-1">
                                  <a href="/collections/all" className="nav-link">Thực đơn</a>
                                  <i className="fa fa-angle-down"></i>
                                  <ul className="dropdown-menu dl-bx-1">



                                    <li className="dropdown-submenu nav-item dl-lv-2">
                                      <i className="fa fa-caret-right"></i>
                                      <a className="nav-link" href="/">Bánh Piza</a>
                                      <i className="fa fa-angle-down"></i>
                                      <ul className="dropdown-menu dl-bx-2">



                                        <li className="nav-item">
                                          <i className="fa fa-caret-right"></i>
                                          <a className="nav-link" href="/">Pizza Hải Sản
                                          </a>
                                        </li>




                                        <li className="nav-item">
                                          <i className="fa fa-caret-right"></i>
                                          <a className="nav-link" href="/">Pizza Rau Củ
                                          </a>
                                        </li>


                                      </ul>
                                    </li>




                                    <li className="nav-item">
                                      <i className="fa fa-caret-right"></i>
                                      <a className="nav-link" href="/">Burger</a>
                                    </li>




                                    <li className="nav-item">
                                      <i className="fa fa-caret-right"></i>
                                      <a className="nav-link" href="/">Đồ uống</a>
                                    </li>




                                    <li className="nav-item">
                                      <i className="fa fa-caret-right"></i>
                                      <a className="nav-link" href="/">Trà sữa</a>
                                    </li>




                                    <li className="nav-item">
                                      <i className="fa fa-caret-right"></i>
                                      <a className="nav-link" href="/">Hoa quả</a>
                                    </li>




                                    <li className="nav-item">
                                      <i className="fa fa-caret-right"></i>
                                      <a className="nav-link" href="/">Salad</a>
                                    </li>




                                    <li className="nav-item">
                                      <i className="fa fa-caret-right"></i>
                                      <a className="nav-link" href="/">Xúc xích</a>
                                    </li>




                                    <li className="nav-item">
                                      <i className="fa fa-caret-right"></i>
                                      <a className="nav-link" href="/">Khoai tây</a>
                                    </li>




                                    <li className="nav-item">
                                      <i className="fa fa-caret-right"></i>
                                      <a className="nav-link" href="/">Piza</a>
                                    </li>



                                  </ul>
                                </li>





                                <li className="nav-item dl-lv-1">
                                  <a className="nav-link" href="/tin-tuc">Tin tức</a>
                                </li>





                                <li className="nav-item dl-lv-1">
                                  <a className="nav-link" href="/lien-he">Liên hệ</a>
                                </li>





                                <li className="nav-item dl-lv-1">
                                  <a className="nav-link" href="/gioi-thieu">Nhượng quyền</a>
                                </li>


                              </ul>
                            </div>
                          </div>
                        </aside>


                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="container mx-auto w-full  mt-[50px]">

            <div className="container mx-[auto]">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
                {sp.length > 0 ? (
                  sp.map((item, index) => (
                    <Show1SP key={`${item.product_id}-${index}`} sp={item} />)
                  )) : (
                  <p className="text-gray-500">Không có sản phẩm nào.</p>
                )}
              </div>
            </div>
            {/* Nút xem thêm */}
            {hasMore && (
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="mt-6 block mx-auto bg-blue-500 text-white px-6 py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-600 hover:scale-105 hover:shadow-lg hover:ring-2 hover:ring-blue-300 active:scale-95"
              >
                Xem thêm 🔽
              </button>
            )}
          </div>
        </div>
      </div>
    </div>


  );
}
