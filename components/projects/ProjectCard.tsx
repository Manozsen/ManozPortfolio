import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {project.imageUrls[0] ? (
          <Image
            src={project.imageUrls[0]}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-violet-50 text-5xl">
            🖥️
          </div>
        )}
        {/* Category Badge on image */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur text-violet-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 group-hover:text-violet-600 transition-colors mb-1">
          {project.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">
          {project.problem}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
            >
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
