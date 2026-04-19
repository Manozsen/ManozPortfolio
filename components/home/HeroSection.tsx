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
    heroBgColor = "#f8f7ff",
  } = settings;

  const sizeClass = {
    small: "w-28 h-28 md:w-36 md:h-36",
    medium: "w-36 h-36 md:w-52 md:h-52",
    large: "w-44 h-44 md:w-64 md:h-64",
  }[profileImageSize];

  const shapeClass = {
    circle: "rounded-full",
    rounded: "rounded-2xl",
    square: "rounded-none",
  }[profileImageShape];

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      style={{ backgroundColor: heroBgColor }}
    >
      {/* ── Background Image with Opacity ─────────────── */}
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
              backgroundColor: heroBgColor,
              opacity: heroBgOpacity / 100,
            }}
          />
        </>
      )}

      {/* ── Decorative Blobs ──────────────────────────── */}
      {!heroBgImageUrl && (
        <>
          <div className="absolute top-0 right-0 w-72 h-72 bg-violet-200 rounded-full opacity-20 blur-3xl z-0" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200 rounded-full opacity-20 blur-3xl z-0" />
        </>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* ── Profile Image ───────────────────────────── */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <div
              className={`
                relative overflow-hidden
                ${sizeClass}
                ${shapeClass}
                ring-4 ring-offset-4 ring-violet-400
                shadow-xl shadow-violet-200
                transition-transform duration-300 hover:scale-105
                bg-slate-100
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

            {/* Availability pill */}
            <span className="flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Available for projects
            </span>
          </div>

          {/* ── Text + CTA ──────────────────────────────── */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-violet-600 font-semibold text-sm md:text-base mb-2 tracking-wide">
              👋 Hi, I'm Manoz
            </p>

            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
              {headline}
            </h1>

            <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto md:mx-0">
              {subtext}
            </p>

            {/* Audience Tags */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
              {["Online Creators", "Local Businesses", "Instagram Sellers"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3">
              <Link
                href="/request-demo"
                className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-violet-200"
              >
                🚀 See My Free Demo
              </Link>
              <WhatsAppButton
                message="Hi Manoz! I saw your portfolio and I'd like to get a free demo for my business."
                label="💬 WhatsApp Me"
              />
            </div>

            <p className="text-xs text-slate-400 mt-5">
              ✅ Free demo · No credit card · Response within 24 hrs
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
