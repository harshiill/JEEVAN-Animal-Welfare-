"use client";

import { useState } from "react";
import Image from "next/image";

export default function ReportPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [locationText, setLocationText] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleLocationFocus = () => {
    // Only trigger if location not already filled
    if (locationText.trim() !== "") return;

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationText(`Lat: ${latitude}, Lng: ${longitude}`);
        setIsGettingLocation(false);
      },
      (error) => {
        alert("Unable to retrieve your location. Please allow location access.");
        setIsGettingLocation(false);
        console.error("Geolocation error:", error);
      }
    );
  };

  return (
    <main className="min-h-screen bg-white text-[#000000] font-sans">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-5 border-b">
        <div className="text-xl font-bold flex items-center gap-2">
          <span className="text-lg">🐾</span> Jeevan
        </div>
        <nav className="flex gap-6 items-center text-base font-medium">
          <a href="/" className="hover:underline">Home</a>
          <a href="/report" className="hover:underline font-semibold">Report</a>
          <a href="/rescue" className="hover:underline">Rescue</a>
          <a href="/about" className="hover:underline">About</a>
          <div className="bg-gray-100 p-2 rounded-full">🔔</div>
          <div className="rounded-full overflow-hidden w-8 h-8 border-2 border-gray-300">
            <Image src="/user.png" alt="User" width={32} height={32} />
          </div>
        </nav>
      </header>

      {/* Form Section */}
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-10">Report an Accident</h1>

        <form className="space-y-8 text-[16px]">
          {/* Upload Image */}
          <div>
            <label className="block text-base font-medium mb-2">Upload Animal Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-300 p-2 rounded-md w-full max-w-sm"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Animal Preview"
                className="mt-4 rounded-lg max-w-sm max-h-48 object-cover"
              />
            )}
          </div>

          {/* Short Note */}
          <div>
            <label className="block text-base font-medium mb-2">Short Note (Issue Summary)</label>
            <textarea
              rows={3}
              placeholder="E.g., Injured stray dog near a roadside"
              className="border border-gray-300 p-3 rounded-md w-full text-[15px] resize-none"
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-base font-medium mb-2">Detailed Explanation</label>
            <textarea
              rows={4}
              placeholder="Describe the full scenario, condition of the animal, and surroundings."
              className="border border-gray-300 p-3 rounded-md w-full text-[15px] resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-base font-medium mb-2">Exact Location / Full Address</label>
            <textarea
              rows={2}
              value={locationText}
              onFocus={handleLocationFocus}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="Tap to autofill with current location or enter manually"
              className="border border-gray-300 p-3 rounded-md w-full text-[15px] resize-none"
            />
            {isGettingLocation && (
              <p className="text-sm text-gray-500 mt-1">Fetching current location...</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#00C4B4] hover:bg-[#00a89d] text-white font-semibold px-6 py-2 rounded-full text-base"
            >
              Submit
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
