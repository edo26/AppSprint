"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Zap, Chrome, ArrowRight, Loader2, KeyRound } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { useLanguage } from "@/components/LanguageContext";
import toast from "react-hot-toast";

const LOGIN_T = {
    en: {
        title: "Welcome Back",
        subtitle: "Sign in to AppSprint to submit your idea or check status.",
        googleBtn: "Continue with Google",
        or: "or admin login",
        username: "Admin Username",
        password: "Password",
        loginBtn: "Login as Admin",
        loading: "Authenticating...",
        success: "Logged in successfully!",
        error: "Invalid username or password.",
    },
    id: {
        title: "Selamat Datang",
        subtitle: "Masuk ke AppSprint untuk mengirim ide atau cek status.",
        googleBtn: "Lanjutkan dengan Google",
        or: "atau masuk admin",
        username: "Username Admin",
        password: "Password",
        loginBtn: "Masuk sebagai Admin",
        loading: "Mengautentikasi...",
        success: "Berhasil login!",
        error: "Username atau password salah.",
    },
};

export default function LoginPage() {
    const { lang } = useLanguage();
    const t = LOGIN_T[lang];

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isCredsLoading, setIsCredsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleGoogleSignIn = () => {
        setIsGoogleLoading(true);
        signIn("google", { callbackUrl: ROUTES.DASHBOARD });
    };

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCredsLoading(true);

        const res = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        setIsCredsLoading(false);

        if (res?.error) {
            toast.error(t.error);
        } else {
            toast.success(t.success);
            window.location.href = ROUTES.ADMIN; // Redirect directly to admin page on successful cred login
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-very-dark)] flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7c3aed] blur-[150px] opacity-[0.15] rounded-full pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link href={ROUTES.HOME} className="flex justify-center items-center gap-2 mb-8">
                    <Zap className="w-8 h-8 text-[#c8a2fe]" fill="currentColor" />
                    <span className="text-white text-3xl font-extrabold tracking-tight">AppSprint</span>
                </Link>

                <div className="card w-full fade-in p-8 sm:p-10 border border-white/5 relative bg-[#1c223c]/40 backdrop-blur-3xl shadow-2xl">

                    {/* Glowing Accent */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#9c6dfa]/50 to-transparent" />

                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                            {t.title}
                        </h2>
                        <p className="text-sm text-zinc-400">
                            {t.subtitle}
                        </p>
                    </div>

                    {/* Google Login - Primary Action */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading || isCredsLoading}
                        className="w-full flex justify-center items-center gap-3 py-3.5 px-4 rounded-xl border border-zinc-700 bg-[#272e49]/50 hover:bg-[#323956] text-white font-semibold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9c6dfa] focus:ring-offset-2 focus:ring-offset-[#12101e] disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isGoogleLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                        ) : (
                            <Chrome className="w-5 h-5 text-zinc-300 group-hover:text-white transition-colors" />
                        )}
                        <span>{t.googleBtn}</span>
                    </button>

                    <div className="mt-8 mb-8 relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs font-medium uppercase tracking-widest">
                            <span className="bg-[#1c223c] px-4 text-zinc-500 rounded-full">{t.or}</span>
                        </div>
                    </div>

                    {/* Admin Credentials Login */}
                    <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                                {t.username}
                            </label>
                            <div className="relative">
                                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input-field pl-10"
                                    placeholder="admin"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                                {t.password}
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isCredsLoading || isGoogleLoading || !username || !password}
                            className="w-full btn-primary py-3.5 flex justify-center items-center gap-2 group mt-2"
                        >
                            {isCredsLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>{t.loginBtn}</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Return Home Link */}
                <div className="mt-8 text-center text-sm">
                    <Link href={ROUTES.HOME} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                        ← Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
