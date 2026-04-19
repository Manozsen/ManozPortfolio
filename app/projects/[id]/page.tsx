import { getProject, getAllProjects } from "@/lib/firestore";
import { notFound } from "next/navigation";
import ImageCarousel from "@/components/projects/ImageCarousel";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import Link from "next/link";
import { ExternalLink, ArrowLeft, CheckCircle2 } from "lucide-react";

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props) {
  const project = await getProject(params.id);
  return {
    title: project ? `${project.title} — Manoz's Portfolio` : "Project",
    description: project?.problem || "",
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const project = await getProject(params.id);
  if (!project) notFound();

  const waMessage = `Hi Manoz! I saw your project "${project.title}" and I'd love something similar for my business.`;

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">
            {project.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 mt-1 mb-3">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((t) => (
              <span
                key={t}
                className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Image Carousel */}
        {project.imageUrls.length > 0 && (
          <div className="mb-8">
            <ImageCarousel images={project.imageUrls} title={project.title} />
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Problem */}
          <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
            <h2 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="text-lg">😓</span> The Problem
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">{project.problem}</p>
          </div>

          {/* Solution */}
          <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
            <h2 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="text-lg">✅</span> The Solution
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">{project.solution}</p>
          </div>
        </div>

        {/* Features */}
        {project.features.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 bg-slate-50 rounded-xl p-3 border border-slate-100"
                >
                  <CheckCircle2 className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Bar */}
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div>
            <p className="font-bold">Want something like this?</p>
            <p className="text-violet-100 text-sm">I'll build you a free demo first.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-violet-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-violet-50 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Live Preview
              </a>
            )}
            <WhatsAppButton
              message={waMessage}
              label="💬 Get Similar Site"
              className="!py-2.5 !px-5 !text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
