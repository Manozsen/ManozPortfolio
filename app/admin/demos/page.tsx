"use client";

import { useEffect, useState } from "react";
import { getAllDemos, getAllUsers, getAllDemoRequests, updateDemoRequestStatus } from "@/lib/firestore";
import type { Demo, User, DemoRequest } from "@/types";
import DemoManager from "@/components/admin/DemoManager";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";

type Tab = "demos" | "requests";

export default function AdminDemosPage() {
  const [tab, setTab] = useState<Tab>("demos");
  const [demos, setDemos] = useState<Demo[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const [d, u, r] = await Promise.all([
      getAllDemos(),
      getAllUsers(),
      getAllDemoRequests(),
    ]);
    setDemos(d);
    setUsers(u);
    setRequests(r);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const updateReqStatus = async (id: string, status: DemoRequest["status"]) => {
    await updateDemoRequestStatus(id, status);
    await fetch();
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold text-white">Demo Management</h1>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1 w-fit">
        {(["demos", "requests"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {t === "requests" ? "Demo Requests" : "Assigned Demos"}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
              tab === t ? "bg-violet-500" : "bg-slate-800"
            }`}>
              {t === "demos" ? demos.length : requests.length}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : tab === "demos" ? (
        <DemoManager demos={demos} users={users} onRefresh={fetch} />
      ) : (
        /* Demo Requests Table */
        <div>
          <h2 className="text-white font-bold text-lg mb-4">
            Requests ({requests.length})
          </h2>
          {requests.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800 text-slate-500 text-sm">
              No demo requests yet.
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                    <div>
                      <p className="text-white font-semibold text-sm">{req.name}</p>
                      <p className="text-slate-400 text-xs">{req.email}</p>
                      <a
                        href={`https://wa.me/${req.whatsappNumber.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 text-xs hover:underline"
                      >
                        📱 {req.whatsappNumber}
                      </a>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="bg-slate-800 rounded-lg p-2">
                      <p className="text-slate-500 mb-0.5">Business Type</p>
                      <p className="text-slate-300 font-medium">{req.businessType}</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-2">
                      <p className="text-slate-500 mb-0.5">Requested On</p>
                      <p className="text-slate-300 font-medium">{formatDate(req.createdAt)}</p>
                    </div>
                  </div>

                  {req.requirement && (
                    <p className="text-slate-400 text-xs bg-slate-800 rounded-lg p-2 mb-3 line-clamp-2">
                      📋 {req.requirement}
                    </p>
                  )}

                  {/* Status Update */}
                  <div className="flex gap-2 flex-wrap">
                    {(["pending", "in_progress", "completed"] as DemoRequest["status"][]).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateReqStatus(req.id, s)}
                        disabled={req.status === s}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          req.status === s
                            ? "border-violet-600 bg-violet-600/20 text-violet-300 cursor-default"
                            : "border-slate-700 text-slate-400 hover:border-violet-500 hover:text-white"
                        }`}
                      >
                        {s.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
