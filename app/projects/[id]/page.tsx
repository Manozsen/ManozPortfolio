import { getProject, getAllProjects } from "@/lib/firestore";
import { notFound } from "next/navigation";
import ImageCarousel from "@/components/projects/ImageCarousel";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import Link from "next/link";
import { ExternalLink, ArrowLeft, CheckCircle2 } from "lucide-react";

interface Props { params: { id: string }; }

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props) {
  const project = await getProject(params.id);
  return { title: project ? `${project.title} — Manoz` : "Project" };
}

export default async function CaseStudyPage({ params }: Props) {
  const project = await getProject(params.id);
  if (!project) notFound();

  const waMessage = `Hi Manoz! I saw your project "${project.title}" and I would love something similar.`;

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        <div className="mb-6">
          <span className="section-label">{project.category}</span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 font-display mb-3">{project.title}</h1>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((t) => (
              <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </div>

        {project.imageUrls.length > 0 && (
          <div className="mb-8">
            <ImageCarousel images={project.imageUrls} title={project.title} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
            <h2 className="font-bold text-slate-800 font-display mb-2">The Problem</h2>
            <p className="text-slate-600 text-sm leading-relaxed">{project.problem}</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
            <h2 className="font-bold text-slate-800 font-display mb-2">The Solution</h2>
            <p className="text-slate-600 text-sm leading-relaxed">{project.solution}</p>
          </div>
        </div>

        {project.features.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 font-display mb-4">Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div>
            <p className="font-bold font-display">Want something like this?</p>
            <p className="text-slate-400 text-sm">I will build you a free demo first.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold px-5 py-2.5 rounded-xl text-sm">
                <ExternalLink className="w-4 h-4" /> Live Preview
              </a>
            )}
            <WhatsAppButton message={waMessage} label="Get Similar Site" className="!py-2.5 !px-5 !text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
