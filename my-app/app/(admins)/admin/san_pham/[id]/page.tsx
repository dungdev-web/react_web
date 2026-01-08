// app/(admins)/admin/san_pham/[id]/page.tsx
import SuaSanPham from "./SuaSanPham";

export default async function Page({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  return <SuaSanPham id={id} />;
}