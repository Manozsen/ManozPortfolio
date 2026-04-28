"use client";

/* eslint-disable react/no-unescaped-entities */

import { useEffect, useState, useRef } from "react";
import {
  getHeroSettings,
  updateHeroSettings,
  getPopupSettings,
  updatePopupSettings,
  getSeoSettings,
  updateSeoSettings,
  getAdminSettings,
  updateAdminSettings,
  getSectionTwoSettings,
  updateSectionTwoSettings,
} from "@/lib/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type {
  HeroSettings,
  PopupSettings,
  SeoSettings,
  AdminSettings,
  SectionTwoSettings,
} from "@/types";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  Loader2,
  Save,
  CheckCircle2,
  Upload,
  User,
  Image as ImageIcon,
  Palette,
  Eye,
  Bell,
  Search,
  X,
  Layout,
  Video,
  Layers,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

// ── Constants ─────────────────────────────────────────────────────────────────

const COLOR_PRESETS = [
  { label: "Dark Navy", primary: "#060818", secondary: "#160830", text: "#ffffff" },
  { label: "Midnight",  primary: "#0a0f2e", secondary: "#1a1060", text: "#ffffff" },
  { label: "Forest",    primary: "#051a0f", secondary: "#0a3020", text: "#ffffff" },
  { label: "Charcoal",  primary: "#111111", secondary: "#2a2a2a", text: "#ffffff" },
  { label: "Indigo",    primary: "#1e1b4b", secondary: "#312e81", text: "#ffffff" },
  { label: "Rose Dark", primary: "#1a0810", secondary: "#3b0f20", text: "#ffffff" },
];

const IMAGE_LAYOUTS: {
  value: HeroSettings["imageLayout"];
  label: string;
  desc: string;
}[] = [
  { value: "right",  label: "Right",  desc: "Image right, text left"    },
  { value: "left",   label: "Left",   desc: "Image left, text right"    },
  { value: "center", label: "Center", desc: "Image centered above text" },
  { value: "hidden", label: "Hidden", desc: "No image shown"            },
];

const IMAGE_SHAPES: {
  value: HeroSettings["imageShape"];
  label: string;
}[] = [
  { value: "none",    label: "Blended (no border)" },
  { value: "rounded", label: "Rounded card"        },
  { value: "circle",  label: "Circle"              },
  { value: "square",  label: "Square"              },
];

const IMAGE_SIZES: {
  value: HeroSettings["imageSize"];
  label: string;
  px: string;
}[] = [
  { value: "small",  label: "Small",  px: "220px" },
  { value: "medium", label: "Medium", px: "320px" },
  { value: "large",  label: "Large",  px: "460px" },
];

const BG_TYPES: {
  value: HeroSettings["backgroundType"];
  label: string;
}[] = [
  { value: "gradient", label: "Gradient" },
  { value: "color",    label: "Solid"    },
  { value: "image",    label: "Image"    },
  { value: "video",    label: "Video"    },
];

type Tab = "hero" | "animate" | "video" | "section2" | "popup" | "seo" | "general";

const lbl =
  "block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider";
