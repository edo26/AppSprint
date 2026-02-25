/**
 * Submission Service
 * Orchestrates idea submission business logic, including:
 * - One-submission-per-email enforcement
 * - Character limit validation
 * - Status update delegation
 *
 * SOLID:
 * - SRP: Only responsible for submission business logic
 * - DIP: Depends on ISubmissionRepository interface, not concrete class
 */

import type { ISubmissionRepository } from "@/interfaces/repositories";
import type { ISubmissionService } from "@/interfaces/services";
import type {
    Submission,
    CreateSubmissionPayload,
    UpdateSubmissionStatusPayload,
    ApiResponse,
} from "@/types";

export class SubmissionService implements ISubmissionService {
    /**
     * @param submissionRepository - Injected submission repository (DIP)
     * @param charLimit - Maximum allowed description characters
     */
    constructor(
        private readonly submissionRepository: ISubmissionRepository,
        private readonly charLimit: number = 500
    ) { }

    /**
     * Validates and submits a new idea.
     * Business rules enforced:
     *   1. Description must not exceed charLimit
     *   2. User must not have submitted before (enforced server-side in GAS)
     * @param payload - The idea submission data
     * @returns API response with created submission
     */
    async submitIdea(
        payload: CreateSubmissionPayload
    ): Promise<ApiResponse<Submission>> {
        // Validate description length client-side before sending to backend
        if (payload.description.length > this.charLimit) {
            return {
                success: false,
                error: `Description must not exceed ${this.charLimit} characters.`,
            };
        }

        try {
            return await this.submissionRepository.createSubmission(payload);
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error ? error.message : "Failed to submit idea",
            };
        }
    }

    /**
     * Retrieves a submission by user email
     * @param email - User's email address
     * @returns API response with submission or null
     */
    async getUserSubmission(
        email: string
    ): Promise<ApiResponse<Submission | null>> {
        try {
            return await this.submissionRepository.getSubmissionByEmail(email);
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch submission",
            };
        }
    }

    /**
     * Gets all submissions for the admin dashboard
     * @returns API response with all submissions
     */
    async getAllSubmissions(): Promise<ApiResponse<Submission[]>> {
        try {
            return await this.submissionRepository.getAllSubmissions();
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch submissions",
            };
        }
    }

    /**
     * Updates a submission's status (admin action)
     * @param payload - ID, new status, and optional rejection reason
     * @returns API response indicating success/failure
     */
    async updateStatus(
        payload: UpdateSubmissionStatusPayload
    ): Promise<ApiResponse<void>> {
        try {
            return await this.submissionRepository.updateSubmissionStatus(payload);
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error ? error.message : "Failed to update status",
            };
        }
    }
}
