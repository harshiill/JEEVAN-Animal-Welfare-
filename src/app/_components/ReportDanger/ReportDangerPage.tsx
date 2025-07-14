"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar/Navbar";

export default function ReportDangerPage() {
  const [typeOfAnimal, setTypeOfAnimal] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const router = useRouter();

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setCoords([longitude, latitude]);
    });
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
    if (!image || !coords) return alert("Image and location required");

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
      router.push("/rescuetask");
    } else {
      alert("Failed to report. Try again.");
    }
  };

  return (
     <main className="min-h-screen bg-white text-[#000000] font-sans">
      {/* Navbar */}
      <Navbar />
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Report Injured Animal</h1>

      <input
        type="text"
        placeholder="Type of animal"
        value={typeOfAnimal}
        onChange={(e) => setTypeOfAnimal(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="w-full"
        required
      />

      <button
        type="button"
        onClick={getLocation}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Get Location
      </button>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit Report
      </button>
    </form>
    </main>
  );
}
