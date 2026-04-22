"use client";

import { useEffect, useState } from "react";
import { getPopupSettings } from "@/lib/firestore";
import type { PopupSettings } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

export default function PopupProvider() {
  const [popup, setPopup] = useState<PopupSettings | null>(null);
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // No localStorage — fetch and show on every page load
    getPopupSettings().then((data) => {
      if (data.enabled) {
        setPopup(data);
        setVisible(true);
        // Double rAF ensures DOM is painted before animation starts
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setAnimateIn(true));
        });
      }
    });
  }, []);

  const close = () => {
    setAnimateIn(false);
    setTimeout(() => {
      setVisible(false);
      setPopup(null);
    }, 250);
  };

  if (!visible || !popup) return null;

  const isExternal = popup.buttonLink.startsWith("http");

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
        style={{
          opacity: animateIn ? 1 : 0,
          transition: "opacity 250ms ease",
        }}
        onClick={close}
        aria-hidden="true"
      />

      {/* Modal wrapper — centers content */}
      <div
        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
        style={{ pointerEvents: animateIn ? "auto" : "none" }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-title"
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
          style={{
            opacity: animateIn ? 1 : 0,
            transform: animateIn ? "scale(1)" : "scale(0.95)",
            transition: "opacity 250ms ease, transform 250ms ease",
          }}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close popup"
          >
            <X className="w-4 h-4 text-slate-700" />
          </button>

          {/* Image — object-contain, all aspect ratios, no cropping */}
          {popup.image && (
            <div
              className="w-full bg-slate-100 flex items-center justify-center overflow-hidden"
              style={{ maxHeight: "260px" }}
            >
              <Image
                src={popup.image}
                alt={popup.title}
                width={448}
                height={260}
                loading="lazy"
                className="w-full h-auto"
                style={{ maxHeight: "260px", objectFit: "contain" }}
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <h2
              id="popup-title"
              className="text-xl font-extrabold text-slate-900 font-display mb-2"
            >
              {popup.title}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              {popup.description}
            </p>

            <div className="flex gap-3">
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

              <button
                onClick={close}
                className="px-4 py-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-medium transition-colors"
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
