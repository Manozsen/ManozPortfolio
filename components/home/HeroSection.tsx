"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { HeroSettings } from "@/types";

interface Props {
  hero: HeroSettings;
}

// ── Size map px values ────────────────────────────────────────────────────────
const SIZE_PX: Record<HeroSettings["imageSize"], number> = {
  small: 220,
  medium: 320,
  large: 460,
};

// ── Shape → CSS border-radius ─────────────────────────────────────────────────
const SHAPE_RADIUS: Record<HeroSettings["imageShape"], string> = {
  none: "0px",
  circle: "9999px",
  square: "0px",
  rounded: "24px",
};

// ── Blended mask (used when imageShape === "none") ────────────────────────────
const BLEND_MASK =
  "radial-gradient(ellipse 85% 90% at 50% 35%, black 30%, rgba(0,0,0,0.6) 58%, transparent 78%)";

function buildBg(hero: HeroSettings): React.CSSProperties {
  if (hero.backgroundType === "gradient") {
    return {
      background: `linear-gradient(135deg, ${hero.primaryColor} 0%, ${hero.secondaryColor} 100%)`,
    };
  }
  return { backgroundColor: hero.primaryColor };
}

export default function HeroSection({ hero }: Props) {
  const imageSource = hero.profileImageUrl || "/profile.jpg";
  const bgStyle = buildBg(hero);
  const bgColor = hero.primaryColor || "#060818";
  const textStyle = { color: hero.textColor || "#ffffff" };
  const sizePx = SIZE_PX[hero.imageSize ?? "medium"];
  const isBlended = hero.imageShape === "none";
  const showImage = hero.imageVisible !== false && hero.imageLayout !== "hidden";

  // Flex layout direction based on imageLayout
  const containerDir: Record<HeroSettings["imageLayout"], string> = {
    right: "flex-col md:flex-row",
    left: "flex-col md:flex-row-reverse",
    center: "flex-col items-center",
    hidden: "flex-col",
  };

  const textAlign =
    hero.imageLayout === "center" ? "text-center" : "text-center md:text-left";

  const flexJustify =
    hero.imageLayout === "center" ? "justify-center" : "justify-center md:justify-start";

  // Split title at "for" for gradient accent
  const splitTitle = (text: string) => {
    const idx = text.toLowerCase().indexOf("for");
    if (idx === -1) return { before: text, after: "" };
    return { before: text.slice(0, idx + 3), after: text.slice(idx + 3) };
  };
  const { before, after } = splitTitle(hero.heroTitle || "");

  const isSideLayout =
    hero.imageLayout === "right" || hero.imageLayout === "left";

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={bgStyle}
    >
      {/* Background image layer */}
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

      {/* Ambient glow + grid */}
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
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div
          className={`flex ${containerDir[hero.imageLayout ?? "right"]} items-center justify-between gap-8 min-h-screen md:min-h-0 md:py-0 pt-24 pb-12`}
        >
          {/* ── Text block ──────────────────────────────── */}
          <div
            className={`flex-1 max-w-2xl ${textAlign} z-10 order-2 ${
              hero.imageLayout === "left" ? "md:order-2" : "md:order-1"
            }`}
          >
            {/* Available badge */}
            <div className={`inline-flex items-center gap-2 mb-6 ${flexJustify}`}>
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
            {hero.heroTagline && (
              <p
                className="text-sm font-semibold mb-3 tracking-widest uppercase font-display"
                style={{ color: "#60a5fa" }}
              >
                {hero.heroTagline}
              </p>
            )}

            {/* Title */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] mb-6 font-display"
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
            {hero.heroSubtitle && (
              <p
                className={`text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto opacity-75 ${
                  hero.imageLayout === "center" ? "mx-auto" : "md:mx-0"
                }`}
                style={textStyle}
              >
                {hero.heroSubtitle}
              </p>
            )}

            {/* Audience pills */}
            <div className={`flex flex-wrap gap-2 mb-10 ${flexJustify}`}>
              {["Online Creators", "Local Businesses", "Instagram Sellers"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.06]"
                    style={textStyle}
                  >
                    {tag}
                  </span>
                )
              )}
            </div>

            {/* CTAs */}
            <div className={`flex flex-col sm:flex-row gap-3 ${flexJustify}`}>
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

            <p className="text-xs mt-6 opacity-40" style={textStyle}>
              Free demo · No credit card · Response within 24 hrs
            </p>

            {/* Stats */}
            <div className={`flex gap-8 mt-10 ${flexJustify}`}>
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
                  <p className="text-xs mt-0.5 opacity-50" style={textStyle}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Portrait ────────────────────────────────── */}
          {showImage && (
            <div
              className={`relative flex-shrink-0 flex items-center justify-center order-1 ${
                hero.imageLayout === "left" ? "md:order-1" : "md:order-2"
              }`}
              style={{
                width: `min(${sizePx}px, 80vw)`,
                alignSelf: isSideLayout ? "stretch" : "auto",
              }}
            >
              {/* Glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 75% 85% at 50% 45%, ${hero.secondaryColor}55 0%, transparent 68%)`,
                }}
              />

              {isBlended ? (
                /* ── Blended / no-shape portrait ──────── */
                <div
                  className="relative w-full"
                  style={{
                    aspectRatio: "3/4",
                    maxHeight: isSideLayout ? "85vh" : "60vh",
                  }}
                >
                  <Image
                    src={imageSource}
                    alt="Manoj Sen — Web Developer"
                    fill
                    sizes={`(max-width: 768px) 80vw, ${sizePx}px`}
                    className="object-cover object-top select-none"
                    priority
                    draggable={false}
                    style={{
                      maskImage: BLEND_MASK,
                      WebkitMaskImage: BLEND_MASK,
                      opacity: hero.imageOpacity ?? 1,
                    }}
                  />
                  {/* Top fade */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(to bottom, ${bgColor} 0%, transparent 18%)`,
                    }}
                  />
                  {/* Bottom fade */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(to bottom, transparent 45%, ${bgColor} 92%)`,
                    }}
                  />
                  {/* Left edge fade for right-layout */}
                  {hero.imageLayout === "right" && (
                    <div
                      className="absolute inset-0 pointer-events-none hidden md:block"
                      style={{
                        background: `linear-gradient(to right, ${bgColor} 0%, transparent 28%)`,
                      }}
                    />
                  )}
                  {/* Right edge fade for left-layout */}
                  {hero.imageLayout === "left" && (
                    <div
                      className="absolute inset-0 pointer-events-none hidden md:block"
                      style={{
                        background: `linear-gradient(to left, ${bgColor} 0%, transparent 28%)`,
                      }}
                    />
                  )}
                </div>
              ) : (
                /* ── Shaped portrait ─────────────────── */
                <div
                  className="relative overflow-hidden ring-4 ring-white/10"
                  style={{
                    width: `min(${sizePx}px, 80vw)`,
                    height: `min(${sizePx}px, 80vw)`,
                    borderRadius: SHAPE_RADIUS[hero.imageShape],
                    opacity: hero.imageOpacity ?? 1,
                  }}
                >
                  <Image
                    src={imageSource}
                    alt="Manoj Sen — Web Developer"
                    fill
                    sizes={`(max-width: 768px) 80vw, ${sizePx}px`}
                    className="object-cover object-top select-none"
                    priority
                    draggable={false}
                  />
                </div>
              )}
            </div>
          )}
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
