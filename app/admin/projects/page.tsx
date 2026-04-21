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

  const fetchProjects = async () => {
    setLoading(true);
    setProjects(await getAllProjects());
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    setDeleting(id);
    await deleteProject(id);
    await fetchProjects();
    setDeleting(null);
  };

  if (mode === "add" || mode === "edit") {
    return (
      <div className="max-w-2xl">
        <h1 className="text-xl font-extrabold text-white font-display mb-6">
          {mode === "add" ? "Add New Project" : "Edit Project"}
        </h1>
        <div className="admin-card p-5">
          <ProjectForm
            initial={editing || undefined}
            onSuccess={() => { setMode("list"); fetchProjects(); }}
            onCancel={() => setMode("list")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white font-display">Projects</h1>
          <p className="text-slate-500 text-sm">{projects.length} total</p>
        </div>
        <button onClick={() => { setEditing(null); setMode("add"); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-20 admin-card animate-pulse" />)}</div>
      ) : projects.length === 0 ? (
        <div className="admin-card p-16 text-center text-slate-500 text-sm">No projects yet. Add your first one!</div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="admin-card p-4 flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800">
                {p.imageUrls[0] ? (
                  <Image src={p.imageUrls[0]} alt={p.title} fill className="object-cover" sizes="56px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="w-5 h-5 text-slate-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{p.title}</p>
                <p className="text-slate-500 text-xs">{p.category}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.techStack.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs bg-white/5 text-slate-400 px-1.5 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => { setEditing(p); setMode("edit"); }} className="text-slate-500 hover:text-blue-400 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  {deleting === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
