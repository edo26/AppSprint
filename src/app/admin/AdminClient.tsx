"use client";

/**
 * AdminClient Component
 * Full admin dashboard with:
 * - Submissions table with status filtering
 * - Status update modal with rejection reason
 * - Settings panel
 */

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
    RefreshCw,
    Settings,
    CheckCircle,
    XCircle,
    Filter,
    ChevronDown,
    Save,
    ToggleLeft,
    ToggleRight,
    Eye,
    X,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { Submission, SubmissionStatus, AppSettings, Setting } from "@/types";
import { STATUS_CONFIG } from "@/lib/constants";

type TabType = "submissions" | "settings";

const ALL_STATUSES: SubmissionStatus[] = [
    "pending",
    "approved",
    "rejected",
    "in_progress",
    "completed",
];

/** Modal state for viewing/updating a submission */
interface ModalState {
    submission: Submission;
    newStatus: SubmissionStatus;
    rejectionReason: string;
}

export default function AdminClient() {
    const [activeTab, setActiveTab] = useState<TabType>("submissions");
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<SubmissionStatus | "all">("all");
    const [modal, setModal] = useState<ModalState | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // Settings state
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [settingsLoading, setSettingsLoading] = useState(false);
    const [savingSettings, setSavingSettings] = useState(false);

    /**
     * Fetches all submissions from the admin API.
     */
    const fetchSubmissions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/submissions");
            const data = await res.json();
            if (data.success) {
                setSubmissions(data.data ?? []);
            } else {
                toast.error("Failed to load submissions.");
            }
        } catch {
            toast.error("Network error loading submissions.");
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetches app settings from the admin API.
     */
    const fetchSettings = useCallback(async () => {
        setSettingsLoading(true);
        try {
            const res = await fetch("/api/admin/settings");
            const data = await res.json();
            if (data.success) {
                setSettings(data.data);
            }
        } catch {
            toast.error("Failed to load settings.");
        } finally {
            setSettingsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubmissions();
        fetchSettings();
    }, [fetchSubmissions, fetchSettings]);

    /**
     * Opens the detail/update modal for a submission.
     * @param submission - The submission to view/edit
     */
    const openModal = (submission: Submission) => {
        setModal({
            submission,
            newStatus: submission.status,
            rejectionReason: submission.rejection_reason ?? "",
        });
    };

    /**
     * Submits the status update to the admin API.
     */
    const handleUpdateStatus = async () => {
        if (!modal) return;
        setUpdatingStatus(true);

        const loadingToast = toast.loading("Updating status...");

        try {
            const res = await fetch("/api/admin/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: modal.submission.id,
                    status: modal.newStatus,
                    rejection_reason: modal.rejectionReason,
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Status updated!", { id: loadingToast });
                setModal(null);
                fetchSubmissions();
            } else {
                toast.error(data.error ?? "Update failed.", { id: loadingToast });
            }
        } catch {
            toast.error("Network error.", { id: loadingToast });
        } finally {
            setUpdatingStatus(false);
        }
    };

    /**
     * Saves settings to the admin API.
     * Converts AppSettings to array of Setting key-value pairs.
     */
    const handleSaveSettings = async () => {
        if (!settings) return;
        setSavingSettings(true);

        const settingsArray: Setting[] = [
            { key: "char_limit", value: String(settings.char_limit) },
            { key: "max_free_submissions", value: String(settings.max_free_submissions) },
            { key: "pricing_free", value: settings.pricing_free },
            { key: "pricing_pro", value: settings.pricing_pro },
            { key: "pricing_enterprise", value: settings.pricing_enterprise },
            { key: "accepting_submissions", value: String(settings.accepting_submissions) },
        ];

        const loadingToast = toast.loading("Saving settings...");

        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ settings: settingsArray }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Settings saved!", { id: loadingToast });
            } else {
                toast.error(data.error ?? "Failed to save.", { id: loadingToast });
            }
        } catch {
            toast.error("Network error.", { id: loadingToast });
        } finally {
            setSavingSettings(false);
        }
    };

    // Filter submissions by status
    const filteredSubmissions =
        filterStatus === "all"
            ? submissions
            : submissions.filter((s) => s.status === filterStatus);

    return (
        <ErrorBoundary>
            <main className="max-w-7xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 fade-in">
                    <div>
                        <h1 className="text-3xl font-black gradient-text">Admin Dashboard</h1>
                        <p className="text-zinc-400 text-sm mt-1">
                            {submissions.length} total submissions
                        </p>
                    </div>
                    <button
                        onClick={fetchSubmissions}
                        className="btn-secondary py-2 px-4 text-sm"
                        id="admin-refresh-btn"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl border border-white/5 w-fit mb-8">
                    {(["submissions", "settings"] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            id={`admin-tab-${tab}`}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize flex items-center gap-2 ${activeTab === tab
                                    ? "bg-indigo-600 text-white"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                        >
                            {tab === "settings" && <Settings className="w-4 h-4" />}
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ── Submissions Tab ── */}
                {activeTab === "submissions" && (
                    <div className="fade-in space-y-6">
                        {/* Filter bar */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-zinc-500 flex items-center gap-1">
                                <Filter className="w-3.5 h-3.5" /> Filter:
                            </span>
                            <button
                                onClick={() => setFilterStatus("all")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === "all"
                                        ? "bg-white/10 text-white"
                                        : "text-zinc-500 hover:text-white"
                                    }`}
                            >
                                All ({submissions.length})
                            </button>
                            {ALL_STATUSES.map((status) => {
                                const count = submissions.filter((s) => s.status === status).length;
                                return (
                                    <button
                                        key={status}
                                        id={`admin-filter-${status}`}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === status
                                                ? "bg-white/10 " + STATUS_CONFIG[status].color
                                                : "text-zinc-500 hover:text-white"
                                            }`}
                                    >
                                        {STATUS_CONFIG[status].label} ({count})
                                    </button>
                                );
                            })}
                        </div>

                        {/* Table */}
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <LoadingSpinner size="lg" text="Loading submissions..." />
                            </div>
                        ) : filteredSubmissions.length === 0 ? (
                            <div className="card text-center py-16 text-zinc-500">
                                No submissions found.
                            </div>
                        ) : (
                            <div className="card p-0 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                {["#", "Title", "Email", "Status", "Submitted", "Actions"].map(
                                                    (h) => (
                                                        <th
                                                            key={h}
                                                            className="text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-wider font-medium"
                                                        >
                                                            {h}
                                                        </th>
                                                    )
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredSubmissions.map((sub, i) => (
                                                <tr
                                                    key={sub.id}
                                                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                                                >
                                                    <td className="px-4 py-3 text-zinc-600">
                                                        {i + 1}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="font-medium text-white truncate max-w-48 block">
                                                            {sub.title}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-zinc-400 text-xs">
                                                        {sub.user_email}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <StatusBadge status={sub.status} />
                                                    </td>
                                                    <td className="px-4 py-3 text-zinc-500 text-xs">
                                                        {new Date(sub.created_at).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            id={`admin-view-${sub.id}`}
                                                            onClick={() => openModal(sub)}
                                                            className="btn-secondary py-1.5 px-3 text-xs"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                            Review
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Settings Tab ── */}
                {activeTab === "settings" && (
                    <div className="fade-in max-w-2xl space-y-6">
                        {settingsLoading ? (
                            <LoadingSpinner size="md" text="Loading settings..." />
                        ) : settings ? (
                            <>
                                <div className="card space-y-6">
                                    <h2 className="text-lg font-bold">Submission Settings</h2>

                                    {/* Accepting Submissions Toggle */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="font-medium text-sm text-white">
                                                Accepting Submissions
                                            </label>
                                            <p className="text-xs text-zinc-500 mt-0.5">
                                                Toggle to enable or disable new submissions
                                            </p>
                                        </div>
                                        <button
                                            id="settings-toggle-submissions"
                                            onClick={() =>
                                                setSettings((prev) =>
                                                    prev
                                                        ? {
                                                            ...prev,
                                                            accepting_submissions: !prev.accepting_submissions,
                                                        }
                                                        : prev
                                                )
                                            }
                                            className="transition-colors"
                                        >
                                            {settings.accepting_submissions ? (
                                                <ToggleRight className="w-10 h-10 text-green-400" />
                                            ) : (
                                                <ToggleLeft className="w-10 h-10 text-zinc-600" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Character Limit */}
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="settings-char-limit"
                                            className="text-sm font-medium text-zinc-300"
                                        >
                                            Description Character Limit
                                        </label>
                                        <input
                                            id="settings-char-limit"
                                            type="number"
                                            min={100}
                                            max={5000}
                                            value={settings.char_limit}
                                            onChange={(e) =>
                                                setSettings((prev) =>
                                                    prev
                                                        ? { ...prev, char_limit: parseInt(e.target.value) }
                                                        : prev
                                                )
                                            }
                                            className="input-field max-w-48"
                                        />
                                    </div>

                                    {/* Max Free Submissions */}
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="settings-max-subs"
                                            className="text-sm font-medium text-zinc-300"
                                        >
                                            Max Free Submissions per Email
                                        </label>
                                        <input
                                            id="settings-max-subs"
                                            type="number"
                                            min={1}
                                            max={10}
                                            value={settings.max_free_submissions}
                                            onChange={(e) =>
                                                setSettings((prev) =>
                                                    prev
                                                        ? {
                                                            ...prev,
                                                            max_free_submissions: parseInt(e.target.value),
                                                        }
                                                        : prev
                                                )
                                            }
                                            className="input-field max-w-48"
                                        />
                                    </div>
                                </div>

                                <div className="card space-y-6">
                                    <h2 className="text-lg font-bold">Pricing Settings</h2>

                                    {(
                                        [
                                            { key: "pricing_free", label: "Free Plan Label" },
                                            { key: "pricing_pro", label: "Pro Plan Price" },
                                            { key: "pricing_enterprise", label: "Enterprise Plan Label" },
                                        ] as { key: keyof AppSettings; label: string }[]
                                    ).map(({ key, label }) => (
                                        <div key={key} className="space-y-2">
                                            <label
                                                htmlFor={`settings-${key}`}
                                                className="text-sm font-medium text-zinc-300"
                                            >
                                                {label}
                                            </label>
                                            <input
                                                id={`settings-${key}`}
                                                type="text"
                                                value={String(settings[key])}
                                                onChange={(e) =>
                                                    setSettings((prev) =>
                                                        prev ? { ...prev, [key]: e.target.value } : prev
                                                    )
                                                }
                                                className="input-field max-w-64"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    id="settings-save-btn"
                                    onClick={handleSaveSettings}
                                    disabled={savingSettings}
                                    className="btn-primary py-3 px-8 glow-primary-sm"
                                >
                                    {savingSettings ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Settings
                                        </>
                                    )}
                                </button>
                            </>
                        ) : null}
                    </div>
                )}
            </main>

            {/* ── Review Modal ── */}
            {modal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
                >
                    <div className="glass-strong rounded-2xl w-full max-w-lg p-6 fade-in">
                        <div className="flex items-start justify-between mb-6">
                            <h2 className="text-xl font-bold">Review Submission</h2>
                            <button
                                onClick={() => setModal(null)}
                                className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                                id="modal-close-btn"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <div className="text-xs text-zinc-500 mb-1">Title</div>
                                <div className="text-white font-semibold">{modal.submission.title}</div>
                            </div>
                            <div>
                                <div className="text-xs text-zinc-500 mb-1">Description</div>
                                <div className="text-zinc-300 text-sm leading-relaxed">
                                    {modal.submission.description}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-zinc-500 mb-1">Target Users</div>
                                    <div className="text-zinc-300 text-sm">{modal.submission.target_user}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-zinc-500 mb-1">Monetization</div>
                                    <div className="text-zinc-300 text-sm">
                                        {modal.submission.monetization || "—"}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-zinc-500 mb-1">Submitter</div>
                                <div className="text-zinc-300 text-sm">{modal.submission.user_email}</div>
                            </div>
                        </div>

                        {/* Status selector */}
                        <div className="space-y-3 mb-4">
                            <label className="text-sm font-medium text-zinc-300">
                                Update Status
                            </label>
                            <div className="relative">
                                <select
                                    id="modal-status-select"
                                    value={modal.newStatus}
                                    onChange={(e) =>
                                        setModal((prev) =>
                                            prev
                                                ? { ...prev, newStatus: e.target.value as SubmissionStatus }
                                                : prev
                                        )
                                    }
                                    className="input-field appearance-none pr-10"
                                >
                                    {ALL_STATUSES.map((status) => (
                                        <option key={status} value={status}>
                                            {STATUS_CONFIG[status].label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Rejection reason */}
                        {modal.newStatus === "rejected" && (
                            <div className="space-y-2 mb-4">
                                <label className="text-sm font-medium text-zinc-300">
                                    Rejection Reason
                                </label>
                                <textarea
                                    id="modal-rejection-reason"
                                    value={modal.rejectionReason}
                                    onChange={(e) =>
                                        setModal((prev) =>
                                            prev ? { ...prev, rejectionReason: e.target.value } : prev
                                        )
                                    }
                                    placeholder="Explain why this submission was rejected..."
                                    className="input-field resize-none"
                                    rows={3}
                                />
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                id="modal-approve-btn"
                                onClick={() => {
                                    setModal((prev) =>
                                        prev ? { ...prev, newStatus: "approved" } : prev
                                    );
                                }}
                                className="btn-success flex-1"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                            </button>
                            <button
                                id="modal-reject-btn"
                                onClick={() => {
                                    setModal((prev) =>
                                        prev
                                            ? { ...prev, newStatus: "rejected" }
                                            : prev
                                    );
                                }}
                                className="btn-danger flex-1"
                            >
                                <XCircle className="w-4 h-4" />
                                Reject
                            </button>
                            <button
                                id="modal-update-btn"
                                onClick={handleUpdateStatus}
                                disabled={updatingStatus}
                                className="btn-primary"
                            >
                                {updatingStatus ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ErrorBoundary>
    );
}
