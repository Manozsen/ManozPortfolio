import { getAllProjects, getAdminSettings } from "@/lib/firestore";
import HeroSection from "@/components/home/HeroSection";
import ProjectsPreview from "@/components/home/ProjectsPreview";
import DemoRequestForm from "@/components/home/DemoRequestForm";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import Link from "next/link";
import { ArrowRight, Zap, Smartphone, Shield, TrendingUp } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const [projects, settings] = await Promise.all([
    getAllProjects(),
    getAdminSettings(),
  ]);

  return (
    <>
      <HeroSection
        headline={settings.homepageHeadline}
        subtext={settings.homepageSubtext}
        settings={settings}
      />

      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">Who I Build For</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-display">
              Built for your business
            </h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto text-base">
              Whether you grow on Instagram, run a local shop, or create content — you deserve a site that converts.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Online Creators", desc: "Turn your followers into buyers with a personal brand site that converts.", bg: "bg-violet-50", icon: "🎨" },
              { title: "Local Businesses", desc: "Get found online. Show your services, collect leads, and grow locally.", bg: "bg-blue-50", icon: "🏪" },
              { title: "Instagram Sellers", desc: "Move beyond DMs. Sell your products with a trust-building storefront.", bg: "bg-pink-50", icon: "📦" },
            ].map((card) => (
              <div key={card.title} className={`card card-hover p-6 border-0 ${card.bg}`}>
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="font-bold text-slate-900 font-display mb-2">{card.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProjectsPreview projects={projects} />

      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">Why Choose Me</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-display">
              Not just a website. A growth tool.
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Zap, label: "Fast Delivery", desc: "Live in days", color: "text-amber-500 bg-amber-50" },
              { icon: Smartphone, label: "Mobile-First", desc: "Perfect on all devices", color: "text-blue-500 bg-blue-50" },
              { icon: Shield, label: "Secure", desc: "Enterprise-grade", color: "text-emerald-500 bg-emerald-50" },
              { icon: TrendingUp, label: "Converts", desc: "Built to sell", color: "text-violet-500 bg-violet-50" },
            ].map((item) => (
              <div key={item.label} className="card card-hover p-6 text-center">
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <p className="font-bold text-slate-900 font-display text-sm">{item.label}</p>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            Limited Slots Available
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white font-display mb-4">
            See your website before you pay
          </h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            I will build a free demo tailored to your business. No payment, no commitment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/request-demo" className="btn-primary">
              Get My Free Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <WhatsAppButton
              message="Hi Manoz! I'd like to see a free demo for my business."
              label="WhatsApp Me"
            />
          </div>
        </div>
      </section>

      <section className="py-24 bg-white" id="request-form">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="section-label">Free — No Credit Card</span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-display mb-2">
              Request a Free Demo
            </h2>
            <p className="text-slate-500 text-sm">
              Fill this in and I will reach out on WhatsApp within 24 hours.
            </p>
          </div>
          <div className="card p-6 md:p-8">
            <DemoRequestForm />
          </div>
        </div>
      </section>
    </>
  );
}
