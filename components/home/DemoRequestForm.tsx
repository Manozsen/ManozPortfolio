"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createDemoRequest } from "@/lib/firestore";
import { useRouter } from "next/navigation";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

const BUSINESS_TYPES = [
  "Online Creator / Influencer",
  "Local Business",
  "Instagram Seller",
  "E-Commerce Store",
  "Freelancer / Consultant",
  "Restaurant / Food",
  "Service Provider",
  "Other",
];

export default function DemoRequestForm() {
  const { firebaseUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", whatsappNumber: "", businessType: "", requirement: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) { router.push("/login"); return; }
    setLoading(true); setError("");
    try {
      await createDemoRequest({ userId: firebaseUser.uid, email: firebaseUser.email || "", ...form, status: "pending" });
      setSuccess(true);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4"><CheckCircle2 className="w-12 h-12 text-emerald-500" /></div>
        <h3 className="text-xl font-bold text-slate-900 font-display mb-2">Request received!</h3>
        <p className="text-slate-500 text-sm">I will prepare your free demo and reach out on WhatsApp within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Your Name</label>
        <input name="name" value={form.name} onChange={handle} required placeholder="Rahul Sharma" className="input-field" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">WhatsApp Number</label>
        <input name="whatsappNumber" value={form.whatsappNumber} onChange={handle} required placeholder="+91 9876543210" className="input-field" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Business Type</label>
        <select name="businessType" value={form.businessType} onChange={handle} required className="input-field">
          <option value="">Select your business type</option>
          {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">What do you need?</label>
        <textarea name="requirement" value={form.requirement} onChange={handle} required rows={4} placeholder="Tell me about your business..." className="input-field resize-none" />
      </div>
      {error && <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}
      <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {loading ? "Submitting..." : "Request My Free Demo"}
      </button>
      {!firebaseUser && <p className="text-center text-xs text-slate-400">You will be asked to sign in with Google first.</p>}
    </form>
  );
}
