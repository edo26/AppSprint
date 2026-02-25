"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    Lightbulb,
    Users,
    DollarSign,
    FileText,
    ArrowRight,
    ChevronLeft,
    Sparkles,
    ShoppingCart,
    CalendarCheck,
    BarChart3,
    X,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ROUTES } from "@/lib/constants";
import { useLanguage } from "@/components/LanguageContext";

interface SubmitFormProps {
    userEmail: string;
}

interface FormData {
    title: string;
    description: string;
    target_user: string;
    monetization: string;
}

const INITIAL_STATE: FormData = {
    title: "",
    description: "",
    target_user: "",
    monetization: "",
};

/* ── Example Templates ── */
const TEMPLATES = {
    en: [
        {
            icon: ShoppingCart,
            label: "E-Commerce",
            color: "text-pink-400",
            bg: "bg-pink-500/10 border-pink-500/20",
            data: {
                title: "Online store for handmade crafts",
                description:
                    "A web app where craft sellers can list their handmade products with photos, pricing, and descriptions. Buyers can browse by category, add items to a cart, and checkout via integrated payment. Includes seller dashboard with order management and sales analytics.",
                target_user: "Craft sellers, artisan entrepreneurs, small business owners",
                monetization: "5% transaction fee on each sale + optional premium seller plan at $9/mo",
            },
        },
        {
            icon: CalendarCheck,
            label: "Booking App",
            color: "text-cyan-400",
            bg: "bg-cyan-500/10 border-cyan-500/20",
            data: {
                title: "Appointment booking for freelance barbers",
                description:
                    "A scheduling web app where freelance barbers can manage their availability and clients can book time slots. Features include calendar sync, automated reminders via WhatsApp/email, client history, and a simple CRM to track repeat customers.",
                target_user: "Freelance barbers, mobile hairdressers, beauty professionals",
                monetization: "Freemium — free for up to 30 bookings/month, $12/mo for unlimited",
            },
        },
        {
            icon: BarChart3,
            label: "SaaS Dashboard",
            color: "text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/20",
            data: {
                title: "Analytics dashboard for content creators",
                description:
                    "A unified dashboard that pulls metrics from YouTube, Instagram, and TikTok into one view. Creators can see engagement rates, follower trends, top-performing content, and revenue estimates. Includes weekly email reports and goal tracking widgets.",
                target_user: "YouTubers, Instagram influencers, TikTok creators, social media managers",
                monetization: "SaaS subscription — $15/mo for individuals, $49/mo for agencies",
            },
        },
    ],
    id: [
        {
            icon: ShoppingCart,
            label: "E-Commerce",
            color: "text-pink-400",
            bg: "bg-pink-500/10 border-pink-500/20",
            data: {
                title: "Toko online untuk kerajinan tangan",
                description:
                    "Web app dimana penjual kerajinan bisa menampilkan produk buatan tangan dengan foto, harga, dan deskripsi. Pembeli bisa telusuri berdasarkan kategori, tambahkan ke keranjang, dan checkout via pembayaran terintegrasi. Termasuk dasbor penjual dengan manajemen pesanan dan analitik penjualan.",
                target_user: "Penjual kerajinan, pengusaha artisan, pemilik bisnis kecil",
                monetization: "Biaya transaksi 5% per penjualan + opsi paket premium penjual Rp 99rb/bln",
            },
        },
        {
            icon: CalendarCheck,
            label: "Booking App",
            color: "text-cyan-400",
            bg: "bg-cyan-500/10 border-cyan-500/20",
            data: {
                title: "Booking jadwal untuk barbershop freelance",
                description:
                    "Web app penjadwalan dimana tukang cukur freelance bisa mengatur ketersediaan dan klien bisa booking slot waktu. Fitur termasuk sinkronisasi kalender, pengingat otomatis via WhatsApp/email, riwayat klien, dan CRM sederhana untuk melacak pelanggan setia.",
                target_user: "Barbershop freelance, penata rambut keliling, profesional kecantikan",
                monetization: "Freemium — gratis hingga 30 booking/bulan, Rp 99rb/bln untuk tak terbatas",
            },
        },
        {
            icon: BarChart3,
            label: "Dasbor SaaS",
            color: "text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/20",
            data: {
                title: "Dasbor analitik untuk konten kreator",
                description:
                    "Dasbor terpadu yang mengambil metrik dari YouTube, Instagram, dan TikTok ke dalam satu tampilan. Kreator bisa melihat tingkat engagement, tren follower, konten performa terbaik, dan estimasi pendapatan. Termasuk laporan email mingguan dan widget pelacakan target.",
                target_user: "YouTuber, influencer Instagram, kreator TikTok, manajer media sosial",
                monetization: "Langganan SaaS — Rp 149rb/bln untuk individu, Rp 499rb/bln untuk agensi",
            },
        },
    ],
};

