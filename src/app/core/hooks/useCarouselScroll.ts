"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseCarouselScrollOptions = {
  itemsLength: number;
};

function getScrollStep() {
  if (typeof window === "undefined") return 316;
  if (window.innerWidth >= 1280) return 396;
  if (window.innerWidth >= 1024) return 376;
  if (window.innerWidth >= 640) return 356;
  return 316;
}

export function useCarouselScroll({ itemsLength }: UseCarouselScrollOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const updateNavigationState = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const currentScroll = container.scrollLeft;
    const tolerance = 2;
    const overflowing = maxScrollLeft > tolerance;

    setCanScrollLeft(currentScroll > tolerance);
    setCanScrollRight(currentScroll < maxScrollLeft - tolerance);
    setIsOverflowing(overflowing);

    const step = getScrollStep();
    const nextIndex = Math.round(currentScroll / step);
    setActiveIndex(Math.min(Math.max(nextIndex, 0), Math.max(0, itemsLength - 1)));
  }, [itemsLength]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateNavigationState();
    container.addEventListener("scroll", updateNavigationState, { passive: true });
    window.addEventListener("resize", updateNavigationState);

    return () => {
      container.removeEventListener("scroll", updateNavigationState);
      window.removeEventListener("resize", updateNavigationState);
    };
  }, [updateNavigationState]);

  const handleScroll = useCallback((direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const offset = getScrollStep();
    container.scrollBy({
      left: direction === "right" ? offset : -offset,
      behavior: "smooth",
    });
  }, []);

  return {
    activeIndex,
    canScrollLeft,
    canScrollRight,
    containerRef,
    handleScroll,
    isOverflowing,
  };
}
