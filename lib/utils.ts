import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine Tailwind classes safely
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

/**
 * WhatsApp link builder
 */
export function buildWhatsAppLink(message: string) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916296622391";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
