/**
 * Service interfaces following the Service Layer pattern & ISP
 * Services orchestrate business logic using repositories
 */

import type {
    User,
    Submission,
    AppSettings,
    CreateUserPayload,
    CreateSubmissionPayload,
    UpdateSubmissionStatusPayload,
    ApiResponse,
    Setting,
} from "@/types";

/**
 * Contract for user-related business logic
 */
export interface IUserService {
    /**
     * Registers or retrieves an existing user after Google login
     * @param payload - User's name and email from Google OAuth
     * @returns API response with user data
     */
    registerUser(payload: CreateUserPayload): Promise<ApiResponse<User>>;
}

/**
 * Contract for submission-related business logic
 * Enforces submission rules such as max-one-free-submission
 */
export interface ISubmissionService {
    /**
     * Submits a new idea after validating submission rules
     * @param payload - Idea submission data
     * @returns API response with submission result
     */
    submitIdea(
        payload: CreateSubmissionPayload
    ): Promise<ApiResponse<Submission>>;

    /**
     * Gets submission for a specific user by email
     * @param email - User's email address
     * @returns API response with submission or null
     */
    getUserSubmission(
        email: string
    ): Promise<ApiResponse<Submission | null>>;

    /**
     * Retrieves all submissions for admin view
     * @returns API response with all submissions
     */
    getAllSubmissions(): Promise<ApiResponse<Submission[]>>;

    /**
     * Updates the status of a submission (admin action)
     * @param payload - Status update payload
     * @returns API response indicating success/failure
     */
    updateStatus(
        payload: UpdateSubmissionStatusPayload
    ): Promise<ApiResponse<void>>;
}

/**
 * Contract for app settings business logic
 */
export interface ISettingsService {
    /**
     * Retrieves and parses app settings into structured form
     * @returns API response with parsed app settings
     */
    getSettings(): Promise<ApiResponse<AppSettings>>;

    /**
     * Persists updated settings
     * @param settings - Array of key-value pairs to save
     * @returns API response indicating success/failure
     */
    updateSettings(settings: Setting[]): Promise<ApiResponse<void>>;
}
