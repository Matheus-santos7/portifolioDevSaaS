"use client";

import { Layers } from "lucide-react";
import { useState } from "react";

type TechnologyIconProps = {
  name: string;
  svgUrl?: string | null;
  size?: number;
  className?: string;
};

export function TechnologyIcon({
  name,
  svgUrl,
  size = 44,
  className = "",
}: TechnologyIconProps) {
  const [broken, setBroken] = useState(false);
  const initials =
    name.trim().length <= 2 ? name.trim().toUpperCase() : name.trim().slice(0, 2).toUpperCase();

  if (!svgUrl || broken) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-xs font-bold text-gray-600 ring-1 ring-gray-200 dark:from-gray-700 dark:to-gray-800 dark:text-gray-200 dark:ring-gray-600 ${className}`}
        style={{ width: size, height: size }}
        aria-hidden
      >
        {initials || <Layers className="h-5 w-5 opacity-60" aria-hidden />}
      </div>
    );
  }

  return (
    // SVGs podem ser locais ou remotos dinâmicos; <img> evita restrições do next/image aqui.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={svgUrl}
      alt=""
      width={size}
      height={size}
      className={`shrink-0 object-contain dark:brightness-[1.05] ${className}`}
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
    />
  );
}