const SUBMIT_T = {
    en: {
        back: "Back to Dashboard",
        title: "Submit Your ",
        titleIdea: "Idea",
        subtitle: "Describe your software concept clearly. We'll take it from idea to a live web app.",
        ideaTitle: "Idea Title",
        ideaTitlePlaceholder: "e.g. Invoice generator for freelancers",
        desc: "Description",
        descPlaceholder: "What does your app do? What problem does it solve? What features does it need?",
        charsLeft: "left",
        targetUsers: "Target Users",
        targetUsersPlaceholder: "e.g. Freelance designers, small business owners",
        monetization: "Monetization Strategy",
        optional: "(optional)",
        monetizationPlaceholder: "e.g. SaaS subscription, freemium, one-time purchase",
        submitBtn: "Submit Idea",
        toastAlready: "You've already submitted an idea!",
        toastFillAll: "Please fill in all required fields.",
        toastSuccess: "🎉 Idea submitted successfully!",
        loadForm: "Preparing your form...",
        terms: "By submitting, you agree to our terms. One free submission per account.",
        templateTitle: "Need inspiration? Try a template:",
        templateUsing: "Using template — feel free to customize!",
        clearTemplate: "Clear",
    },
    id: {
        back: "Kembali ke Dasbor",
        title: "Kirim ",
        titleIdea: "Ide Anda",
        subtitle: "Jelaskan konsep software Anda dengan jelas. Kami akan mengubah ide ini menjadi web app siap pakai.",
        ideaTitle: "Judul Ide",
        ideaTitlePlaceholder: "Cth. Pembuat faktur untuk freelancer",
        desc: "Deskripsi",
        descPlaceholder: "Apa yang dilakukan aplikasi Anda? Masalah apa yang dipecahkan? Fitur apa yang dibutuhkan?",
        charsLeft: "tersisa",
        targetUsers: "Target Pengguna",
        targetUsersPlaceholder: "Cth. Desainer lepas, pemilik bisnis kecil",
        monetization: "Strategi Monetisasi",
        optional: "(opsional)",
        monetizationPlaceholder: "Cth. Langganan SaaS, freemium, pembelian sekali bayar",
        submitBtn: "Kirim Ide",
        toastAlready: "Anda sudah mengirimkan ide!",
        toastFillAll: "Harap isi semua kolom yang wajib.",
        toastSuccess: "🎉 Ide berhasil dikirimkan!",
        loadForm: "Menyiapkan formulir Anda...",
        terms: "Dengan mengirimkan, Anda menyetujui ketentuan kami. Satu kiriman gratis per akun.",
        templateTitle: "Butuh inspirasi? Coba template:",
        templateUsing: "Menggunakan template — silakan sesuaikan!",
        clearTemplate: "Hapus",
    },
};

