// components/ClientWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import ChatBot from "@/app/_components/Chatbot/ChatBot";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/isLoggedIn", { credentials: "include" });
        const data = await res.json();
        if (data?.isLoggedIn) setIsLoggedIn(true);
      } catch (err) {
        console.error("Login check failed", err);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <>
      {children}
      {!loading && isLoggedIn && <ChatBot isLoggedIn={isLoggedIn} />}
    </>
  );
}
