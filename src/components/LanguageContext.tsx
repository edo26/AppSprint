"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "id";

interface LanguageContextType {
    lang: Language;
    toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Language>("en");

    // Load saved preference from localStorage on mount (client-side only)
    useEffect(() => {
        const savedLang = localStorage.getItem("app_lang") as Language;
        if (savedLang === "en" || savedLang === "id") {
            setLang(savedLang);
        }
    }, []);

    const toggleLang = () => {
        setLang((prev) => {
            const newLang = prev === "en" ? "id" : "en";
            localStorage.setItem("app_lang", newLang);
            return newLang;
        });
    };

    return (
        <LanguageContext.Provider value={{ lang, toggleLang }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