const sectionTitle =
  "text-white font-semibold text-sm uppercase tracking-wide flex items-center gap-2 mb-4";

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({
  value,
  onChange,
  label,
  sub,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
          value ? "bg-blue-600" : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

// ── PillGroup ─────────────────────────────────────────────────────────────────

function PillGroup<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label?: string;
}) {
  return (
    <div>
      {label && <label className={lbl}>{label}</label>}
      <div className="flex gap-2 flex-wrap">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`flex-1 min-w-[60px] py-2 rounded-xl border text-xs font-medium transition-colors text-center ${
              value === o.value
                ? "border-blue-600 bg-blue-600/20 text-blue-300"
                : "border-white/10 text-slate-400 hover:border-white/20"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [hero, setHero] = useState<HeroSettings>({
    heroTitle: "",
    heroSubtitle: "",
    heroTagline: "",
    profileImageUrl: "",
    imageLayout: "right",
    imageShape: "none",
    imageSize: "medium",
    imageOpacity: 1,
    imageVisible: true,
    backgroundType: "gradient",
    primaryColor: "#060818",
    secondaryColor: "#160830",
    textColor: "#ffffff",
    backgroundImageUrl: "",
    videoUrl: "",
    fallbackImageUrl: "",
    enableVideo: false,
    enableAnimation: true,
    animationSpeed: "medium",
    glowIntensity: "medium",
    enable3DTransition: true,
    transitionIntensity: "medium",
    enable3D: true,
    enableCardTilt: true,
  });

  const [section2, setSection2] = useState<SectionTwoSettings>({
    enabled: true,
    backgroundImageUrl: "",
    heading: "Ready to grow your business online?",
    description: "I build websites that turn visitors into customers.",
    buttonText: "Get My Free Demo",
    buttonLink: "/request-demo",
  });

  const [popup, setPopup] = useState<PopupSettings>({
    enabled: false,
    title: "",
    description: "",
    image: "",
    buttonText: "Get Free Demo",
    buttonLink: "/request-demo",
  });

  const [seo, setSeo] = useState<SeoSettings>({
    title: "",
    description: "",
    keywords: "",
    ogImage: "",
  });

  const [general, setGeneral] = useState<AdminSettings>({
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

  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("hero");

  const refs = {
    heroImg:  useRef<HTMLInputElement>(null),
    heroBg:   useRef<HTMLInputElement>(null),
    fallback: useRef<HTMLInputElement>(null),
    sec2Bg:   useRef<HTMLInputElement>(null),
    popupImg: useRef<HTMLInputElement>(null),
    ogImg:    useRef<HTMLInputElement>(null),
  };

  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    Promise.all([
      getHeroSettings(),
      getSectionTwoSettings(),
      getPopupSettings(),
      getSeoSettings(),
      getAdminSettings(),
    ]).then(([h, s2, p, se, g]) => {
      setHero(h);
      setSection2(s2);
      setPopup(p);
      setSeo(se);
      setGeneral(g);
      setLoading(false);
    });
  }, []);

  const upload = async (
    file: File,
    key: string,
    onDone: (url: string) => void
  ) => {
    setUploading((prev) => ({ ...prev, [key]: true }));
    try {
      const r = await uploadToCloudinary(file);
      onDone(r.url);
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    await Promise.all([
      updateHeroSettings(hero),
      updateSectionTwoSettings(section2),
      updatePopupSettings(popup),
      updateSeoSettings(seo),
      updateAdminSettings(general),
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

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "hero",     label: "Hero",    icon: <Layout className="w-3.5 h-3.5" />   },
    { key: "animate",  label: "Animate", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { key: "video",    label: "Video",   icon: <Video className="w-3.5 h-3.5" />    },
    { key: "section2", label: "Sec 2",   icon: <Layers className="w-3.5 h-3.5" />   },
    { key: "popup",    label: "Popup",   icon: <Bell className="w-3.5 h-3.5" />     },
    { key: "seo",      label: "SEO",     icon: <Search className="w-3.5 h-3.5" />   },
    { key: "general",  label: "General", icon: <Eye className="w-3.5 h-3.5" />      },
  ];

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-extrabold text-white font-display">
          Settings
        </h1>
        <p className="text-slate-500 text-sm">
          Control every part of your homepage
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1 bg-white/5 rounded-xl p-1 md:flex">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === t.key
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ══════════ HERO TAB */}
      {activeTab === "hero" && (
        <div className="space-y-5">
          {/* Live preview */}
          <div className="admin-card overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm font-semibold">
                Live Preview
              </span>
              <span className="text-slate-500 text-xs ml-auto">
                Updates as you edit
              </span>
            </div>
            <div className="relative h-44 overflow-hidden">
              <AnimatedBackground hero={hero} />
              <div className="relative z-10 flex items-center h-full px-5 gap-4">
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-1"
                    style={{ color: "#60a5fa" }}
                  >
                    {hero.heroTagline || "Tagline"}
                  </p>
                  <p
                    className="text-sm font-extrabold font-display leading-tight mb-1 line-clamp-2"
                    style={{ color: hero.textColor }}
                  >
                    {hero.heroTitle || "Your headline"}
                  </p>
                  <p
                    className="text-xs opacity-60 line-clamp-1"
                    style={{ color: hero.textColor }}
                  >
                    {hero.heroSubtitle || "Your subtitle"}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded font-medium">
                      Demo
                    </span>
                    <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded font-medium">
                      WhatsApp
                    </span>
                  </div>
                </div>
                {hero.imageVisible &&
                  hero.imageLayout !== "hidden" &&
                  hero.profileImageUrl && (
                    <div
                      className="relative flex-shrink-0 overflow-hidden"
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius:
                          hero.imageShape === "circle"
                            ? "50%"
                            : hero.imageShape === "rounded"
                            ? "12px"
                            : "4px",
                        opacity: hero.imageOpacity,
                      }}
                    >
                      <Image
                        src={hero.profileImageUrl}
                        alt="Profile"
                        fill
                        className="object-cover object-top"
                        sizes="56px"
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="admin-card p-5 space-y-4">
            <h2 className={sectionTitle}>Hero Text</h2>
            <div>
              <label className={lbl}>Tagline</label>
              <input
                value={hero.heroTagline}
                onChange={(e) =>
                  setHero((p) => ({ ...p, heroTagline: e.target.value }))
                }
                placeholder="Manoj Sen - Web Developer"
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
                className="input-dark resize-none"
              />
            </div>
          </div>

          {/* Image controls */}
          <div className="admin-card p-5 space-y-4">
            <h2 className={sectionTitle}>
              <User className="w-4 h-4 text-blue-400" />
              Profile Image
            </h2>
            <Toggle
              value={hero.imageVisible}
              onChange={(v) => setHero((p) => ({ ...p, imageVisible: v }))}
              label="Show Image"
              sub="Toggle visibility"
            />
            <div>
              <label className={lbl}>Profile Photo</label>
              <div className="flex items-center gap-3 mb-2">
                {hero.profileImageUrl && (
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                    <Image
                      src={hero.profileImageUrl}
                      alt="Profile"
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={refs.heroImg}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      upload(e.target.files[0], "heroImg", (url) =>
                        setHero((p) => ({ ...p, profileImageUrl: url }))
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => refs.heroImg.current?.click()}
                    disabled={uploading.heroImg}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full justify-center transition-colors"
                  >
                    {uploading.heroImg ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {uploading.heroImg ? "Uploading..." : "Upload Photo"}
                  </button>
                </div>
              </div>
              {hero.profileImageUrl && (
                <button
                  type="button"
                  onClick={() =>
                    setHero((p) => ({ ...p, profileImageUrl: "" }))
                  }
                  className="text-xs text-red-400 text-center w-full"
                >
                  Remove
                </button>
              )}
            </div>

            <div>
              <label className={lbl}>Image Position</label>
              <div className="grid grid-cols-2 gap-2">
                {IMAGE_LAYOUTS.map((l) => (
                  <button
                    key={l.value}
                    type="button"
                    onClick={() =>
                      setHero((p) => ({ ...p, imageLayout: l.value }))
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
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {l.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={lbl}>Image Shape</label>
              <div className="grid grid-cols-2 gap-2">
                {IMAGE_SHAPES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() =>
                      setHero((p) => ({ ...p, imageShape: s.value }))
                    }
                    className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors text-center ${
                      hero.imageShape === s.value
                        ? "border-blue-600 bg-blue-600/20 text-blue-300"
                        : "border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <PillGroup
              options={IMAGE_SIZES}
              value={hero.imageSize}
              onChange={(v) => setHero((p) => ({ ...p, imageSize: v }))}
              label="Image Size"
            />

            <div>
              <label className={lbl}>
                Opacity -{" "}
                <span className="text-blue-400">
                  {Math.round((hero.imageOpacity ?? 1) * 100)}%
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={hero.imageOpacity ?? 1}
                onChange={(e) =>
                  setHero((p) => ({
                    ...p,
                    imageOpacity: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-blue-600"
              />
            </div>
          </div>

          {/* Background */}
          <div className="admin-card p-5 space-y-4">
            <h2 className={sectionTitle}>
              <Palette className="w-4 h-4 text-blue-400" />
              Background
            </h2>
            <PillGroup
              options={BG_TYPES}
              value={hero.backgroundType}
              onChange={(v) =>
                setHero((p) => ({ ...p, backgroundType: v }))
              }
              label="Type"
            />
            <div>
              <label className={lbl}>Quick Presets</label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() =>
                      setHero((p) => ({
                        ...p,
                        primaryColor: preset.primary,
                        secondaryColor: preset.secondary,
                        textColor: preset.text,
                        backgroundType: "gradient",
                      }))
                    }
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                      }}
                    />
                    <span className="text-xs text-slate-400">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { key: "primaryColor" as const,  label: "Primary"   },
                  { key: "secondaryColor" as const, label: "Secondary" },
                  { key: "textColor" as const,      label: "Text"      },
                ] as const
              ).map((c) => (
                <div key={c.key}>
                  <label className={lbl}>{c.label}</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={hero[c.key]}
                      onChange={(e) =>
                        setHero((p) => ({ ...p, [c.key]: e.target.value }))
                      }
                      className="w-8 h-8 rounded-lg border border-white/10 bg-transparent cursor-pointer flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={hero[c.key]}
                      onChange={(e) =>
                        setHero((p) => ({ ...p, [c.key]: e.target.value }))
                      }
                      className="input-dark flex-1 !py-1.5 font-mono text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

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
                    <button
                      type="button"
                      onClick={() =>
                        setHero((p) => ({ ...p, backgroundImageUrl: "" }))
                      }
                      className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <input
                  ref={refs.heroBg}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    upload(e.target.files[0], "heroBg", (url) =>
                      setHero((p) => ({ ...p, backgroundImageUrl: url }))
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() => refs.heroBg.current?.click()}
                  disabled={uploading.heroBg}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-60 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full justify-center transition-colors"
                >
                  {uploading.heroBg ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                  {uploading.heroBg ? "Uploading..." : "Upload Background"}
                </button>
              </div>
            )}
          </div>

          {/* 3D */}
          <div className="admin-card p-5 space-y-4">
            <h2 className={sectionTitle}>
              <Layers className="w-4 h-4 text-blue-400" />
              3D Scroll Transition
            </h2>
            <Toggle
              value={hero.enable3DTransition}
              onChange={(v) =>
                setHero((p) => ({ ...p, enable3DTransition: v }))
              }
              label="Enable 3D Scroll"
              sub="Depth effect on scroll (desktop only)"
            />
            <Toggle
              value={hero.enable3D}
              onChange={(v) => setHero((p) => ({ ...p, enable3D: v }))}
              label="Enable 3D UI"
              sub="Global 3D perspective effects"
            />
            <Toggle
              value={hero.enableCardTilt}
              onChange={(v) =>
                setHero((p) => ({ ...p, enableCardTilt: v }))
              }
              label="Card Tilt Effect"
              sub="Hover tilt on project cards"
            />
            {hero.enable3DTransition && (
              <PillGroup
                options={[
                  { value: "low"    as const, label: "Low"    },
                  { value: "medium" as const, label: "Medium" },
                  { value: "high"   as const, label: "High"   },
                ]}
                value={hero.transitionIntensity}
                onChange={(v) =>
                  setHero((p) => ({ ...p, transitionIntensity: v }))
                }
                label="Transition Intensity"
              />
            )}
          </div>
        </div>
      )}

      {/* ══════════ ANIMATE TAB */}
      {activeTab === "animate" && (
        <div className="space-y-5">
          <div className="admin-card overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm font-semibold">
                Animation Preview
              </span>
            </div>
            <div className="relative h-40 overflow-hidden rounded-b-2xl">
              <AnimatedBackground hero={hero} />
              <div className="relative z-10 h-full flex items-center justify-center">
                <p className="text-white/50 text-sm">
                  Live preview of your background animation
                </p>
              </div>
            </div>
          </div>

          <div className="admin-card p-5 space-y-4">
            <h2 className={sectionTitle}>
              <Sparkles className="w-4 h-4 text-blue-400" />
              Background Animation
            </h2>
            <Toggle
              value={hero.enableAnimation !== false}
              onChange={(v) =>
                setHero((p) => ({ ...p, enableAnimation: v }))
              }
              label="Enable Animation"
              sub="Animated gradient + floating orbs"
            />
            <PillGroup
              options={[
                { value: "slow"   as const, label: "Slow"   },
                { value: "medium" as const, label: "Medium" },
                { value: "fast"   as const, label: "Fast"   },
              ]}
              value={hero.animationSpeed ?? "medium"}
              onChange={(v) =>
                setHero((p) => ({ ...p, animationSpeed: v }))
              }
              label="Animation Speed"
            />
            <PillGroup
              options={[
                { value: "subtle" as const, label: "Subtle" },
                { value: "medium" as const, label: "Medium" },
                { value: "strong" as const, label: "Strong" },
              ]}
              value={hero.glowIntensity ?? "medium"}
              onChange={(v) =>
                setHero((p) => ({ ...p, glowIntensity: v }))
              }
              label="Glow Intensity"
            />
          </div>
        </div>
      )}

      {/* ══════════ VIDEO TAB */}
      {activeTab === "video" && (
        <div className="space-y-5">
          <div className="admin-card p-5 space-y-4">
            <h2 className={sectionTitle}>
              <Video className="w-4 h-4 text-blue-400" />
              Background Video
            </h2>
            <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-3 text-xs text-blue-300 space-y-1">
              <p className="font-semibold">Instructions:</p>
              <p>Use MP4 format, keep under 10MB</p>
              <p>Paste a direct .mp4 URL from Cloudinary or CDN</p>
              <p>Video plays on desktop only - set a mobile fallback below</p>
              <p>Set Background Type to Video in Hero tab first</p>
            </div>
            <Toggle
              value={hero.enableVideo}
              onChange={(v) => setHero((p) => ({ ...p, enableVideo: v }))}
              label="Enable Video"
              sub="Replaces gradient background"
            />
            <div>
              <label className={lbl}>Video URL (MP4)</label>
              <input
                value={hero.videoUrl}
                onChange={(e) =>
                  setHero((p) => ({ ...p, videoUrl: e.target.value }))
                }
                placeholder="https://res.cloudinary.com/.../video.mp4"
                className="input-dark"
              />
            </div>
            <div>
              <label className={lbl}>Mobile Fallback Image</label>
              {hero.fallbackImageUrl && (
                <div className="relative h-20 rounded-xl overflow-hidden mb-2">
                  <Image
                    src={hero.fallbackImageUrl}
                    alt="Fallback"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setHero((p) => ({ ...p, fallbackImageUrl: "" }))
                    }
                    className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <input
                ref={refs.fallback}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  upload(e.target.files[0], "fallback", (url) =>
                    setHero((p) => ({ ...p, fallbackImageUrl: url }))
                  )
                }
              />
              <button
                type="button"
                onClick={() => refs.fallback.current?.click()}
                disabled={uploading.fallback}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-60 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full justify-center transition-colors"
              >
                {uploading.fallback ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploading.fallback ? "Uploading..." : "Upload Fallback Image"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ SECTION 2 TAB */}
      {activeTab === "section2" && (
        <div className="space-y-5">
          <div className="admin-card p-5 space-y-4">
            <h2 className={sectionTitle}>
              <Layers className="w-4 h-4 text-blue-400" />
              Section Two
            </h2>
            <Toggle
              value={section2.enabled}
              onChange={(v) => setSection2((p) => ({ ...p, enabled: v }))}
              label="Enable Section"
              sub="Show this section after Hero"
            />
            <div>
              <label className={lbl}>Heading</label>
              <textarea
                value={section2.heading}
                onChange={(e) =>
                  setSection2((p) => ({ ...p, heading: e.target.value }))
                }
                rows={2}
                placeholder="Ready to grow your business online?"
                className="input-dark resize-none"
              />
            </div>
            <div>
              <label className={lbl}>Description</label>
              <textarea
                value={section2.description}
                onChange={(e) =>
                  setSection2((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="input-dark resize-none"
              />
            </div>
            <div>
              <label className={lbl}>Button Text</label>
              <input
                value={section2.buttonText}
                onChange={(e) =>
                  setSection2((p) => ({ ...p, buttonText: e.target.value }))
                }
                placeholder="Get My Free Demo"
                className="input-dark"
              />
            </div>
            <div>
              <label className={lbl}>Button Link</label>
              <input
                value={section2.buttonLink}
                onChange={(e) =>
                  setSection2((p) => ({ ...p, buttonLink: e.target.value }))
                }
                placeholder="/request-demo"
                className="input-dark"
              />
            </div>
            <div>
              <label className={lbl}>Background Image (optional)</label>
              {section2.backgroundImageUrl && (
                <div className="relative h-20 rounded-xl overflow-hidden mb-2">
                  <Image
                    src={section2.backgroundImageUrl}
                    alt="Section 2 bg"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSection2((p) => ({
                        ...p,
                        backgroundImageUrl: "",
                      }))
                    }
                    className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <input
                ref={refs.sec2Bg}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  upload(e.target.files[0], "sec2Bg", (url) =>
                    setSection2((p) => ({
                      ...p,
                      backgroundImageUrl: url,
                    }))
                  )
                }
              />
              <button
                type="button"
                onClick={() => refs.sec2Bg.current?.click()}
                disabled={uploading.sec2Bg}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-60 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full justify-center transition-colors"
              >
                {uploading.sec2Bg ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ImageIcon className="w-4 h-4" />
                )}
                {uploading.sec2Bg
                  ? "Uploading..."
                  : "Upload Background Image"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ POPUP TAB */}
      {activeTab === "popup" && (
        <div className="space-y-5">
          <div className="admin-card overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm font-semibold">
                Popup Preview
              </span>
              <span
                className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
                  popup.enabled
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-slate-500/20 text-slate-400"
                }`}
              >
                {popup.enabled ? "Active" : "Disabled"}
              </span>
            </div>
            <div className="p-4 flex justify-center">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden w-full max-w-xs shadow-lg">
                {popup.image && (
                  <div
                    className="w-full bg-slate-100 flex items-center justify-center"
                    style={{ maxHeight: "140px" }}
                  >
                    <Image
                      src={popup.image}
                      alt="Popup"
                      width={320}
                      height={140}
                      className="w-full h-auto object-contain"
                      style={{ maxHeight: "140px" }}
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 text-sm font-display mb-1">
                    {popup.title || "Popup Title"}
                  </h3>
                  <p className="text-slate-500 text-xs mb-3 line-clamp-2">
                    {popup.description || "Description"}
                  </p>
                  <div className="flex gap-2">
                    <span className="flex-1 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg text-center">
                      {popup.buttonText || "Button"}
                    </span>
                    <span className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-400 text-xs">
                      Later
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card p-5">
            <Toggle
              value={popup.enabled}
              onChange={(v) => setPopup((p) => ({ ...p, enabled: v }))}
              label="Enable Popup"
              sub="Shows on every page visit"
            />
          </div>

          <div className="admin-card p-5 space-y-4">
            <h2 className={sectionTitle}>Popup Content</h2>
            <div>
              <label className={lbl}>Title</label>
              <input
                value={popup.title}
                onChange={(e) =>
                  setPopup((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Special Offer"
                className="input-dark"
              />
            </div>
            <div>
              <label className={lbl}>Description</label>
              <textarea
                value={popup.description}
                onChange={(e) =>
                  setPopup((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                className="input-dark resize-none"
              />
            </div>
            <div>
              <label className={lbl}>Button Text</label>
              <input
                value={popup.buttonText}
                onChange={(e) =>
                  setPopup((p) => ({ ...p, buttonText: e.target.value }))
                }
                className="input-dark"
              />
            </div>
            <div>
              <label className={lbl}>Button Link</label>
              <input
                value={popup.buttonLink}
                onChange={(e) =>
                  setPopup((p) => ({ ...p, buttonLink: e.target.value }))
                }
                className="input-dark"
              />
            </div>
            <div>
              <label className={lbl}>Popup Image (optional)</label>
              {popup.image && (
                <div
                  className="relative mb-2 bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center"
                  style={{ maxHeight: "140px" }}
                >
                  <Image
                    src={popup.image}
                    alt="Popup"
                    width={320}
                    height={140}
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: "140px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setPopup((p) => ({ ...p, image: "" }))}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <input
                ref={refs.popupImg}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  upload(e.target.files[0], "popupImg", (url) =>
                    setPopup((p) => ({ ...p, image: url }))
                  )
                }
              />
              <button
                type="button"
                onClick={() => refs.popupImg.current?.click()}
                disabled={uploading.popupImg}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-60 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full justify-center transition-colors"
              >
                {uploading.popupImg ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploading.popupImg ? "Uploading..." : "Upload Image"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ SEO TAB */}
      {activeTab === "seo" && (
        <div className="space-y-5">
          <div className="admin-card overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm font-semibold">
                Google Preview
              </span>
            </div>
            <div className="p-4">
              <div className="bg-white rounded-xl p-4">
                <p className="text-xs text-green-700 mb-0.5">
                  manoz-portfolio-546n.vercel.app
                </p>
                <p className="text-blue-700 text-sm font-medium leading-tight mb-1 line-clamp-2">
                  {seo.title || "Your Page Title"}
                </p>
                <p className="text-slate-500 text-xs line-clamp-2">
                  {seo.description || "Your meta description will appear here."}
                </p>
              </div>
            </div>
          </div>

          <div className="admin-card p-5 space-y-4">
            <h2 className={sectionTitle}>SEO Settings</h2>
            <div>
              <label className={lbl}>Meta Title</label>
              <input
                value={seo.title}
                onChange={(e) =>
                  setSeo((p) => ({ ...p, title: e.target.value }))
                }
                className="input-dark"
              />
              <p className="text-xs text-slate-600 mt-1">
                {seo.title.length}/60
              </p>
            </div>
            <div>
              <label className={lbl}>Meta Description</label>
              <textarea
                value={seo.description}
                onChange={(e) =>
                  setSeo((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                className="input-dark resize-none"
              />
              <p className="text-xs text-slate-600 mt-1">
                {seo.description.length}/160
              </p>
            </div>
            <div>
              <label className={lbl}>Keywords</label>
              <input
                value={seo.keywords}
                onChange={(e) =>
                  setSeo((p) => ({ ...p, keywords: e.target.value }))
                }
                className="input-dark"
              />
            </div>
            <div>
              <label className={lbl}>OG Image (1200x630px)</label>
              {seo.ogImage && (
                <div className="relative h-20 rounded-xl overflow-hidden mb-2">
                  <Image
                    src={seo.ogImage}
                    alt="OG"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  <button
                    type="button"
                    onClick={() => setSeo((p) => ({ ...p, ogImage: "" }))}
                    className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <input
                ref={refs.ogImg}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  upload(e.target.files[0], "ogImg", (url) =>
                    setSeo((p) => ({ ...p, ogImage: url }))
                  )
                }
              />
              <button
                type="button"
                onClick={() => refs.ogImg.current?.click()}
                disabled={uploading.ogImg}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-60 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full justify-center transition-colors"
              >
                {uploading.ogImg ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploading.ogImg ? "Uploading..." : "Upload OG Image"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ GENERAL TAB */}
      {activeTab === "general" && (
        <div className="space-y-5">
          <div className="admin-card p-5 space-y-4">
            <h2 className={sectionTitle}>Homepage Text</h2>
            <div>
              <label className={lbl}>Main Headline</label>
              <textarea
                value={general.homepageHeadline}
                onChange={(e) =>
                  setGeneral({ ...general, homepageHeadline: e.target.value })
                }
                rows={3}
                className="input-dark resize-none w-full"
              />
            </div>
            <div>
              <label className={lbl}>Subtext</label>
              <textarea
                value={general.homepageSubtext}
                onChange={(e) =>
                  setGeneral({ ...general, homepageSubtext: e.target.value })
                }
                rows={2}
                className="input-dark resize-none w-full"
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
          All changes are live.
        </p>
      )}
    </div>
  );
}
