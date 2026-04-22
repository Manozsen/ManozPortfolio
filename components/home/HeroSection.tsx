"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { HeroSettings } from "@/types";

interface Props {
  hero: HeroSettings;
}

// ── Layout configs ────────────────────────────────────────────────────────────
const LAYOUT_CONFIG = {
  "right-hero": {
    containerClass: "flex-col md:flex-row",
    imageOrder: "order-1 md:order-2",
    textOrder: "order-2 md:order-1",
    imageAlign: "items-end justify-center md:self-stretch",
    maskImage:
      "radial-gradient(ellipse 88% 92% at 52% 38%, black 35%, rgba(0,0,0,0.6) 60%, transparent 80%)",
    leftFade: true,
    imageWidth: "w-[72vw] max-w-[320px] md:w-[44%] md:max-w-[520px]",
  },
  "left-hero": {
    containerClass: "flex-col md:flex-row-reverse",
    imageOrder: "order-1 md:order-2",
    textOrder: "order-2 md:order-1",
    imageAlign: "items-end justify-center md:self-stretch",
    maskImage:
      "radial-gradient(ellipse 88% 92% at 48% 38%, black 35%, rgba(0,0,0,0.6) 60%, transparent 80%)",
    leftFade: false,
    imageWidth: "w-[72vw] max-w-[320px] md:w-[44%] md:max-w-[520px]",
  },
  "center-blend": {
    containerClass: "flex-col items-center",
    imageOrder: "order-1",
    textOrder: "order-2",
    imageAlign: "items-center justify-center",
    maskImage:
      "radial-gradient(ellipse 80% 85% at 50% 40%, black 30%, rgba(0,0,0,0.5) 60%, transparent 80%)",
    leftFade: false,
    imageWidth: "w-[72vw] max-w-[340px] md:max-w-[420px]",
  },
  "full-overlay": {
    containerClass: "flex-col items-center justify-center",
    imageOrder: "order-1",
    textOrder: "order-2",
    imageAlign: "items-center justify-center",
    maskImage:
      "radial-gradient(ellipse 90% 95% at 50% 35%, black 25%, rgba(0,0,0,0.4) 55%, transparent 78%)",
    leftFade: false,
    imageWidth: "w-full max-w-[480px] md:max-w-[600px]",
  },
};

// ── Background builder ────────────────────────────────────────────────────────
function buildBackground(hero: HeroSettings): React.CSSProperties {
  if (hero.backgroundType === "gradient") {
    return {
      background: `linear-gradient(135deg, ${hero.primaryColor} 0%, ${hero.secondaryColor} 100%)`,
    };
  }
  if (hero.backgroundType === "color") {
    return { backgroundColor: hero.primaryColor };
  }
  // image — handled via separate layer
  return { backgroundColor: hero.primaryColor };
}

