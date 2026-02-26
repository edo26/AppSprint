"use client";

import { signIn } from "next-auth/react";
import {
    ArrowRight,
    Check,
    Zap,
    Lightbulb,
    Rocket,
    Code2,
    Terminal,
    FastForward,
    UserCheck,
    Activity
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageContext";

// Translations dictionary
const CONTENT = {
    en: {
        hero: {
            title1: "Turn Your Software",
            title2: "Idea Into A Web App —",
            titleHighlight1: "Now Just One",
            titleHighlight2: "Click Away!",
            ctaBtn: "Start Project",
            pill: "AppSprint",
            statValue: "2.4k+",
            statLabel: "Ideas Submitted",
        },
        features: {
            title1: "Everything You Need to ",
            titleHighlight: "Ship Faster",
            subtitle: "From idea to validated web app in a day, not months.",
            list: [
                {
                    icon: Lightbulb,
                    title: "Submit Your Idea",
                    description: "Share your software concept with a clear description, target audience, and core features.",
                },
                {
                    icon: FastForward,
                    title: "Rapid Delivery",
                    description: "We focus on speed. Get your web app fully developed and delivered faster than traditional agencies.",
                },
                {
                    icon: UserCheck,
                    title: "Single Founder Focus",
                    description: "Work directly with a dedicated solo founder who builds your vision without communication overhead.",
                },
                {
                    icon: Rocket,
                    title: "Idea to Web App",
                    description: "Skip complex setups. We take your raw concept straight to a live, working application in a day.",
                },
                {
                    icon: Terminal,
                    title: "Seamless Execution",
                    description: "No bureaucracy. Just straightforward, direct development focused on launching your product.",
                },
                {
                    icon: Activity,
                    title: "Real-Time Status",
                    description: "Monitor your idea's progress from submission through rapid development and launch.",
                },
            ]
        },
        pricing: {
            title1: "Simple, ",
            titleHighlight: "Transparent",
            title2: " Pricing",
            subtitle: "Start free. Scale when you're ready.",
            popularBadge: "MOST POPULAR",
            plans: [
                {
                    name: "Free",
                    price: "$0",
                    period: "forever",
                    description: "Perfect for first-time idea submitters",
                    features: [
                        "1 idea submission",
                        "300 character description",
                        "Real-time status tracking",
                        "Email notifications",
                    ],
                    cta: "Get Started Free",
                    highlighted: false,
                },
                {
                    name: "Pro",
                    price: "$29",
                    period: "per month",
                    description: "For rapid iterations",
                    features: [
                        "Unlimited submissions",
                        "2,000 character descriptions",
                        "Priority development queue",
                        "Direct founder access",
                        "Rapid execution",
                    ],
                    cta: "Start Pro Trial",
                    highlighted: true,
                },
                {
                    name: "Enterprise",
                    price: "Custom",
                    period: "pricing",
                    description: "For complex integrations",
                    features: [
                        "Everything in Pro",
                        "Dedicated execution strategy",
                        "Custom SLA",
                        "API access",
                        "Priority support",
                    ],
                    cta: "Contact Sales",
                    highlighted: false,
                },
            ]
        },
        footer: {
            rights: "AppSprint. All rights reserved."
        }
    },
    id: {
        hero: {
            title1: "Ubah Ide Software",
            title2: "Menjadi Web App —",
            titleHighlight1: "Hanya Dengan",
            titleHighlight2: "Satu Klik!",
            ctaBtn: "Mulai Proyek",
            pill: "AppSprint",
            statValue: "2.4k+",
            statLabel: "Ide Terkirim",
        },
        features: {
            title1: "Semua Yang Anda Butuhkan Untuk ",
            titleHighlight: "Rilis Lebih Cepat",
            subtitle: "Dari ide hingga web app dalam sehari, bukan berbulan-bulan.",
            list: [
                {
                    icon: Lightbulb,
                    title: "Kirim Ide Anda",
                    description: "Bagikan konsep software Anda dengan deskripsi yang jelas, target audiens, dan fitur utama.",
                },
                {
                    icon: FastForward,
                    title: "Pengiriman Cepat",
                    description: "Kami berfokus pada kecepatan. Dapatkan web app Anda dikembangkan lebih cepat dari agensi biasa.",
                },
                {
                    icon: UserCheck,
                    title: "Fokus Founder Tunggal",
                    description: "Bekerja langsung dengan solo founder yang membangun visi Anda tanpa proses komunikasi yang rumit.",
                },
                {
                    icon: Rocket,
                    title: "Ide Menjadi Web App",
                    description: "Lewati pengaturan rumit. Kami membawa konsep awal Anda menjadi aplikasi siap pakai dalam sehari.",
                },
                {
                    icon: Terminal,
                    title: "Eksekusi Mulus",
                    description: "Tanpa birokrasi. Hanya pengembangan langsung dan lugas yang berfokus pada peluncuran produk.",
                },
                {
                    icon: Activity,
                    title: "Status Real-Time",
                    description: "Pantau perkembangan ide Anda dari pengiriman hingga tahap pengembangan cepat dan peluncuran.",
                },
            ]
        },
        pricing: {
            title1: "Harga yang ",
            titleHighlight: "Transparan",
            title2: " & Sederhana",
            subtitle: "Mulai gratis. Kembangkan saat Anda siap.",
            popularBadge: "PALING POPULER",
            plans: [
                {
                    name: "Gratis",
                    price: "$0",
                    period: "selamanya",
                    description: "Cocok untuk percobaan pertama",
                    features: [
                        "1 kali kirim ide",
                        "Deskripsi 300 karakter",
                        "Pelacakan status real-time",
                        "Notifikasi email",
                    ],
                    cta: "Mulai Gratis",
                    highlighted: false,
                },
                {
                    name: "Pro",
                    price: "$29",
                    period: "per bulan",
                    description: "Untuk iterasi yang cepat",
                    features: [
                        "Kirim ide tak terbatas",
                        "Deskripsi 2.000 karakter",
                        "Antrean prioritas",
                        "Akses langsung ke founder",
                        "Eksekusi super cepat",
                    ],
                    cta: "Mulai Uji Coba Pro",
                    highlighted: true,
                },
                {
                    name: "Enterprise",
                    price: "Kustom",
                    period: "harga",
                    description: "Untuk integrasi kompleks",
                    features: [
                        "Semua fitur Pro",
                        "Strategi eksekusi khusus",
                        "SLA Khusus",
                        "Akses API",
                        "Dukungan prioritas",
                    ],
                    cta: "Hubungi Sales",
                    highlighted: false,
                },
            ]
        },
        footer: {
            rights: "AppSprint. Hak cipta dilindungi."
        }
    }
};

export default function LandingClient() {
    const { lang } = useLanguage();
    const content = CONTENT[lang];

    return (
        <div className="min-h-screen bg-[var(--bg-very-dark)]">
            {/* ── Hero Section (Mesh Gradient + Concentric Circles) ── */}
            <section className="hero-gradient min-h-[95vh] flex flex-col relative rounded-b-[40px] overflow-hidden shadow-2xl shadow-purple-900/10 mb-10">

                <Navbar />

                <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 pb-20 flex flex-col lg:flex-row items-center relative z-10">

                    {/* ── Left Column (Text) ── */}
                    <div className="w-full lg:w-[55%] text-left z-20 pr-0 lg:pr-10 mb-20 lg:mb-0 mt-8 lg:mt-0">
                        <h1 className="text-[54px] lg:text-[76px] font-extrabold tracking-tight mb-8 leading-[1.05] text-[#1e1b4b]">
                            {content.hero.title1}<br />
                            {content.hero.title2}<br />
                            <span className="text-white">{content.hero.titleHighlight1}<br />{content.hero.titleHighlight2}</span>
                        </h1>

                        <div className="flex items-center gap-4 fade-in">
                            <button
                                id="hero-start-btn"
                                onClick={() => signIn("google")}
                                className="btn-pill btn-dark text-[15px] px-8 py-4 flex items-center gap-2 group"
                            >
                                {content.hero.ctaBtn}
                                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        <div className="mt-6 flex items-center fade-in">
                            <div className="bg-[#bba2ff] text-[#1e1b4b] px-4 py-1.5 rounded-full text-xs font-black shadow-lg shadow-purple-900/20 transform -rotate-2 cursor-default pointer-events-none">
                                {content.hero.pill}
                            </div>
                        </div>
                    </div>

                    {/* ── Right Column (Concentric Circles) ── */}
                    <div className="w-full lg:w-[45%] relative h-[450px] lg:h-[600px] flex items-center justify-center z-10">
                        {/* Circles */}
                        <div className="concentric-circle w-[280px] h-[280px]" />
                        <div className="concentric-circle w-[420px] h-[420px]" />
                        <div className="concentric-circle w-[580px] h-[580px] hidden md:block" />

                        {/* Center Content */}
                        <div className="relative z-20 flex flex-col items-center justify-center fade-in">
                            <span className="text-6xl font-black text-white mb-2 tracking-tight drop-shadow-lg">{content.hero.statValue}</span>
                            <span className="text-sm font-medium text-zinc-300 tracking-wide uppercase">{content.hero.statLabel}</span>
                        </div>

                        <div className="floating-avatar top-[12%] left-[45%] float-slow bg-[#1e1b4b]">
                            <FastForward className="w-5 h-5 text-white" />
                        </div>
                        <div className="floating-avatar top-[30%] left-[20%] float-medium bg-[#8b5cf6]">
                            <Lightbulb className="w-5 h-5 text-white" />
                        </div>
                        <div className="floating-avatar-lg floating-avatar bottom-[25%] left-[25%] float-fast bg-[#0b0f19]">
                            <Code2 className="w-6 h-6 text-[#a78bfa]" />
                        </div>
                        <div className="floating-avatar bottom-[15%] right-[30%] float-medium bg-rose-500">
                            <Terminal className="w-5 h-5 text-white" />
                        </div>
                        <div className="floating-avatar top-[25%] right-[15%] float-slow bg-[#10b981]">
                            <Check className="w-5 h-5 text-white" />
                        </div>
                        <div className="floating-avatar-lg floating-avatar top-[45%] right-[5%] float-fast bg-[#0b0f19] hidden md:flex">
                            <Rocket className="w-6 h-6 text-[#fbbf24]" />
                        </div>
                    </div>
                </div>

                {/* ── Partner Logos ── */}
                <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 pb-14 flex flex-wrap justify-center md:justify-between items-center opacity-[0.65] relative z-10 text-white font-bold text-lg md:text-xl gap-6">
                    <span className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-white/20" /> Dreamure</span>
                    <span className="uppercase tracking-widest font-black">SWITCH.WIN</span>
                    <span className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-white/20 grid place-items-center"><div className="w-2 h-2 rounded-full bg-white" /></div> sphere</span>
                    <span className="flex items-center gap-1 font-black text-2xl tracking-tighter hidden md:flex">PinSpace</span>
                    <span className="flex flex-col items-center leading-none text-xl font-black md:hidden lg:flex"><Zap fill="white" className="w-4 h-4 mb-1" />Visionix</span>
                </div>
            </section>

            {/* ── Features Section ── */}
            <section className="py-24 px-6 lg:px-12" id="features">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-16 fade-in">
                        <h2 className="text-3xl md:text-5xl font-black mb-4">
                            {content.features.title1} <span className="text-[#c8a2fe]">{content.features.titleHighlight}</span>
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            {content.features.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {content.features.list.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.title}
                                    className="glass-card hover:bg-white/10 transition-colors group"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                                        <Icon className="w-6 h-6 text-[#c8a2fe]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-zinc-400 text-[15px] leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Pricing Section ── */}
            <section className="py-24 px-6 lg:px-12 bg-[#0b0f19]" id="pricing">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4">
                            {content.pricing.title1} <span className="text-[#c8a2fe]">{content.pricing.titleHighlight}</span>
                            {content.pricing.title2 && content.pricing.title2}
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                            {content.pricing.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        {content.pricing.plans.map((plan) => (
                            <div
                                key={plan.name}
                                id={`pricing-${plan.name.toLowerCase()}`}
                                className={`glass-card relative flex flex-col h-full ${plan.highlighted
                                    ? "border-[#c8a2fe]/40 shadow-2xl shadow-[#9c6dfa]/20 scale-105 bg-[#0f1325]"
                                    : "border-white/5 bg-[#0f1325]/50"
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#bba2ff] text-[#1e1b4b] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                                        {content.pricing.popularBadge}
                                    </div>
                                )}
                                <div className="mb-6 flex-1">
                                    <div className="text-zinc-400 text-sm font-medium mb-1 uppercase tracking-wide">
                                        {plan.name}
                                    </div>
                                    <div className="flex items-end gap-1 mb-2">
                                        <span className="text-5xl font-black text-white">
                                            {plan.price}
                                        </span>
                                        <span className="text-zinc-500 text-sm mb-1.5 font-medium">
                                            /{plan.period}
                                        </span>
                                    </div>
                                    <p className="text-zinc-400 text-sm">{plan.description}</p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-[15px]">
                                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                                            <span className="text-zinc-300 font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => signIn("google")}
                                    className={`py-3.5 px-6 rounded-full font-semibold transition-all w-full mt-auto ${plan.highlighted
                                        ? "btn-glow"
                                        : "bg-[#1c223c] text-white hover:bg-[#252c4d]"
                                        }`}
                                    id={`pricing-cta-${plan.name.toLowerCase()}`}
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-white/5 py-12 px-6 lg:px-12 text-center text-zinc-500 text-sm bg-black/20">
                <div className="flex items-center justify-center gap-2.5 mb-4">
                    <Zap className="w-5 h-5 text-[#c8a2fe]" />
                    <span className="font-extrabold text-white text-lg tracking-tight">AppSprint</span>
                </div>
                <p>© {new Date().getFullYear()} {content.footer.rights}</p>
            </footer>
        </div>
    );
}
