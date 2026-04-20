"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDemosByUser } from "@/lib/firestore";
import type { Demo } from "@/types";
import StatusBadge from "@/components/shared/StatusBadge";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { ExternalLink, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

export default function DashboardPage() {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [demos, setDemos] = useState<Demo[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.replace("/login");
      return;
    }
    if (firebaseUser) {
      getDemosByUser(firebaseUser.uid).then((data) => {
        setDemos(data);
        setFetching(false);
      });
    }
  }, [firebaseUser, loading, router]);

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading your demos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-white/5 bg-[#0d0d16]/80 backdrop-blur px-4 py-6 pt-20">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          {firebaseUser?.photoURL && (
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full opacity-60 blur-sm" />
              <Image
                src={firebaseUser.photoURL}
                alt="Profile"
                width={48}
                height={48}
                className="relative rounded-full ring-2 ring-white/10"
              />
            </div>
          )}
          <div>
            <h1
              className="text-xl font-extrabold text-white"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Welcome, {firebaseUser?.displayName?.split(" ")[0]}! 👋
            </h1>
            <p className="text-slate-500 text-sm">Your demo dashboard</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {demos.length === 0 ? (
          /* Empty State */
          <div className="glass-strong rounded-3xl p-10 text-center gradient-border">
            <div className="text-6xl mb-4 animate-float">🎨</div>
            <h2
              className="font-extrabold text-white text-xl mb-2"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              No Demo Yet
            </h2>
            <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
              Once you request a demo, it will appear here. I'll notify you
              on WhatsApp when it's ready!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href="/request-demo"
                className="btn-gradient text-white font-bold px-6 py-3 rounded-2xl text-sm flex items-center justify-center gap-2"
              >
                🚀 Request a Demo
              </a>
              <WhatsAppButton
                message="Hi Manoz! I signed in and I'd like to request a demo for my business."
                label="💬 Ask on WhatsApp"
                className="!bg-green-500/20 !text-green-400 hover:!bg-green-500/30 !border !border-green-500/30 !rounded-2xl"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2
              className="text-lg font-bold text-white mb-6"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Your Demos
              <span className="ml-2 text-sm font-normal text-slate-500">
                ({demos.length})
              </span>
            </h2>
            {demos.map((demo) => (
              <div
                key={demo.id}
                className="glass rounded-3xl p-5 border border-white/5 hover:border-violet-500/20 transition-all duration-300"
              >
                {/* Top Row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3
                      className="font-bold text-white"
                      style={{ fontFamily: 'Syne, sans-serif' }}
                    >
                      {demo.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Added {formatDate(demo.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={demo.status} />
                </div>

                {/* Notes */}
                {demo.notes && (
                  <p className="text-sm text-slate-400 bg-white/5 rounded-2xl p-3 mb-4">
                    📝 {demo.notes}
                  </p>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {demo.status !== "in_progress" && demo.demoUrl && (
                    <a
                      href={demo.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gradient flex items-center justify-center gap-2 text-white font-semibold px-5 py-2.5 rounded-2xl text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View My Demo
                    </a>
                  )}
                  <WhatsAppButton
                    message={`Hi Manoz! I just viewed my demo "${demo.title}" and I have some feedback.`}
                    label="💬 Send Feedback"
                    className="!bg-green-500/20 !text-green-400 hover:!bg-green-500/30 !border !border-green-500/30 !rounded-2xl !py-2.5 !px-5 !text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
