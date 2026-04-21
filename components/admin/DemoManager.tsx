"use client";

import { useState } from "react";
import { createDemo, updateDemo, deleteDemo } from "@/lib/firestore";
import type { Demo, User } from "@/types";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import { Pencil, Trash2, Plus, Loader2, X, Check } from "lucide-react";

interface Props { demos: Demo[]; users: User[]; onRefresh: () => void; }

export default function DemoManager({ demos, users, onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Demo | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const openAdd = () => { setEditing(null); setShowForm(true); };
  const openEdit = (d: Demo) => { setEditing(d); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this demo?")) return;
    setDeleting(id);
    await deleteDemo(id);
    setDeleting(null);
    onRefresh();
  };

  const getUserName = (uid: string) => users.find((u) => u.id === uid)?.name || uid.slice(0, 8) + "...";

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-bold font-display">Assigned Demos ({demos.length})</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Assign Demo
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#0d0d1a] rounded-2xl w-full max-w-md border border-white/5 p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold font-display">{editing ? "Edit Demo" : "Assign New Demo"}</h3>
              <button onClick={closeForm} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <DemoForm initial={editing} users={users} onSuccess={() => { closeForm(); onRefresh(); }} onCancel={closeForm} />
          </div>
        </div>
      )}

      {demos.length === 0 ? (
        <div className="admin-card p-12 text-center text-slate-500 text-sm">No demos assigned yet.</div>
      ) : (
        <div className="space-y-3">
          {demos.map((demo) => (
            <div key={demo.id} className="admin-card p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{demo.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{getUserName(demo.userId)} · {formatDate(demo.createdAt)}</p>
                  {demo.demoUrl && <a href={demo.demoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:underline truncate block mt-1">{demo.demoUrl}</a>}
                  {demo.notes && <p className="text-slate-600 text-xs mt-1 line-clamp-1">{demo.notes}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={demo.status} />
                  <button onClick={() => openEdit(demo)} className="text-slate-500 hover:text-blue-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(demo.id)} disabled={deleting === demo.id} className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                    {deleting === demo.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DemoForm({ initial, users, onSuccess, onCancel }: { initial: Demo | null; users: User[]; onSuccess: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    userId: initial?.userId || "",
    title: initial?.title || "",
    demoUrl: initial?.demoUrl || "",
    status: (initial?.status || "in_progress") as Demo["status"],
    notes: initial?.notes || "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      initial ? await updateDemo(initial.id, form) : await createDemo(form);
      onSuccess();
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Assign to User</label>
        <select value={form.userId} onChange={(e) => set("userId", e.target.value)} required className="input-dark">
          <option value="">Select user...</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Demo Title</label>
        <input value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="Demo title" className="input-dark" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Demo URL</label>
        <input value={form.demoUrl} onChange={(e) => set("demoUrl", e.target.value)} placeholder="https://..." type="url" className="input-dark" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Status</label>
        <div className="flex gap-2 flex-wrap">
          {(["in_progress","ready","updated"] as Demo["status"][]).map((s) => (
            <button key={s} type="button" onClick={() => set("status", s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.status === s ? "bg-blue-600 border-blue-600 text-white" : "border-white/10 text-slate-400 hover:border-blue-500/50"}`}>
              {form.status === s && <Check className="w-3 h-3 inline mr-1" />}
              {s.replace("_"," ")}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Notes for Client</label>
        <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3} placeholder="Optional message shown to the client..." className="input-dark resize-none" />
      </div>
      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm">
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {saving ? "Saving..." : initial ? "Update" : "Assign Demo"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm">Cancel</button>
      </div>
    </form>
  );
}
