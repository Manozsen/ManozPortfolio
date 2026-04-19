"use client";

import { useEffect, useState } from "react";
import { getAllProjects } from "@/lib/firestore";
import type { Project } from "@/types";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectFilter from "@/components/projects/ProjectFilter";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const categories = Array.from(
    new Set(projects.map((p) => p.category))
  ) as string[];

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12 px-4 text-center">
        <h1 className="text-2xl md:text-4xl font-extrabold mb-3">My Projects</h1>
        <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto">
          Real websites built for creators, local businesses, and Instagram-based sellers.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {!loading && categories.length > 0 && (
          <div className="mb-8">
            <ProjectFilter
              categories={categories}
              active={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <div className="text-5xl mb-4">🛠️</div>
            <p className="font-medium">No projects yet — check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}

        <div className="mt-14 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">Want a Site Like These?</h2>
          <p className="text-violet-100 text-sm mb-5">
            I'll build you a free demo — no payment required.
          </p>
          <Link
            href="/request-demo"
            className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-6 py-3 rounded-xl hover:bg-violet-50 transition-colors"
          >
            🚀 Get My Free Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
