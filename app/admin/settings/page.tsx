"use client";

import { useEffect, useState, useRef } from "react";
import {
  getAdminSettings, updateAdminSettings,
  getHeroSettings, updateHeroSettings,
  getPopupSettings, updatePopupSettings,
  getSeoSettings, updateSeoSettings,
} from "@/lib/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { AdminSettings, HeroSettings, PopupSettings, SeoSettings } from "@/types";
import {
  Loader2, Save, CheckCircle2, Upload, User,
  Image as ImageIcon, Palette, Layout, Eye,
  Bell, Search, X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ── Constants ─────────────────────────────────────────────────────────────────

const PRESETS = [
  { label: "Dark Navy", primary: "#060818", secondary: "#160830", text: "#ffffff" },
  { label: "Midnight", primary: "#0a0f2e", secondary: "#1a1060", text: "#ffffff" },
  { label: "Forest", primary: "#051a0f", secondary: "#0a3020", text: "#ffffff" },
  { label: "Charcoal", primary: "#111111", secondary: "#2a2a2a", text: "#ffffff" },
  { label: "Indigo", primary: "#1e1b4b", secondary: "#312e81", text: "#ffffff" },
];

const LAYOUTS = [
  { value: "right-hero", label: "Right Hero", desc: "Image right, text left" },
  { value: "left-hero", label: "Left Hero", desc: "Image left, text right" },
  { value: "center-blend", label: "Center Blend", desc: "Centered above text" },
  { value: "full-overlay", label: "Full Overlay", desc: "Large center overlay" },
];

const BG_TYPES = [
  { value: "gradient", label: "Gradient" },
  { value: "color", label: "Solid" },
  { value: "image", label: "Image" },
];

type Tab = "hero" | "popup" | "seo" | "general";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>({
    defaultTheme: "light", homepageHeadline: "", homepageSubtext: "",
    profileImageUrl: "", profileImageSize: "medium", profileImageShape: "rounded",
    heroBgImageUrl: "", heroBgOpacity: 10, heroBgColor: "#060818",
  });
  const [hero, setHero] = useState<HeroSettings>({
    heroTitle: "", heroSubtitle: "", heroTagline: "",
    profileImageUrl: "", imageLayout: "right-hero",
    backgroundType: "gradient", primaryColor: "#060818",
    secondaryColor: "#160830", textColor: "#ffffff", backgroundImageUrl: "",
  });
  const [popup, setPopup] = useState<PopupSettings>({
    enabled: false, title: "", description: "",
    image: "", buttonText: "Get Free Demo", buttonLink: "/request-demo",
  });
  const [seo, setSeo] = useState<SeoSettings>({
    title: "", description: "", keywords: "", ogImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("hero");

  // Upload states
  const [uploadingHeroProfile, setUploadingHeroProfile] = useState(false);
  const [uploadingHeroBg, setUploadingHeroBg] = useState(false);
  const [uploadingPopupImg, setUploadingPopupImg] = useState(false);
  const [uploadingOgImg, setUploadingOgImg] = useState(false);

  const heroProfileRef = useRef<HTMLInputElement>(null);
  const heroBgRef = useRef<HTMLInputElement>(null);
  const popupImgRef = useRef<HTMLInputElement>(null);
  const ogImgRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      getAdminSettings(), getHeroSettings(),
      getPopupSettings(), getSeoSettings(),
    ]).then(([s, h, p, se]) => {
      setSettings(s); setHero(h); setPopup(p); setSeo(se);
      setLoading(false);
    });
  }, []);

  const handleUpload = async (
    file: File,
    setLoading: (v: boolean) => void,
    onSuccess: (url: string) => void
  ) => {
    setLoading(true);
    try {
      const result = await uploadToCloudinary(file);
      onSuccess(result.url);
    } catch { alert("Upload failed. Please try again."); }
    finally { setLoading(false); }
  };

  const save = async () => {
    setSaving(true); setSaved(false);
    await Promise.all([
      updateAdminSettings(settings),
      updateHeroSettings(hero),
      updatePopupSettings(popup),
      updateSeoSettings(seo),
    ]);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
      </div>
    );
  }

  const previewBg = hero.backgroundType === "gradient"
    ? `linear-gradient(135deg, ${hero.primaryColor}, ${hero.secondaryColor})`
    : hero.primaryColor;

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "hero", label: "Hero", icon: <Layout className="w-4 h-4" /> },
    { key: "popup", label: "Popup", icon: <Bell className="w-4 h-4" /> },
    { key: "seo", label: "SEO", icon: <Search className="w-4 h-4" /> },
    { key: "general", label: "General", icon: <Eye className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-extrabold text-white font-display">Settings</h1>
        <p className="text-slate-500 text-sm">Control every part of your homepage</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === t.key ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════ HERO TAB */}
      {activeTab === "hero" && (
        <div className="space-y-5">

          {/* Live preview */}
          <div className="admin-card overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm font-semibold">Live Preview</span>
              <span className="text-slate-500 text-xs ml-auto">Updates as you type</span>
            </div>
            <div className="relative h-44 flex items-center overflow-hidden px-6" style={{ background: previewBg }}>
              {hero.backgroundType === "image" && hero.backgroundImageUrl && (
                <div className="absolute inset-0">
                  <Image src={hero.backgroundImageUrl} alt="bg" fill className="object-cover opacity-40" sizes="400px" />
                </div>
              )}
              <div className="relative z-10 flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#60a5fa" }}>
                  {hero.heroTagline || "Your tagline"}
                </p>
                <h3 className="text-base font-extrabold font-display leading-tight mb-1 line-clamp-2" style={{ color: hero.textColor }}>
                  {hero.heroTitle || "Your headline here"}
                </h3>
                <p className="text-xs opacity-60 line-clamp-1" style={{ color: hero.textColor }}>
                  {hero.heroSubtitle || "Your subtitle here"}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg font-medium">Free Demo</span>
                  <span className="text-xs bg-white/10 text-white px-3 py-1 rounded-lg font-medium">WhatsApp</span>
                </div>
              </div>
              {hero.profileImageUrl && (
                <div className="relative h-36 w-20 flex-shrink-0 ml-4">
                  <Image
                    src={hero.profileImageUrl}
                    alt="Profile"
                    fill className="object-cover object-top"
                    sizes="80px"
                    style={{
                      maskImage: "radial-gradient(ellipse 80% 90% at 50% 30%, black 30%, transparent 80%)",
                      WebkitMaskImage: "radial-gradient(ellipse 80% 90% at 50% 30%, black 30%, transparent 80%)",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Text */}
          <div className="admin-card p-5 space-y-4">
            <h2 className={sectionTitle}>Hero Text</h2>
            <div>
              <label className={lbl}>Tagline</label>
              <input value={hero.heroTagline} onChange={(e) => setHero((p) => ({ ...p, heroTagline: e.target.value }))} placeholder="Manoj Sen — Web Developer" className="input-dark" />
            </div>
            <div>
              <label className={lbl}>Main Title</label>
              <textarea value={hero.heroTitle} onChange={(e) => setHero((p) => ({ ...p, heroTitle: e.target.value }))} rows={3} placeholder="I build high-converting websites for..." className="input-dark resize-none" />
            </div>
            <div>
              <label className={lbl}>Subtitle</label>
              <textarea value={hero.heroSubtitle} onChange={(e) => setHero((p) => ({ ...p, heroSubtitle: e.target.value }))} rows={2} placeholder="Turn your audience into customers..." className="input-dark resize-none" />
            </div>
          </div>

          {/* Profile image */}
          <div className="admin-card p-5 space-y-4">
            <h2 className={sectionTitle}><User className="w-4 h-4 text-blue-400" /> Profile Image</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                {hero.profileImageUrl ? (
                  <Image src={hero.profileImageUrl} alt="Profile" fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><User className="w-8 h-8 text-slate-600" /></div>
                )}
              </div>
              <div className="flex-1">
                <input ref={heroProfileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], setUploadingHeroProfile, (url) => setHero((p) => ({ ...p, profileImageUrl: url })))} />
                <button type="button" onClick={() => heroProfileRef.current?.click()} disabled={uploadingHeroProfile}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full justify-center transition-colors">
                  {uploadingHeroProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploadingHeroProfile ? "Uploading..." : "Upload Photo"}
                </button>
                {hero.profileImageUrl && (
                  <button type="button" onClick={() => setHero((p) => ({ ...p, profileImageUrl: "" }))} className="text-xs text-red-400 mt-2 w-full text-center">Remove</button>
                )}
              </div>
            </div>
          </div>

          {/* Layout */}
          <div className="admin-card p-5 space-y-3">
            <h2 className={sectionTitle}><Layout className="w-4 h-4 text-blue-400" /> Image Layout</h2>
            <div className="grid grid-cols-2 gap-2">
              {LAYOUTS.map((l) => (
                <button key={l.value} type="button"
                  onClick={() => setHero((p) => ({ ...p, imageLayout: l.value as HeroSettings["imageLayout"] }))}
                  className={`p-3 rounded-xl border text-left transition-colors ${hero.imageLayout === l.value ? "border-blue-600 bg-blue-600/20" : "border-white/10 hover:border-white/20"}`}>
                  <p className={`text-xs font-semibold ${hero.imageLayout === l.value ? "text-blue-300" : "text-white"}`}>{l.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{l.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Background */}
          <div className="admin-card p-5 space-y-4">
            <h2 className={sectionTitle}><Palette className="w-4 h-4 text-blue-400" /> Background</h2>

            <div>
              <label className={lbl}>Type</label>
              <div className="flex gap-2">
                {BG_TYPES.map((bt) => (
                  <button key={bt.value} type="button"
                    onClick={() => setHero((p) => ({ ...p, backgroundType: bt.value as HeroSettings["backgroundType"] }))}
                    className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-colors ${hero.backgroundType === bt.value ? "border-blue-600 bg-blue-600/20 text-blue-300" : "border-white/10 text-slate-400 hover:border-white/20"}`}>
                    {bt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={lbl}>Preset Themes</label>
              <div className="flex gap-2 flex-wrap">
                {PRESETS.map((preset) => (
                  <button key={preset.label} type="button"
                    onClick={() => setHero((p) => ({ ...p, primaryColor: preset.primary, secondaryColor: preset.secondary, textColor: preset.text, backgroundType: "gradient" }))}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors group">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }} />
                    <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Primary</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={hero.primaryColor} onChange={(e) => setHero((p) => ({ ...p, primaryColor: e.target.value }))} className="w-10 h-9 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                  <input type="text" value={hero.primaryColor} onChange={(e) => setHero((p) => ({ ...p, primaryColor: e.target.value }))} className="input-dark flex-1 !py-2 font-mono text-xs" placeholder="#060818" />
                </div>
              </div>
              <div>
                <label className={lbl}>Secondary</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={hero.secondaryColor} onChange={(e) => setHero((p) => ({ ...p, secondaryColor: e.target.value }))} className="w-10 h-9 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                  <input type="text" value={hero.secondaryColor} onChange={(e) => setHero((p) => ({ ...p, secondaryColor: e.target.value }))} className="input-dark flex-1 !py-2 font-mono text-xs" placeholder="#160830" />
                </div>
              </div>
            </div>

            <div>
              <label className={lbl}>Text Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={hero.textColor} onChange={(e) => setHero((p) => ({ ...p, textColor: e.target.value }))} className="w-10 h-9 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                <input type="text" value={hero.textColor} onChange={(e) => setHero((p) => ({ ...p, textColor: e.target.value }))} className="input-dark flex-1 !py-2 font-mono text-xs" placeholder="#ffffff" />
              </div>
            </div>

            {hero.backgroundType === "image" && (
              <div>
                <label className={lbl}>Background Image</label>
                {hero.backgroundImageUrl && (
                  <div className="relative h-16 rounded-xl overflow-hidden mb-2">
                    <Image src={hero.backgroundImageUrl} alt="Background" fill className="object-cover" sizes="400px" />
                  </div>
                )}
                <input ref={heroBgRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], setUploadingHeroBg, (url) => setHero((p) => ({ ...p, backgroundImageUrl: url })))} />
                <button type="button" onClick={() => heroBgRef.current?.click()} disabled={uploadingHeroBg}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-60 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full justify-center transition-colors">
                  {uploadingHeroBg ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  {uploadingHeroBg ? "Uploading..." : "Upload Background"}
                </button>
                {hero.backgroundImageUrl && (
                  <button type="button" onClick={() => setHero((p) => ({ ...p, backgroundImageUrl: "" }))} className="text-xs text-red-400 mt-2 w-full text-center">Remove</button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════ POPUP TAB */}
      {activeTab === "popup" && (
        <div className="space-y-5">

          {/* Popup live preview */}
          <div className="admin-card overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm font-semibold">Popup Preview</span>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${popup.enabled ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"}`}>
                {popup.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="p-4">
              <div className="bg-white dark:bg-[#0d0d1a] rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden max-w-xs mx-auto">
                {popup.image && (
                  <div className="relative h-28 bg-slate-100 dark:bg-slate-800">
                    <Image src={popup.image} alt="Popup" fill className="object-cover" sizes="320px" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm font-display mb-1">
                    {popup.title || "Popup Title"}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-3 line-clamp-2">
                    {popup.description || "Popup description goes here"}
                  </p>
                  <div className="flex gap-2">
                    <span className="flex-1 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg text-center">
                      {popup.buttonText || "Button"}
                    </span>
                    <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-xs">Later</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enable toggle */}
          <div className="admin-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">Enable Popup</p>
                <p className="text-slate-500 text-xs mt-0.5">Show popup to new visitors on first load</p>
              </div>
              <button
                type="button"
                onClick={() => setPopup((p) => ({ ...p, enabled: !p.enabled }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${popup.enabled ? "bg-blue-600" : "bg-slate-700"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${popup.enabled ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>

          {/* Popup fields */}
          <div className="admin-card p-5 space-y-4">
            <h2 className={sectionTitle}>Popup Content</h2>
            <div>
              <label className={lbl}>Title</label>
              <input value={popup.title} onChange={(e) => setPopup((p) => ({ ...p, title: e.target.value }))} placeholder="Special Offer" className="input-dark" />
            </div>
            <div>
              <label className={lbl}>Description</label>
              <textarea value={popup.description} onChange={(e) => setPopup((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Get a free website demo..." className="input-dark resize-none" />
            </div>
            <div>
              <label className={lbl}>Button Text</label>
              <input value={popup.buttonText} onChange={(e) => setPopup((p) => ({ ...p, buttonText: e.target.value }))} placeholder="Get Free Demo" className="input-dark" />
            </div>
            <div>
              <label className={lbl}>Button Link</label>
              <input value={popup.buttonLink} onChange={(e) => setPopup((p) => ({ ...p, buttonLink: e.target.value }))} placeholder="/request-demo" className="input-dark" />
            </div>

            {/* Popup image */}
            <div>
              <label className={lbl}>Popup Image (optional)</label>
              {popup.image && (
                <div className="relative h-24 rounded-xl overflow-hidden mb-2">
                  <Image src={popup.image} alt="Popup" fill className="object-cover" sizes="400px" />
                  <button type="button" onClick={() => setPopup((p) => ({ ...p, image: "" }))} className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <input ref={popupImgRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], setUploadingPopupImg, (url) => setPopup((p) => ({ ...p, image: url })))} />
              <button type="button" onClick={() => popupImgRef.current?.click()} disabled={uploadingPopupImg}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-60 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full justify-center transition-colors">
                {uploadingPopupImg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploadingPopupImg ? "Uploading..." : "Upload Popup Image"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ SEO TAB */}
      {activeTab === "seo" && (
        <div className="space-y-5">

          {/* SEO preview */}
          <div className="admin-card overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm font-semibold">Google Preview</span>
            </div>
            <div className="p-4">
              <div className="bg-white rounded-xl p-4 max-w-sm">
                <p className="text-xs text-slate-500 mb-1">manoz-portfolio.vercel.app</p>
                <p className="text-blue-700 text-sm font-medium leading-tight mb-1 line-clamp-2">
                  {seo.title || "Page Title"}
                </p>
                <p className="text-slate-600 text-xs line-clamp-2">
                  {seo.description || "Page description will appear here in search results."}
                </p>
              </div>
            </div>
          </div>

          <div className="admin-card p-5 space-y-4">
            <h2 className={sectionTitle}>SEO Settings</h2>
            <div>
              <label className={lbl}>Meta Title</label>
              <input value={seo.title} onChange={(e) => setSeo((p) => ({ ...p, title: e.target.value }))} placeholder="Manoz — High-Converting Websites" className="input-dark" />
              <p className="text-xs text-slate-600 mt-1">{seo.title.length}/60 chars recommended</p>
            </div>
            <div>
              <label className={lbl}>Meta Description</label>
              <textarea value={seo.description} onChange={(e) => setSeo((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="I build high-converting websites for..." className="input-dark resize-none" />
              <p className="text-xs text-slate-600 mt-1">{seo.description.length}/160 chars recommended</p>
            </div>
            <div>
              <label className={lbl}>Keywords (comma separated)</label>
              <input value={seo.keywords} onChange={(e) => setSeo((p) => ({ ...p, keywords: e.target.value }))} placeholder="web developer, portfolio, Instagram seller website..." className="input-dark" />
            </div>

            {/* OG Image */}
            <div>
              <label className={lbl}>OG Image (for social sharing — 1200×630px)</label>
              {seo.ogImage && (
                <div className="relative h-24 rounded-xl overflow-hidden mb-2">
                  <Image src={seo.ogImage} alt="OG Image" fill className="object-cover" sizes="400px" />
                  <button type="button" onClick={() => setSeo((p) => ({ ...p, ogImage: "" }))} className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <input ref={ogImgRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], setUploadingOgImg, (url) => setSeo((p) => ({ ...p, ogImage: url })))} />
              <button type="button" onClick={() => ogImgRef.current?.click()} disabled={uploadingOgImg}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-60 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full justify-center transition-colors">
                {uploadingOgImg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploadingOgImg ? "Uploading..." : "Upload OG Image"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ GENERAL TAB */}
      {activeTab === "general" && (
        <div className="space-y-5">
          <div className="admin-card p-5 space-y-4">
            <h2 className={sectionTitle}>General Homepage Text</h2>
            <div>
              <label className={lbl}>Main Headline</label>
              <textarea value={settings.homepageHeadline} onChange={(e) => setSettings({ ...settings, homepageHeadline: e.target.value })} rows={3} className="input-dark resize-none w-full" placeholder="I build high-converting websites for..." />
            </div>
            <div>
              <label className={lbl}>Subtext</label>
              <textarea value={settings.homepageSubtext} onChange={(e) => setSettings({ ...settings, homepageSubtext: e.target.value })} rows={2} className="input-dark resize-none w-full" placeholder="Turn your audience into customers..." />
            </div>
          </div>
        </div>
      )}

      {/* Save button */}
      <button onClick={save} disabled={saving} className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors">
        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</>
          : <><Save className="w-4 h-4" /> Save All Settings</>}
      </button>

      {saved && <p className="text-center text-emerald-400 text-sm">All changes are live.</p>}
    </div>
  );
}

const lbl = "block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider";
const sectionTitle = "text-white font-semibold text-sm uppercase tracking-wide flex items-center gap-2";
