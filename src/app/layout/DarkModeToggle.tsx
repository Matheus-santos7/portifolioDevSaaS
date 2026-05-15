"use client";

import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";

import { cn } from "@/app/core/utils/utils";

type DarkModeToggleProps = {
  className?: string;
};

export function DarkModeToggle({ className }: DarkModeToggleProps) {
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to false

  useEffect(() => {
    // Only runs client-side
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(storedTheme === 'dark' || (!storedTheme && prefersDark));
  }, []); // Empty dependency array to run once on mount

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <button
      type="button"
      onClick={() => setIsDarkMode(!isDarkMode)}
      aria-label={isDarkMode ? "Ativar tema claro" : "Ativar tema escuro"}
      className={cn(
        "flex items-center justify-center rounded-full bg-gray-200 p-2 dark:bg-gray-700",
        className,
      )}
    >
      {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-400" />}
    </button>
  );
}