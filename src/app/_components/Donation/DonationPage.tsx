"use client";

import Image from "next/image";
import { useState } from "react";

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<{ [key: string]: string }>({
    food: "",
    shelter: "",
    transport: "",
  });

  const handleAmountSelect = (type: string, amount: string) => {
    setSelectedAmount((prev) => ({ ...prev, [type]: amount }));
  };

  const calculateTotal = () => {
    return ["food", "shelter", "transport"]
      .map((key) => parseInt(selectedAmount[key]) || 0)
      .reduce((sum, val) => sum + val, 0);
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
          <a href="/about" className="hover:underline">About</a>
          <a href="/contact" className="hover:underline">Contact</a>
          <a href="/donate" className="bg-[#00C4B4] text-white px-4 py-2 rounded-full">Donate</a>
          <div className="bg-gray-100 p-2 rounded-full">🔔</div>
        </nav>
      </header>

      {/* Content */}
      <section className="px-6 py-10 max-w-6xl mx-auto text-[16px]">
        <h1 className="text-3xl md:text-4xl font-bold mb-10">Donation Page</h1>

        {[
          {
            key: "food",
            title: "Food",
            subtitle: "Help feed abandoned animals",
            description:
              "Many animals are left without food. Your donation can provide essential nourishment.",
            image: "/Donation/fooddonation.png",
          },
          {
            key: "shelter",
            title: "Shelter",
            subtitle: "Provide safe shelter for rescued animals",
            description:
              "Rescued animals need a safe place to recover. Your donation helps build and maintain shelters.",
            image: "/Donation/shelterDonation.png",
          },
          {
            key: "transport",
            title: "Transport",
            subtitle: "Help transport animals to safety",
            description:
              "Transporting rescued animals to shelters or medical facilities requires resources. Your donation assists in safe transport.",
            image: "/Donation/transportdonation.png",
          },
        ].map((item) => (
          <div key={item.key} className="flex flex-col md:flex-row items-start md:items-center justify-between border-b py-8 gap-6">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-500 mb-1">{item.title}</h3>
              <h2 className="text-xl font-semibold mb-1">{item.subtitle}</h2>
              <p className="text-gray-600 mb-3">{item.description}</p>
              <button className="bg-gray-100 px-4 py-1 rounded-full text-sm font-semibold mb-4">Donate</button>
              <div className="flex gap-2 flex-wrap items-center">
                {["100", "500", "1000", "Other"].map((amt) => (
                  <div key={amt} className="relative">
                    <button
                      onClick={() => handleAmountSelect(item.key, amt)}
                      className={`px-4 py-1 rounded-full font-semibold border ${
                        selectedAmount[item.key] === amt || (amt === "Other" && !["100", "500", "1000"].includes(selectedAmount[item.key]))
                          ? "bg-[#00C4B4] text-white"
                          : "bg-gray-100 text-black"
                      }`}
                    >
                      ₹{amt}
                    </button>

                    {amt === "Other" && selectedAmount[item.key] !== "" && !["100", "500", "1000"].includes(selectedAmount[item.key]) && (
                      <input
                        type="number"
                        placeholder="Enter amount"
                        className="mt-2 ml-2 p-2 border rounded-md w-32 text-sm"
                        value={selectedAmount[item.key]}
                        onChange={(e) =>
                          setSelectedAmount((prev) => ({
                            ...prev,
                            [item.key]: e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 w-full md:w-56">
              <Image
                src={item.image}
                alt={item.title}
                width={250}
                height={150}
                className="rounded-lg object-cover w-full h-auto"
              />
            </div>
          </div>
        ))}

        {/* Total Donation Summary */}
        <div className="mt-16 max-w-xl mx-auto text-center bg-[#e9fdfc] border border-[#00C4B4] rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Total Donation</h2>
          <p className="text-3xl font-extrabold text-[#00C4B4]">₹{calculateTotal()}</p>
          <p className="italic text-sm text-[#333333] mt-4">
            "Your contribution brings warmth, hope, and healing to countless voiceless lives." 💖
          </p>
        </div>

        {/* Secure Payment */}
        <div className="mt-10 bg-[#f8f9fa] rounded-xl shadow-lg p-8 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Secure Payment</h2>

          <div className="grid gap-5">
            <input
              type="text"
              placeholder="Card Number"
              className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"
            />
            <div className="grid grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Expiry Date (MM/YY)"
                className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"
              />
              <input
                type="password"
                placeholder="CVV"
                className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"
              />
            </div>
            <input
              type="text"
              placeholder="Name on Card"
              className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"
            />

            {/* Trust icons */}
            <div className="flex justify-center gap-6 my-4 text-gray-500 text-xl">
              <span>🔒</span>
              <span>✅</span>
              <span>💳</span>
            </div>

            <button className="bg-[#00C4B4] hover:bg-[#00a89d] text-white font-semibold px-8 py-3 rounded-full text-lg transition">
              Donate Now
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
