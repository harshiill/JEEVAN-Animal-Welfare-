"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { useCallback, useState } from "react";
import { Menu, X } from "lucide-react";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data, isLoading } = useSWR("/api/isLoggedIn", fetcher);
  const isLoggedIn = data?.isLoggedIn;
  const userName = data?.name;

  const handleLogout = useCallback(async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/login");
      } else {
        console.error("Logout failed.");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  }, [router]);

  const navLinkClass = (href: string) =>
    pathname === href
      ? "text-emerald-600 font-semibold underline underline-offset-4"
      : "text-gray-700 hover:text-emerald-600 transition";

  const links = [
    { href: "/Model", label: "Predict" },
    { href: "/Vet", label: "Nearby Vet" },
    { href: "/gallery", label: "Gallery" },
    { href: "/rescuetask", label: "Rescue Task" },
    { href: "/reportdanger", label: "Report Danger" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/forum", label: "Forum" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm px-4 md:px-10 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xl font-bold">
        <span className="text-2xl">🐾</span> Jeevan
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link href="/" className={navLinkClass("/")}>Home</Link>

        {!isLoading && isLoggedIn ? (
          <>
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className={navLinkClass(href)}>
                {label}
              </Link>
            ))}
            <Link href="/donation">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full font-medium">
                Donate
              </button>
            </Link>
            <Link href="/profile" className="ml-2">
              {userName && (
                <span className="text-emerald-600 font-semibold">
                  Hi, {userName}
                </span>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline ml-4"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={navLinkClass("/login")}>Login</Link>
            <Link href="/signup" className={navLinkClass("/signup")}>Signup</Link>
          </>
        )}
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-600"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle Menu"
      >
        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg z-40 flex flex-col gap-4 p-6 md:hidden transition-all">
          <Link href="/" className={navLinkClass("/")}>Home</Link>

          {!isLoading && isLoggedIn ? (
            <>
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={navLinkClass(href)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <Link href="/donation">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full w-full mt-2">
                  Donate
                </button>
              </Link>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-emerald-600 font-semibold">
                  Hi, {userName}
                </span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-red-500 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={navLinkClass("/login")}>Login</Link>
              <Link href="/signup" className={navLinkClass("/signup")}>Signup</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
