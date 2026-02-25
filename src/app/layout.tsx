/**
 * Root Layout
 * Sets up global fonts, metadata, and Toaster provider.
 */

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

export const metadata: Metadata = {
    title: "AppSprint — Turn Ideas Into Reality",
    description:
        "Submit your software idea and get expert feedback. Built for entrepreneurs, makers, and dreamers.",
    keywords: ["app ideas", "startup ideas", "software submission", "saas"],
    openGraph: {
        title: "AppSprint — Turn Ideas Into Reality",
        description: "Submit your software idea and get expert feedback.",
        type: "website",
    },
};

/**
 * Root application layout wrapping all pages
 * @param children - Page content
 */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={sans.variable}>
            <body>
                <Providers>
                    {children}
                </Providers>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: "#18181b",
                            color: "#fafafa",
                            border: "1px solid #27272a",
                            borderRadius: "0.75rem",
                            fontSize: "0.9rem",
                            fontFamily: "var(--font-sans)",
                        },
                        success: {
                            iconTheme: {
                                primary: "#4ade80",
                                secondary: "#18181b",
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: "#f87171",
                                secondary: "#18181b",
                            },
                        },
                    }}
                />
            </body>
        </html>
    );
}
