"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { X, Loader2, ImagePlus } from "lucide-react";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

interface UploadItem {
  id: string;
  file?: File;
  preview: string;
  url?: string;
  status: "pending" | "uploading" | "done" | "error";
}

export default function ImageUploader({ value, onChange, maxImages = 8 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploadItem[]>(
    value.map((url) => ({ id: url, preview: url, url, status: "done" }))
  );
  const [dragging, setDragging] = useState(false);

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, maxImages - items.length);
    const newItems: UploadItem[] = newFiles.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
      status: "uploading" as const,
    }));
    setItems((prev) => [...prev, ...newItems]);

    const uploaded = await Promise.all(
      newItems.map(async (item) => {
        try {
          const result = await uploadToCloudinary(item.file!);
          return { ...item, url: result.url, status: "done" as const };
        } catch {
          return { ...item, status: "error" as const };
        }
      })
    );

    setItems((prev) => {
      const updated = prev.map((p) => uploaded.find((u) => u.id === p.id) ?? p);
      onChange(updated.filter((i) => i.status === "done" && i.url).map((i) => i.url!));
      return updated;
    });
  };

  const remove = (id: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      onChange(updated.filter((i) => i.url).map((i) => i.url!));
      return updated;
    });
  };

  return (
    <div className="space-y-3">
      {items.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${dragging ? "border-blue-500 bg-blue-500/10" : "border-white/10 hover:border-blue-500/50 bg-white/[0.02]"}`}
        >
          <ImagePlus className="w-7 h-7 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-400"><span className="text-blue-400 font-medium">Tap to upload</span> or drag images</p>
          <p className="text-xs text-slate-600 mt-1">PNG, JPG, WEBP · Max {maxImages}</p>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {items.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-slate-800 group">
              <Image src={item.preview} alt="Upload preview" fill className="object-cover" sizes="120px" />
              {item.status === "uploading" && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
              {item.status === "error" && (
                <div className="absolute inset-0 bg-red-900/70 flex items-center justify-center">
                  <span className="text-xs text-red-200 font-medium">Failed</span>
                </div>
              )}
              {item.status !== "uploading" && (
                <button type="button" onClick={() => remove(item.id)} className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {items.some((i) => i.status === "uploading") && (
        <p className="text-xs text-blue-400 flex items-center gap-1.5">
          <Loader2 className="w-3 h-3 animate-spin" /> Uploading to Cloudinary...
        </p>
      )}
    </div>
  );
}
