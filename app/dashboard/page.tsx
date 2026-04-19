"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDemosByUser } from "@/lib/firestore";
import type { Demo } from "@/types";
import StatusBadge from "@/components/shared/StatusBadge";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

export default function DashboardPage() {
  const { firebaseUser, userProfile, loading } = useAuth();
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          {firebaseUser?.photoURL && (
            <Image
              src={firebaseUser.photoURL}
              alt="Profile"
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Welcome, {firebaseUser?.displayName?.split(" ")[0]}! 👋
            </h1>
            <p className="text-sm text-slate-500">Your demo dashboard</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {demos.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
            <div className="text-5xl mb-4">🎨</div>
            <h2 className="font-bold text-slate-800 text-lg mb-2">No Demo Yet</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              Once you request a demo, it will appear here. I'll notify you on WhatsApp when it's ready!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href="/request-demo"
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                🚀 Request a Demo
              </a>
              <WhatsAppButton
                message="Hi Manoz! I signed in and I'd like to request a demo for my business."
                label="💬 Ask on WhatsApp"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Your Demos ({demos.length})
            </h2>
            {demos.map((demo) => (
              <div
                key={demo.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
              >
                {/* Top Row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800">{demo.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Added {formatDate(demo.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={demo.status} />
                </div>

                {/* Notes */}
                {demo.notes && (
                  <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 mb-4">
                    📝 {demo.notes}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {demo.status !== "in_progress" && demo.demoUrl && (
                    <a
                      href={demo.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View My Demo
                    </a>
                  )}
                  <WhatsAppButton
                    message={`Hi Manoz! I just viewed my demo "${demo.title}" and I have some feedback.`}
                    label="💬 Send Feedback"
                    className="!py-2.5 !px-5 !text-sm"
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
