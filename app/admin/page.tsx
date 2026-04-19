"use client";

import { useEffect, useState } from "react";
import { getAllProjects, getAllDemos, getAllUsers, getAllDemoRequests } from "@/lib/firestore";
import { FolderKanban, MonitorPlay, Users, Bell, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";

export default function AdminHomePage() {
  const [stats, setStats] = useState({ projects: 0, demos: 0, users: 0, requests: 0 });
  const [recentRequests, setRecentRequests] = useState<Awaited<ReturnType<typeof getAllDemoRequests>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllProjects(),
      getAllDemos(),
      getAllUsers(),
      getAllDemoRequests(),
    ]).then(([projects, demos, users, requests]) => {
      setStats({
        projects: projects.length,
        demos: demos.length,
        users: users.length,
        requests: requests.length,
      });
      setRecentRequests(requests.slice(0, 5));
      setLoading(false);
    });
  }, []);

  const STAT_CARDS = [
    { label: "Projects", value: stats.projects, icon: FolderKanban, href: "/admin/projects", color: "text-violet-400", bg: "bg-violet-900/30" },
    { label: "Demos", value: stats.demos, icon: MonitorPlay, href: "/admin/demos", color: "text-blue-400", bg: "bg-blue-900/30" },
    { label: "Users", value: stats.users, icon: Users, href: "/admin/users", color: "text-green-400", bg: "bg-green-900/30" },
    { label: "Requests", value: stats.requests, icon: Bell, href: "/admin/demos", color: "text-orange-400", bg: "bg-orange-900/30" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-0.5">Welcome back, Manoz 👋</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, href, color, bg }) => (
          <Link
            key={label}
            href={href}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-600 transition-colors"
          >
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            {loading ? (
              <div className="h-7 w-10 bg-slate-800 rounded animate-pulse mb-1" />
            ) : (
              <p className="text-2xl font-extrabold text-white">{value}</p>
            )}
            <p className="text-xs text-slate-500 font-medium">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { href: "/admin/projects", label: "Add New Project", icon: "➕", desc: "Upload project images & details" },
            { href: "/admin/demos", label: "Assign Demo", icon: "🔗", desc: "Send demo link to a client" },
            { href: "/admin/users", label: "View Users", icon: "👥", desc: "See all registered clients" },
            { href: "/admin/settings", label: "Edit Homepage", icon: "✏️", desc: "Change headline & subtext" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-violet-700 transition-colors group"
            >
              <span className="text-2xl">{action.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">{action.label}</p>
                <p className="text-slate-500 text-xs truncate">{action.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Demo Requests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Recent Demo Requests
          </h2>
          <Link href="/admin/demos" className="text-xs text-violet-400 hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentRequests.length === 0 ? (
          <div className="bg-slate-900 rounded-xl p-6 text-center text-slate-500 text-sm border border-slate-800">
            No demo requests yet.
          </div>
        ) : (
          <div className="space-y-2">
            {recentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{req.name}</p>
                  <p className="text-slate-500 text-xs truncate">
                    {req.businessType} · {formatDate(req.createdAt)}
                  </p>
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