export default function SubmitForm({ userEmail }: SubmitFormProps) {
    const router = useRouter();
    const { lang } = useLanguage();
    const [form, setForm] = useState<FormData>(INITIAL_STATE);
    const [loading, setLoading] = useState(false);
    const [checkingExisting, setCheckingExisting] = useState(true);
    const [charLimit, setCharLimit] = useState(500);
    const [activeTemplate, setActiveTemplate] = useState<number | null>(null);

    const t = SUBMIT_T[lang];
    const templates = TEMPLATES[lang];

    useEffect(() => {
        const check = async () => {
            try {
                const res = await fetch(
                    `/api/submissions?email=${encodeURIComponent(userEmail)}`
                );
                const data = await res.json();

                if (data.success && data.data) {
                    toast.error(t.toastAlready);
                    router.replace(ROUTES.DASHBOARD);
                    return;
                }

                const settingsRes = await fetch("/api/settings");
                const settingsData = await settingsRes.json();
                if (settingsData.success && settingsData.data?.char_limit) {
                    setCharLimit(settingsData.data.char_limit);
                }
            } catch {
                // Non-critical: continue with defaults
            } finally {
                setCheckingExisting(false);
            }
        };

        check();
    }, [userEmail, router, t.toastAlready]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (name === "description" && value.length > charLimit) return;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const applyTemplate = (index: number) => {
        const tmpl = templates[index];
        setForm(tmpl.data);
        setActiveTemplate(index);
        toast.success(t.templateUsing);
    };

    const clearTemplate = () => {
        setForm(INITIAL_STATE);
        setActiveTemplate(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.title.trim() || !form.description.trim() || !form.target_user.trim()) {
            toast.error(t.toastFillAll);
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Submitting...");

        try {
            const res = await fetch("/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (data.success) {
                toast.success(t.toastSuccess, { id: loadingToast });
                router.push(ROUTES.DASHBOARD);
            } else {
                toast.error(data.error ?? "Submission failed. Try again.", {
                    id: loadingToast,
                });
            }
        } catch {
            toast.error("Network error. Please try again.", { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    const descCharsLeft = charLimit - form.description.length;
    const descProgress = (form.description.length / charLimit) * 100;

    if (checkingExisting) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <LoadingSpinner size="lg" text={t.loadForm} />
            </div>
        );
    }

    return (
        <main className="max-w-3xl mx-auto px-4 py-12">
            {/* ── Back button ── */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 text-sm group"
                id="submit-back-btn"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                {t.back}
            </button>

            {/* ── Header ── */}
            <div className="mb-10 fade-in">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9c6dfa] to-[#7c3aed] flex items-center justify-center glow-primary-sm">
                        <Lightbulb className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black flex items-center gap-2">
                            {t.title} <span className="gradient-text">{t.titleIdea}</span>
                        </h1>
                        <p className="text-zinc-400 text-sm mt-1">{t.subtitle}</p>
                    </div>
                </div>
            </div>

            {/* ── Example Templates ── */}
            <div className="mb-8 fade-in">
                <p className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#c8a2fe]" />
                    {t.templateTitle}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {templates.map((tmpl, i) => {
                        const Icon = tmpl.icon;
                        const isActive = activeTemplate === i;
                        return (
                            <button
                                key={tmpl.label}
                                type="button"
                                onClick={() => isActive ? clearTemplate() : applyTemplate(i)}
                                className={`relative text-left p-4 rounded-xl border transition-all duration-300 group ${isActive
                                        ? "bg-[#9c6dfa]/10 border-[#9c6dfa]/40 ring-1 ring-[#9c6dfa]/20"
                                        : "bg-[#141829] border-white/[0.06] hover:border-white/15"
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${tmpl.bg}`}>
                                        <Icon className={`w-4 h-4 ${tmpl.color}`} />
                                    </div>
                                    <span className="text-sm font-bold text-white">{tmpl.label}</span>
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                                    {tmpl.data.title}
                                </p>
                                {isActive && (
                                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#9c6dfa] flex items-center justify-center">
                                        <X className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-6 fade-in">
                {/* Title */}
                <div className="space-y-2">
                    <label
                        htmlFor="title"
                        className="flex items-center gap-2 text-sm font-semibold text-zinc-300"
                    >
                        <FileText className="w-4 h-4 text-[#c8a2fe]" />
                        {t.ideaTitle} <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={form.title}
                        onChange={handleChange}
                        placeholder={t.ideaTitlePlaceholder}
                        className="input-field"
                        required
                        maxLength={120}
                        disabled={loading}
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label
                        htmlFor="description"
                        className="flex items-center gap-2 text-sm font-semibold text-zinc-300"
                    >
                        <FileText className="w-4 h-4 text-[#c8a2fe]" />
                        {t.desc} <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder={t.descPlaceholder}
                        className="input-field resize-none"
                        rows={7}
                        required
                        disabled={loading}
                    />
                    {/* Char counter */}
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${descProgress > 90
                                        ? "bg-red-500"
                                        : descProgress > 70
                                            ? "bg-yellow-500"
                                            : "bg-[#9c6dfa]"
                                    }`}
                                style={{ width: `${Math.min(descProgress, 100)}%` }}
                            />
                        </div>
                        <span
                            className={`text-xs font-mono tabular-nums ${descCharsLeft < 50 ? "text-red-400" : "text-zinc-500"
                                }`}
                        >
                            {descCharsLeft} {t.charsLeft}
                        </span>
                    </div>
                </div>

                {/* Target User */}
                <div className="space-y-2">
                    <label
                        htmlFor="target_user"
                        className="flex items-center gap-2 text-sm font-semibold text-zinc-300"
                    >
                        <Users className="w-4 h-4 text-[#c8a2fe]" />
                        {t.targetUsers} <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="target_user"
                        name="target_user"
                        type="text"
                        value={form.target_user}
                        onChange={handleChange}
                        placeholder={t.targetUsersPlaceholder}
                        className="input-field"
                        required
                        maxLength={200}
                        disabled={loading}
                    />
                </div>

                {/* Monetization */}
                <div className="space-y-2">
                    <label
                        htmlFor="monetization"
                        className="flex items-center gap-2 text-sm font-semibold text-zinc-300"
                    >
                        <DollarSign className="w-4 h-4 text-[#c8a2fe]" />
                        {t.monetization}
                        <span className="text-zinc-600 font-normal">{t.optional}</span>
                    </label>
                    <input
                        id="monetization"
                        name="monetization"
                        type="text"
                        value={form.monetization}
                        onChange={handleChange}
                        placeholder={t.monetizationPlaceholder}
                        className="input-field"
                        maxLength={200}
                        disabled={loading}
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    id="submit-form-btn"
                    disabled={loading || !form.title || !form.description || !form.target_user}
                    className="btn-primary w-full py-4 text-base mt-4 glow-primary group"
                >
                    {loading ? (
                        <LoadingSpinner size="sm" />
                    ) : (
                        <>
                            {t.submitBtn}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                <p className="text-xs text-zinc-600 text-center">{t.terms}</p>
            </form>
        </main>
    );
}
