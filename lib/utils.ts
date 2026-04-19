import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Build a pre-filled WhatsApp link */
export function buildWhatsAppLink(message: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Format Firestore Timestamp to readable date */
export function formatDate(timestamp: { seconds: number } | null): string {
  if (!timestamp) return "—";
  return new Date(timestamp.seconds * 1000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Status color mapping */
export function getStatusColor(
  status: string
): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700" },
    in_progress: { bg: "bg-blue-100", text: "text-blue-700" },
    completed: { bg: "bg-green-100", text: "text-green-700" },
    ready: { bg: "bg-green-100", text: "text-green-700" },
    updated: { bg: "bg-purple-100", text: "text-purple-700" },
  };
  return map[status] ?? { bg: "bg-gray-100", text: "text-gray-600" };
}
