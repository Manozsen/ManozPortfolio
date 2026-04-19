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
    if (!loading && !firebaseUser) {
      router.replace("/login");
      return;
    }
    if (firebaseUser) {
      getAllDemos().then((demos) => {
        const found = demos.find(
          (d) => d.id === id && d.userId === firebaseUser.uid
        );
        setDemo(found || null);
        setFetching(false);
      });
    }
  }, [firebaseUser, loading, id, router]);

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!demo) {
    return (
      <div className="text-center py-20 px-4">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="font-bold text-slate-800 text-lg mb-2">Demo Not Found</h2>
        <p className="text-slate-500 text-sm mb-4">
          This demo doesn't exist or you don't have access.
        </p>
        <Link href="/dashboard" className="text-violet-600 underline text-sm">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const waMessage = `Hi Manoz! I just reviewed my demo "${demo.title}" and I'm ready to move forward! 🚀`;
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916296622391";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-slate-500 hover:text-violet-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-slate-900 text-base">{demo.title}</h1>
              <StatusBadge status={demo.status} />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-2 flex-wrap">
            <a
              href={`tel:+${phoneNumber}`}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
            >
              <Phone className="w-4 h-4" /> Call
            </a>
            <WhatsAppButton
              message={waMessage}
              label="💬 I'm Interested!"
              className="!py-2 !px-4 !text-sm"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      {demo.notes && (
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 text-sm text-violet-800">
            📝 <strong>Note from Manoz:</strong> {demo.notes}
          </div>
        </div>
      )}

      {/* Demo Link / Preview */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        {demo.status === "in_progress" ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
            <div className="text-5xl mb-4">⚙️</div>
            <h2 className="font-bold text-slate-800 mb-2">Demo In Progress</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-5">
              I'm still building your demo. You'll get a WhatsApp notification when it's ready!
            </p>
            <WhatsAppButton
              message="Hi Manoz! Just checking in on my demo status."
              label="💬 Check Status"
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Open in new tab button */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <span className="text-xs text-slate-500 font-medium truncate flex-1 mr-2">
                {demo.demoUrl}
              </span>
              <a
                href={demo.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-violet-600 hover:text-violet-700 text-xs font-semibold flex-shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Demo
              </a>
            </div>

            {/* Open Demo Link CTA */}
            <div className="p-8 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="font-bold text-slate-800 text-lg mb-2">Your Demo is Ready!</h2>
              <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                Click below to view your custom website demo. Take your time exploring it!
              </p>
              <a
                href={demo.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-violet-200"
              >
                <ExternalLink className="w-4 h-4" />
                View My Demo
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-5xl mx-auto px-4 pb-10">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white text-center">
          <p className="font-bold text-lg mb-1">Love what you see?</p>
          <p className="text-violet-100 text-sm mb-5">
            Let's make it yours. Reply on WhatsApp to get started.
          </p>
          <WhatsAppButton
            message={waMessage}
            label="🚀 Yes, I Want This Site!"
            className="!bg-white !text-violet-700 hover:!bg-violet-50"
          />
        </div>
      </div>
    </div>
  );
}
