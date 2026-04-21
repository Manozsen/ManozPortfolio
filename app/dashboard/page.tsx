"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDemosByUser } from "@/lib/firestore";
import type { Demo } from "@/types";
import StatusBadge from "@/components/shared/StatusBadge";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { ExternalLink, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [demos, setDemos] = useState<Demo[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !firebaseUser) { router.replace("/login"); return; }
    if (firebaseUser) {
      getDemosByUser(firebaseUser.uid).then((data) => {
        setDemos(data);
        setFetching(false);
      });
    }
  }, [firebaseUser, loading, router]);

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-4">
          {firebaseUser?.photoURL && (
            <Image src={firebaseUser.photoURL} alt="Profile" width={44} height={44} className="rounded-full ring-2 ring-slate-200" />
          )}
          <div>
            <h1 className="text-lg font-bold text-slate-900 font-display">
              Welcome back, {firebaseUser?.displayName?.split(" ")[0]}
            </h1>
            <p className="text-sm text-slate-500">Your demo dashboard</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {demos.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus className="w-7 h-7 text-blue-500" />
            </div>
            <h2 className="font-bold text-slate-900 font-display text-lg mb-2">No Demo Yet</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              Once you request a demo it will appear here.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/request-demo" className="btn-primary">Request a Demo</Link>
              <WhatsAppButton message="Hi Manoz! I'd like to request a demo." label="Ask on WhatsApp" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-display mb-2">
              Your Demos <span className="text-sm font-normal text-slate-400">({demos.length})</span>
            </h2>
            {demos.map((demo) => (
              <div key={demo.id} className="card p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 font-display">{demo.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Added {formatDate(demo.createdAt)}</p>
                  </div>
                  <StatusBadge status={demo.status} />
                </div>
                {demo.notes && (
                  <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">{demo.notes}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-2">
                  {demo.status !== "in_progress" && demo.demoUrl && (
                    <a href={demo.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2.5 !px-5 !text-sm">
                      <ExternalLink className="w-4 h-4" /> View My Demo
                    </a>
                  )}
                  <WhatsAppButton
                    message={`Hi Manoz! I viewed my demo "${demo.title}" and have feedback.`}
                    label="Send Feedback"
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
