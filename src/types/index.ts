/**
 * Core type definitions for AppSprint
 * Following SRP - each type has a single clear responsibility
 */

// ================================
// ENTITY TYPES
// ================================

/**
 * Represents a registered user
 */
export interface User {
    id: string;
    name: string;
    email: string;
    created_at: string;
}

/**
 * Submission status enum
 */
export type SubmissionStatus =
    | "pending"
    | "approved"
    | "rejected"
    | "in_progress"
    | "completed";

/**
 * Represents an idea submission
 */
export interface Submission {
    id: string;
    user_email: string;
    title: string;
    description: string;
    target_user: string;
    monetization: string;
    status: SubmissionStatus;
    rejection_reason: string;
    created_at: string;
    updated_at: string;
}

/**
 * Represents a key-value setting entry
 */
export interface Setting {
    key: string;
    value: string;
}

/**
 * App-wide settings object (parsed)
 */
export interface AppSettings {
    char_limit: number;
    max_free_submissions: number;
    pricing_free: string;
    pricing_pro: string;
    pricing_enterprise: string;
    accepting_submissions: boolean;
}

// ================================
// REQUEST/RESPONSE TYPES
// ================================

/**
 * Payload to create a new user
 */
export interface CreateUserPayload {
    name: string;
    email: string;
}

/**
 * Payload to create a new submission
 */
export interface CreateSubmissionPayload {
    user_email: string;
    title: string;
    description: string;
    target_user: string;
    monetization?: string;
}

/**
 * Payload to update submission status
 */
export interface UpdateSubmissionStatusPayload {
    id: string;
    status: SubmissionStatus;
    rejection_reason?: string;
}

/**
 * Payload to update settings
 */
export interface UpdateSettingsPayload {
    settings: Setting[];
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// ================================
// UI TYPES
// ================================

/**
 * Toast notification type
 */
export type ToastType = "success" | "error" | "loading";

/**
 * Navigation item
 */
export interface NavItem {
    label: string;
    href: string;
}

/**
 * Pricing plan definition
 */
export interface PricingPlan {
    name: string;
    price: string;
    features: string[];
    cta: string;
    highlighted?: boolean;
}
