import { getAllProjects, getAdminSettings } from "@/lib/firestore";
import HeroSection from "@/components/home/HeroSection";
import ProjectsPreview from "@/components/home/ProjectsPreview";
import DemoRequestForm from "@/components/home/DemoRequestForm";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import Link from "next/link";

export const revalidate = 60; // ISR — refresh every 60 seconds

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
      />

      {/* ── Who I Help ───────────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Who I Build For
          </h2>
          <p className="text-slate-500 mb-10 max-w-lg mx-auto">
            Whether you're growing on Instagram, running a local shop, or creating content — your business deserves a professional online presence.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                emoji: "🎨",
                title: "Online Creators",
                desc: "Turn your followers into buyers with a personal brand site that converts.",
              },
              {
                emoji: "🏪",
                title: "Local Businesses",
                desc: "Get found online. Show your services, collect leads, and grow locally.",
              },
              {
                emoji: "📦",
                title: "Instagram Sellers",
                desc: "Move beyond DMs. Sell your products with a trust-building storefront.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-3">{card.emoji}</div>
                <h3 className="font-semibold text-slate-800 mb-1">{card.title}</h3>
                <p className="text-sm text-slate-500">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects Preview ─────────────────────────────── */}
      <ProjectsPreview projects={projects} />

      {/* ── Why Me ───────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Why Work With Me?
          </h2>
          <p className="text-slate-500 mb-10 max-w-lg mx-auto">
            Not just a website — a growth tool built around your goals
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: "⚡", label: "Fast Delivery" },
              { icon: "📱", label: "Mobile-First" },
              { icon: "🔒", label: "Secure & Reliable" },
              { icon: "💰", label: "Conversion-Focused" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-violet-50 rounded-2xl p-5 flex flex-col items-center gap-2"
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-sm font-semibold text-violet-800">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo Request CTA ─────────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            See Your Website Before You Pay
          </h2>
          <p className="text-violet-100 mb-8">
            I'll build a free demo tailored to your business. No payment, no commitment — just results.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/request-demo"
              className="bg-white text-violet-700 font-bold px-6 py-3 rounded-xl hover:bg-violet-50 transition-colors"
            >
              🚀 Get My Free Demo
            </Link>
            <WhatsAppButton
              message="Hi Manoz! I'd like to see a free demo for my business."
              label="💬 Ask on WhatsApp"
              className="!bg-green-500 hover:!bg-green-600"
            />
          </div>
        </div>
      </section>

      {/* ── Demo Request Form ────────────────────────────── */}
      <section className="py-16 bg-slate-50" id="request-form">
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Request a Free Demo
            </h2>
            <p className="text-slate-500 text-sm">
              Fill this in and I'll reach out on WhatsApp within 24 hours 🙌
            </p>
          </div>
          <DemoRequestForm />
        </div>
      </section>
    </>
  );
}
