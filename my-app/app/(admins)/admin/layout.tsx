import "./css1.css";
import "./sccc.css";
import Link from "next/link";
import AdminGuard from "@/app/(client)/components/AdminGuard ";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="vi">
  <body className="bg-[#f3f4f6]">
    <div className="w-full m-auto">
     
    <div className="sidebar">
        <h2>Dashdark X</h2>
        <ul>
            <li><Link href="/admin" className="">Dashboard</Link></li>
            <li><Link href="/admin/nguoi_dung">Quản lý người dùng</Link></li>
            <li><Link href="/admin/loai">Quản lý loại hàng</Link></li>
            <li><Link href="/admin/san_pham">Quản lý sản phẩm</Link></li>
            <li><Link href="/admin/binh_luan">Quản lý bình luận</Link></li>
            <li><Link href="#">Authentication</Link></li>
            <li><Link href="/">Quay về web</Link></li>
        </ul>
    </div>
      <main className="main-content">{children}</main>
      <AdminGuard>
      <div>
        <h1 className="text-2xl font-bold">👑 Quản lý admin</h1>
        {/* Nội dung trang admin ở đây */}
      </div>
    </AdminGuard>
    </div>
  </body>
</html>
)}
