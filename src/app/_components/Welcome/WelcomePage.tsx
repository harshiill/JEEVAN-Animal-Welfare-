"use client";

import Image from "next/image";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-white text-black font-sans">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        {/* Left: Logo */}
        <div className="text-lg font-bold flex items-center gap-2">
          <span className="text-xl">🐾</span> Jeevan
        </div>

        {/* Center: Links */}
        <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
          <a href="#" className="hover:text-[#00C4B4]">Home</a>
          <a href="#" className="hover:text-[#00C4B4]">Dashboard</a>
          <a href="#" className="hover:text-[#00C4B4]">Donate</a>
        </nav>

        {/* Right: Profile + Menu */}
        <div className="flex items-center gap-4">
          {/* Hamburger icon */}
          <button className="md:hidden">
            <span className="text-2xl">☰</span>
          </button>
          {/* Profile image */}
          <Image
            src="/profile-user.png"
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full border"
          />
        </div>
      </header>

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
