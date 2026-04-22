"use client";

import { useEffect, useState } from "react";
import { getPopupSettings } from "@/lib/firestore";
import type { PopupSettings } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "manoz_popup_closed";

export default function PopupProvider() {
  const [popup, setPopup] = useState<PopupSettings | null>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const alreadyClosed = localStorage.getItem(STORAGE_KEY);
    if (alreadyClosed) return;

    getPopupSettings().then((data) => {
      if (data.enabled) {
        setPopup(data);
        // Small delay for better UX — page loads first
        setTimeout(() => setVisible(true), 800);
      }
    });
  }, []);

  const close = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
    setTimeout(() => setPopup(null), 300);
  };

  if (!mounted || !popup || !popup.enabled) return null;

  const isExternal = popup.buttonLink.startsWith("http");

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
      />

      {/* Modal */}
      <div
        className={`fixed z-[101] inset-0 flex items-center justify-center p-4 transition-all duration-300 ${
          visible
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="relative bg-white dark:bg-[#0d0d1a] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-white/10">
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close popup"
          >
            <X className="w-4 h-4 text-slate-600 dark:text-white" />
          </button>

          {/* Image */}
          {popup.image && (
            <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
              <Image
                src={popup.image}
                alt={popup.title}
                fill
                className="object-cover"
                sizes="448px"
                priority
              />
              {/* Gradient overlay on image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display mb-2">
              {popup.title}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
              {popup.description}
            </p>

            <div className="flex gap-3">
              {/* CTA button */}
              {isExternal ? (
                <a
                  href={popup.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="flex-1 btn-primary text-center text-sm !py-3"
                >
                  {popup.buttonText}
                </a>
              ) : (
                <Link
                  href={popup.buttonLink}
                  onClick={close}
                  className="flex-1 btn-primary text-center text-sm !py-3"
                >
                  {popup.buttonText}
                </Link>
              )}

              {/* Dismiss */}
              <button
                onClick={close}
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-medium transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
