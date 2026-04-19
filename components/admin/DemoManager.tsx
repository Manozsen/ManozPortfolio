"use client";

import { useState } from "react";
import { createDemo, updateDemo, deleteDemo } from "@/lib/firestore";
import type { Demo, User } from "@/types";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import { Pencil, Trash2, Plus, Loader2, X, Check } from "lucide-react";

interface Props {
  demos: Demo[];
  users: User[];
  onRefresh: () => void;
}

const STATUS_OPTIONS: Demo["status"][] = ["in_progress", "ready", "updated"];

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

  const getUserName = (uid: string) =>
    users.find((u) => u.id === uid)?.name || uid.slice(0, 8) + "...";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-bold text-lg">
          Demos ({demos.length})
        </h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Assign Demo
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl w-full max-w-md border border-slate-700 p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">
                {editing ? "Edit Demo" : "Assign New Demo"}
              </h3>
              <button onClick={closeForm} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <DemoForm
              initial={editing}
              users={users}
              onSuccess={() => { closeForm(); onRefresh(); }}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}

      {/* Demos List */}
      {demos.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <div className="text-4xl mb-3">📭</div>
          <p>No demos assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {demos.map((demo) => (
            <div
              key={demo.id}
              className="bg-slate-900 rounded-xl border border-slate-800 p-4"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{demo.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    👤 {getUserName(demo.userId)} · {formatDate(demo.createdAt)}
                  </p>
                  {demo.demoUrl && (
                    <a
                      href={demo.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 text-xs hover:underline truncate block mt-1"
                    >
                      {demo.demoUrl}
                    </a>
                  )}
                  {demo.notes && (
                    <p className="text-slate-500 text-xs mt-1 line-clamp-1">📝 {demo.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={demo.status} />
                  <button
                    onClick={() => openEdit(demo)}
                    className="text-slate-400 hover:text-violet-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(demo.id)}
                    disabled={deleting === demo.id}
                    className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    {deleting === demo.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
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

// ── Demo Form ────────────────────────────────────────
function DemoForm({
  initial, users, onSuccess, onCancel,
}: {
  initial: Demo | null;
  users: User[];
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    userId: initial?.userId || "",
    title: initial?.title || "",
    demoUrl: initial?.demoUrl || "",
    status: initial?.status || "in_progress" as Demo["status"],
    notes: initial?.notes || "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (initial) {
        await updateDemo(initial.id, form);
      } else {
        await createDemo(form);
      }
      onSuccess();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* User */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Assign to User *</label>
        <select
          value={form.userId}
          onChange={(e) => set("userId", e.target.value)}
          required
          className={inp}
        >
          <option value="">Select user...</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Demo Title *</label>
        <input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
          placeholder="e.g. Priya's Jewellery Shop Demo"
          className={inp}
        />
      </div>

      {/* URL */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Demo URL</label>
        <input
          value={form.demoUrl}
          onChange={(e) => set("demoUrl", e.target.value)}
          placeholder="https://..."
          type="url"
          className={inp}
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Status *</label>
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => set("status", s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                form.status === s
                  ? "bg-violet-600 border-violet-600 text-white"
                  : "border-slate-700 text-slate-400 hover:border-violet-500"
              }`}
            >
              {form.status === s && <Check className="w-3 h-3 inline mr-1" />}
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Notes for Client</label>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
          placeholder="Optional message shown to the client..."
          className={inp + " resize-none"}
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm"
        >
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {saving ? "Saving..." : initial ? "Update" : "Assign Demo"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const inp =
  "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500";
