"use client";

import { useEffect, useState, useRef } from "react";
import {
  getAdminSettings,
  updateAdminSettings,
  getHeroSettings,
  updateHeroSettings,
} from "@/lib/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { AdminSettings, HeroSettings } from "@/types";
import {
  Loader2,
  Save,
  CheckCircle2,
  Upload,
  User,
  Image as ImageIcon,
  Palette,
  Layout,
  Eye,
} from "lucide-react";
import Image from "next/image";

// ── Preset themes ─────────────────────────────────────────────────────────────
const PRESETS = [
  { label: "Dark Navy", primary: "#060818", secondary: "#160830", text: "#ffffff" },
  { label: "Midnight Blue", primary: "#0a0f2e", secondary: "#1a1060", text: "#ffffff" },
  { label: "Deep Forest", primary: "#051a0f", secondary: "#0a3020", text: "#ffffff" },
  { label: "Charcoal", primary: "#111111", secondary: "#2a2a2a", text: "#ffffff" },
  { label: "Indigo Dark", primary: "#1e1b4b", secondary: "#312e81", text: "#ffffff" },
];

const LAYOUTS = [
  { value: "right-hero", label: "Right Hero", desc: "Image on right, text on left" },
  { value: "left-hero", label: "Left Hero", desc: "Image on left, text on right" },
  { value: "center-blend", label: "Center Blend", desc: "Centered portrait above text" },
  { value: "full-overlay", label: "Full Overlay", desc: "Large centered image overlay" },
];

