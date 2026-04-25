"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types";
import { attachCardTilt, attachScrollIn, shouldEnable3D } from "@/lib/3d-effects";

interface Props {
  projects: Project[];
}

function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!cardRef.current || !shouldEnable3D()) return;
    const cleanup = attachCardTilt(cardRef.current, "low");
    return cleanup;
  }, []);

  return (
    <Link
      ref={cardRef}
      href={`/projects/${project.id}`}
      className="card card-3d group overflow-hidden block"
    >
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {project.imageUrls[0] ? (
          <Image
            src={project.imageUrls[0]}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50">
            <span className="text-4xl opacity-20">🖥</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-white text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {project.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-slate-900 font-display mb-1 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{project.problem}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 3).map((t) => (
            <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {t}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="text-xs text-slate-400">+{project.techStack.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsPreview({ projects }: Props) {
  const preview    = projects.slice(0, 3);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    if (headerRef.current) cleanups.push(attachScrollIn(headerRef.current, { delay: 0   }));
    if (gridRef.current)   cleanups.push(attachScrollIn(gridRef.current,   { delay: 100 }));
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={headerRef} className="flex items-end justify-between mb-12">
          <div>
            <span className="section-label">Recent Work</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-display">
              Projects I have built
            </h2>
          </div>
          {projects.length > 3 && (
            <Link
              href="/projects"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {preview.length === 0 ? (
          <div className="text-center py-20 text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="font-medium">Projects coming soon</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {preview.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}

        {projects.length > 3 && (
          <div className="text-center mt-10 md:hidden">
            <Link href="/projects" className="btn-secondary inline-flex">
              View all projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
