"use client";

import { useEffect, useState, useRef } from "react";
import { getAdminSettings, updateAdminSettings } from "@/lib/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { AdminSettings } from "@/types";
import { Loader2, Save, CheckCircle2, Upload, User, Image as ImageIcon } from "lucide-react";
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
    heroBgColor: "#060818",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAdminSettings().then((s) => { setSettings(s); setLoading(false); });
  }, []);

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProfile(true);
    try {
      const result = await uploadToCloudinary(file);
      setSettings((prev) => ({ ...prev, profileImageUrl: result.url }));
    } catch { alert("Upload failed."); }
    finally { setUploadingProfile(false); }
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBg(true);
    try {
      const result = await uploadToCloudinary(file);
      setSettings((prev) => ({ ...prev, heroBgImageUrl: result.url }));
    } catch { alert("Upload failed."); }
    finally { setUploadingBg(false); }
  };

  const save = async () => {
    setSaving(true); setSaved(false);
    await updateAdminSettings(settings);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-blue-400 animate-spin" /></div>;

  const sizeClass = { small: "w-16 h-16", medium: "w-24 h-24", large: "w-32 h-32" }[settings.profileImageSize];
  const shapeClass = { circle: "rounded-full", rounded: "rounded-2xl", square: "rounded-none" }[settings.profileImageShape];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-extrabold text-white font-display">Settings</h1>
        <p className="text-slate-500 text-sm">Full control over your homepage appearance</p>
      </div>

      <div className="admin-card p-5 space-y-4">
        <h2 className="text-white font-semibold flex items-center gap-2 text-sm uppercase tracking-wide">
          <User className="w-4 h-4 text-blue-400" /> Profile Image
        </h2>
        <div className="flex items-center gap-4">
          <div className={`relative overflow-hidden bg-slate-800 flex-shrink-0 ${sizeClass} ${shapeClass}`}>
            {settings.profileImageUrl ? (
              <Image src={settings.profileImageUrl} alt="Profile" fill className="object-cover" sizes="128px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><User className="w-8 h-8 text-slate-600" /></div>
            )}
          </div>
          <div className="flex-1">
            <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
            <button type="button" onClick={() => profileInputRef.current?.click()} disabled={uploadingProfile}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full justify-center transition-colors">
              {uploadingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploadingProfile ? "Uploading..." : "Upload Photo"}
            </button>
            {settings.profileImageUrl && (
              <button type="button" onClick={() => setSettings((p) => ({ ...p, profileImageUrl: "" }))} className="text-xs text-red-400 mt-2 w-full text-center">Remove photo</button>
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Image Size</label>
          <div className="flex gap-2">
            {(["small","medium","large"] as const).map((s) => (
              <button key={s} type="button" onClick={() => setSettings((p) => ({ ...p, profileImageSize: s }))}
                className={`flex-1 py-2 rounded-xl border text-xs font-medium capitalize transition-colors ${settings.profileImageSize === s ? "border-blue-600 bg-blue-600/20 text-blue-300" : "border-white/10 text-slate-400 hover:border-white/20"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Image Shape</label>
          <div className="flex gap-2">
            {(["circle","rounded","square"] as const).map((s) => (
              <button key={s} type="button" onClick={() => setSettings((p) => ({ ...p, profileImageShape: s }))}
                className={`flex-1 py-2 rounded-xl border text-xs font-medium capitalize transition-colors ${settings.profileImageShape === s ? "border-blue-600 bg-blue-600/20 text-blue-300" : "border-white/10 text-slate-400 hover:border-white/20"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-card p-5 space-y-4">
        <h2 className="text-white font-semibold flex items-center gap-2 text-sm uppercase tracking-wide">
          <ImageIcon className="w-4 h-4 text-blue-400" /> Hero Background
        </h2>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Background Image (optional)</label>
          {settings.heroBgImageUrl && (
            <div className="relative h-20 rounded-xl overflow-hidden mb-2">
              <Image src={settings.heroBgImageUrl} alt="Background" fill className="object-cover" sizes="400px" />
            </div>
          )}
          <input ref={bgInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
          <button type="button" onClick={() => bgInputRef.current?.click()} disabled={uploadingBg}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-60 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full justify-center transition-colors">
            {uploadingBg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploadingBg ? "Uploading..." : "Upload Background Image"}
          </button>
          {settings.heroBgImageUrl && (
            <button type="button" onClick={() => setSettings((p) => ({ ...p, heroBgImageUrl: "" }))} className="text-xs text-red-400 mt-2 w-full text-center">Remove background</button>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Background Color</label>
          <div className="flex items-center gap-3">
            <input type="color" value={settings.heroBgColor} onChange={(e) => setSettings((p) => ({ ...p, heroBgColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
            <span className="text-slate-400 text-sm font-mono">{settings.heroBgColor}</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
            Overlay Opacity — <span className="text-blue-400">{settings.heroBgOpacity}%</span>
          </label>
          <input type="range" min={0} max={100} value={settings.heroBgOpacity} onChange={(e) => setSettings((p) => ({ ...p, heroBgOpacity: Number(e.target.value) }))} className="w-full accent-blue-600" />
        </div>
      </div>

      <div className="admin-card p-5 space-y-4">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wide">Homepage Text</h2>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Main Headline</label>
          <textarea value={settings.homepageHeadline} onChange={(e) => setSettings({ ...settings, homepageHeadline: e.target.value })} rows={3} className="input-dark resize-none w-full" placeholder="I build high-converting websites for..." />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Subtext</label>
          <textarea value={settings.homepageSubtext} onChange={(e) => setSettings({ ...settings, homepageSubtext: e.target.value })} rows={2} className="input-dark resize-none w-full" placeholder="Turn your audience into customers..." />
        </div>
      </div>

      <button onClick={save} disabled={saving} className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors">
        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save All Settings</>}
      </button>
      {saved && <p className="text-center text-emerald-400 text-sm">Changes are live on your homepage.</p>}
    </div>
  );
}
