'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FileUpload } from '@/components/ui/file-upload';

export default function GalleryUploadPage() {
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return toast.error("Please select an image!");

    const formData = new FormData();
    formData.append("image", image);

    try {
      setSubmitting(true);
      const res = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Image uploaded successfully!");
        setImage(null);
        toast.info("Redirecting to gallery...");
        setTimeout(() => router.push("/gallery"), 1500);
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      toast.error("An error occurred while uploading the image");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-gray-50 p-6 rounded-xl shadow border">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          🐾 Contribute to the Gallery
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2 text-gray-700">Upload an image</p>
            <FileUpload
              onChange={(files) => {
                const file = files[0];
                if (file) setImage(file);
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {submitting ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}
