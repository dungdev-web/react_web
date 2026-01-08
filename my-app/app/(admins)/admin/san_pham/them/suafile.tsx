"use client";
import { API_URL } from "@/app/(client)/config/config";
import { useState } from "react";
import Image from "next/image";
export default function UploadImage({ name, onImageChange }: { name: string, onImageChange: (newImage: string) => void }) {
  const [image, setImage] = useState<string | null>(null);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.url) {
      setImage(data.url); // Cập nhật URL hình ảnh từ backend
      onImageChange(data.url);  // Gửi lại URL mới cho component cha (SuaSanPham)

      const hiddenInput = document.querySelector(
        `input[name='${name}']`
      ) as HTMLInputElement;
      if (hiddenInput) hiddenInput.value = data.url;
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="border p-2 w-full"
      />
      {image && <Image src={image} alt="Hình ảnh" className="w-32 h-32 mt-2" />}
    </div>
  );
}
