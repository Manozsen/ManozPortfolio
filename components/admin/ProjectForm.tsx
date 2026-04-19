"use client";

import { useState } from "react";
import { createProject, updateProject } from "@/lib/firestore";
import ImageUploader from "./ImageUploader";
import type { Project } from "@/types";
import { Plus, X, Loader2 } from "lucide-react";

interface Props {
  initial?: Project;
  onSuccess: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  "Creator / Influencer",
  "Local Business",
  "Instagram Seller",
  "E-Commerce",
  "Restaurant / Food",
  "Service Business",
  "Portfolio",
  "Other",
];

export default function ProjectForm({ initial, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    category: initial?.category || "",
    problem: initial?.problem || "",
    solution: initial?.solution || "",
    liveUrl: initial?.liveUrl || "",
    features: initial?.features || [""],
    techStack: initial?.techStack || [""],
    imageUrls: initial?.imageUrls || [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  // Dynamic list helpers
  const updateList = (key: "features" | "techStack", i: number, val: string) => {
    const arr = [...form[key]];
    arr[i] = val;
    set(key, arr);
  };
  const addItem = (key: "features" | "techStack") => set(key, [...form[key], ""]);
  const removeItem = (key: "features" | "techStack", i: number) =>
    set(key, form[key].filter((_, idx) => idx !== i));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.imageUrls.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    setSaving(true);
    try {
      const data = {
        ...form,
        features: form.features.filter(Boolean),
        techStack: form.techStack.filter(Boolean),
      };
      if (initial) {
        await updateProject(initial.id, data);
      } else {
        await createProject(data);
      }
      onSuccess();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Title */}
      <Field label="Project Title *">
        <input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
          placeholder="e.g. Priya's Jewellery Store"
          className={inputCls}
        />
      </Field>

      {/* Category */}
      <Field label="Category *">
        <select
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          required
          className={inputCls + " bg-slate-800"}
        >
          <option value="">Select category</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>

      {/* Problem */}
      <Field label="The Problem *">
        <textarea
          value={form.problem}
          onChange={(e) => set("problem", e.target.value)}
          required
          rows={3}
          placeholder="What challenge did the client have?"
          className={inputCls + " resize-none"}
        />
      </Field>

      {/* Solution */}
      <Field label="The Solution *">
        <textarea
          value={form.solution}
          onChange={(e) => set("solution", e.target.value)}
          required
          rows={3}
          placeholder="How did you solve it?"
          className={inputCls + " resize-none"}
        />
      </Field>

      {/* Features */}
      <Field label="Key Features">
        <div className="space-y-2">
          {form.features.map((f, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={f}
                onChange={(e) => updateList("features", i, e.target.value)}
                placeholder={`Feature ${i + 1}`}
                className={inputCls + " flex-1"}
              />
              {form.features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem("features", i)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem("features")}
            className="flex items-center gap-1.5 text-violet-400 hover:text-violet-300 text-sm"
          >
            <Plus className="w-4 h-4" /> Add Feature
          </button>
        </div>
      </Field>

      {/* Tech Stack */}
      <Field label="Tech Stack">
        <div className="space-y-2">
          {form.techStack.map((t, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={t}
                onChange={(e) => updateList("techStack", i, e.target.value)}
                placeholder={`e.g. Next.js, Tailwind`}
                className={inputCls + " flex-1"}
              />
              {form.techStack.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem("techStack", i)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem("techStack")}
            className="flex items-center gap-1.5 text-violet-400 hover:text-violet-300 text-sm"
          >
            <Plus className="w-4 h-4" /> Add Tech
          </button>
        </div>
      </Field>

      {/* Live URL */}
      <Field label="Live URL">
        <input
          value={form.liveUrl}
          onChange={(e) => set("liveUrl", e.target.value)}
          placeholder="https://example.com"
          type="url"
          className={inputCls}
        />
      </Field>

      {/* Images */}
      <Field label="Project Images *">
        <ImageUploader
          value={form.imageUrls}
          onChange={(urls) => set("imageUrls", urls)}
        />
      </Field>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {saving ? "Saving..." : initial ? "Update Project" : "Create Project"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Helpers ─────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent";
