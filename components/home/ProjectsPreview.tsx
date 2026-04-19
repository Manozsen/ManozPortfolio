import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";

interface Props {
  projects: Project[];
}

export default function ProjectsPreview({ projects }: Props) {
  const preview = projects.slice(0, 3);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Recent Work
          </h2>
          <p className="text-slate-500 text-sm md:text-base">
            Websites built for creators, sellers, and local businesses
          </p>
        </div>

        {/* Cards */}
        {preview.length === 0 ? (
          <p className="text-center text-slate-400 py-10">
            Projects coming soon...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {preview.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="group rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 bg-slate-100">
                  {p.imageUrls[0] ? (
                    <Image
                      src={p.imageUrls[0]}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-4xl">
                      🖥️
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">
                    {p.category}
                  </span>
                  <h3 className="font-semibold text-slate-800 mt-1 group-hover:text-violet-600 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {p.problem}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All */}
        {projects.length > 3 && (
          <div className="text-center mt-10">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 border border-violet-300 text-violet-600 font-semibold px-6 py-3 rounded-xl hover:bg-violet-50 transition-colors"
            >
              View All Projects →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
