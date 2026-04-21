import DemoRequestForm from "@/components/home/DemoRequestForm";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

export const metadata = {
  title: "Request a Free Demo — Manoz",
  description: "Get a free website demo built for your business.",
};

export default function RequestDemoPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="bg-slate-900 text-white py-16 px-4 text-center">
        <span className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
          Free — No Credit Card
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold font-display mb-3">
          Get Your Free Website Demo
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base">
          See exactly what your website will look like before spending a single rupee.
        </p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { step: "1", title: "Fill the Form", desc: "Tell me about your business." },
            { step: "2", title: "I Build Your Demo", desc: "Custom demo within 24–48 hrs." },
            { step: "3", title: "Review and Decide", desc: "Love it? We move forward." },
          ].map((s) => (
            <div key={s.step} className="card p-5 text-center">
              <div className="w-8 h-8 bg-blue-600 text-white text-sm font-bold rounded-full flex items-center justify-center mx-auto mb-3 font-display">
                {s.step}
              </div>
              <h3 className="font-bold text-slate-900 font-display text-sm mb-1">{s.title}</h3>
              <p className="text-xs text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="card p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 font-display mb-1 text-center">Request Your Demo</h2>
          <p className="text-center text-slate-500 text-sm mb-6">Free · No credit card · Response within 24 hours</p>
          <DemoRequestForm />
        </div>
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm mb-3">Prefer to talk directly?</p>
          <WhatsAppButton message="Hi Manoz! I want to see a free demo for my business." label="Message Me on WhatsApp" />
        </div>
      </div>
    </div>
  );
}
