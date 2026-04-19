"use client";

import Image from "next/image";
import Link from "next/link";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import type { AdminSettings } from "@/types";

interface Props {
  headline: string;
  subtext: string;
  settings: AdminSettings;
}

export default function HeroSection({ headline, subtext, settings }: Props) {
  const {
    profileImageUrl,
    profileImageSize = "medium",
    profileImageShape = "rounded",
    heroBgImageUrl,
    heroBgOpacity = 10,
    heroBgColor = "#0a0a0f",
  } = settings;

  const sizeClass = {
    small: "w-32 h-32 md:w-44 md:h-44",
    medium: "w-40 h-40 md:w-56 md:h-56",
    large: "w-48 h-48 md:w-64 md:h-64",
  }[profileImageSize];

  const shapeClass = {
    circle: "rounded-full",
    rounded: "rounded-3xl",
    square: "rounded-none",
  }[profileImageShape];

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: heroBgColor || "#0a0a0f" }}
    >
      {/* ── Background Image ──────────────────────── */}
      {heroBgImageUrl && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={heroBgImageUrl}
              alt="Hero background"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundColor: heroBgColor || "#0a0a0f",
              opacity: heroBgOpacity / 100,
            }}
          />
        </>
      )}

      {/* ── Animated Blobs ────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="animate-float absolute top-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="animate-float-delayed absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="animate-float absolute top-1/2 left-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(124,58,237,0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(124,58,237,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Main Content ──────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 md:py-0 w-full">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">

          {/* ── Profile Image ─────────────────────── */}
          <div className="flex-shrink-0 flex flex-col items-center gap-4 opacity-0-start animate-slide-left">
            {/* Outer glow ring */}
            <div className="relative">
              <div
                className={`
                  absolute -inset-3 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600
                  ${profileImageShape === "circle" ? "rounded-full" : "rounded-3xl"}
                  opacity-60 blur-lg animate-pulse-glow
                `}
              />
              <div
                className={`
                  relative overflow-hidden bg-slate-800
                  ${sizeClass} ${shapeClass}
                  ring-2 ring-white/10
                  shadow-2xl
                  transition-transform duration-500 hover:scale-105
                `}
              >
                {profileImageUrl ? (
                  <Image
                    src={profileImageUrl}
                    alt="Manoz — Web Developer"
                    fill
                    sizes="(max-width: 768px) 160px, 224px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <Image
                    src="/profile.jpg"
                    alt="Manoz — Web Developer"
                    fill
                    sizes="(max-width: 768px) 160px, 224px"
                    className="object-cover"
                    priority
                  />
                )}
              </div>
            </div>

            {/* Availability pill */}
            <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-400">
                Available for projects
              </span>
            </div>

            {/* Stats row */}
            <div className="flex gap-4">
              {[
                { value: "50+", label: "Projects" },
                { value: "100%", label: "Satisfaction" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass rounded-2xl px-4 py-3 text-center"
                >
                  <p className="text-lg font-bold gradient-text"
                    style={{ fontFamily: 'Syne, sans-serif' }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Text Content ──────────────────────── */}
          <div className="flex-1 text-center md:text-left">
            {/* Greeting badge */}
            <div className="opacity-0-start animate-fade-up inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
              <span className="text-lg">👋</span>
              <span className="text-sm font-medium text-violet-300">
                Hi, I'm Manoz — Web Developer
              </span>
            </div>

            {/* Main headline */}
            <h1
              className="opacity-0-start animate-fade-up delay-200 text-4xl md:text-6xl font-extrabold leading-tight mb-6"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              <span className="text-white">{headline.split("for")[0]}for</span>
              <br />
              <span className="gradient-text glow-text">
                {headline.split("for")[1]}
              </span>
            </h1>

            {/* Subtext */}
            <p className="opacity-0-start animate-fade-up delay-300 text-slate-400 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto md:mx-0">
              {subtext}
            </p>

            {/* Audience Tags */}
            <div className="opacity-0-start animate-fade-up delay-400 flex flex-wrap justify-center md:justify-start gap-2 mb-8">
              {[
                { label: "Online Creators", icon: "🎨" },
                { label: "Local Businesses", icon: "🏪" },
                { label: "Instagram Sellers", icon: "📦" },
              ].map((tag) => (
                <span
                  key={tag.label}
                  className="glass rounded-full text-xs font-medium px-3 py-1.5 text-slate-300 flex items-center gap-1.5 hover:border-violet-500/50 transition-colors"
                >
                  {tag.icon} {tag.label}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="opacity-0-start animate-fade-up delay-500 flex flex-col sm:flex-row justify-center md:justify-start gap-3">
              <Link
                href="/request-demo"
                className="btn-gradient text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 text-sm"
              >
                🚀 See My Free Demo
              </Link>
              <WhatsAppButton
                message="Hi Manoz! I saw your portfolio and I'd like to get a free demo for my business."
                label="💬 WhatsApp Me"
                className="!bg-green-500/20 !text-green-400 hover:!bg-green-500/30 !border !border-green-500/30 !rounded-2xl !py-4"
              />
            </div>

            {/* Trust badges */}
            <div className="opacity-0-start animate-fade-up delay-600 flex flex-wrap justify-center md:justify-start gap-4 mt-8">
              {[
                "✅ Free demo",
                "🔒 No credit card",
                "⚡ 24hr response",
              ].map((badge) => (
                <span key={badge} className="text-xs text-slate-500">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-violet-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
