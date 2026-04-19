"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, Code2, Zap } from "lucide-react";

export default function Navbar() {
  const { firebaseUser, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/request-demo", label: "Get Free Demo" },
  ];

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled
          ? "glass border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
        }
      `}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center glow-sm transition-transform group-hover:scale-110">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text font-extrabold tracking-tight"
            style={{ fontFamily: 'Syne, sans-serif' }}>
            Manoz
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              {l.label}
            </Link>
          ))}
          {firebaseUser ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2 text-sm font-medium text-violet-400 hover:text-violet-300 rounded-lg hover:bg-violet-500/10 transition-all"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="ml-2 btn-gradient text-white text-sm font-semibold px-5 py-2 rounded-xl flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" />
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl glass text-slate-300 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden glass-strong border-t border-white/5 px-4 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-slate-300 hover:text-white px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-sm font-medium"
            >
              {l.label}
            </Link>
          ))}
          {firebaseUser ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="text-slate-300 hover:text-white px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-sm"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="text-violet-400 px-4 py-3 rounded-xl hover:bg-violet-500/10 transition-all text-sm font-semibold"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="text-left text-red-400 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-all text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="btn-gradient text-white text-center py-3 rounded-xl text-sm font-semibold mt-2"
            >
              Sign In with Google
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
