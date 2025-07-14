/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import axios from "axios";
import { signInSchema } from "@/Schemas/LogInSchema";
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
    
     const result = signInSchema.safeParse(form);
      if (!result.success) {
        setError(result.error.errors[0]?.message || "Validation failed.");
        setIsLoading(false);
        return;
      }

      const res = await axios.post("/api/login", {
        ...form,
      });

      alert("Logged In successfully!");
      router.push("/");
      
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
          <a href="#">About Us</a>
          <a href="/rescuetask">Rescue task</a>
          <a href="/reportdanger">Report Danger</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/login" className="text-[#00C4B4] hover:underline">Login</a>
          <a href="/signup" className="text-[#00C4B4] hover:underline">Signup</a>
          <a href="/donation">
          <button className="bg-[#00C4B4] hover:bg-[#00a89d] text-white font-medium px-5 py-2 rounded-full">
          Donate
          </button>
          </a>

          <button className="bg-[#00C4B4] hover:bg-[#00a89d] text-white font-medium px-5 py-2 rounded-full">
            Volunteer
          </button>
        </nav>
      </header>

      {/* Login Form */}
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-white px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-[#f8f9fa] shadow-lg rounded-2xl p-8 border border-gray-200"
        >
          <h2 className="text-3xl font-semibold text-[#00C4B4] text-center mb-6">Login Your Account</h2>

          <div className="space-y-4">
           
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"
              required 
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"
              required 
            />

            <button
              type="submit"
              className="w-full bg-[#00C4B4] hover:bg-[#00a89d] text-white font-semibold py-2 rounded-md transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}

            </button>

            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

            <p className="text-center text-sm text-gray-600 mt-4">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#00C4B4] hover:underline font-medium">
  Sign-up here
</Link>

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

