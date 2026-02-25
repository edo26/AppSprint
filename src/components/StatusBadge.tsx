"use client";

/**
 * StatusBadge Component
 * Displays submission status with color-coded styling.
 * @param status - The submission status string
 */

import { SubmissionStatus } from "@/types";
import { STATUS_CONFIG } from "@/lib/constants";
import clsx from "clsx";

interface StatusBadgeProps {
    status: SubmissionStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = STATUS_CONFIG[status];

    return (
        <span
            className={clsx(
                "badge",
                config.color,
                config.bg,
                "border",
                config.border
            )}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {config.label}
        </span>
    );
}
