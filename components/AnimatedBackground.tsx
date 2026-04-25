"use client";

import { useMemo } from "react";
import type { HeroSettings } from "@/types";

interface Props {
  hero: HeroSettings;
  /** Override to render a static version (e.g. for admin preview) */
  static?: boolean;
}

// ── Noise SVG (tiny, inline — no network request) ─────────────────────────────
const NOISE_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
  <filter id='n'>
    <feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/>
    <feColorMatrix type='saturate' values='0'/>
  </filter>
  <rect width='200' height='200' filter='url(#n)' opacity='0.08'/>
</svg>`;

const NOISE_URL = `data:image/svg+xml;base64,${
  typeof btoa !== "undefined" ? btoa(NOISE_SVG) : ""
}`;

// ── Speed → CSS duration map ──────────────────────────────────────────────────
const SPEED_MAP = {
  slow:   { gradient: "18s", glow: "9s",  glow2: "12s", float: "26s", float2: "30s" },
  medium: { gradient: "12s", glow: "7s",  glow2: "9s",  float: "18s", float2: "22s" },
  fast:   { gradient: "7s",  glow: "4s",  glow2: "5s",  float: "11s", float2: "13s" },
};

// ── Glow opacity map ──────────────────────────────────────────────────────────
const GLOW_MAP = {
  subtle: { g1: 0.25, g2: 0.18, g3: 0.12 },
  medium: { g1: 0.42, g2: 0.30, g3: 0.20 },
  strong: { g1: 0.62, g2: 0.48, g3: 0.32 },
};

export default function AnimatedBackground({ hero, static: isStatic = false }: Props) {
  const speed = SPEED_MAP[hero.animationSpeed ?? "medium"];
  const glow  = GLOW_MAP[hero.glowIntensity  ?? "medium"];
  const c1    = hero.primaryColor   || "#060818";
  const c2    = hero.secondaryColor || "#160830";
  const c3    = "#0f1535"; // mid tone

  // Derive accent glow colour from secondary (shift hue toward blue-violet)
  const glowColor1 = hero.secondaryColor || "#3730a3";
  const glowColor2 = hero.primaryColor   || "#1e1b4b";

  const shouldAnimate = !isStatic && hero.enableAnimation !== false;

  const cssVars = useMemo<React.CSSProperties>(
    () => ({
      "--anim-duration":    speed.gradient,
      "--glow-duration":    speed.glow,
      "--glow-duration-2":  speed.glow2,
      "--float-duration":   speed.float,
      "--float-duration-2": speed.float2,
    } as React.CSSProperties),
    [speed]
  );

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      style={cssVars}
    >
      {/* ── Layer 1: Base animated gradient ─────────── */}
      <div
        className={shouldAnimate ? "absolute inset-0 anim-bg-gradient" : "absolute inset-0"}
        style={{
          background: `linear-gradient(135deg, ${c1} 0%, ${c2} 35%, ${c3} 65%, ${c1} 100%)`,
          ...(shouldAnimate ? {} : {
            background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
          }),
        }}
      />

      {/* ── Layer 2: Primary glow orb (top-right) ───── */}
      <div
        className={shouldAnimate ? "absolute anim-glow-1 pointer-events-none" : "absolute pointer-events-none"}
        style={{
          top: "5%",
          right: "8%",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background: `radial-gradient(circle at center, ${glowColor1}99 0%, ${glowColor1}44 40%, transparent 72%)`,
          opacity: glow.g1,
          filter: "blur(2px)",
        }}
      />

      {/* ── Layer 3: Secondary glow orb (bottom-left) ─ */}
      <div
        className={shouldAnimate ? "absolute anim-glow-2 pointer-events-none" : "absolute pointer-events-none"}
        style={{
          bottom: "10%",
          left: "5%",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: `radial-gradient(circle at center, ${glowColor2}88 0%, ${glowColor2}33 45%, transparent 70%)`,
          opacity: glow.g2,
          filter: "blur(4px)",
        }}
      />

      {/* ── Layer 4: Center accent orb ───────────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "40%",
          left: "45%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: `radial-gradient(circle at center, ${glowColor1}22 0%, transparent 65%)`,
          opacity: glow.g3,
          ...(shouldAnimate ? {
            animation: `glowPulse ${speed.glow} ease-in-out infinite`,
          } : {}),
        }}
      />

      {/* ── Layer 5: Subtle grid lines ───────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            `linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px)`,
            `linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)`,
          ].join(", "),
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Layer 6: Noise texture ───────────────────── */}
      <div
        className={shouldAnimate ? "absolute inset-0 anim-noise pointer-events-none" : "absolute inset-0 pointer-events-none"}
        style={{
          backgroundImage: `url("${NOISE_URL}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          opacity: 0.55,
          mixBlendMode: "overlay",
          width: "104%",
          height: "104%",
          top: "-2%",
          left: "-2%",
        }}
      />

      {/* ── Layer 7: Edge vignette ───────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 50%, ${c1}cc 100%)`,
        }}
      />
    </div>
  );
}
