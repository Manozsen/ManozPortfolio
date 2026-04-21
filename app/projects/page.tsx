"use client";

import { useEffect, useState } from "react";
import { getAllProjects } from "@/lib/firestore";
import type { Project } from "@/types";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectFilter from "@/components/projects/ProjectFilter";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProjects().then((data) => { setProjects(data); setLoading(false); });
  }, []);

  const categories = Array.from(new Set(projects.map((p) => p.category))) as string[];
  const filtered = activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="bg-slate-900 text-white py-16 px-4 text-center">
        <span className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">Portfolio</span>
        <h1 className="text-3xl md:text-4xl font-extrabold font-display mb-3">My Projects</h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">Real websites built for creators, local businesses, and Instagram-based sellers.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {!loading && categories.length > 0 && (
          <div className="mb-8">
            <ProjectFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="card h-64 animate-pulse bg-slate-100 border-0" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-slate-400 font-medium">No projects yet — check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}

        <div className="mt-16 bg-slate-900 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl font-bold font-display mb-2">Want a site like these?</h2>
          <p className="text-slate-400 text-sm mb-6">I will build you a free demo — no payment required.</p>
          <Link href="/request-demo" className="btn-primary inline-flex">
            Get My Free Demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
