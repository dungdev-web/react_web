import Link from "next/link"
import "../style/footer.css"
export default function Footer() {
    return (

        <footer className="footer">
            <div >
                <div className="container4 mx-auto max-w-6xl grid grid-cols-4 gap-4 py-8 ">
                    <div className="footer-column">
                        <h3>VỀ CHÚNG TÔI</h3>
                        <p>Chúng tôi chuyên cung cấp các sản phẩm thực phẩm sạch, an toàn cho sức khỏe người tiêu dùng.</p>
                        <p><i className="fas fa-map-marker-alt"></i> Ladeco Building, 266 Doi Can Street, Hà Nội</p>
                        <p><i className="fas fa-phone"></i> 1900 6750</p>
                        <p>Thứ 2 - Chủ nhật: 9:00 - 18:00</p>
                        <p><i className="fas fa-envelope"></i> support@sapo.vn</p>
                    </div>
                    <div className="footer-column">
                        <h3>LIÊN KẾT NHANH</h3>
                        <ul>
                            <li><Link href="#">Trang chủ</Link></li>
                            <li><Link href="#">Giới thiệu</Link></li>
                            <li><Link href="#">Thực đơn</Link></li>
                            <li><Link href="#">Tin tức</Link></li>
                            <li><Link href="#">Liên hệ</Link></li>
                            <li><Link href="#">Nhượng quyền</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>HƯỚNG DẪN SỬ DỤNG</h3>
                        <ul>
                            <li><Link href="#">Trang chủ</Link></li>
                            <li><Link href="#">Giới thiệu</Link></li>
                            <li><Link href="#">Thực đơn</Link></li>
                            <li><Link href="#">Tin tức</Link></li>
                            <li><Link href="#">Liên hệ</Link></li>
                            <li><Link href="#">Nhượng quyền</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>KẾT NỐI VỚI DUALEO</h3>
                        <ul>
                            <li><Link href="#">Trang chủ</Link></li>
                            <li><Link href="#">Giới thiệu</Link></li>
                            <li><Link href="#">Thực đơn</Link></li>
                            <li><Link href="#">Tin tức</Link></li>
                            <li><Link href="#">Liên hệ</Link></li>
                            <li><Link href="#">Nhượng quyền</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="bg-[#222] h-[70px]">
            <div className="footer-bottom">
                © Bản quyền thuộc về <Link href="#">Dualeo</Link> | Cung cấp bởi <Link href="#">Sapo</Link>
            </div>
            </div>
        </footer>
    )
}