"use client";

import Image from "next/image";
import { useState } from "react";

const mockData = [
  {
    id: 1,
    image: "/Rescue/inj-dog.png",
    title: "Dog found near park",
    time: "Reported 2 hours ago",
    address: "123 Elm Street, San Francisco",
  },
  {
    id: 2,
    image: "/Rescue/cat-stuck.png",
    title: "Cat stuck in tree",
    time: "Reported 3 hours ago",
    address: "456 Oak Avenue, San Francisco",
  },
  {
    id: 3,
    image: "/Rescue/inj-bird.png",
    title: "Injured bird",
    time: "Reported 4 hours ago",
    address: "789 Pine Lane, San Francisco",
  },
  {
    id: 4,
    image: "/Rescue/puppy.png",
    title: "Lost puppy",
    time: "Reported 5 hours ago",
    address: "101 Maple Drive, San Francisco",
  },
  {
    id: 5,
    image: "/Rescue/str-rabbit.png",
    title: "Stray rabbit",
    time: "Reported 6 hours ago",
    address: "222 Cedar Court, San Francisco",
  },
];

export default function RescuePage() {
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 border-b">
        <div className="text-xl font-bold flex items-center gap-2">
          <span className="text-lg">🐾</span> Jeevan
        </div>
        <nav className="flex gap-6 items-center text-base font-medium">
          <a href="/" className="hover:underline">Home</a>
          <a href="/report" className="hover:underline">Report</a>
          <a href="/rescue" className="hover:underline font-semibold">Rescue</a>
          <a href="/about" className="hover:underline">About</a>
          <div className="bg-gray-100 p-2 rounded-full">🔔</div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
            <Image src="/profile-user.png" alt="User" width={32} height={32} />
          </div>
        </nav>
      </header>

      {/* Main Content - Full Width */}
      <div className="flex flex-col lg:flex-row py-10 gap-10 px-6 md:px-10">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-3">Nearby Cases</h2>
            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src="/map.png"
                alt="Map"
                width={300}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2">Filters</h3>
            <div className="flex gap-2 flex-wrap">
              {["All", "Urgent", "Rescued"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-4 py-1 rounded-full border text-sm ${
                    filter === item ? "bg-[#00C4B4] text-white" : "bg-gray-100 text-black"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2">Sort by</h3>
            <div className="flex gap-2 flex-wrap">
              {["Newest", "Distance"].map((item) => (
                <button
                  key={item}
                  onClick={() => setSortBy(item)}
                  className={`px-4 py-1 rounded-full border text-sm ${
                    sortBy === item ? "bg-[#00C4B4] text-white" : "bg-gray-100 text-black"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Reported Cases Section */}
        <section className="w-full lg:w-3/4">
          <h2 className="text-2xl font-bold mb-6">Reported Cases</h2>

          <div className="space-y-6">
            {mockData.map((caseItem) => (
              <div
                key={caseItem.id}
                className="flex items-center justify-between p-4 bg-[#f9f9f9] rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={caseItem.image}
                    alt={caseItem.title}
                    width={60}
                    height={60}
                    className="rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-[16px]">{caseItem.title}</h3>
                    <p className="text-gray-500 text-sm">{caseItem.time}</p>
                    <p className="text-[#00A89D] text-sm font-medium">{caseItem.address}</p>
                  </div>
                </div>
                <button className="bg-gray-100 hover:bg-gray-200 text-sm font-medium px-4 py-2 rounded-full">
                  Accept
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