export default function HeroSection({ hero }: Props) {
  const imageSource = hero.profileImageUrl || "/profile.jpg";
  const layout = LAYOUT_CONFIG[hero.imageLayout] ?? LAYOUT_CONFIG["right-hero"];
  const bgStyle = buildBackground(hero);
  const textStyle = { color: hero.textColor || "#ffffff" };
  const bgColor = hero.primaryColor || "#060818";

  // Split title at "for" for gradient highlight
  const splitTitle = (text: string) => {
    const idx = text.toLowerCase().indexOf("for");
    if (idx === -1) return { before: text, after: "" };
    return { before: text.slice(0, idx + 3), after: text.slice(idx + 3) };
  };
  const { before, after } = splitTitle(hero.heroTitle);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={bgStyle}
    >
      {/* ── Background image layer ──────────────────── */}
      {hero.backgroundType === "image" && hero.backgroundImageUrl && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={hero.backgroundImageUrl}
              alt="Hero background"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
          <div
            className="absolute inset-0 z-0"
            style={{ backgroundColor: hero.primaryColor, opacity: 0.75 }}
          />
        </>
      )}

      {/* ── Ambient glow blobs ──────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-[15%] -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${hero.primaryColor}44 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[650px] h-[650px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${hero.secondaryColor}55 0%, transparent 65%)`,
            filter: "blur(60px)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* ── Main layout ─────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div
          className={`flex ${layout.containerClass} items-center justify-between gap-0 min-h-screen md:min-h-0 md:py-0 pt-24 pb-12`}
        >
          {/* ── Text ──────────────────────────────────── */}
          <div
            className={`flex-1 max-w-2xl text-center md:text-left z-10 ${layout.textOrder}`}
          >
            {/* Available badge */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span
                className="text-xs font-medium tracking-wide opacity-70"
                style={textStyle}
              >
                Available for new projects
              </span>
            </div>

            {/* Tagline */}
            <p
              className="text-sm font-semibold mb-3 tracking-widest uppercase font-display animate-fade-up"
              style={{ color: "#60a5fa" }}
            >
              {hero.heroTagline}
            </p>

            {/* Title */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] mb-6 font-display animate-fade-up delay-100"
              style={textStyle}
            >
              {before}
              {after && (
                <span
                  className="block"
                  style={{
                    background: "linear-gradient(135deg, #93c5fd, #c4b5fd)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {after}
                </span>
              )}
            </h1>

            {/* Subtitle */}
            <p
              className="text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto md:mx-0 animate-fade-up delay-200 opacity-75"
              style={textStyle}
            >
              {hero.heroSubtitle}
            </p>

            {/* Audience pills */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-10 animate-fade-up delay-300">
              {["Online Creators", "Local Businesses", "Instagram Sellers"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.06]"
                    style={{ color: hero.textColor || "#ffffff" }}
                  >
                    {tag}
                  </span>
                )
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start animate-fade-up delay-400">
              <Link
                href="/request-demo"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/25 text-sm min-h-[44px]"
              >
                See Free Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/916296622391?text=${encodeURIComponent(
                  "Hi Manoz! I saw your portfolio and I'd like to discuss my project."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 hover:border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-150 hover:-translate-y-0.5 text-sm min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                WhatsApp
              </a>
            </div>

            {/* Trust text */}
            <p
              className="text-xs mt-6 animate-fade-up delay-500 opacity-40"
              style={textStyle}
            >
              Free demo · No credit card · Response within 24 hrs
            </p>

            {/* Stats */}
            <div className="flex gap-8 mt-10 justify-center md:justify-start animate-fade-up delay-500">
              {[
                { value: "50+", label: "Projects delivered" },
                { value: "100%", label: "Client satisfaction" },
                { value: "24hr", label: "Response time" },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    className="text-xl font-extrabold font-display"
                    style={textStyle}
                  >
                    {s.value}
                  </p>
                  <p
                    className="text-xs mt-0.5 opacity-50"
                    style={textStyle}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Blended portrait ────────────────────── */}
          <div
            className={`relative flex-shrink-0 flex ${layout.imageAlign} ${layout.imageWidth} ${layout.imageOrder}`}
            style={
              hero.imageLayout === "right-hero" ||
              hero.imageLayout === "left-hero"
                ? { alignSelf: "stretch" }
                : {}
            }
          >
            {/* Glow behind face */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 75% 85% at 52% 45%, ${hero.secondaryColor}55 0%, transparent 68%)`,
              }}
            />

            {/* Portrait */}
            <div
              className="relative w-full hero-image-container"
              style={
                hero.imageLayout === "center-blend" ||
                hero.imageLayout === "full-overlay"
                  ? { aspectRatio: "3/4", maxHeight: "70vh" }
                  : { aspectRatio: "3/4", maxHeight: "85vh" }
              }
            >
              <Image
                src={imageSource}
                alt="Manoj Sen — Web Developer"
                fill
                sizes="(max-width: 768px) 72vw, 44vw"
                className="object-cover object-top select-none"
                priority
                draggable={false}
                style={{
                  maskImage: layout.maskImage,
                  WebkitMaskImage: layout.maskImage,
                  opacity: 0.92,
                }}
              />

              {/* Bottom fade into bg */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom, transparent 45%, ${bgColor} 92%)`,
                }}
              />

              {/* Left edge fade — only for right-hero */}
              {layout.leftFade && (
                <div
                  className="absolute inset-0 pointer-events-none hidden md:block"
                  style={{
                    background: `linear-gradient(to right, ${bgColor} 0%, transparent 28%)`,
                  }}
                />
              )}

              {/* Right edge fade — only for left-hero */}
              {hero.imageLayout === "left-hero" && (
                <div
                  className="absolute inset-0 pointer-events-none hidden md:block"
                  style={{
                    background: `linear-gradient(to left, ${bgColor} 0%, transparent 28%)`,
                  }}
                />
              )}

              {/* Top fade */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom, ${bgColor} 0%, transparent 18%)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2">
        <span
          className="text-[10px] tracking-[0.2em] uppercase opacity-30"
          style={textStyle}
        >
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
