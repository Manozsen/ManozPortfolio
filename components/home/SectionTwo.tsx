"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SectionTwoSettings } from "@/types";
import { attachScrollIn } from "@/lib/3d-effects";

interface Props {
  section: SectionTwoSettings;
}

export default function SectionTwo({ section }: Props) {
  const sectionRef  = useRef<HTMLElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const descRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const trustRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    if (badgeRef.current)   cleanups.push(attachScrollIn(badgeRef.current,   { delay: 0   }));
    if (headingRef.current) cleanups.push(attachScrollIn(headingRef.current, { delay: 80  }));
    if (descRef.current)    cleanups.push(attachScrollIn(descRef.current,    { delay: 160 }));
    if (ctaRef.current)     cleanups.push(attachScrollIn(ctaRef.current,     { delay: 240 }));
    if (trustRef.current)   cleanups.push(attachScrollIn(trustRef.current,   { delay: 320 }));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  if (!section.enabled) return null;

  const isExternal = section.buttonLink?.startsWith("http");

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden"
      id="section-two"
    >
      {/* Background image */}
      {section.backgroundImageUrl ? (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={section.backgroundImageUrl}
              alt="Section background"
              fill
              className="object-cover"
              sizes="100vw"
              loading="lazy"
            />
          </div>
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(6,8,24,0.90) 0%, rgba(22,8,48,0.84) 50%, rgba(6,8,24,0.94) 100%)",
            }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0 z-0"
          style={{ background: "linear-gradient(135deg, #060818 0%, #0c0a24 50%, #160830 100%)" }}
        />
      )}

      {/* Subtle glow orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)", filter: "blur(50px)" }}
        />
        <div
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 65%)", filter: "blur(50px)" }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center"
      >
        {/* Badge */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            What I Do
          </span>
        </div>

        {/* Heading */}
        <h2
          ref={headingRef}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-display leading-[1.08] mb-6"
        >
          {section.heading.split(" ").map((word, i, arr) =>
            i >= arr.length - 2 ? (
              <span
                key={i}
                style={{
                  background: "linear-gradient(135deg, #93c5fd, #c4b5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {word}{i < arr.length - 1 ? " " : ""}
              </span>
            ) : (
              <span key={i}>{word} </span>
            )
          )}
        </h2>

        {/* Description */}
        <p
          ref={descRef}
          className="text-slate-400 text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          {section.description}
        </p>

        {/* CTA */}
        <div ref={ctaRef}>
          {isExternal ? (
            <a
              href={section.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/30 text-sm"
            >
              {section.buttonText}
              <ArrowRight className="w-4 h-4" />
            </a>
          ) : (
            <Link
              href={section.buttonLink || "/request-demo"}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/30 text-sm"
            >
              {section.buttonText}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Trust badges */}
        <div
          ref={trustRef}
          className="flex flex-wrap justify-center gap-6 mt-12"
        >
          {[
            { icon: "⚡", label: "Fast delivery"    },
            { icon: "📱", label: "Mobile-first"     },
            { icon: "🔒", label: "Secure & stable"  },
            { icon: "🎯", label: "Built to convert" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-2 text-slate-400 text-sm">
              <span>{b.icon}</span>
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #F8FAFC)" }}
      />
    </section>
  );
}
