import { buildWhatsAppLink } from "@/lib/utils";

interface Props {
  message?: string;
  label?: string;
  className?: string;
}

export default function WhatsAppButton({
  message = "Hi Manoz! I'm interested in working with you.",
  label = "💬 Chat on WhatsApp",
  className = "",
}: Props) {
  return (
    <a
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors ${className}`}
    >
      {label}
    </a>
  );
}
