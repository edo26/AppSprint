/**
 * Google Apps Script API Repository
 * Implements all repository interfaces against the GAS Web App backend.
 * 
 * SOLID:
 * - SRP: Each method handles one specific API concern
 * - OCP: Extend new endpoints by adding methods without modifying existing ones
 * - LSP: Implements interfaces exactly
 * - ISP: Implements separate repository interfaces
 * - DIP: Accepts API_URL via constructor (dependency injection)
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
import type {
    IUserRepository,
    ISubmissionRepository,
    ISettingsRepository,
} from "@/interfaces/repositories";

/**
 * Base repository with shared HTTP helper methods
 * SRP: Handles only raw HTTP communication with the GAS backend
 */
class BaseRepository {
    /**
     * @param apiUrl - The Google Apps Script deployment URL
     */
    constructor(protected readonly apiUrl: string) { }

    /**
     * Sends a GET request with query parameters to the GAS endpoint
     * @param params - URL query parameters as key-value pairs
     * @returns Parsed JSON response
     */
    protected async get<T>(
        params: Record<string, string>
    ): Promise<ApiResponse<T>> {
        const query = new URLSearchParams(params).toString();
        const url = `${this.apiUrl}?${query}`;

        const res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res.json();
    }

    /**
     * Sends a POST request with JSON body to the GAS endpoint
     * @param body - Request body object
     * @returns Parsed JSON response
     */
    protected async post<T>(
        body: Record<string, unknown>
    ): Promise<ApiResponse<T>> {
        const res = await fetch(this.apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res.json();
    }
}

/**
 * User repository: handles all user-related API calls
 * SRP: Only manages user data operations
 */
export class UserRepository
    extends BaseRepository
    implements IUserRepository {
    /**
     * Calls the createUser endpoint on Google Apps Script
     * @param payload - User's name and email
     * @returns API response with user record
     */
    async createUser(payload: CreateUserPayload): Promise<ApiResponse<User>> {
        return this.post<User>({
            action: "createUser",
            ...payload,
        });
    }
}

/**
 * Submission repository: handles all submission-related API calls
 * SRP: Only manages submission data operations
 */
export class SubmissionRepository
    extends BaseRepository
    implements ISubmissionRepository {
    /**
     * Calls the createSubmission endpoint
     * @param payload - Full submission data
     * @returns API response with created submission
     */
    async createSubmission(
        payload: CreateSubmissionPayload
    ): Promise<ApiResponse<Submission>> {
        return this.post<Submission>({
            action: "createSubmission",
            ...payload,
        });
    }

    /**
     * Retrieves a submission by user email
     * @param email - The user's email address
     * @returns API response with submission or null
     */
    async getSubmissionByEmail(
        email: string
    ): Promise<ApiResponse<Submission | null>> {
        return this.get<Submission | null>({
            action: "getSubmissionByEmail",
            email,
        });
    }

    /**
     * Retrieves all submissions for admin dashboard
     * @returns API response with full submissions list
     */
    async getAllSubmissions(): Promise<ApiResponse<Submission[]>> {
        return this.get<Submission[]>({ action: "getAllSubmissions" });
    }

    /**
     * Updates a submission's status and optional rejection reason
     * @param payload - Status update data
     * @returns API response indicating success
     */
    async updateSubmissionStatus(
        payload: UpdateSubmissionStatusPayload
    ): Promise<ApiResponse<void>> {
        return this.post<void>({
            action: "updateSubmissionStatus",
            ...payload,
        });
    }
}

/**
 * Settings repository: handles all settings-related API calls
 * SRP: Only manages settings data operations
 */
export class SettingsRepository
    extends BaseRepository
    implements ISettingsRepository {
    /**
     * Fetches all settings from the settings sheet
     * @returns API response with array of key-value settings
     */
    async getSettings(): Promise<ApiResponse<Setting[]>> {
        return this.get<Setting[]>({ action: "getSettings" });
    }

    /**
     * Saves updated settings to Google Sheets
     * @param settings - Array of key-value pairs
     * @returns API response indicating success
     */
    async updateSettings(settings: Setting[]): Promise<ApiResponse<void>> {
        return this.post<void>({
            action: "updateSettings",
            settings,
        });
    }
}
