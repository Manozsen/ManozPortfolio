"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createDemoRequest } from "@/lib/firestore";
import { useRouter } from "next/navigation";

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Request Received!</h3>
        <p className="text-slate-500">
          I'll prepare your free demo and reach out on WhatsApp within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-lg mx-auto">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Your Name *
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handle}
          required
          placeholder="e.g. Rahul Sharma"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </div>

      {/* WhatsApp */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          WhatsApp Number *
        </label>
        <input
          name="whatsappNumber"
          value={form.whatsappNumber}
          onChange={handle}
          required
          placeholder="+91 9876543210"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </div>

      {/* Business Type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Business Type *
        </label>
        <select
          name="businessType"
          value={form.businessType}
          onChange={handle}
          required
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
        >
          <option value="">Select your business type</option>
          {BUSINESS_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Requirement */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          What do you need? *
        </label>
        <textarea
          name="requirement"
          value={form.requirement}
          onChange={handle}
          required
          rows={4}
          placeholder="Tell me about your business and what kind of website you're looking for..."
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
      >
        {loading ? "Submitting..." : "🚀 Request My Free Demo"}
      </button>

      {!firebaseUser && (
        <p className="text-center text-xs text-slate-400">
          You'll be asked to sign in with Google first.
        </p>
      )}
    </form>
  );
}
