import DemoRequestForm from "@/components/home/DemoRequestForm";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

export const metadata = {
  title: "Request a Free Demo — Manoz's Portfolio",
  description:
    "Get a free website demo built for your business. Creators, local businesses, and Instagram sellers welcome.",
};

export default function RequestDemoPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white py-12 px-4 text-center">
        <h1 className="text-2xl md:text-4xl font-extrabold mb-3">
          Get Your Free Website Demo 🚀
        </h1>
        <p className="text-violet-100 max-w-xl mx-auto text-sm md:text-base">
          See exactly what your website will look like — before spending a single rupee.
          Built for creators, local businesses, and Instagram sellers.
        </p>
      </div>

      {/* How It Works */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-center text-lg font-bold text-slate-800 mb-6">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { step: "1", title: "Fill the Form", desc: "Tell me about your business and what you need." },
            { step: "2", title: "I Build Your Demo", desc: "I'll create a custom demo within 24–48 hrs." },
            { step: "3", title: "Review & Decide", desc: "Love it? We move forward. No pressure." },
          ].map((s) => (
            <div key={s.step} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
              <div className="w-8 h-8 bg-violet-600 text-white text-sm font-bold rounded-full flex items-center justify-center mx-auto mb-3">
                {s.step}
              </div>
              <h3 className="font-semibold text-slate-800 text-sm mb-1">{s.title}</h3>
              <p className="text-xs text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1 text-center">
            Request Your Demo
          </h2>
          <p className="text-center text-slate-500 text-sm mb-6">
            Free · No credit card · Response within 24 hours
          </p>
          <DemoRequestForm />
        </div>

        {/* Alternative CTA */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm mb-3">Prefer to talk directly?</p>
          <WhatsAppButton
            message="Hi Manoz! I want to see a free demo for my business. Can we chat?"
            label="💬 Message Me on WhatsApp"
          />
        </div>
      </div>
    </div>
  );
}
