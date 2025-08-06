import React from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

const people = [
  {
    id: 1,
    name: "Harshil Khandelwal",
    designation: "IIIT Jabalpur - CSE '27",
    image:
      "/Harshil.jpg",
  },
  {
    id: 2,
    name: "Devansh Singh",
    designation: "IIIT Jabalpur - CSE '27",
    image:
      "/Devansh.jpg",
  },
  {
    id: 3,
    name: "Harshit Raj",
    designation: "IIIT Jabalpur - CSE '27",
    image:
      "/Harshit.jpg",
  },
  {
    id: 4,
    name: "Krishan Veer Singh",
    designation: "IIIT Jabalpur - CSE '27",
    image:
      "/Krishna.jpeg",
  },
  {
    id: 5,
    name: "Ishwari Maske",
    designation: "IIIT Jabalpur - CSE '27",
    image:
      "/Ishwari.jpg",
  },
];

function Footer() {
  return (
    <footer className="w-full border-t bg-white mt-16 py-10 px-4">
      {/* Link Row */}
      <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 mb-8">
        <a href="#" className="hover:text-[#00C4B4] transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-[#00C4B4] transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-[#00C4B4] transition-colors">Contact Us</a>
      </div>

      {/* Tooltip Row */}
      <div className="flex justify-center mb-16 h-4 ">
        <AnimatedTooltip items={people} />
      </div>

      {/* Copyright */}
      <p className="text-center text-xs text-gray-400">
        © {new Date().getFullYear()} <span className="font-semibold text-[#00C4B4]">Jeevan</span>. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
