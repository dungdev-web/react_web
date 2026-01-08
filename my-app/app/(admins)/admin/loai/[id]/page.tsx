import SuaLoaiClient from "./SuaLoaiClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SuaLoaiClient id={id} />;
}
