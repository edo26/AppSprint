/**
 * Application-wide constants
 * Single source of truth for all magic values
 */

/** Google Apps Script Web App deployment URL */
export const GAS_API_URL = process.env.NEXT_PUBLIC_GAS_API_URL ?? "";

/** Default character limit for idea descriptions */
export const DEFAULT_CHAR_LIMIT = 500;

/** Admin email addresses (comma-separated in env) */
export const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

/** Auth.js secret */
export const AUTH_SECRET = process.env.AUTH_SECRET ?? "";

/** Routes */
export const ROUTES = {
    HOME: "/",
    DASHBOARD: "/dashboard",
    SUBMIT: "/submit",
    ADMIN: "/admin",
    AUTH_SIGNIN: "/api/auth/signin",
    AUTH_SIGNOUT: "/api/auth/signout",
} as const;

/** Submission statuses with display labels and colors */
export const STATUS_CONFIG = {
    pending: {
        label: "Pending Review",
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/20",
    },
    approved: {
        label: "Approved",
        color: "text-green-400",
        bg: "bg-green-400/10",
        border: "border-green-400/20",
    },
    rejected: {
        label: "Rejected",
        color: "text-red-400",
        bg: "bg-red-400/10",
        border: "border-red-400/20",
    },
    in_progress: {
        label: "In Progress",
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/20",
    },
    completed: {
        label: "Completed",
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        border: "border-purple-400/20",
    },
} as const;
