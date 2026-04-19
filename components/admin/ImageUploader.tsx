"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Upload, X, Loader2, ImagePlus } from "lucide-react";

interface Props {
  value: string[];          // existing URLs
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

interface UploadItem {
  id: string;
  file?: File;
  preview: string;
  url?: string;             // Cloudinary URL after upload
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

    // Upload each file
    const uploaded: UploadItem[] = await Promise.all(
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
      const updated = prev.map((p) => {
        const found = uploaded.find((u) => u.id === p.id);
        return found ?? p;
      });
      // Notify parent of all done URLs
      const urls = updated.filter((i) => i.status === "done" && i.url).map((i) => i.url!);
      onChange(urls);
      return updated;
    });
  };

  const remove = (id: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      const urls = updated.filter((i) => i.url).map((i) => i.url!);
      onChange(urls);
      return updated;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const anyUploading = items.some((i) => i.status === "uploading");

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      {items.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
            ${dragging
              ? "border-violet-500 bg-violet-950"
              : "border-slate-700 hover:border-violet-600 bg-slate-900"
            }
          `}
        >
          <ImagePlus className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-400">
            <span className="text-violet-400 font-medium">Tap to upload</span> or drag images here
          </p>
          <p className="text-xs text-slate-600 mt-1">
            PNG, JPG, WEBP · Max {maxImages} images
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>
      )}

      {/* Preview Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {items.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-slate-800 group">
              <Image
                src={item.preview}
                alt="Upload preview"
                fill
                className="object-cover"
                sizes="120px"
              />

              {/* Upload Overlay */}
              {item.status === "uploading" && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}

              {/* Error Overlay */}
              {item.status === "error" && (
                <div className="absolute inset-0 bg-red-900/70 flex items-center justify-center">
                  <span className="text-xs text-red-200 font-medium">Failed</span>
                </div>
              )}

              {/* Remove Button */}
              {item.status !== "uploading" && (
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload status */}
      {anyUploading && (
        <p className="text-xs text-violet-400 flex items-center gap-1.5">
          <Loader2 className="w-3 h-3 animate-spin" /> Uploading to Cloudinary...
        </p>
      )}
      {!anyUploading && items.filter(i => i.status === "done").length > 0 && (
        <p className="text-xs text-green-400">
          ✓ {items.filter(i => i.status === "done").length} image(s) ready
        </p>
      )}
    </div>
  );
}
