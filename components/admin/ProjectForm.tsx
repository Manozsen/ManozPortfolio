"use client";

import { useState } from "react";
import { createProject, updateProject } from "@/lib/firestore";
import ImageUploader from "./ImageUploader";
import type { Project } from "@/types";
import { Plus, X, Loader2 } from "lucide-react";

interface Props { initial?: Project; onSuccess: () => void; onCancel: () => void; }

const CATEGORIES = ["Creator / Influencer", "Local Business", "Instagram Seller", "E-Commerce", "Restaurant / Food", "Service Business", "Portfolio", "Other"];

export default function ProjectForm({ initial, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    category: initial?.category || "",
    problem: initial?.problem || "",
    solution: initial?.solution || "",
    liveUrl: initial?.liveUrl || "",
    features: initial?.features.length ? initial.features : [""],
    techStack: initial?.techStack.length ? initial.techStack : [""],
    imageUrls: initial?.imageUrls || [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }));
  const updateList = (key: "features" | "techStack", i: number, val: string) => { const arr = [...form[key]]; arr[i] = val; set(key, arr); };
  const addItem = (key: "features" | "techStack") => set(key, [...form[key], ""]);
  const removeItem = (key: "features" | "techStack", i: number) => set(key, form[key].filter((_, idx) => idx !== i));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (form.imageUrls.length === 0) { setError("Please upload at least one image."); return; }
    setSaving(true);
    try {
      const data = { ...form, features: form.features.filter(Boolean), techStack: form.techStack.filter(Boolean) };
      initial ? await updateProject(initial.id, data) : await createProject(data);
      onSuccess();
    } catch { setError("Failed to save. Please try again."); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Project Title"><input value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="Priya's Jewellery Store" className="input-dark" /></Field>
      <Field label="Category">
        <select value={form.category} onChange={(e) => set("category", e.target.value)} required className="input-dark">
          <option value="">Select category</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="The Problem"><textarea value={form.problem} onChange={(e) => set("problem", e.target.value)} required rows={3} placeholder="What challenge did the client face?" className="input-dark resize-none" /></Field>
      <Field label="The Solution"><textarea value={form.solution} onChange={(e) => set("solution", e.target.value)} required rows={3} placeholder="How did you solve it?" className="input-dark resize-none" /></Field>
      <Field label="Key Features">
        <div className="space-y-2">
          {form.features.map((f, i) => (
            <div key={i} className="flex gap-2">
              <input value={f} onChange={(e) => updateList("features", i, e.target.value)} placeholder={`Feature ${i + 1}`} className="input-dark flex-1" />
              {form.features.length > 1 && <button type="button" onClick={() => removeItem("features", i)} className="text-slate-500 hover:text-red-400 p-2"><X className="w-4 h-4" /></button>}
            </div>
          ))}
          <button type="button" onClick={() => addItem("features")} className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm"><Plus className="w-4 h-4" /> Add Feature</button>
        </div>
      </Field>
      <Field label="Tech Stack">
        <div className="space-y-2">
          {form.techStack.map((t, i) => (
            <div key={i} className="flex gap-2">
              <input value={t} onChange={(e) => updateList("techStack", i, e.target.value)} placeholder="e.g. Next.js, Tailwind" className="input-dark flex-1" />
              {form.techStack.length > 1 && <button type="button" onClick={() => removeItem("techStack", i)} className="text-slate-500 hover:text-red-400 p-2"><X className="w-4 h-4" /></button>}
            </div>
          ))}
          <button type="button" onClick={() => addItem("techStack")} className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm"><Plus className="w-4 h-4" /> Add Tech</button>
        </div>
      </Field>
      <Field label="Live URL (optional)"><input value={form.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} placeholder="https://example.com" type="url" className="input-dark" /></Field>
      <Field label="Project Images"><ImageUploader value={form.imageUrls} onChange={(urls) => set("imageUrls", urls)} /></Field>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Saving..." : initial ? "Update Project" : "Create Project"}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-colors text-sm">Cancel</button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
