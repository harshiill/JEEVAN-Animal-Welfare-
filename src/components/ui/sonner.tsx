"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      className="toaster group"
      style={
        {
          marginTop: "3rem",
          "--normal-bg": "rgba(31, 41, 55, 0.85)", // dark gray with opacity
          "--normal-text": "#ffffff",              // white text
          "--normal-border": "rgba(255, 255, 255, 0.2)", // subtle border
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
