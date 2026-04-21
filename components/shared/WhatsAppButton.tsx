import { buildWhatsAppLink } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface Props {
  message?: string;
  label?: string;
  className?: string;
}

export default function WhatsAppButton({
  message = "Hi Manoz! I'm interested in working with you.",
  label = "WhatsApp Me",
  className = "",
}: Props) {
  return (
    <a
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-150 hover:-translate-y-0.5 text-sm min-h-[44px] ${className}`}
    >
      <MessageCircle className="w-4 h-4 flex-shrink-0" />
      {label}
    </a>
  );
}
