/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./_components/Navbar/Navbar";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/isLoggedIn", {
          credentials: "include",
        });
        const data = await res.json();
        if (data?.isLoggedIn) setIsLoggedIn(true);
      } catch (err) {
        console.error("Login check failed", err);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const handleGetStarted = () => {
    router.push(isLoggedIn ? "/Model" : "/login");
  };

  const handleVolunteer = () => {
    router.push(isLoggedIn ? "/reportdanger" : "/login");
  };

  return (
    <main className="min-h-screen bg-white text-[#000000] font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[500px] max-w-6xl mx-auto mt-6 rounded-xl overflow-hidden">
        <Image
  src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1600&q=80"
  alt="Hero"
  fill
  className="object-cover object-center rounded-xl"
  priority
/>

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-6">
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
              Jeevan: Every Life Matters
            </h1>
            <p className="text-lg md:text-xl mb-6 drop-shadow-sm">
              Empowering people to rescue, report, and recover animals in distress.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="bg-[#00C4B4] text-white px-6 py-3 rounded-full font-medium hover:bg-[#00b3a5]"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="text-center my-20 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-700 text-base leading-relaxed">
          We believe every animal deserves care, compassion, and a chance. Jeevan connects
          volunteers, vets, and compassionate citizens to make rescue and recovery more
          efficient through technology and community.
        </p>
      </section>

      {/* Feature Highlights */}
      <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 mb-20">
        {[
          {
            title: "Report Incidents",
            desc: "Capture and report injured or stray animals instantly with our mobile-friendly interface.",
            icon: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/exclamation-triangle.svg"
          },
          {
            title: "AI Diagnosis",
            desc: "Upload images for AI-powered disease predictions to speed up treatment decisions.",
            icon: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/microscope.svg"
          },
          {
            title: "Nearby Vets",
            desc: "Automatically find nearby veterinary clinics to seek immediate help.",
            icon: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/hospital.svg"
          }
        ].map((f, i) => (
          <div key={i} className="bg-[#f9f9f9] rounded-xl p-6 text-center shadow-sm">
            <img
              src={f.icon}
              alt={f.title}
              width={40}
              height={40}
              className="mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section className="bg-[#00C4B4] py-12 text-center text-white">
        <h3 className="text-2xl font-bold mb-3">Join the Mission</h3>
        <p className="mb-6 text-sm md:text-base">
          Whether you&#39;re a vet, volunteer, or a kind-hearted human — you can make a
          difference.
        </p>
        <button
          onClick={handleVolunteer}
          className="bg-white text-[#00C4B4] px-6 py-3 rounded-full font-semibold hover:bg-gray-100"
        >
          Become a Volunteer
        </button>
      </section>

      {/* Footer */}
      <footer className="text-sm text-gray-500 text-center py-6 mt-10">
        <div className="flex justify-center gap-6 mb-3">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
        <p>© 2024 Jeevan. All rights reserved.</p>
      </footer>
    </main>
  );
}
