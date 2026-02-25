"use client";

/**
 * LoadingSpinner Component
 * Accessible, animated loading indicator.
 * @param size - Size variant: 'sm', 'md', 'lg'
 * @param text - Optional loading text to display
 */

import clsx from "clsx";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    className?: string;
}

const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-7 h-7 border-2",
    lg: "w-12 h-12 border-3",
};

export default function LoadingSpinner({
    size = "md",
    text,
    className,
}: LoadingSpinnerProps) {
    return (
        <div
            className={clsx("flex flex-col items-center justify-center gap-3", className)}
            role="status"
            aria-label={text ?? "Loading"}
        >
            <div
                className={clsx(
                    sizeMap[size],
                    "rounded-full border-zinc-700 border-t-indigo-500 animate-spin"
                )}
            />
            {text && (
                <p className="text-sm text-zinc-400 animate-pulse">{text}</p>
            )}
        </div>
    );
}
