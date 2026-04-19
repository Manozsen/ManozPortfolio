import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/utils";
import { Code2, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const waLink = buildWhatsAppLink(
    "Hi Manoz! I visited your portfolio and I'm interested in building a website."
  );

  return (
    <footer className="bg-[#0a0a0f] border-t border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-80 h-40 bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* ── Brand ─────────────────────────────── */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg mb-4 group w-fit"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center glow-sm">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span
                className="gradient-text font-extrabold"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Manoz
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Building high-converting websites for creators, local businesses,
              and Instagram-based sellers.
            </p>

            {/* Social proof */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex -space-x-2">
                {["🟣", "🔵", "🟢"].map((c, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full glass border border-white/10 flex items-center justify-center text-xs"
                  >
                    {c}
                  </div>
                ))}
              </div>
              <span className="text-xs text-slate-500">
                Trusted by 50+ clients
              </span>
            </div>
          </div>

          {/* ── Links ─────────────────────────────── */}
          <div>
            <h3
              className="text-white font-semibold mb-4 text-sm uppercase tracking-widest"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Navigate
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/projects", label: "Projects" },
                { href: "/request-demo", label: "Request Demo" },
                { href: "/dashboard", label: "Client Dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-violet-400 transition-colors flex items-center gap-1 group w-fit"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ───────────────────────────── */}
          <div>
            <h3
              className="text-white font-semibold mb-4 text-sm uppercase tracking-widest"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Get In Touch
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Ready to build something great? Let's talk.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 text-sm font-semibold px-5 py-3 rounded-2xl transition-all hover:-translate-y-0.5"
            >
              💬 WhatsApp Me
            </a>
            <p className="text-xs text-slate-600 mt-3">
              Mon–Sat · 10am–8pm IST
            </p>
          </div>
        </div>

        {/* ── Bottom Bar ────────────────────────── */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Manoz. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-600">Built with</span>
            <span className="text-xs gradient-text font-semibold mx-1">
              Next.js + Firebase
            </span>
            <span className="text-xs text-slate-600">by Manoz</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
