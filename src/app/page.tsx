/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ChatBot from '@/app/_components/Chatbot/ChatBot';
import Navbar from "./_components/Navbar/Navbar";
import { ImagesSlider } from "@/components/ui/images-slider";
import Footer from "./_components/Footer/Footer";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/isLoggedIn", { credentials: "include" });
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

  const handleGetStarted = () => router.push(isLoggedIn ? "/Model" : "/login");
  const handleVolunteer = () => router.push(isLoggedIn ? "/reportdanger" : "/login");
  const handleFeatureClick = (href: string) => router.push(isLoggedIn ? href : "/login");

  const images = ["/Dog1.jpg", "/Dog2.jpg", "/Dog3.jpg", "/Dog4.jpg", "/Dog5.jpg"];

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[500px] max-w-7xl mx-auto mt-6 rounded-3xl overflow-hidden shadow-lg">
        <ImagesSlider className="h-[40rem]" images={images}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="z-[50] flex flex-col justify-center items-center text-center px-4"
          >
            <motion.h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-md">
              Jeevan: Every Life Matters
            </motion.h1>
            <p className="mt-4 text-lg md:text-xl text-white max-w-2xl">
  Empowering people to rescue, report, and recover animals in distress.
</p>
            <button
  className="mt-6 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition duration-200 shadow-md z-[60]"
  onClick={handleGetStarted}
>
  Get Started →
</button>
          </motion.div>
        </ImagesSlider>
      </section>

      {/* Mission Section */}
      <section className="text-center my-20 max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold mb-4">Our Mission</h2>
        <p className="text-gray-700 text-base leading-relaxed">
          We believe every animal deserves care, compassion, and a chance. Jeevan connects
          volunteers, vets, and compassionate citizens to make rescue and recovery more
          efficient through technology and community.
        </p>
      </section>

      {/* Feature Highlights */}
      <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 mb-24">
        {[
          {
            title: "Report Incidents",
            desc: "Capture and report injured or stray animals instantly with our mobile-friendly interface.",
            icon: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/exclamation-triangle.svg",
            href: "/reportdanger",
          },
          {
            title: "AI Diagnosis",
            desc: "Upload images for AI-powered disease predictions to speed up treatment decisions.",
            icon: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/microscope.svg",
            href: "/Model",
          },
          {
            title: "Nearby Vets",
            desc: "Automatically find nearby veterinary clinics to seek immediate help.",
            icon: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/hospital.svg",
            href: "/Vet",
          },
        ].map((f, i) => (
          <div
            key={i}
            onClick={() => handleFeatureClick(f.href)}
            className="cursor-pointer bg-gray-100 hover:bg-white transition-colors p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-200 text-center"
          >
            <img src={f.icon} alt={f.title} className="w-10 h-10 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section className="bg-emerald-500 py-14 text-center text-white px-4">
        <h3 className="text-2xl font-bold mb-2">Join the Mission</h3>
        <p className="mb-6 text-base max-w-xl mx-auto">
          Whether you&#39;re a vet, volunteer, or a kind-hearted human — you can make a difference.
        </p>
        <button
          onClick={handleVolunteer}
          className="bg-white text-emerald-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Become a Volunteer
        </button>
      </section>

      {/* Chatbot */}
      {isLoggedIn && !loading && <ChatBot isLoggedIn={isLoggedIn} />}

      {/* Footer */}
      <Footer />
    </main>
  );
}
