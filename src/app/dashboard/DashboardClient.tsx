"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    PlusCircle,
    FileText,
    Clock,
    AlertCircle,
    Sparkles,
    ArrowRight,
    Zap,
    Target,
    DollarSign,
    CheckCircle2,
    Hourglass,
    XCircle,
    Loader2,
    Rocket,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { Submission, SubmissionStatus } from "@/types";
import { ROUTES } from "@/lib/constants";
import { useLanguage } from "@/components/LanguageContext";

interface DashboardClientProps {
    userEmail: string;
    userName: string;
}

const STATUS_STEPS: { key: SubmissionStatus; iconDone: typeof CheckCircle2; iconPending: typeof Hourglass }[] = [
    { key: "pending", iconDone: CheckCircle2, iconPending: Hourglass },
    { key: "approved", iconDone: CheckCircle2, iconPending: Hourglass },
    { key: "in_progress", iconDone: Loader2, iconPending: Hourglass },
    { key: "completed", iconDone: Rocket, iconPending: Hourglass },
];

const STATUS_INDEX: Record<string, number> = {
    pending: 0,
    approved: 1,
    in_progress: 2,
    completed: 3,
    rejected: -1,
};

const DASHBOARD_T = {
    en: {
        welcome: "Welcome back,",
        hasSubmission: "Track your idea's journey below.",
        noSubmissionReady: "Ready to submit your first idea?",
        loading: "Loading your dashboard...",
        failedLoad: "Failed to load your submission.",
        yourIdea: "Your Idea",
        description: "Description",
        targetUsers: "Target Users",
        monetization: "Monetization",
        rejectionReason: "Rejection Reason",
        submitted: "Submitted",
        updated: "Last Updated",
        freePlanInfo: "You're on the Free plan — 1 submission allowed.",
        upgradePrompt: "Upgrade to Pro for unlimited submissions and faster delivery.",
        noSubmissionTitle: "No idea submitted yet",
        noSubmissionDesc: "Got a software concept in mind? Submit it now and we'll turn it into a live web app — fast.",
        submitBtn: "Submit Your Idea",
        progressTitle: "Progress",
        stepPending: "Submitted",
        stepApproved: "Approved",
        stepInProgress: "Building",
        stepCompleted: "Delivered",
        rejectedBanner: "Your idea was not approved this time. See the feedback below.",
    },
    id: {
        welcome: "Selamat datang kembali,",
        hasSubmission: "Pantau perjalanan ide Anda di bawah ini.",
        noSubmissionReady: "Siap mengirimkan ide pertama Anda?",
        loading: "Memuat dasbor Anda...",
        failedLoad: "Gagal memuat pengajuan Anda.",
        yourIdea: "Ide Anda",
        description: "Deskripsi",
        targetUsers: "Target Pengguna",
        monetization: "Monetisasi",
        rejectionReason: "Alasan Penolakan",
        submitted: "Dikirim",
        updated: "Terakhir Diperbarui",
        freePlanInfo: "Anda pada paket Gratis — 1 pengajuan.",
        upgradePrompt: "Tingkatkan ke Pro untuk pengajuan tanpa batas dan pengiriman lebih cepat.",
        noSubmissionTitle: "Belum ada ide yang dikirim",
        noSubmissionDesc: "Punya konsep software? Kirim sekarang dan kami akan ubah menjadi web app siap pakai — cepat.",
        submitBtn: "Kirim Ide Anda",
        progressTitle: "Progres",
        stepPending: "Terkirim",
        stepApproved: "Disetujui",
        stepInProgress: "Dibangun",
        stepCompleted: "Selesai",
        rejectedBanner: "Ide Anda belum disetujui kali ini. Lihat umpan balik di bawah.",
    }
};

