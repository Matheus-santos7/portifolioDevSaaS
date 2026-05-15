"use client";

import { ReactNode, useEffect } from "react";

interface ScrollRevealWrapperProps {
  children: ReactNode;
  className: string;
  options?: {
    distance?: string;
    duration?: number;
    easing?: string;
    origin?: string;
    delay?: number;
    reset?: boolean;
    [key: string]: unknown;
  };
}

export default function ScrollRevealWrapper({
  children,
  className,
  options = {},
}: ScrollRevealWrapperProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("scrollreveal").then((ScrollRevealModule) => {
        const sr = ScrollRevealModule.default ? ScrollRevealModule.default : ScrollRevealModule;
        if (typeof sr.reveal === "function") {
          sr.reveal(`.${className}`, {
            distance: "50px",
            duration: 1000,
            easing: "ease-out",
            origin: "bottom",
            delay: 500,
            reset: true,
            ...options,
          });
        }
      });
    }
  }, [className, options]);

  return <div className={className}>{children}</div>;
}
