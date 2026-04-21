"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, Code2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { firebaseUser, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isDarkPage = pathname === "/" || pathname.startsWith("/demo");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/request-demo", label: "Get Free Demo" },
  ];

  const navBase = isDarkPage
    ? scrolled ? "bg-[#060818]/90 backdrop-blur-md border-b border-white/5" : "bg-transparent"
    : scrolled ? "bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm" : "bg-white border-b border-slate-200/60";

  const linkColor = isDarkPage ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900";
  const logoColor = isDarkPage ? "text-white" : "text-slate-900";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBase}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className={`flex items-center gap-2 font-bold text-base ${logoColor}`}>
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-display">Manoz</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${linkColor}`}>{l.label}</Link>
          ))}
          {firebaseUser ? (
            <>
              <Link href="/dashboard" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${linkColor}`}>Dashboard</Link>
              {isAdmin && <Link href="/admin" className="px-4 py-2 text-sm font-medium rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">Admin</Link>}
              <button onClick={logout} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${linkColor}`}>Logout</button>
            </>
          ) : (
            <Link href="/login" className="ml-2 btn-primary !py-2 !px-5 !text-sm">Sign In</Link>
          )}
        </div>

        <button className={`md:hidden p-2 rounded-lg transition-colors ${isDarkPage ? "text-slate-300 hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"}`} onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className={`md:hidden px-4 py-3 space-y-1 border-t ${isDarkPage ? "bg-[#0d0d1a] border-white/5" : "bg-white border-slate-200"}`}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className={`block px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isDarkPage ? "text-slate-300 hover:bg-white/5" : "text-slate-700 hover:bg-slate-50"}`}>{l.label}</Link>
          ))}
          {firebaseUser ? (
            <>
              <Link href="/dashboard" className={`block px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isDarkPage ? "text-slate-300 hover:bg-white/5" : "text-slate-700 hover:bg-slate-50"}`}>Dashboard</Link>
              {isAdmin && <Link href="/admin" className="block px-4 py-3 text-sm font-semibold text-blue-600 rounded-xl hover:bg-blue-50 transition-colors">Admin Panel</Link>}
              <button onClick={logout} className="block w-full text-left px-4 py-3 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 transition-colors">Logout</button>
            </>
          ) : (
            <Link href="/login" className="block mt-2 btn-primary text-center">Sign In with Google</Link>
          )}
        </div>
      )}
    </nav>
  );
}
