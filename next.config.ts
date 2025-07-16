// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**", // ✅ This line is important
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/predict-json",
        destination: "https://dog-disease-api.onrender.com/predict-json",
      },
    ];
  },
};

export default nextConfig;
