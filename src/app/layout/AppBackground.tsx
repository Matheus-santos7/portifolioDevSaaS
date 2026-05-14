// components/AppBackground.jsx
import React from "react";

interface AppBackgroundProps {
  isDarkMode: boolean;
  children: React.ReactNode;
}

export function AppBackground({ isDarkMode, children }: AppBackgroundProps) {
  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      style={{
        backgroundImage: isDarkMode
          ? "radial-gradient(rgba(139, 92, 246, 0.16) 2px, transparent 2px), radial-gradient(rgba(124, 58, 237, 0.12) 2px, transparent 2px)"
          : "radial-gradient(rgba(139, 92, 246, 0.12) 2px, transparent 2px), radial-gradient(rgba(124, 58, 237, 0.08) 2px, transparent 2px)",
        backgroundSize: "100px 100px",
        backgroundPosition: "0 0, 50px 50px",
      }}
    >
      {children}
    </div>
  );
}
