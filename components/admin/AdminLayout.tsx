"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, FolderKanban, MonitorPlay, Users, Settings, Menu, X, LogOut, Code2, ExternalLink } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/demos", label: "Demos", icon: MonitorPlay },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { firebaseUser, isAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!firebaseUser || !isAdmin)) router.replace("/login");
  }, [firebaseUser, isAdmin, loading, router]);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (loading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080810]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) => exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex h-screen bg-[#080810] overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-60 bg-[#0d0d1a] border-r border-white/5 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center"><Code2 className="w-3.5 h-3.5 text-white" /></div>
            <span className="font-display font-bold text-white text-sm">Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="px-4 py-4 border-b border-white/5 flex-shrink-0">
          <p className="text-xs text-slate-600 mb-0.5">Signed in as</p>
          <p className="text-sm font-semibold text-white truncate">{firebaseUser?.displayName || "Admin"}</p>
          <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full mt-1 inline-block font-medium">Admin</span>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link key={href} href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white hover:bg-white/5"}`}>
                <Icon className="w-4 h-4 flex-shrink-0" /> {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-white/5 space-y-0.5 flex-shrink-0">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-white hover:bg-white/5 transition-all">
            <ExternalLink className="w-4 h-4" /> View Site
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-[#0d0d1a] border-b border-white/5 flex items-center px-4 gap-4 md:hidden flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-bold text-white text-sm flex-1">
            {NAV.find((n) => isActive(n.href, n.exact))?.label ?? "Admin"}
          </span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
