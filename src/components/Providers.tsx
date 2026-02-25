"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "./LanguageContext";
import type { ReactNode } from "react";

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            <LanguageProvider>
                {children}
            </LanguageProvider>
        </SessionProvider>
    );
}
