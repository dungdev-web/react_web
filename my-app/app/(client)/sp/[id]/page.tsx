"use client";
import { useParams } from "next/navigation";
import { useEffect, useState,useCallback  } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import "../../style/chitietsp.css";
import Show1SP from "../../components/Show1SP";
import { ISanPham, IUser, IReview } from "../../components/cautrucdata";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Swal from "sweetalert2";
import { themSP1 } from "@/lib/cartSlice";
import { API_URL } from "../../config/config";
export default function ChitietSanPham() {
  const dispatch = useDispatch();
  const params = useParams();
  const id = params.id as string;
  const [sp, setSp] = useState<ISanPham | null>(null);
  const [activeTab, setActiveTab] = useState("tab-1");
  const [splienquan, setSPlienquan] = useState<ISanPham[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [comments, setComments] = useState<IReview[]>([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5); // Mặc định 5 sao
  const [message, setMessage] = useState("");

  const [user, setUser] = useState<IUser | null>(null);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(isNaN(value) || value < 1 ? 1 : value);
  };


  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/api/check-auth`, {
          method: "GET",
          credentials: "include",
          headers: { "Authorization": `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("Dữ liệu từ API check-auth:", data); // 🔥 Kiểm tra API trả gì

        if (res.ok && data.user) {
          setUser(data.user);
        } else {
          console.error("API check-auth không trả về user hợp lệ:", data);
        }
      } catch (error) {
        console.error("Lỗi fetch user:", error);
      }
    };


    fetchUser();
  }, []); // Chỉ chạy một lần khi component mount

  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/api/sp/${id}`)
      .then((res) => res.json())
      .then((data) => setSp(data));

    fetch(`${API_URL}/api/sp-tuong-tu/${id}`)
      .then((res) => res.json())
      .then((data) => setSPlienquan(data))
      .catch((err) => console.error("Lỗi khi lấy sản phẩm liên quan:", err));
  }, [id]); // Chạy khi `id` thay đổi
  const renderStars = (rating: number | null | undefined): string => {
    if (!rating || rating < 1) return "Chưa có đánh giá";
    return "⭐".repeat(rating);
  };

  const fetchComments = useCallback(async () => {
  if (!id) {
    console.warn("Không có ID, không gọi API.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/binhluan/${id}`);

    if (!res.ok) {
      if (res.status === 404) {
        console.log(`Sản phẩm ${id} chưa có bình luận.`);
        setComments([]);
        return;
      }
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }

    const data = await res.json();
    console.log("Dữ liệu API nhận được:", data);

    if (data?.binhluans && Array.isArray(data.binhluans)) {
      setComments(data.binhluans);
    } else {
      setComments([]);
    }
  } catch (error) {
    console.error("Lỗi khi lấy bình luận:", error);
    setComments([]);
  }
}, [id]); // 👈 phụ thuộc id

  

  useEffect(() => {
  fetchComments();
}, [fetchComments, user]); // 👈 thêm fetchComments
// Chạy khi `id` hoặc `user` thay đổi

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setMessage("Bạn cần đăng nhập để bình luận!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Bạn cần đăng nhập để bình luận!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/thembinhluan/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: user.user_id, comment, rating }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Bình luận đã được gửi!");
        setComment(""); // Xóa nội dung sau khi gửi
        fetchComments(); // 🔥 Gọi lại fetchComments sau khi thêm bình luận
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      setMessage("Lỗi hệ thống! Vui lòng thử lại.");
    }
  };




  if (!sp) return <p className="text-center text-red-500">Đang tải sản phẩm...</p>;

  return (
    //  <div classNameName="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6">
    //   {/* Tiêu đề sản phẩm */}
    //   <h1 classNameName="text-3xl font-bold text-gray-800 text-center">{sp.name}</h1>

    //   {/* Hình ảnh sản phẩm */}
    //   <div classNameName="mt-4 flex justify-center">
    //     {/* <Image 
    //       src=`{sp.Image} `
    //       alt={sp.name} 
    //       classNameName="w-[350px] h-[280px] object-cover rounded-lg transition-transform transform hover:scale-105"
    //     /> */}
    //     <Image
    //      src={`/Image/${sp.Image}`}
    //      alt={sp.name}
    //      layout="intrinsic"
    //      width={500} // Giá trị bất kỳ, không ảnh hưởng vì layout sẽ tự động điều chỉnh
    //      height={500}

    //     ></Image>
    //   </div>

    //   {/* Thông tin sản phẩm */}
    //   <div classNameName="mt-4 text-center space-y-2">
    //     <p classNameName="text-gray-700 text-lg font-semibold"> Giá khuyến mãi: <span classNameName="text-red-500 font-bold">{sp.discount_price.toLocaleString('vi')} VND</span></p>

    //   </div>

    //   {/* Nút Quay lại */}
    //   <div classNameName="mt-6 text-center">
    //     <Link href="/">
    //       <button classNameName="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
    //         ⬅ Quay lại
    //       </button>
    //     </Link>
    //   </div>
    // </div> 
    <div>

      <section className="bread-crumb">
        <div className="container1">
          <div className="rows">
            <div className="col-xs-12">

              <div className="breadcrumb-title"><b> Chi tiết sản phẩm </b></div>

              <ul className="breadcrumb">

                <li className="home">
                  <Link href="/"><span>Trang chủ</span></Link>
                  <span> / </span>
                </li>


                <li><strong><span> Sản phẩm </span></strong><span style={{ fontWeight: "0px" }}>/</span></li>
                <li><strong><span> {sp.name}</span></strong></li>


              </ul>
            </div>
          </div>
        </div>
      </section>
      <div className="container1">
        <div className="rows">
          <div className="col-lg-9">
            <div className="details-product">
              <div className="rows">
                <div className="col-xs-12 col-sm-12 col-md-5">
                  <div className="large-image">
                    <Link href="https://bizweb.dktcdn.net/thumb/1024x1024/100/310/257/products/ga-1-d45b2dc2-a3af-4259-9843-e60b54cd63dd.png?v=1527215295217" data-rel="prettyPhoto[product-gallery]">
                      <div style={{ height: "263px", width: "334px" }} className="zoomWrapper"><Image id="zoom_01" layout="intrinsic" width={500} height={500} src={`/img/${sp.img}`} alt={sp.name} style={{ position: "absolute" }}></Image></div>
                    </Link>
                    <div className="hidden">
                      <div className="item">
                        <Link href="https:https://bizweb.dktcdn.net/100/310/257/products/ga-1-d45b2dc2-a3af-4259-9843-e60b54cd63dd.png?v=1527215295217" data-image="https:https://bizweb.dktcdn.net/100/310/257/products/ga-1-d45b2dc2-a3af-4259-9843-e60b54cd63dd.png?v=1527215295217" data-zoom-image="https:https://bizweb.dktcdn.net/100/310/257/products/ga-1-d45b2dc2-a3af-4259-9843-e60b54cd63dd.png?v=1527215295217" data-rel="prettyPhoto[product-gallery]">
                        </Link>
                      </div>
                      <div className="item">
                        <Link href="https:https://bizweb.dktcdn.net/100/310/257/products/com-ga-nuong-pho-mai-cay-63d50a98-2c72-43d4-aacf-668db364e845-ed885cf2-8eef-4437-a21a-b1fddd23487b.jpg?v=1531914415080" data-image="https:https://bizweb.dktcdn.net/100/310/257/products/com-ga-nuong-pho-mai-cay-63d50a98-2c72-43d4-aacf-668db364e845-ed885cf2-8eef-4437-a21a-b1fddd23487b.jpg?v=1531914415080" data-zoom-image="https:https://bizweb.dktcdn.net/100/310/257/products/com-ga-nuong-pho-mai-cay-63d50a98-2c72-43d4-aacf-668db364e845-ed885cf2-8eef-4437-a21a-b1fddd23487b.jpg?v=1531914415080" data-rel="prettyPhoto[product-gallery]">
                        </Link>
                      </div>
                      <div className="item">
                        <Link href="https:https://bizweb.dktcdn.net/100/310/257/products/com-tron-hai-san-37293d1b-9277-4c96-8691-f3158cbf31e2-2ce9f423-dcfb-49fb-a636-4c3f48b47a0d.jpg?v=1531914415797" data-image="https:https://bizweb.dktcdn.net/100/310/257/products/com-tron-hai-san-37293d1b-9277-4c96-8691-f3158cbf31e2-2ce9f423-dcfb-49fb-a636-4c3f48b47a0d.jpg?v=1531914415797" data-zoom-image="https:https://bizweb.dktcdn.net/100/310/257/products/com-tron-hai-san-37293d1b-9277-4c96-8691-f3158cbf31e2-2ce9f423-dcfb-49fb-a636-4c3f48b47a0d.jpg?v=1531914415797" data-rel="prettyPhoto[product-gallery]">
                        </Link>
                      </div>
                      <div className="item">
                        <Link href="https:https://bizweb.dktcdn.net/100/310/257/products/com-tron-hai-san-bc475fed-0506-4e4a-98e0-9b8a6b5144f0-91622daf-17ca-438a-90e9-95238825cdbf.jpg?v=1531914416260" data-image="https:https://bizweb.dktcdn.net/100/310/257/products/com-tron-hai-san-bc475fed-0506-4e4a-98e0-9b8a6b5144f0-91622daf-17ca-438a-90e9-95238825cdbf.jpg?v=1531914416260" data-zoom-image="https:https://bizweb.dktcdn.net/100/310/257/products/com-tron-hai-san-bc475fed-0506-4e4a-98e0-9b8a6b5144f0-91622daf-17ca-438a-90e9-95238825cdbf.jpg?v=1531914416260" data-rel="prettyPhoto[product-gallery]">
                        </Link>
                      </div>

                    </div>
                  </div>
                  {sp.thumbnail && (
                    <div className="thumnail flex justify-center items-center mt-3">
                      {Object.entries(sp.thumbnail)
                        .filter(([key]) => key.startsWith("Image")) // Chỉ lấy key bắt đầu bằng "Image"
                        .map(([, value], index) => (
                          <div
                            className="gallery"
                            key={index}
                            style={{
                              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                              borderRadius: "8px",
                              padding: "10px",
                              transition: "box-shadow 0.3s ease-in-out"
                            }}
                          >
                            <Link href="#">
                              <Image
                                layout="intrinsic"
                              
                                src={`/Image/${value}`}  // value là tên file ảnh
                                alt={`Thumbnail ${index + 1}`}
                                style={{ width: "58px", marginRight: "10px" }}
                              />
                            </Link>
                          </div>
                        ))}
                    </div>
                  )}


                </div>
                <div className="col-xs-12 col-sm-12 col-md-7 details-pro">
                  <h1 className="title-head">{sp.name}</h1>
                  <div className="reviews clearfix">
                    <div className="float-left mr-[10px]">
                      <div className="sapo-product-reviews-badge sapo-product-reviews-badge-detail" data-id="11777911"></div>
                    </div>
                    <div className="float-left iddanhgia hidden" >
                      <span>Viết đánh giá</span>
                    </div>
                  </div>
                  <div className="price-box clearfix">

                    <span className="special-price"><span className="price product-price">{sp.discount_price.toLocaleString('vi')}₫</span> </span>
                    <span className="old-price"><del className="price product-price-old">{sp.price.toLocaleString('vi')}₫</del></span>

                  </div>
                  <div className="status clearfix hidden">
                    Trạng thái: <span className="inventory"><span>{sp.status ? "Còn hàng" : "Hết hàng"}</span></span>
                  </div>
                  <div className=" product-summary product_description mb-[15px]">
                    <div className="rte description">

                      <p>{sp.description}</p>

                    </div>
                  </div>
                  <div className="form-product ">
                    <form encType="multipart/form-data" id="add-to-cart-form" className="form-inline mb-[10px] dqdt-form" onSubmit={(event) => { event.preventDefault(); }}>

                      <div className="box-variant clearfix ">
                        <fieldset className="form-group">
                          <div className="selector-wrapper" style={{ textAlign: "left", marginBottom: "15px" }}><label>Kích thước</label>
                            <select className="single-option-selector" data-option="option1" id="product-selectors-option-0" value={size} onChange={(e) => setSize(e.target.value)} >
                              <option value="Lớn">Lớn</option>
                              <option value="Nhỏ">Nhỏ</option>
                            </select>
                          </div>
                          <select id="product-selectors" className="form-control form-control-lg" name="variantId" style={{ display: "none" }}>
                            <option value="18721593">Lớn - 60.000₫</option>
                            <option value="19636899">Nhỏ - 60.000₫</option>
                          </select>
                        </fieldset>


                      </div>
                      <div className="form-group form-groupx form-detail-action clearfix">
                        <label className="float-left">Số lượng: </label>
                        <div className="custom custom-btn-number flex items-center border border-gray-300 rounded-md">
                          <button
                            className="qtyminus px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-l-md flex items-center justify-center"
                            onClick={handleDecrease}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="input-text qty w-12 text-center border-none outline-none"
                            title="Số lượng"
                            maxLength={12}
                            id="qty"
                            name="quantity"
                            value={quantity}
                            onChange={handleChange}
                          />
                          <button
                            className="qtyplus px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-md flex items-center justify-center"
                            onClick={handleIncrease}
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="btn btn-lg btn-primary btn-cart btn-cart2 add_to_cart btn_buy add_to_cart"
                          title="Cho vào giỏ hàng"
                          onClick={() => {
                            dispatch(themSP1({ sp, quantity, size }));
                            Swal.fire({
                              title: "🎉 Thành công!",
                              text: `Đã thêm "${sp.name}" vào giỏ hàng.`,
                              icon: "success",
                              showConfirmButton: false,
                              timer: 3000,
                            });

                          }}
                        >
                          Thêm vào giỏ hàng
                        </button>


                      </div>
                    </form>



                  </div>

                </div>
              </div>
            </div>
          </div>
          <aside className="dqdt-sidebar sidebar right left-content col-lg-3">


            <div className="aside-item aside-product aside-vanchuyen magin-bottom-30">
              <div>
                <div className="aside-content">
                  <div className="vanchuyen">
                    <div>
                      <div className="icon">
                        <Image src="https://bizweb.dktcdn.net/100/310/257/themes/801944/assets/po_icon1.png?1676001091788" alt="vận chuyển miễn phí" />
                      </div>
                      vận chuyển miễn phí</div>
                    <p>- Nội thành Hà Nội: với đơn hàng trên <b>550.000đ</b></p>
                    <p>- Toàn quốc: với đơn hàng trên <b>700.000đ</b></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="aside-item aside-product border-none aside-policy magin-bottom-0">
              <div>
                <div className="icon">
                  <Image src="https://bizweb.dktcdn.net/100/310/257/themes/801944/assets/po_icon2.png?1676001091788" alt="Giao hàng tận nơi và nhanh chóng" />
                </div>
                <p>Giao hàng tận nơi và nhanh chóng</p>
              </div>
            </div>
            <div className="aside-item aside-product aside-policy magin-bottom-30">
              <div>
                <div className="icon">
                  <Image src="https://bizweb.dktcdn.net/100/310/257/themes/801944/assets/po_icon3.png?1676001091788" alt="Thu tiền tại nhà, đảm bảo an toàn" />
                </div>
                <p>Thu tiền tại nhà, đảm bảo an toàn</p>
              </div>
            </div>

          </aside>
          <div className="col-lg-12 mt-[15px] mb-[10px] float-left">
            <div className="product-tab e-tabs">
              <ul className="tabs tabs-title clearfix">

                <li
                  className={`tab-link ${activeTab === "tab-1" ? "current" : ""}`}
                  onClick={() => setActiveTab("tab-1")}
                >
                  <h3><span>Mô tả</span></h3>
                </li>

                <li
                  className={`tab-link ${activeTab === "tab-2" ? "current" : ""}`}
                  onClick={() => setActiveTab("tab-2")}
                >
                  <h3><span>Thông tin</span></h3>
                </li>

                <li
                  className={`tab-link ${activeTab === "tab-3" ? "current" : ""}`}
                  onClick={() => setActiveTab("tab-3")}
                >
                  <h3><span>Đánh giá</span></h3>
                </li>


              </ul>
              <div className={`tab-content ${activeTab === "tab-1" ? "current" : ""}`}>
                <h1 className="text-3xl mb-2.5">Nguyên liệu</h1>
                <b><p>Nguyên liệu làm {sp.name}:</p></b>
                <p className="pl-3 text-[#898989] text-[14px]">
                  {sp.food_detail?.ingredients.split(",").map((item, index) => (
                    <span key={index}>
                      + {item.trim()}.
                      <br />
                    </span>
                  ))}
                </p>
                <b><p>Cách làm {sp.name}:</p></b>
                <p className="pl-3 text-[#898989] text-[14px]">{sp.food_detail?.instructions.split(".").map((item, index) => (
                  <span key={index}>
                    {item.trim()}.
                    <br />
                  </span>
                ))}</p>
                <p>Chúc các bạn thành công và ngon miệng với món <b> {sp.name} </b>này nhé</p>
              </div>

              <div className={`tab-content ${activeTab === "tab-2" ? "current" : ""}`}>
                {/* <h4>Thông tin sản phẩm</h4> */}
                <p>Sản phẩm này được sản xuất theo tiêu chuẩn chất lượng cao:</p>
                <ul>
                  <li><strong>Xuất xứ:</strong> Việt Nam</li>
                  <li><strong>Bảo hành:</strong> Trong ngày</li>
                  <li><strong>Chính sách đổi trả:</strong> Có cái nịt</li>
                  <li><strong>Lượng calories:</strong> {sp.food_detail?.calories}</li>
                  <li><strong>Thời gian tối thiểu:</strong> {sp.food_detail?.cooking_time}p</li>

                </ul>
              </div>

              <div className={`tab-content ${activeTab === "tab-3" ? "current" : ""}`}>
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Bình luận</h3>

                  {/* Danh sách bình luận */}
                  <div className="space-y-4">
                    {comments.length > 0 ? (
                      comments.map((comment1) => (
                        <div
                          key={comment1.review_id}
                          className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-gray-600 font-semibold">
                              {comment1.review_user?.name.charAt(0).toUpperCase() || "A"}
                            </div>
                            <div>
                              <p className="text-gray-800 font-semibold !m-0">
                                {comment1.review_user?.name || "Ẩn danh"}
                              </p> 
                              <p className="text-sm text-gray-500 !m-0">{new Date(comment1.created_at).toLocaleDateString("vi")}</p>
                            </div>
                          </div>

                          <p className="text-gray-700 !m-0">{comment1.comment}</p>
                          <p className="text-sm text-yellow-500 mt-1 !m-0">
                            Đánh giá: {comment1.rating ? renderStars(comment1.rating) : "Chưa có đánh giá"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center">Chưa có bình luận nào.</p>
                    )}
                  </div>

                  {/* Form nhập bình luận */}
                  <div className="mt-6 bg-white p-6 shadow-md rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">Viết bình luận</h4>

                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                      <textarea
                        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                        placeholder="Nhập bình luận..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      ></textarea>

                      <div className="flex items-center gap-4">
                        <select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ - Tuyệt vời</option>
                          <option value={4}>⭐⭐⭐⭐ - Tốt</option>
                          <option value={3}>⭐⭐⭐ - Trung bình</option>
                          <option value={2}>⭐⭐ - Tệ</option>
                          <option value={1}>⭐ - Rất tệ</option>
                        </select>

                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition shadow-md"
                        >
                          Gửi bình luận
                        </button>
                      </div>
                    </form>

                    {message && <p className="text-red-500 text-center mt-3">{message}</p>}
                  </div>
                </div>


              </div>
            </div>
          </div>
          <h2 className="non my-3 text-xl font-bold uppercase text-gray-700 p-[30px] text-center relative" style={{ clear: "both" }}>
            Sản phẩm liên quan
          </h2>
          <div className="container mx-auto">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={15}
              slidesPerView={2}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="relative"
            >
              {splienquan.length > 0 ? (
                splienquan.map((sp: ISanPham) => (
                  <SwiperSlide key={sp.product_id}>
                    <Show1SP sp={sp} />
                  </SwiperSlide>
                ))
              ) : (
                <p className="text-gray-500">Không có sản phẩm nào.</p>
              )}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
