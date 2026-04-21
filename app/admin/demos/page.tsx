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

  const fetchData = async () => {
    setLoading(true);
    const [d, u, r] = await Promise.all([getAllDemos(), getAllUsers(), getAllDemoRequests()]);
    setDemos(d); setUsers(u); setRequests(r);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateReqStatus = async (id: string, status: DemoRequest["status"]) => {
    await updateDemoRequestStatus(id, status);
    await fetchData();
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <h1 className="text-xl font-extrabold text-white font-display">Demo Management</h1>

      <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit">
        {(["demos", "requests"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}>
            {t === "requests" ? "Demo Requests" : "Assigned Demos"}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === t ? "bg-blue-500" : "bg-white/10"}`}>
              {t === "demos" ? demos.length : requests.length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-16 admin-card animate-pulse" />)}</div>
      ) : tab === "demos" ? (
        <DemoManager demos={demos} users={users} onRefresh={fetchData} />
      ) : (
        <div>
          <h2 className="text-white font-bold font-display mb-4">Requests ({requests.length})</h2>
          {requests.length === 0 ? (
            <div className="admin-card p-12 text-center text-slate-500 text-sm">No demo requests yet.</div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req.id} className="admin-card p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                    <div>
                      <p className="text-white font-semibold text-sm">{req.name}</p>
                      <p className="text-slate-400 text-xs">{req.email}</p>
                      <a href={`https://wa.me/${req.whatsappNumber.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 text-xs hover:underline">{req.whatsappNumber}</a>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="bg-white/[0.03] rounded-lg p-2">
                      <p className="text-slate-500 mb-0.5">Business Type</p>
                      <p className="text-slate-300 font-medium">{req.businessType}</p>
                    </div>
                    <div className="bg-white/[0.03] rounded-lg p-2">
                      <p className="text-slate-500 mb-0.5">Requested</p>
                      <p className="text-slate-300 font-medium">{formatDate(req.createdAt)}</p>
                    </div>
                  </div>
                  {req.requirement && (
                    <p className="text-slate-500 text-xs bg-white/[0.03] rounded-lg p-2 mb-3 line-clamp-2">{req.requirement}</p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {(["pending","in_progress","completed"] as DemoRequest["status"][]).map((s) => (
                      <button key={s} onClick={() => updateReqStatus(req.id, s)} disabled={req.status === s}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${req.status === s ? "border-blue-600 bg-blue-600/20 text-blue-300 cursor-default" : "border-white/10 text-slate-400 hover:border-blue-500/50 hover:text-white"}`}>
                        {s.replace("_"," ")}
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
