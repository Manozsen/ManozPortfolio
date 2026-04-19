"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/firestore";
import type { User } from "@/types";
import { formatDate } from "@/lib/utils";
import { Users, Shield, User as UserIcon } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-white">Users</h1>
          <p className="text-slate-500 text-sm">{users.length} registered</p>
        </div>
        <div className="flex gap-3 text-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-400" />
            <span className="text-slate-300">{users.filter((u) => u.role === "admin").length} Admin</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300">{users.filter((u) => u.role === "client").length} Clients</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
      />

      {/* Users List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800 text-slate-500 text-sm">
          {search ? "No users match your search." : "No users registered yet."}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((user) => (
            <div
              key={user.id}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 flex items-center gap-4"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-violet-900 flex items-center justify-center flex-shrink-0">
                {user.role === "admin" ? (
                  <Shield className="w-4 h-4 text-violet-300" />
                ) : (
                  <UserIcon className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm font-semibold truncate">{user.name || "—"}</p>
                  {user.role === "admin" && (
                    <span className="text-xs bg-violet-900 text-violet-300 px-2 py-0.5 rounded-full flex-shrink-0">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-xs truncate">{user.email}</p>
                {user.whatsappNumber && (
                  <a
                    href={`https://wa.me/${user.whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 text-xs hover:underline"
                  >
                    📱 {user.whatsappNumber}
                  </a>
                )}
              </div>

              {/* Date */}
              <div className="text-xs text-slate-500 flex-shrink-0 text-right">
                <p>Joined</p>
                <p className="text-slate-400">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
