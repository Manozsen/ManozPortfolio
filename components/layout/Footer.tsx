import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/utils";
import { Code2, ArrowUpRight, MessageCircle } from "lucide-react";

export default function Footer() {
  const waLink = buildWhatsAppLink("Hi Manoz! I visited your portfolio and I'm interested in building a website.");

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 text-white font-bold mb-4 w-fit">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-display">Manoz</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Building high-converting websites for creators, local businesses, and Instagram-based sellers.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 font-display uppercase tracking-wider">Navigate</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/projects", label: "Projects" },
                { href: "/request-demo", label: "Request Demo" },
                { href: "/dashboard", label: "Client Dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-white transition-colors flex items-center gap-1 group w-fit">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 font-display uppercase tracking-wider">Get In Touch</h3>
            <p className="text-sm text-slate-500 mb-4">Ready to build something great? Let us talk.</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
              <MessageCircle className="w-4 h-4" /> WhatsApp Me
            </a>
            <p className="text-xs text-slate-600 mt-3">Mon–Sat · 10am–8pm IST</p>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} Manoz. All rights reserved.</p>
          <p className="text-xs text-slate-600">Built with Next.js + Firebase</p>
        </div>
      </div>
    </footer>
  );
}
