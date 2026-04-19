"use client";

import { useEffect, useState } from "react";
import { getAdminSettings, updateAdminSettings } from "@/lib/firestore";
import type { AdminSettings } from "@/types";
import { Loader2, Save, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>({
    defaultTheme: "light",
    homepageHeadline: "",
    homepageSubtext: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAdminSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    await updateAdminSettings(settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-extrabold text-white">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your homepage content</p>
      </div>

      {/* Homepage Text */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wide">
          🏠 Homepage Content
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Main Headline
          </label>
          <textarea
            value={settings.homepageHeadline}
            onChange={(e) => setSettings({ ...settings, homepageHeadline: e.target.value })}
            rows={3}
            className={inputCls + " resize-none"}
            placeholder="I build high-converting websites for..."
          />
          <p className="text-xs text-slate-600 mt-1">
            This is the big text on your homepage hero section.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Subtext
          </label>
          <textarea
            value={settings.homepageSubtext}
            onChange={(e) => setSettings({ ...settings, homepageSubtext: e.target.value })}
            rows={2}
            className={inputCls + " resize-none"}
            placeholder="Turn your audience into customers..."
          />
          <p className="text-xs text-slate-600 mt-1">
            Supporting text shown below the headline.
          </p>
        </div>
      </div>

      {/* Theme (future use) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">
          🎨 Theme
        </h2>
        <div className="flex gap-3">
          {(["light", "dark"] as AdminSettings["defaultTheme"][]).map((t) => (
            <button
              key={t}
              onClick={() => setSettings({ ...settings, defaultTheme: t })}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium capitalize transition-colors ${
                settings.defaultTheme === t
                  ? "border-violet-600 bg-violet-600/20 text-violet-300"
                  : "border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
            >
              {t === "light" ? "☀️" : "🌙"} {t}
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={save}
        disabled={saving}
        className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors"
      >
        {saving ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
        ) : saved ? (
          <><CheckCircle2 className="w-4 h-4" /> Saved!</>
        ) : (
          <><Save className="w-4 h-4" /> Save Settings</>
        )}
      </button>

      {saved && (
        <p className="text-center text-green-400 text-sm">
          ✓ Changes are live on your homepage.
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500";