const BG_TYPES = [
  { value: "gradient", label: "Gradient" },
  { value: "color", label: "Solid Color" },
  { value: "image", label: "Image" },
];

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
    heroBgColor: "#060818",
  });

  const [hero, setHero] = useState<HeroSettings>({
    heroTitle: "",
    heroSubtitle: "",
    heroTagline: "",
    profileImageUrl: "",
    imageLayout: "right-hero",
    backgroundType: "gradient",
    primaryColor: "#060818",
    secondaryColor: "#160830",
    textColor: "#ffffff",
    backgroundImageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "legacy">("hero");
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([getAdminSettings(), getHeroSettings()]).then(([s, h]) => {
      setSettings(s);
      setHero(h);
      setLoading(false);
    });
  }, []);

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProfile(true);
    try {
      const result = await uploadToCloudinary(file);
      setHero((prev) => ({ ...prev, profileImageUrl: result.url }));
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
      setHero((prev) => ({ ...prev, backgroundImageUrl: result.url }));
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploadingBg(false);
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setHero((prev) => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      textColor: preset.text,
      backgroundType: "gradient",
    }));
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    await Promise.all([
      updateAdminSettings(settings),
      updateHeroSettings(hero),
    ]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
      </div>
    );
  }

  // ── Build preview background ──────────────────────────────────────────────
  const previewBg =
    hero.backgroundType === "gradient"
      ? `linear-gradient(135deg, ${hero.primaryColor}, ${hero.secondaryColor})`
      : hero.primaryColor;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-extrabold text-white font-display">
          Settings
        </h1>
        <p className="text-slate-500 text-sm">
          Control your homepage appearance
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit">
        {(["hero", "legacy"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === t
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t === "hero" ? "Hero Settings" : "General Settings"}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════ HERO TAB */}
      {activeTab === "hero" && (
        <div className="space-y-5">

          {/* Live preview */}
          <div className="admin-card overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm font-semibold">Live Preview</span>
              <span className="text-slate-500 text-xs ml-auto">Updates as you edit</span>
            </div>
            <div
              className="relative h-40 flex items-center overflow-hidden px-6"
              style={{ background: previewBg }}
            >
              {/* Background image preview */}
              {hero.backgroundType === "image" && hero.backgroundImageUrl && (
                <div className="absolute inset-0">
                  <Image
                    src={hero.backgroundImageUrl}
                    alt="bg preview"
                    fill
                    className="object-cover opacity-40"
                    sizes="400px"
                  />
                </div>
              )}
              <div className="relative z-10 flex-1">
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-1 opacity-70"
                  style={{ color: "#60a5fa" }}
                >
                  {hero.heroTagline || "Your tagline"}
                </p>
                <h3
                  className="text-lg font-extrabold font-display leading-tight mb-1"
                  style={{ color: hero.textColor }}
                >
                  {hero.heroTitle
                    ? hero.heroTitle.slice(0, 50) + "..."
                    : "Your headline here"}
                </h3>
                <p
                  className="text-xs opacity-60"
                  style={{ color: hero.textColor }}
                >
                  {hero.heroSubtitle
                    ? hero.heroSubtitle.slice(0, 60) + "..."
                    : "Your subtitle here"}
                </p>
              </div>
              {hero.profileImageUrl && (
                <div className="relative h-32 w-20 flex-shrink-0">
                  <Image
                    src={hero.profileImageUrl}
                    alt="Profile preview"
                    fill
                    className="object-cover object-top"
                    sizes="80px"
                    style={{
                      maskImage:
                        "radial-gradient(ellipse 80% 90% at 50% 30%, black 30%, transparent 80%)",
                      WebkitMaskImage:
                        "radial-gradient(ellipse 80% 90% at 50% 30%, black 30%, transparent 80%)",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Text content ─────────────────────────── */}
          <div className="admin-card p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wide">
              Hero Text
            </h2>
            <div>
              <label className={lbl}>Tagline (small top text)</label>
              <input
                value={hero.heroTagline}
                onChange={(e) =>
                  setHero((p) => ({ ...p, heroTagline: e.target.value }))
                }
                placeholder="Manoj Sen — Web Developer"
                className="input-dark"
              />
            </div>
            <div>
              <label className={lbl}>Main Title</label>
              <textarea
                value={hero.heroTitle}
                onChange={(e) =>
                  setHero((p) => ({ ...p, heroTitle: e.target.value }))
                }
                rows={3}
                placeholder="I build high-converting websites for..."
                className="input-dark resize-none"
              />
            </div>
            <div>
              <label className={lbl}>Subtitle</label>
              <textarea
                value={hero.heroSubtitle}
                onChange={(e) =>
                  setHero((p) => ({ ...p, heroSubtitle: e.target.value }))
                }
                rows={2}
                placeholder="Turn your audience into customers..."
                className="input-dark resize-none"
              />
            </div>
          </div>

          {/* ── Profile image ────────────────────────── */}
          <div className="admin-card p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" /> Profile Image
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                {hero.profileImageUrl ? (
                  <Image
                    src={hero.profileImageUrl}
                    alt="Profile"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-600" />
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
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full justify-center transition-colors"
                >
                  {uploadingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploadingProfile ? "Uploading..." : "Upload Photo"}
                </button>
                {hero.profileImageUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setHero((p) => ({ ...p, profileImageUrl: "" }))
                    }
                    className="text-xs text-red-400 mt-2 w-full text-center"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Image layout ─────────────────────────── */}
          <div className="admin-card p-5 space-y-3">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
              <Layout className="w-4 h-4 text-blue-400" /> Image Layout
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {LAYOUTS.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() =>
                    setHero((p) => ({
                      ...p,
                      imageLayout: l.value as HeroSettings["imageLayout"],
                    }))
                  }
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    hero.imageLayout === l.value
                      ? "border-blue-600 bg-blue-600/20"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold ${
                      hero.imageLayout === l.value
                        ? "text-blue-300"
                        : "text-white"
                    }`}
                  >
                    {l.label}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{l.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ── Background system ────────────────────── */}
          <div className="admin-card p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-400" /> Background
            </h2>

            {/* Background type */}
            <div>
              <label className={lbl}>Background Type</label>
              <div className="flex gap-2">
                {BG_TYPES.map((bt) => (
                  <button
                    key={bt.value}
                    type="button"
                    onClick={() =>
                      setHero((p) => ({
                        ...p,
                        backgroundType:
                          bt.value as HeroSettings["backgroundType"],
                      }))
                    }
                    className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-colors ${
                      hero.backgroundType === bt.value
                        ? "border-blue-600 bg-blue-600/20 text-blue-300"
                        : "border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    {bt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preset themes */}
            <div>
              <label className={lbl}>Preset Themes</label>
              <div className="flex gap-2 flex-wrap">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors group"
                  >
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                      }}
                    />
                    <span className="text-xs text-slate-400 group-hover:text-white transition-colors">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color pickers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={hero.primaryColor}
                    onChange={(e) =>
                      setHero((p) => ({ ...p, primaryColor: e.target.value }))
                    }
                    className="w-10 h-9 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={hero.primaryColor}
                    onChange={(e) =>
                      setHero((p) => ({ ...p, primaryColor: e.target.value }))
                    }
                    className="input-dark flex-1 !py-2 font-mono text-xs"
                    placeholder="#060818"
                  />
                </div>
              </div>
              <div>
                <label className={lbl}>Secondary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={hero.secondaryColor}
                    onChange={(e) =>
                      setHero((p) => ({
                        ...p,
                        secondaryColor: e.target.value,
                      }))
                    }
                    className="w-10 h-9 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={hero.secondaryColor}
                    onChange={(e) =>
                      setHero((p) => ({
                        ...p,
                        secondaryColor: e.target.value,
                      }))
                    }
                    className="input-dark flex-1 !py-2 font-mono text-xs"
                    placeholder="#160830"
                  />
                </div>
              </div>
            </div>

            {/* Text color */}
            <div>
              <label className={lbl}>Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={hero.textColor}
                  onChange={(e) =>
                    setHero((p) => ({ ...p, textColor: e.target.value }))
                  }
                  className="w-10 h-9 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={hero.textColor}
                  onChange={(e) =>
                    setHero((p) => ({ ...p, textColor: e.target.value }))
                  }
                  className="input-dark flex-1 !py-2 font-mono text-xs"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* BG image upload */}
            {hero.backgroundType === "image" && (
              <div>
                <label className={lbl}>Background Image</label>
                {hero.backgroundImageUrl && (
                  <div className="relative h-16 rounded-xl overflow-hidden mb-2">
                    <Image
                      src={hero.backgroundImageUrl}
                      alt="Background"
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
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
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-60 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full justify-center transition-colors"
                >
                  {uploadingBg ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                  {uploadingBg ? "Uploading..." : "Upload Background Image"}
                </button>
                {hero.backgroundImageUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setHero((p) => ({ ...p, backgroundImageUrl: "" }))
                    }
                    className="text-xs text-red-400 mt-2 w-full text-center"
                  >
                    Remove background
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════ LEGACY TAB */}
      {activeTab === "legacy" && (
        <div className="space-y-5">
          <div className="admin-card p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wide">
              General Homepage Text
            </h2>
            <div>
              <label className={lbl}>Main Headline</label>
              <textarea
                value={settings.homepageHeadline}
                onChange={(e) =>
                  setSettings({ ...settings, homepageHeadline: e.target.value })
                }
                rows={3}
                className="input-dark resize-none w-full"
                placeholder="I build high-converting websites for..."
              />
            </div>
            <div>
              <label className={lbl}>Subtext</label>
              <textarea
                value={settings.homepageSubtext}
                onChange={(e) =>
                  setSettings({ ...settings, homepageSubtext: e.target.value })
                }
                rows={2}
                className="input-dark resize-none w-full"
                placeholder="Turn your audience into customers..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Save */}
      <button
        onClick={save}
        disabled={saving}
        className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Saving...
          </>
        ) : saved ? (
          <>
            <CheckCircle2 className="w-4 h-4" /> Saved!
          </>
        ) : (
          <>
            <Save className="w-4 h-4" /> Save All Settings
          </>
        )}
      </button>

      {saved && (
        <p className="text-center text-emerald-400 text-sm">
          Changes are live on your homepage.
        </p>
      )}
    </div>
  );
}

const lbl = "block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider";
