"use client";

import { useEffect, useState } from "react";
import { getAllProjects, deleteProject } from "@/lib/firestore";
import type { Project } from "@/types";
import ProjectForm from "@/components/admin/ProjectForm";
import Image from "next/image";
import { Pencil, Trash2, Plus, Loader2, ImageOff } from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    const data = await getAllProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(id);
    await deleteProject(id);
    await fetch();
    setDeleting(null);
  };

  const openEdit = (p: Project) => { setEditing(p); setMode("edit"); };

  if (mode === "add" || mode === "edit") {
    return (
      <div>
        <h1 className="text-xl font-extrabold text-white mb-6">
          {mode === "add" ? "Add New Project" : "Edit Project"}
        </h1>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-2xl">
          <ProjectForm
            initial={editing || undefined}
            onSuccess={() => { setMode("list"); fetch(); }}
            onCancel={() => setMode("list")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white">Projects</h1>
          <p className="text-slate-500 text-sm">{projects.length} total</p>
        </div>
        <button
          onClick={() => { setEditing(null); setMode("add"); }}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800">
          <div className="text-4xl mb-3">🛠️</div>
          <p className="text-slate-400 text-sm">No projects yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4"
            >
              {/* Thumbnail */}
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                {p.imageUrls[0] ? (
                  <Image src={p.imageUrls[0]} alt={p.title} fill className="object-cover" sizes="64px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="w-5 h-5 text-slate-600" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{p.title}</p>
                <p className="text-slate-400 text-xs">{p.category}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.techStack.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => openEdit(p)}
                  className="text-slate-400 hover:text-violet-400 p-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deleting === p.id}
                  className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {deleting === p.id
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
