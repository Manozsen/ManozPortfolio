getAllProjects, getAdminSettings } from "@/lib/firestore";
import HeroSection from "@/components/home/HeroSection";
import ProjectsPreview from "@/components/home/ProjectsPreview";
import DemoRequestForm from "@/components/home/DemoRequestForm";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const [projects, settings] = await Promise.all([
    getAllProjects(),
    getAdminSettings(),
  ]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <HeroSection
        headline={settings.homepageHeadline}
        subtext={settings.homepageSubtext}
        settings={settings}
      />

      {/* ── Who I Help ───────────────────────────────────── */}
      <section className="py-24 bg-[#0d0d16] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-violet-500/30 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
              Who I Build For
            </span>
            <h2
              className="text-3xl md:text-5xl font-extrabold text-white mb-4"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Built for{" "}
              <span className="gradient-text">your business</span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Whether you're growing on Instagram, running a local shop, or
              creating content — you deserve a site that converts.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                emoji: "🎨",
                title: "Online Creators",
                desc: "Turn your followers into buyers with a personal brand site that converts.",
                color: "from-violet-600/20 to-purple-600/5",
                border: "border-violet-500/20",
                glow: "hover:shadow-violet-500/10",
              },
              {
                emoji: "🏪",
                title: "Local Businesses",
                desc: "Get found online. Show your services, collect leads, and grow locally.",
                color: "from-blue-600/20 to-cyan-600/5",
                border: "border-blue-500/20",
                glow: "hover:shadow-blue-500/10",
              },
              {
                emoji: "📦",
                title: "Instagram Sellers",
                desc: "Move beyond DMs. Sell products with a trust-building storefront.",
                color: "from-pink-600/20 to-rose-600/5",
                border: "border-pink-500/20",
                glow: "hover:shadow-pink-500/10",
              },
            ].map((card) => (
              <div
                key={card.title}
                className={`
                  relative rounded-3xl p-6 border ${card.border}
                  bg-gradient-to-br ${card.color}
                  backdrop-blur-sm
                  hover:shadow-2xl ${card.glow}
                  transition-all duration-500 hover:-translate-y-2
                  group
                `}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {card.emoji}
                </div>
                <h3
                  className="font-bold text-white mb-2 text-lg"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  {card.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects Preview ─────────────────────────────── */}
      <section className="py-4 bg-[#0a0a0f]">
        <ProjectsPreview projects={projects} />
      </section>

      {/* ── Why Me ───────────────────────────────────────── */}
      <section className="py-24 bg-[#0d0d16]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
              Why Choose Me
            </span>
            <h2
              className="text-3xl md:text-5xl font-extrabold text-white mb-4"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Not just a website.{" "}
              <span className="gradient-text">A growth tool.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "⚡", label: "Fast Delivery", desc: "Live in days" },
              { icon: "📱", label: "Mobile-First", desc: "Perfect on all devices" },
              { icon: "🔒", label: "Secure", desc: "Enterprise-grade" },
              { icon: "💰", label: "Converts", desc: "Built to sell" },
            ].map((item) => (
              <div
                key={item.label}
                className="glass rounded-3xl p-6 flex flex-col items-center gap-3 text-center hover:-translate-y-1 transition-transform duration-300 hover:border-violet-500/30 group"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <div>
                  <p
                    className="font-bold text-white text-sm"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="py-24 bg-[#0a0a0f] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-blue-600/10" />
          <div className="animate-float absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="animate-float-delayed absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <div className="glass-strong rounded-3xl p-10 md:p-16 gradient-border">
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs font-semibold text-violet-400 uppercase tracking-widest mb-6">
              🚀 Limited Slots Available
            </span>
            <h2
              className="text-3xl md:text-5xl font-extrabold text-white mb-4"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              See your website
              <br />
              <span className="gradient-text">before you pay</span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              I'll build a free demo tailored to your business. No payment,
              no commitment — just results.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/request-demo"
                className="btn-gradient text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2"
              >
                🚀 Get My Free Demo
              </Link>
              <WhatsAppButton
                message="Hi Manoz! I'd like to see a free demo for my business."
                label="💬 Ask on WhatsApp"
                className="!bg-green-500/20 !text-green-400 hover:!bg-green-500/30 !border !border-green-500/30 !rounded-2xl !py-4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Demo Request Form ────────────────────────────── */}
      <section className="py-24 bg-[#0d0d16]" id="request-form">
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">
              ✨ Free — No Credit Required
            </span>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-3"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Request a{" "}
              <span className="gradient-text">Free Demo</span>
            </h2>
            <p className="text-slate-500 text-sm">
              Fill this in and I'll reach out on WhatsApp within 24 hours 🙌
            </p>
          </div>
          <div className="glass-strong rounded-3xl p-6 md:p-8 gradient-border">
            <DemoRequestForm />
          </div>
        </div>
      </section>
