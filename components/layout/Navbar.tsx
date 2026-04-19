"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, Code2 } from "lucide-react";

export default function Navbar() {
  const { firebaseUser, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/request-demo", label: "Get Free Demo" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
          <Code2 className="w-5 h-5 text-violet-600" />
          <span>Manoz</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-violet-600 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          {firebaseUser ? (
            <>
              <Link
                href="/dashboard"
                className="hover:text-violet-600 transition-colors"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hover:text-violet-600 transition-colors text-violet-600 font-semibold"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="text-slate-500 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-slate-700 hover:text-violet-600 py-2"
            >
              {l.label}
            </Link>
          ))}
          {firebaseUser ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="text-slate-700 py-2">
                Dashboard
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setOpen(false)} className="text-violet-600 font-semibold py-2">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="text-left text-red-500 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="bg-violet-600 text-white text-center py-3 rounded-lg"
            >
              Sign In with Google
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
