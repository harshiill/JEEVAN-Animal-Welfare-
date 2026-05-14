// components/ClientWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ChatBot from "@/app/_components/Chatbot/ChatBot";
import LoadingSpinner from "@/app/_components/LoadingSpinner/page"; // Make sure this file exists

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [routeLoading, setRouteLoading] = useState(false);

  const pathname = usePathname();

  // 👇 Trigger spinner on route change
  useEffect(() => {
    setRouteLoading(true);
    const timeout = setTimeout(() => setRouteLoading(false), 500); // Adjust duration

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {routeLoading && <LoadingSpinner />}
      {children}
      <ChatBot isLoggedIn={true} />
    </>
  );
}
