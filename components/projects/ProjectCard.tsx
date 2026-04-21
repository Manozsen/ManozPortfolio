import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";

interface Props { project: Project; }

export default function ProjectCard({ project }: Props) {
  return (
    <Link href={`/projects/${project.id}`} className="card card-hover group overflow-hidden block">
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {project.imageUrls[0] ? (
          <Image src={project.imageUrls[0]} alt={project.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50">
            <span className="text-4xl opacity-20">🖥</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-white text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">{project.category}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-slate-900 font-display mb-1 group-hover:text-blue-600 transition-colors">{project.title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{project.problem}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 3).map((t) => (
            <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t}</span>
          ))}
          {project.techStack.length > 3 && <span className="text-xs text-slate-400">+{project.techStack.length - 3}</span>}
        </div>
      </div>
    </Link>
  );
}
