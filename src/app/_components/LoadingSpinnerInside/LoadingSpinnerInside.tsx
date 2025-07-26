// components/LoadingSpinnerInside.tsx
import React from "react";

interface Props {
  title: string;
}

export default function LoadingSpinnerInside({ title }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#00C4B4] border-dashed rounded-full animate-spin"></div>
        <p className="text-gray-600 text-lg font-medium">Loading {title}...</p>
      </div>
    </div>
  );
}
