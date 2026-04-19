"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createDemoRequest } from "@/lib/firestore";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";

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

  const [form, setForm] = useState({
    name: "",
    whatsappNumber: "",
    businessType: "",
    requirement: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handle = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await createDemoRequest({
        userId: firebaseUser.uid,
        email: firebaseUser.email || "",
        ...form,
        status: "pending",
      });
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="text-6xl mb-4 animate-float">🎉</div>
        <h3
          className="text-xl font-bold text-white mb-2"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Request Received!
        </h3>
        <p className="text-slate-400 text-sm">
          I'll prepare your free demo and reach out on WhatsApp within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
          Your Name *
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handle}
          required
          placeholder="e.g. Rahul Sharma"
          className={inp}
        />
      </div>

      {/* WhatsApp */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
          WhatsApp Number *
        </label>
        <input
          name="whatsappNumber"
          value={form.whatsappNumber}
          onChange={handle}
          required
          placeholder="+91 9876543210"
          className={inp}
        />
      </div>

      {/* Business Type */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
          Business Type *
        </label>
        <select
          name="businessType"
          value={form.businessType}
          onChange={handle}
          required
          className={inp + " bg-[#0f0f1a]"}
        >
          <option value="">Select your business type</option>
          {BUSINESS_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Requirement */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
          What do you need? *
        </label>
        <textarea
          name="requirement"
          value={form.requirement}
          onChange={handle}
          required
          rows={4}
          placeholder="Tell me about your business and what kind of website you're looking for..."
          className={inp + " resize-none"}
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-gradient disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {loading ? "Submitting..." : "🚀 Request My Free Demo"}
      </button>

      {!firebaseUser && (
        <p className="text-center text-xs text-slate-500">
          You'll be asked to sign in with Google first.
        </p>
      )}
    </form>
  );
}

const inp =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all";
