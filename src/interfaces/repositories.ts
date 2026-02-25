/**
 * Repository interfaces following the Repository Pattern & ISP (Interface Segregation Principle)
 * Each interface defines a contract for a specific data resource
 */

import type {
    User,
    Submission,
    Setting,
    CreateUserPayload,
    CreateSubmissionPayload,
    UpdateSubmissionStatusPayload,
    ApiResponse,
} from "@/types";

/**
 * Contract for user data operations
 * SRP: Only responsible for user-related data access
 */
export interface IUserRepository {
    /**
     * Creates a new user record
     * @param payload - User data to save
     * @returns API response with created user
     */
    createUser(payload: CreateUserPayload): Promise<ApiResponse<User>>;
}

/**
 * Contract for submission data operations
 * SRP: Only responsible for submission-related data access
 */
export interface ISubmissionRepository {
    /**
     * Creates a new idea submission
     * @param payload - Submission data
     * @returns API response with created submission
     */
    createSubmission(
        payload: CreateSubmissionPayload
    ): Promise<ApiResponse<Submission>>;

    /**
     * Retrieves submission by user email
     * @param email - User's email address
     * @returns API response with submission or null
     */
    getSubmissionByEmail(
        email: string
    ): Promise<ApiResponse<Submission | null>>;

    /**
     * Retrieves all submissions (admin only)
     * @returns API response with list of all submissions
     */
    getAllSubmissions(): Promise<ApiResponse<Submission[]>>;

    /**
     * Updates submission status with optional rejection reason
     * @param payload - Status update data
     * @returns API response indicating success/failure
     */
    updateSubmissionStatus(
        payload: UpdateSubmissionStatusPayload
    ): Promise<ApiResponse<void>>;
}

/**
 * Contract for settings data operations
 * SRP: Only responsible for settings-related data access
 */
export interface ISettingsRepository {
    /**
     * Retrieves all settings key/value pairs
     * @returns API response with settings array
     */
    getSettings(): Promise<ApiResponse<Setting[]>>;

    /**
     * Updates settings entries
     * @param settings - Array of key-value setting pairs
     * @returns API response indicating success/failure
     */
    updateSettings(settings: Setting[]): Promise<ApiResponse<void>>;
}
