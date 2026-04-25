"use client";

import { useEffect, useRef } from "react";
import { attachCardTilt, shouldEnable3D } from "@/lib/3d-effects";
import type { Intensity } from "@/lib/3d-effects";

interface Props {
  children: React.ReactNode;
  className?: string;
  intensity?: Intensity;
  disabled?: boolean;
}

/**
 * Drop-in wrapper that adds a 3D tilt hover effect to any card.
 * Degrades gracefully on mobile and reduced-motion.
 */
export default function Card3D({
  children,
  className = "",
  intensity = "medium",
  disabled = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || !ref.current || !shouldEnable3D()) return;
    const cleanup = attachCardTilt(ref.current, intensity);
    return cleanup;
  }, [intensity, disabled]);

  return (
    <div ref={ref} className={`card-3d ${className}`}>
      {children}
    </div>
  );
}
