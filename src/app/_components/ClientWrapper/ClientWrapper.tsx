// components/ClientWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ChatBot from "@/app/_components/Chatbot/ChatBot";
import LoadingSpinner from "@/app/_components/LoadingSpinner/page"; // Make sure this file exists

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginCheckLoading, setLoginCheckLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  const pathname = usePathname();

  // 👇 Trigger spinner on route change
  useEffect(() => {
    setRouteLoading(true);
    const timeout = setTimeout(() => setRouteLoading(false), 500); // Adjust duration

    return () => clearTimeout(timeout);
  }, [pathname]);

  // 👇 Check login status
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/isLoggedIn", { credentials: "include" });
        const data = await res.json();
        if (data?.isLoggedIn) setIsLoggedIn(true);
      } catch (err) {
        console.error("Login check failed", err);
      } finally {
        setLoginCheckLoading(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <>
      {(routeLoading || loginCheckLoading) && <LoadingSpinner />}
      {children}
      {!loginCheckLoading && isLoggedIn && <ChatBot isLoggedIn={isLoggedIn} />}
    </>
  );
}
