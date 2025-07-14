"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // ✅ for active link check

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch("/api/isLoggedIn", {
          credentials: "include",
        });

        const data = await res.json();

        if (data.isLoggedIn) {
          setIsLoggedIn(true);
          setUserName(data.name || null);
        } else {
          setIsLoggedIn(false);
          setUserName(null);
        }
      } catch (error) {
        console.error("Login check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        setIsLoggedIn(false);
        setUserName(null);
        router.push("/login");
      } else {
        console.error("Logout failed.");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navLinkClass = (href: string) =>
    pathname === href
      ? "text-[#00C4B4] font-semibold underline underline-offset-4"
      : "text-gray-600 hover:text-[#00C4B4]";

  return (
    <header className="flex justify-between items-center px-8 py-5 mb-6">
      <div className="text-xl font-bold flex items-center gap-2">
        <span className="text-lg">🐾</span> Jeevan
      </div>

      <nav className="flex gap-6 items-center text-base font-medium">
        <Link href="#" className={navLinkClass("#")}>
          About Us
        </Link>

        {loading ? null : isLoggedIn ? (
          <>
            <Link href="/rescuetask" className={navLinkClass("/rescuetask")}>
              Rescue task
            </Link>
            <Link href="/reportdanger" className={navLinkClass("/reportdanger")}>
              Report Danger
            </Link>
            <Link href="/dashboard" className={navLinkClass("/dashboard")}>
              Dashboard
            </Link>
            <Link href="/donation">
              <button className="bg-[#00C4B4] hover:bg-[#00a89d] text-white font-medium px-5 py-2 rounded-full">
                Donate
              </button>
            </Link>
            <button className="bg-[#00C4B4] hover:bg-[#00a89d] text-white font-medium px-5 py-2 rounded-full">
              Volunteer
            </button>
            {userName && (
              <span className="text-[#00C4B4] font-semibold ml-2">
                Hi! {userName}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-red-500 font-medium ml-4 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={navLinkClass("/login")}>
              Login
            </Link>
            <Link href="/signup" className={navLinkClass("/signup")}>
              Signup
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