export default function DashboardClient({
    userEmail,
    userName,
}: DashboardClientProps) {
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { lang } = useLanguage();
    const t = DASHBOARD_T[lang];

    const fetchSubmission = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/submissions?email=${encodeURIComponent(userEmail)}`
            );
            const data = await res.json();
            if (data.success && data.data) {
                setSubmission(data.data);
            } else {
                setSubmission(null);
            }
        } catch {
            toast.error(t.failedLoad);
        } finally {
            setLoading(false);
        }
    }, [userEmail, t.failedLoad]);

    useEffect(() => {
        fetchSubmission();
    }, [fetchSubmission]);

    const firstName = userName.split(" ")[0];
    const currentStepIndex = submission ? STATUS_INDEX[submission.status] ?? -1 : -1;
    const stepLabels = [t.stepPending, t.stepApproved, t.stepInProgress, t.stepCompleted];

    return (
        <ErrorBoundary>
            <main className="max-w-4xl mx-auto px-4 py-12">
                {/* ── Welcome Header ── */}
                <div className="mb-10 fade-in">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                        {t.welcome} <span className="gradient-text">{firstName}!</span> 👋
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        {submission ? t.hasSubmission : t.noSubmissionReady}
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <LoadingSpinner size="lg" text={t.loading} />
                    </div>
                ) : submission ? (
                    <div className="fade-in space-y-8">

                        {/* ── Progress Timeline ── */}
                        {submission.status !== "rejected" && (
                            <div className="card">
                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-6">
                                    {t.progressTitle}
                                </h3>
                                <div className="flex items-center justify-between relative">
                                    {/* Connection line */}
                                    <div className="absolute top-4 left-4 right-4 h-[2px] bg-zinc-800 z-0" />
                                    <div
                                        className="absolute top-4 left-4 h-[2px] bg-gradient-to-r from-green-400 to-[#9c6dfa] z-0 transition-all duration-700"
                                        style={{ width: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 100)}%` }}
                                    />

                                    {STATUS_STEPS.map((step, i) => {
                                        const isDone = currentStepIndex > i;
                                        const isActive = currentStepIndex === i;
                                        return (
                                            <div key={step.key} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                                                <div className={`step-dot ${isDone ? "step-dot-done" : isActive ? "step-dot-active" : "step-dot-pending"}`}>
                                                    {isDone ? (
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    ) : isActive ? (
                                                        <span className="animate-pulse">●</span>
                                                    ) : (
                                                        <span>{i + 1}</span>
                                                    )}
                                                </div>
                                                <span className={`text-xs font-medium ${isDone ? "text-green-400" : isActive ? "text-[#c8a2fe]" : "text-zinc-600"}`}>
                                                    {stepLabels[i]}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── Rejected Banner ── */}
                        {submission.status === "rejected" && (
                            <div className="card bg-red-500/5 border-red-500/15">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                        <XCircle className="w-5 h-5 text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-red-300 font-semibold text-sm mb-1">{t.rejectedBanner}</p>
                                        {submission.rejection_reason && (
                                            <p className="text-red-400/80 text-sm leading-relaxed">
                                                {submission.rejection_reason}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Idea Details Card ── */}
                        <div className="card space-y-6">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9c6dfa] to-[#7c3aed] flex items-center justify-center flex-shrink-0">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">{t.yourIdea}</p>
                                        <h2 className="text-xl font-bold text-white">{submission.title}</h2>
                                    </div>
                                </div>
                                <StatusBadge status={submission.status} />
                            </div>

                            <div className="bg-[#0f1325] border border-white/5 rounded-xl p-5">
                                <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium block mb-2">
                                    {t.description}
                                </label>
                                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                                    {submission.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-[#0f1325] border border-white/5 rounded-xl p-4 flex items-start gap-3">
                                    <Target className="w-4 h-4 text-[#c8a2fe] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium block mb-1">
                                            {t.targetUsers}
                                        </label>
                                        <p className="text-zinc-300 text-sm">{submission.target_user}</p>
                                    </div>
                                </div>
                                {submission.monetization && (
                                    <div className="bg-[#0f1325] border border-white/5 rounded-xl p-4 flex items-start gap-3">
                                        <DollarSign className="w-4 h-4 text-[#c8a2fe] mt-0.5 flex-shrink-0" />
                                        <div>
                                            <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium block mb-1">
                                                {t.monetization}
                                            </label>
                                            <p className="text-zinc-300 text-sm">{submission.monetization}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Dates row */}
                            <div className="flex flex-wrap gap-6 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="font-medium">{t.submitted}:</span>
                                    {new Date(submission.created_at).toLocaleDateString(
                                        lang === "id" ? "id-ID" : "en-US",
                                        { year: "numeric", month: "short", day: "numeric" }
                                    )}
                                </div>
                                {submission.updated_at !== submission.created_at && (
                                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="font-medium">{t.updated}:</span>
                                        {new Date(submission.updated_at).toLocaleDateString(
                                            lang === "id" ? "id-ID" : "en-US",
                                            { year: "numeric", month: "short", day: "numeric" }
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Free plan info ── */}
                        <div className="card bg-amber-500/[0.03] border-amber-500/10 flex items-start gap-4">
                            <FileText className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-amber-300 font-medium">{t.freePlanInfo}</p>
                                <p className="text-xs text-zinc-500 mt-1">{t.upgradePrompt}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── Empty State — No Submission ── */
                    <div className="fade-in">
                        <div className="card border-[#9c6dfa]/10 bg-gradient-to-br from-[#1c223c]/40 to-transparent text-center py-20">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#9c6dfa] to-[#7c3aed] flex items-center justify-center mx-auto mb-8 float glow-primary">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3">{t.noSubmissionTitle}</h2>
                            <p className="text-zinc-400 text-base mb-10 max-w-md mx-auto leading-relaxed">
                                {t.noSubmissionDesc}
                            </p>
                            <button
                                id="dashboard-submit-btn"
                                onClick={() => router.push(ROUTES.SUBMIT)}
                                className="btn-primary py-4 px-10 text-base glow-primary"
                            >
                                <PlusCircle className="w-5 h-5" />
                                {t.submitBtn}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </ErrorBoundary>
    );
}
