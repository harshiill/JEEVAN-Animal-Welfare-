"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <span className="text-emerald-600 font-semibold">
            Profile
          </span>
        </Link>
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
              Profile
            </span>
          </Link>
        </div>
      )}
    </header>
  );
}
