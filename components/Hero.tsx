"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

// ── Greeting system ───────────────────────────────────────────────────────────

const GREETINGS = [
  { text: "I'm Manoj",   lang: "en"   },
  { text: "नमस्ते",       lang: "hi"   },
  { text: "こんにちは",    lang: "ja"   },
  { text: "안녕하세요",    lang: "ko"   },
  { text: "Hola, soy Manoj", lang: "es" },
  { text: "Bonjour",     lang: "fr"   },
];

// ── Typing animation hook ─────────────────────────────────────────────────────

function useTypedGreeting() {
  const [greeting, setGreeting] = useState<typeof GREETINGS[0] | null>(null);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "erasing">("typing");

  // Pick a random greeting on mount (client only — avoids hydration mismatch)
  useEffect(() => {
    setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
  }, []);

  // Typing loop
  useEffect(() => {
    if (!greeting) return;
    const full = greeting.text;
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayed.length < full.length) {
        timer = setTimeout(() => {
          setDisplayed(full.slice(0, displayed.length + 1));
        }, 80);
      } else {
        timer = setTimeout(() => setPhase("holding"), 2200);
      }
    } else if (phase === "holding") {
      timer = setTimeout(() => setPhase("erasing"), 400);
    } else if (phase === "erasing") {
      if (displayed.length > 0) {
        timer = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, 40);
      } else {
        // Pick next greeting
        const next = GREETINGS[(GREETINGS.indexOf(greeting) + 1) % GREETINGS.length];
        setGreeting(next);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timer);
  }, [greeting, displayed, phase]);

  return { displayed, isTyping: phase === "typing" || phase === "erasing" };
}

// ── Scroll progress for 3D fade ───────────────────────────────────────────────

function useScrollOpacity(): number {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let raf: number;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollY  = window.scrollY;
        const vh       = window.innerHeight;
        // Fade out over first 60% of viewport scroll
        const progress = Math.min(scrollY / (vh * 0.6), 1);
        setOpacity(1 - progress * 0.85);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return opacity;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Hero() {
  const { displayed, isTyping } = useTypedGreeting();
  const scrollOpacity           = useScrollOpacity();
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    // Small delay so the entrance animation is visible
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        opacity: scrollOpacity,
        willChange: "opacity",
      }}
      id="hero"
    >
      {/* ── Particle / mesh background ──────────────── */}
      <ParticleBackground
        particleCount={50}
        lineDistance={130}
        particleColor="255,255,255"
        lineColor="255,255,255"
        backgroundColor="#050508"
        mouseInteraction
      />

      {/* ── Radial vignette overlay ──────────────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(5,5,8,0.70) 100%)",
        }}
      />

      {/* ── Subtle bottom gradient ───────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-[1] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #050508)",
        }}
      />

      {/* ── Hero content ─────────────────────────────── */}
      <div
        className="relative z-10 text-center px-4 sm:px-8"
        style={{
          opacity:    mounted ? 1 : 0,
          transform:  mounted ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.9s ease, transform 0.9s ease",
        }}
      >
        {/* Greeting / typing text */}
        <div className="mb-4 min-h-[3.5rem] flex items-center justify-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white font-display tracking-tight leading-none">
            {displayed}
            {/* Blinking cursor */}
            <span
              className="inline-block w-[3px] ml-1 align-middle bg-white rounded-sm"
              style={{
                height: "0.85em",
                opacity: isTyping ? 1 : 0,
                animation: isTyping ? "none" : undefined,
              }}
            />
          </h1>
        </div>

        {/* Static sub-line */}
        <p
          className="text-slate-400 text-base sm:text-xl md:text-2xl font-light tracking-wide mb-10 max-w-lg mx-auto"
          style={{
            opacity:    mounted ? 1 : 0,
            transform:  mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
          }}
        >
          Web Developer &mdash; I build sites that convert
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          style={{
            opacity:    mounted ? 1 : 0,
            transform:  mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s",
          }}
        >
          <Link
            href="/request-demo"
            className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 font-semibold px-7 py-3.5 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-white/10 text-sm min-h-[44px]"
          >
            Get Free Demo
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`https://wa.me/916296622391?text=${encodeURIComponent(
              "Hi Manoj! I saw your portfolio and I'd like to discuss my project."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 hover:border-white/25 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-150 hover:-translate-y-0.5 text-sm min-h-[44px] backdrop-blur-sm"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            WhatsApp
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-16 flex flex-col items-center gap-2"
          style={{
            opacity:    mounted ? 0.4 : 0,
            transition: "opacity 1s ease 0.7s",
          }}
        >
          <span className="text-[10px] text-white tracking-[0.25em] uppercase">Scroll</span>
          <div
            className="w-px h-10 bg-gradient-to-b from-white to-transparent"
            style={{ animation: "scrollPulse 2s ease-in-out infinite" }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50%       { opacity: 0.9; transform: scaleY(1.15); }
        }
      `}</style>
    </section>
  );
}
