/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { signUpSchema } from "@/Schemas/signUpSchema";
import axios from "axios";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
    
      signUpSchema.parse(form);

      let profilePictureUrl = "";

      if (selectedImage) {
        const imageForm = new FormData();
        imageForm.append("file", selectedImage);

        const imageUploadRes = await axios.post("/api/image-upload", imageForm, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        profilePictureUrl = imageUploadRes.data.url;
      }

      const res = await axios.post("/api/signup", {
        ...form,
        profilePicture: profilePictureUrl, // send image URL
      });

      alert("Signup successful!");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#000000] font-sans">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-5 mb-6">
        <div className="text-xl font-bold flex items-center gap-2">
          <span className="text-lg">🐾</span> Jeevan
        </div>
        <nav className="flex gap-6 items-center text-base font-medium">
          <a href="#">Home</a>
          <a href="#">Report</a>
          <a href="#">Rescue</a>
          <a href="#">About Us</a>
          <a href="/login" className="text-[#00C4B4] hover:underline">Login</a>
          <a href="/signup" className="text-[#00C4B4] hover:underline">Signup</a>
          <button className="bg-[#00C4B4] hover:bg-[#00a89d] text-white font-medium px-5 py-2 rounded-full">Donate</button>
          <button className="bg-[#00C4B4] hover:bg-[#00a89d] text-white font-medium px-5 py-2 rounded-full">Volunteer</button>
        </nav>
      </header>

      {/* Signup Form */}
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-white px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-[#f8f9fa] shadow-lg rounded-2xl p-8 border border-gray-200"
        >
          <h2 className="text-3xl font-semibold text-[#00C4B4] text-center mb-6">Create an Account</h2>

          <div className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"
            />

            {/* 📷 File Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />

            {/* 🖼️ Preview */}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover mx-auto"
              />
            )}

            <button
              type="submit"
              className="w-full bg-[#00C4B4] hover:bg-[#00a89d] text-white font-semibold py-2 rounded-md transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>

            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-[#00C4B4] hover:underline font-medium">
                Login here
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="text-sm text-gray-500 text-center py-6">
        <div className="flex justify-center gap-6 mb-3">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
        <div className="flex justify-center gap-4 text-xl mb-3">
          <a href="#">🐦</a>
          <a href="#">📘</a>
          <a href="#">📸</a>
        </div>
        <p>© 2024 Jeevan. All rights reserved.</p>
      </footer>
    </main>
  );
}
