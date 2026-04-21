"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { AdminSettings } from "@/types";

interface Props {
  headline: string;
  subtext: string;
  settings: AdminSettings;
}

export default function HeroSection({ headline, subtext, settings }: Props) {
  const imageSource = settings.profileImageUrl || "/profile.jpg";

  const splitHeadline = (text: string) => {
    const idx = text.toLowerCase().indexOf("for");
    if (idx === -1) return { before: text, after: "" };
    return { before: text.slice(0, idx + 3), after: text.slice(idx + 3) };
  };
  const { before, after } = splitHeadline(headline);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#060818]">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#060818] via-[#0c0a24] to-[#160830]" />
        <div className="absolute top-1/2 left-[15%] -translate-y-1/2 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.16) 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[650px] h-[650px] rounded-full" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.20) 0%, transparent 65%)" }} />
        <div className="absolute inset-0 opacity-[0.032]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-0 min-h-screen md:min-h-0 md:py-0 pt-24 pb-12">

          <div className="flex-1 max-w-2xl text-center md:text-left order-2 md:order-1 z-10">
            <div className="inline-flex items-center gap-2 mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-slate-400 tracking-wide">Available for new projects</span>
            </div>

            <p className="text-sm font-semibold text-blue-400 mb-3 tracking-widest uppercase font-display animate-fade-up">
              Manoj Sen — Web Developer
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] mb-6 font-display animate-fade-up delay-100">
              {before}
              {after && <span className="block text-gradient-light">{after}</span>}
            </h1>

            <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto md:mx-0 animate-fade-up delay-200">
              {subtext}
            </p>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-10 animate-fade-up delay-300">
              {["Online Creators", "Local Businesses", "Instagram Sellers"].map((tag) => (
                <span key={tag} className="text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 text-slate-400 bg-white/[0.04]">{tag}</span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start animate-fade-up delay-400">
              <Link href="/request-demo" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/25 text-sm min-h-[44px]">
                See Free Demo <ArrowRight className="w-4 h-4" />
              </Link>
              <a href={`https://wa.me/916296622391?text=${encodeURIComponent("Hi Manoz! I saw your portfolio and I'd like to discuss my project.")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 hover:border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-150 hover:-translate-y-0.5 text-sm min-h-[44px]">
                <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp
              </a>
            </div>

            <p className="text-xs text-slate-600 mt-6 animate-fade-up delay-500">
              Free demo · No credit card · Response within 24 hrs
            </p>

            <div className="flex gap-8 mt-10 justify-center md:justify-start animate-fade-up delay-500">
              {[{ value: "50+", label: "Projects delivered" }, { value: "100%", label: "Client satisfaction" }, { value: "24hr", label: "Response time" }].map((s) => (
                <div key={s.label}>
                  <p className="text-xl font-extrabold text-white font-display">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative order-1 md:order-2 w-[72vw] max-w-[320px] md:w-[44%] md:max-w-[520px] flex-shrink-0 flex items-end justify-center md:self-stretch animate-slide-left delay-200">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 75% 85% at 52% 45%, rgba(124,58,237,0.28) 0%, transparent 68%)" }} />
            <div className="relative w-full" style={{ aspectRatio: "3/4", maxHeight: "85vh" }}>
              <Image
                src={imageSource}
                alt="Manoj Sen — Web Developer"
                fill
                sizes="(max-width: 768px) 72vw, 44vw"
                className="object-cover object-top select-none"
                priority
                draggable={false}
                style={{
                  maskImage: "radial-gradient(ellipse 88% 92% at 52% 38%, black 35%, rgba(0,0,0,0.6) 60%, transparent 80%)",
                  WebkitMaskImage: "radial-gradient(ellipse 88% 92% at 52% 38%, black 35%, rgba(0,0,0,0.6) 60%, transparent 80%)",
                }}
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 45%, #060818 92%)" }} />
              <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ background: "linear-gradient(to right, #060818 0%, transparent 28%)" }} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, #060818 0%, transparent 18%)" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2">
        <span className="text-[10px] text-slate-600 tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
      </div>
    </section>
  );
}
