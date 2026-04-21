"use client";

import { useEffect, useState } from "react";
import { getAllProjects, getAllDemos, getAllUsers, getAllDemoRequests } from "@/lib/firestore";
import { FolderKanban, MonitorPlay, Users, Bell, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";
import type { DemoRequest } from "@/types";

export default function AdminHomePage() {
  const [stats, setStats] = useState({ projects: 0, demos: 0, users: 0, requests: 0 });
  const [recentRequests, setRecentRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllProjects(), getAllDemos(), getAllUsers(), getAllDemoRequests()]).then(
      ([projects, demos, users, requests]) => {
        setStats({ projects: projects.length, demos: demos.length, users: users.length, requests: requests.length });
        setRecentRequests(requests.slice(0, 5));
        setLoading(false);
      }
    );
  }, []);

  const CARDS = [
    { label: "Projects", value: stats.projects, icon: FolderKanban, href: "/admin/projects", color: "text-violet-400 bg-violet-400/10" },
    { label: "Demos", value: stats.demos, icon: MonitorPlay, href: "/admin/demos", color: "text-blue-400 bg-blue-400/10" },
    { label: "Users", value: stats.users, icon: Users, href: "/admin/users", color: "text-emerald-400 bg-emerald-400/10" },
    { label: "Requests", value: stats.requests, icon: Bell, href: "/admin/demos", color: "text-amber-400 bg-amber-400/10" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-display">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Welcome back, Manoz</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="admin-card p-4 hover:border-white/12 transition-colors">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            {loading ? <div className="h-7 w-10 bg-white/5 rounded animate-pulse mb-1" /> : (
              <p className="text-2xl font-extrabold text-white font-display">{value}</p>
            )}
            <p className="text-xs text-slate-500 font-medium">{label}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { href: "/admin/projects", label: "Add New Project", desc: "Upload project images and details" },
            { href: "/admin/demos", label: "Assign Demo", desc: "Send demo link to a client" },
            { href: "/admin/users", label: "View Users", desc: "See all registered clients" },
            { href: "/admin/settings", label: "Edit Homepage", desc: "Change headline, subtext, and images" },
          ].map((action) => (
            <Link key={action.href} href={action.href} className="admin-card p-4 flex items-center gap-4 hover:border-blue-500/20 transition-colors group">
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">{action.label}</p>
                <p className="text-slate-500 text-xs truncate">{action.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent Demo Requests</h2>
          <Link href="/admin/demos" className="text-xs text-blue-400 hover:underline">View all</Link>
        </div>
        {loading ? (
          <div className="space-y-2">{[1,2,3].map((i) => <div key={i} className="h-14 admin-card animate-pulse" />)}</div>
        ) : recentRequests.length === 0 ? (
          <div className="admin-card p-6 text-center text-slate-500 text-sm">No demo requests yet.</div>
        ) : (
          <div className="space-y-2">
            {recentRequests.map((req) => (
              <div key={req.id} className="admin-card px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{req.name}</p>
                  <p className="text-slate-500 text-xs truncate">{req.businessType} · {formatDate(req.createdAt)}</p>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
