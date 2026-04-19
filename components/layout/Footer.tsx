import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/utils";
import { Code2 } from "lucide-react";

export default function Footer() {
  const waLink = buildWhatsAppLink("Hi Manoz! I visited your portfolio and I'm interested in building a website.");

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <Code2 className="w-5 h-5 text-violet-400" />
            Manoz
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Building high-converting websites for creators, local businesses,
            and Instagram-based sellers.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-violet-400 transition-colors">Home</Link></li>
            <li><Link href="/projects" className="hover:text-violet-400 transition-colors">Projects</Link></li>
            <li><Link href="/request-demo" className="hover:text-violet-400 transition-colors">Request a Demo</Link></li>
            <li><Link href="/dashboard" className="hover:text-violet-400 transition-colors">Client Dashboard</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Get In Touch</h3>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            💬 WhatsApp Me
          </a>
          <p className="text-xs text-slate-500 mt-3">
            Available Mon–Sat, 10am–8pm IST
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 text-center py-4 text-xs text-slate-500">
        © {new Date().getFullYear()} Manoz's Portfolio. All rights reserved.
      </div>
    </footer>
  );
}
