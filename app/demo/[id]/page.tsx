"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAllDemos } from "@/lib/firestore";
import type { Demo } from "@/types";
import StatusBadge from "@/components/shared/StatusBadge";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { ExternalLink, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DemoViewerPage() {
  const { id } = useParams<{ id: string }>();
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [demo, setDemo] = useState<Demo | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !firebaseUser) { router.replace("/login"); return; }
    if (firebaseUser) {
      getAllDemos().then((demos) => {
        const found = demos.find((d) => d.id === id && d.userId === firebaseUser.uid);
        setDemo(found || null);
        setFetching(false);
      });
    }
  }, [firebaseUser, loading, id, router]);

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!demo) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 pt-16">
        <div className="card p-10 text-center max-w-sm w-full">
          <h2 className="font-bold text-slate-900 font-display text-lg mb-2">Demo Not Found</h2>
          <p className="text-slate-500 text-sm mb-4">This demo does not exist or you do not have access.</p>
          <Link href="/dashboard" className="btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const waMessage = `Hi Manoz! I reviewed my demo "${demo.title}" and I am ready to move forward!`;
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916296622391";

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-slate-900 font-display text-base">{demo.title}</h1>
              <StatusBadge status={demo.status} />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <a href={`tel:+${phoneNumber}`} className="btn-secondary !py-2 !px-4 !text-sm">
              <Phone className="w-4 h-4" /> Call
            </a>
            <WhatsAppButton message={waMessage} label="I am Interested!" className="!py-2 !px-4 !text-sm" />
          </div>
        </div>
      </div>

      {demo.notes && (
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
            <strong>Note from Manoz:</strong> {demo.notes}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-4">
        {demo.status === "in_progress" ? (
          <div className="card p-10 text-center">
            <h2 className="font-bold text-slate-900 font-display mb-2">Demo In Progress</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-5">
              I am still building your demo. You will get a WhatsApp notification when it is ready!
            </p>
            <WhatsAppButton message="Hi Manoz! Checking in on my demo status." label="Check Status" />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <span className="text-xs text-slate-500 font-medium truncate flex-1 mr-2">{demo.demoUrl}</span>
              <a href={demo.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 text-xs font-semibold">
                <ExternalLink className="w-3.5 h-3.5" /> Open Demo
              </a>
            </div>
            <div className="p-8 text-center">
              <h2 className="font-bold text-slate-900 font-display text-lg mb-2">Your Demo is Ready!</h2>
              <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">Click below to view your custom website demo.</p>
              <a href={demo.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
                <ExternalLink className="w-4 h-4" /> View My Demo
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-10">
        <div className="bg-slate-900 rounded-2xl p-6 text-white text-center">
          <p className="font-bold font-display text-lg mb-1">Love what you see?</p>
          <p className="text-slate-400 text-sm mb-5">Let us make it yours. Reply on WhatsApp to get started.</p>
          <WhatsAppButton message={waMessage} label="Yes, I Want This Site!" />
        </div>
      </div>
    </div>
  );
}
