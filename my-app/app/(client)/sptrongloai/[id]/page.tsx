import { ILoai, ISanPham } from "../../components/cautrucdata";
import Show1SP from "../../components/Show1SP";
import { API_URL } from "../../config/config";
import Link from "next/link";
import "../../style/sptrongloai.css";

// ✅ Next 15: params là Promise
type SPTrongLoaiProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SPTrongLoai({ params }: SPTrongLoaiProps) {
  // ✅ phải await params
  const { id } = await params;
  const category_id = Number(id);

  // gọi API
  const resSP = await fetch(`${API_URL}/api/sptrongloai/${category_id}`);
  const sp_arr: ISanPham[] = await resSP.json();

  const resLoai = await fetch(`${API_URL}/api/loai/${category_id}`);
  const loai: ILoai = await resLoai.json();

  return (
    <div>
      <section className="bread-crumb">
        <div className="container1">
          <div className="rows">
            <div className="col-xs-12">
              <div className="breadcrumb-title">
                <b>Sản phẩm trong loại</b>
              </div>
              <ul className="breadcrumb">
                <li className="home">
                  <Link href="/"><span>Trang chủ</span></Link>
                  <span> / </span>
                </li>
                <li>
                  <strong>
                    <span>Sản phẩm trong loại {loai.name}</span>
                  </strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto p-4">
        <div className="container1">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
              {sp_arr.length > 0 ? (
                sp_arr.map(sp => <Show1SP key={sp.product_id} sp={sp} />)
              ) : (
                <p className="text-gray-500">Không có sản phẩm nào.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
