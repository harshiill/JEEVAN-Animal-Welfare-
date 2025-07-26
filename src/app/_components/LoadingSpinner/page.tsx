// components/LoadingSpinner.tsx
import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex space-x-2">
        <div className="w-5 h-5 bg-[#51e3d9] rounded-full animate-bounce delay-0 shadow-md" />
        <div className="w-5 h-5 bg-[#02322f] rounded-full animate-bounce delay-150 shadow-md" />
        <div className="w-5 h-5 bg-[#a3cac8] rounded-full animate-bounce delay-300 shadow-md" />
      </div>
      <p className="mt-4 text-blue-400 font-semibold text-lg animate-pulse">Loading...</p>
    </div>
  );
}
