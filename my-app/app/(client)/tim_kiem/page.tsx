import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

export default function Page() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Kết quả tìm kiếm</h1>

      <Suspense fallback={<p>Đang load kết quả...</p>}>
        <SearchPageClient />
      </Suspense>
    </div>
  );
}
