/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Script from "next/script";

import { useEffect } from "react";


declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function DonatePage() {

  useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
}, []);

  const [selectedAmount, setSelectedAmount] = useState<{ [key: string]: string }>({
    food: "",
    shelter: "",
    transport: "",
  });

  const [loading, setLoading] = useState(false);

  const handleAmountSelect = (type: string, amount: string) => {
    setSelectedAmount((prev) => ({ ...prev, [type]: amount }));
  };

  const calculateTotal = () => {
    return ["food", "shelter", "transport"]
      .map((key) => parseInt(selectedAmount[key]) || 0)
      .reduce((sum, val) => sum + val, 0);
  };

  const handlePayment = async () => {
  if (loading) return;
  setLoading(true);

  const totalAmount = calculateTotal();

  if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
    alert("Please enter a valid donation amount.");
    setLoading(false);
    return;
  }

  try {
    // Step 1: Parallel fetch for session and payment order
    const [sessionRes, razorpayRes] = await Promise.all([
      fetch("/api/isLoggedIn").then((res) => res.json()),
      fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      }).then((res) => res.json()),
    ]);

    const id = sessionRes?.id;
    if (!id) {
      alert("Please log in to make a donation.");
      setLoading(false);
      return;
    }

    // Step 2: Get user details (dependent on ID)
    const user = await fetch(`/api/getUserById?id=${id}`).then((res) => res.json());
    if (!user) {
      alert("User not found. Please log in again.");
      setLoading(false);
      return;
    }

    // Step 3: Configure Razorpay
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      amount: razorpayRes.amount,
      currency: razorpayRes.currency,
      name: "Jeevan Animal Rescue",
      description: "Donation Payment",
      image: "/logo.png",
      order_id: razorpayRes.id,
      handler: async function (response: any) {
        try {
          const donorData = {
            userId: user._id,
            name: user.name,
            email: user.email,
            amount: totalAmount,
            paymentId: response.razorpay_payment_id,
            donationDate: new Date(),
            donationBreakdown: selectedAmount,
          };

          await fetch("/api/record-donation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(donorData),
          });

          alert("Payment Successful! Thank you for your donation.");
        } catch (error) {
          console.error("Error recording donation:", error);
          alert("Payment succeeded, but failed to record donation.");
        }
      },
      prefill: {
        name: user.name || "Donor Name",
        email: user.email || "",
      },
      theme: { color: "#00C4B4" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Payment initiation failed:", error);
    alert("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <main className="min-h-screen bg-white text-[#000000] font-sans">
        {/* Navbar */}
        <header className="flex justify-between items-center px-8 py-5 border-b">
          <div className="text-xl font-bold flex items-center gap-2">
            <span className="text-lg">🐾</span> Jeevan
          </div>
          <nav className="flex gap-6 items-center text-base font-medium">
            <Link href="#">Home</Link>
            <Link href="#">About Us</Link>
            <Link href="/rescuetask">Rescue task</Link>
            <Link href="/reportdanger">Report Danger</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/login" className="text-[#00C4B4] hover:underline">Login</Link>
            <Link href="/signup" className="text-[#00C4B4] hover:underline">Signup</Link>
            <Link href="/donation">
              <button className="bg-[#00C4B4] hover:bg-[#00a89d] text-white font-medium px-5 py-2 rounded-full">
                Donate
              </button>
            </Link>
            <button className="bg-[#00C4B4] hover:bg-[#00a89d] text-white font-medium px-5 py-2 rounded-full">
              Volunteer
            </button>
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
                <div className="flex gap-2 flex-wrap items-center">
                  {["100", "500", "1000", "Other"].map((amt) => (
                    <div key={amt} className="relative">
                      <button
                        onClick={() => handleAmountSelect(item.key, amt)}
                        className={`px-4 py-1 rounded-full font-semibold border ${
                          selectedAmount[item.key] === amt ||
                          (amt === "Other" &&
                            !["100", "500", "1000"].includes(selectedAmount[item.key]))
                            ? "bg-[#00C4B4] text-white"
                            : "bg-gray-100 text-black"
                        }`}
                      >
                        ₹{amt}
                      </button>

                      {amt === "Other" &&
                        selectedAmount[item.key] !== "" &&
                        !["100", "500", "1000"].includes(selectedAmount[item.key]) && (
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

          {/* Total Summary */}
          <div className="mt-16 max-w-xl mx-auto text-center bg-[#e9fdfc] border border-[#00C4B4] rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Total Donation</h2>
            <p className="text-3xl font-extrabold text-[#00C4B4]">₹{calculateTotal()}</p>
            <p className="italic text-sm text-[#333333] mt-4">
              "Your contribution brings warmth, hope, and healing to countless voiceless lives." 💖
            </p>
          </div>

          {/* Donate Button */}
          <div className="mt-10 text-center">
            <button
              onClick={handlePayment}
              disabled={loading}
              className={`bg-[#00C4B4] hover:bg-[#00a89d] text-white font-semibold px-8 py-3 rounded-full text-lg transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : "Donate Now"}
            </button>
          </div>
        </section>
      </main>
      

    </>
  );
}
