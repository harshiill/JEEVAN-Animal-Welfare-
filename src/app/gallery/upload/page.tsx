'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function GalleryUploadPage() {
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Image uploaded successfully!");

        // 🔁 Clear input & state so user can upload again
        setImage(null);
        if (inputRef.current) {
          inputRef.current.value = "";
        }

        router.push("/gallery");
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      alert("Something went wrong while uploading.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        🐾 Contribute to the Gallery
      </h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <input
          type="file"
          ref={inputRef}
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="block w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
