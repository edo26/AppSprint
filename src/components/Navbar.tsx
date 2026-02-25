"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Zap, Shield, Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { ROUTES, ADMIN_EMAILS } from "@/lib/constants";
import { useLanguage } from "@/components/LanguageContext";

const T = {
    en: {
        features: "Features",
        pricing: "Pricing",
        admin: "Admin",
        dashboard: "Dashboard",
        signout: "Sign Out",
        submit: "Submit Idea",
        login: "Log In",
        join: "Join Now"
    },
    id: {
        features: "Fitur",
        pricing: "Harga",
        admin: "Admin",
        dashboard: "Dasbor",
        signout: "Keluar",
        submit: "Kirim Ide",
        login: "Masuk",
        join: "Bergabung"
    }
};

export default function Navbar() {
    const { data: session } = useSession();
    const { lang, toggleLang } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isAdmin =
        session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

    const t = T[lang];

    return (
        <nav className="w-full relative z-50 pt-8 px-6 lg:px-12 fade-in">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href={ROUTES.HOME} className="flex items-center gap-2.5 text-white mr-10">
                    <Zap className="w-6 h-6 text-white" fill="currentColor" />
                    <span className="font-extrabold text-xl tracking-tight">AppSprint</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10 text-[15px] mr-auto">
                    <a href="/#features" className="text-zinc-800 hover:text-black transition-colors font-medium">
                        {t.features}
                    </a>
                    <a href="/#pricing" className="text-zinc-800 hover:text-black transition-colors font-medium">
                        {t.pricing}
                    </a>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-6 text-[15px] font-medium">
                    {/* Language Toggle */}
                    <button
                        onClick={toggleLang}
                        className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors uppercase text-sm font-bold bg-white/5 px-3 py-1.5 rounded-full border border-white/10 mt-0"
                    >
                        <Globe className="w-4 h-4" />
                        {lang}
                    </button>

                    {session ? (
                        <div className="flex items-center gap-6 text-white">
                            {isAdmin && (
                                <Link href={ROUTES.ADMIN} className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors">
                                    <Shield className="w-4 h-4" />
                                    {t.admin}
                                </Link>
                            )}
                            <Link href={ROUTES.DASHBOARD} className="hover:text-zinc-300 transition-colors">{t.dashboard}</Link>
                            <button
                                onClick={() => signOut({ callbackUrl: ROUTES.HOME })}
                                className="hover:text-zinc-300 transition-colors"
                            >
                                {t.signout}
                            </button>
                            <Link
                                href={ROUTES.SUBMIT}
                                className="btn-pill btn-glow py-2.5 px-6 ml-2"
                            >
                                {t.submit}
                            </Link>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => signIn("google")}
                                className="text-white hover:text-zinc-200 transition-colors"
                                id="nav-login-btn"
                            >
                                {t.login}
                            </button>
                            <button
                                onClick={() => signIn("google")}
                                className="btn-pill btn-glow py-2.5 px-7"
                                id="nav-join-btn"
                            >
                                {t.join}
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <button
                        onClick={toggleLang}
                        className="flex items-center gap-1 text-[#12101e] uppercase text-xs font-bold"
                    >
                        <Globe className="w-5 h-5" />
                        {lang}
                    </button>
                    <button
                        className="text-[#12101e] p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full glass-card border-t border-white/5 p-6 flex flex-col gap-5 mt-4 fade-in z-50 bg-[#0f1325]/95">
                    <a href="/#features" className="text-white font-medium text-lg">{t.features}</a>
                    <a href="/#pricing" className="text-white font-medium text-lg">{t.pricing}</a>
                    <hr className="border-white/10" />
                    {session ? (
                        <>
                            {isAdmin && (
                                <Link href={ROUTES.ADMIN} className="text-white font-medium text-lg">{t.admin}</Link>
                            )}
                            <Link href={ROUTES.DASHBOARD} className="text-white font-medium text-lg">{t.dashboard}</Link>
                            <Link href={ROUTES.SUBMIT} className="text-indigo-400 font-bold text-lg">{t.submit}</Link>
                            <button onClick={() => signOut({ callbackUrl: ROUTES.HOME })} className="text-left text-zinc-400 font-medium text-lg">{t.signout}</button>
                        </>
                    ) : (
                        <button
                            onClick={() => signIn("google")}
                            className="text-left text-white font-bold text-lg"
                        >
                            {t.login} / {t.join}
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}
