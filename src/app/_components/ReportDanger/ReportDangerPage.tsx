"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar/Navbar";
import { toast } from "sonner";
import { FileUpload } from "@/components/ui/file-upload";
import Footer from "../Footer/Footer";

export default function ReportDangerPage() {
  const [typeOfAnimal, setTypeOfAnimal] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [locationFetched, setLocationFetched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords([longitude, latitude]);
        setLocationFetched(true);
        toast.success("Location captured!");
      },
      () => {
        toast.error("Failed to get location");
      }
    );
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !coords) return toast.error("Image and location are required");

    try {
      setSubmitting(true);
      const imageUrl = await uploadToCloudinary(image);

      const res = await fetch("/api/report", {
        method: "POST",
        body: JSON.stringify({
          imageUrl,
          typeOfAnimal,
          description,
          coordinates: coords,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Report submitted successfully");
        setTypeOfAnimal("");
        setDescription("");
        setImage(null);
        setCoords(null);
        setLocationFetched(false);

        setTimeout(() => router.push("/rescuetask"), 1500);
      } else {
        toast.error("Failed to submit report");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans text-gray-800">
      <Navbar />

      <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-50 shadow rounded-xl border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center">
          🐾 Report Injured Animal
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Type of animal"
            value={typeOfAnimal}
            onChange={(e) => setTypeOfAnimal(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />

          <div>
            <p className="text-sm font-medium mb-1">Upload Image</p>
            <FileUpload
              onChange={(files) => {
                const file = files[0];
                if (file) setImage(file);
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={getLocation}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition disabled:opacity-50"
              disabled={locationFetched}
            >
              {locationFetched ? "📍 Location Captured" : "Get Location"}
            </button>
            {coords && (
              <span className="text-sm text-green-600">
                ({coords[1].toFixed(3)}, {coords[0].toFixed(3)})
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-2 rounded-lg transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
      <Footer />
    </main>
  );
}
