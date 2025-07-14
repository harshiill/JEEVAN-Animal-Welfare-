/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";
import Navbar from "../Navbar/Navbar";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-white text-black font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Welcome Message */}
      <section className="flex flex-col items-center justify-center text-center px-4 mt-20">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Welcome to Jeevan</h1>
        <p className="max-w-2xl text-gray-700 text-sm md:text-base mb-6">
          Jeevan is a real-time animal rescue and reporting system. Our mission is to ensure the
          safety and well-being of animals in need. Whether you're reporting an animal in distress
          or looking to help, Jeevan connects you with the resources and support you need.
        </p>
        <button className="bg-[#00E3D9] hover:bg-[#00c4b4] text-black font-semibold px-6 py-2 rounded-full shadow">
          Report an Animal
        </button>
      </section>
    </main>
  );
}
