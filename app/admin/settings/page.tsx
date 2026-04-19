"use client";

import { useEffect, useState, useRef } from "react";
import { getAdminSettings, updateAdminSettings } from "@/lib/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { AdminSettings } from "@/types";
import {
  Loader2,
  Save,
  CheckCircle2,
  Upload,
  User,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>({
    defaultTheme: "light",
    homepageHeadline: "",
    homepageSubtext: "",
    profileImageUrl: "",
    profileImageSize: "medium",
    profileImageShape: "rounded",
    heroBgImageUrl: "",
    heroBgOpacity: 10,
    heroBgColor: "#f8f7ff",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAdminSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProfile(true);
    try {
      const result = await uploadToCloudinary(file);
      setSettings((prev) => ({ ...prev, profileImageUrl: result.url }));
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploadingProfile(false);
    }
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBg(true);
    try {
      const result = await uploadToCloudinary(file);
      setSettings((prev) => ({ ...prev, heroBgImageUrl: result.url }));
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploadingBg(false);
    }
  };

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
        <p className="text-slate-500 text-sm">
          Full control over your homepage appearance
        </p>
      </div>

      {/* ── Profile Image ───────────────────────────────── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <User className="w-4 h-4 text-violet-400" />
          Profile Image
        </h2>

        {/* Preview */}
        <div className="flex items-center gap-4">
          <div
            className={`relative overflow-hidden bg-slate-800 flex-shrink-0
              ${settings.profileImageShape === "circle" ? "rounded-full" : ""}
              ${settings.profileImageShape === "rounded" ? "rounded-2xl" : ""}
              ${settings.profileImageShape === "square" ? "rounded-none" : ""}
              ${settings.profileImageSize === "small" ? "w-16 h-16" : ""}
              ${settings.profileImageSize === "medium" ? "w-24 h-24" : ""}
              ${settings.profileImageSize === "large" ? "w-32 h-32" : ""}
            `}
          >
            {settings.profileImageUrl ? (
              <Image
                src={settings.profileImageUrl}
                alt="Profile"
                fill
                className="object-cover"
                sizes="128px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600">
                <User className="w-8 h-8" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileUpload}
            />
            <button
              type="button"
              onClick={() => profileInputRef.current?.click()}
              disabled={uploadingProfile}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors w-full justify-center"
            >
              {uploadingProfile ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploadingProfile ? "Uploading..." : "Upload Photo"}
            </button>
            {settings.profileImageUrl && (
              <button
                type="button"
                onClick={() =>
                  setSettings((p) => ({ ...p, profileImageUrl: "" }))
                }
                className="text-xs text-red-400 mt-2 w-full text-center"
              >
                Remove photo
              </button>
            )}
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Image Size
          </label>
          <div className="flex gap-2">
            {(["small", "medium", "large"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSettings((p) => ({ ...p, profileImageSize: s }))}
                className={`flex-1 py-2 rounded-xl border text-xs font-medium capitalize transition-colors ${
                  settings.profileImageSize === s
                    ? "border-violet-600 bg-violet-600/20 text-violet-300"
                    : "border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Shape */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Image Shape
          </label>
          <div className="flex gap-2">
            {(["circle", "rounded", "square"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSettings((p) => ({ ...p, profileImageShape: s }))}
                className={`flex-1 py-2 rounded-xl border text-xs font-medium capitalize transition-colors ${
                  settings.profileImageShape === s
                    ? "border-violet-600 bg-violet-600/20 text-violet-300"
                    : "border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hero Background ─────────────────────────────── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-violet-400" />
          Hero Background
        </h2>

        {/* BG Image Upload */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Background Image (optional)
          </label>
          {settings.heroBgImageUrl && (
            <div className="relative h-24 rounded-xl overflow-hidden mb-2">
              <Image
                src={settings.heroBgImageUrl}
                alt="Background"
                fill
                className="object-cover"
                sizes="400px"
              />
              <div
                className="absolute inset-0 bg-white"
                style={{ opacity: settings.heroBgOpacity / 100 }}
              />
              <span className="absolute bottom-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
                Preview
              </span>
            </div>
          )}
          <input
            ref={bgInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBgUpload}
          />
          <button
            type="button"
            onClick={() => bgInputRef.current?.click()}
            disabled={uploadingBg}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors w-full justify-center border border-slate-700"
          >
            {uploadingBg ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploadingBg ? "Uploading..." : "Upload Background Image"}
          </button>
          {settings.heroBgImageUrl && (
            <button
              type="button"
              onClick={() => setSettings((p) => ({ ...p, heroBgImageUrl: "" }))}
              className="text-xs text-red-400 mt-2 w-full text-center"
            >
              Remove background image
            </button>
          )}
        </div>

        {/* BG Color */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Background Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.heroBgColor}
              onChange={(e) =>
                setSettings((p) => ({ ...p, heroBgColor: e.target.value }))
              }
              className="w-12 h-10 rounded-lg border border-slate-700 bg-slate-800 cursor-pointer"
            />
            <span className="text-slate-400 text-sm font-mono">
              {settings.heroBgColor}
            </span>
          </div>
        </div>

        {/* Opacity Slider */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Background Overlay Opacity —{" "}
            <span className="text-violet-400">{settings.heroBgOpacity}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.heroBgOpacity}
            onChange={(e) =>
              setSettings((p) => ({
                ...p,
                heroBgOpacity: Number(e.target.value),
              }))
            }
            className="w-full accent-violet-600"
          />
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>0% (transparent)</span>
            <span>100% (solid)</span>
          </div>
        </div>
      </div>

      {/* ── Homepage Text ───────────────────────────────── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wide">
          🏠 Homepage Text
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Main Headline
          </label>
          <textarea
            value={settings.homepageHeadline}
            onChange={(e) =>
              setSettings({ ...settings, homepageHeadline: e.target.value })
            }
            rows={3}
            className={inputCls + " resize-none"}
            placeholder="I build high-converting websites for..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Subtext
          </label>
          <textarea
            value={settings.homepageSubtext}
            onChange={(e) =>
              setSettings({ ...settings, homepageSubtext: e.target.value })
            }
            rows={2}
            className={inputCls + " resize-none"}
            placeholder="Turn your audience into customers..."
          />
        </div>
      </div>

      {/* ── Theme ───────────────────────────────────────── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">
          🎨 Theme
        </h2>
        <div className="flex gap-3">
          {(["light", "dark"] as const).map((t) => (
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

      {/* ── Save Button ─────────────────────────────────── */}
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
          <><Save className="w-4 h-4" /> Save All Settings</>
        )}
      </button>

      {saved && (
        <p className="text-center text-green-400 text-sm">
          ✓ All changes are live on your homepage.
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500";
