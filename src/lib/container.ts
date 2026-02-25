/**
 * Dependency Injection Container
 * Wires together repositories and services.
 * Following DIP: high-level modules depend on abstractions.
 * 
 * Future AI integration point: swap repository implementations
 * without changing service code.
 */

import { GAS_API_URL } from "@/lib/constants";
import {
    UserRepository,
    SubmissionRepository,
    SettingsRepository,
} from "@/repositories/gasRepository";
import { UserService } from "@/services/userService";
import { SubmissionService } from "@/services/submissionService";
import { SettingsService } from "@/services/settingsService";

// ── Repositories (data access layer) ──────────────────────────────────────────

/**
 * Singleton user repository instance
 * @type {UserRepository}
 */
export const userRepository = new UserRepository(GAS_API_URL);

/**
 * Singleton submission repository instance
 * @type {SubmissionRepository}
 */
export const submissionRepository = new SubmissionRepository(GAS_API_URL);

/**
 * Singleton settings repository instance
 * @type {SettingsRepository}
 */
export const settingsRepository = new SettingsRepository(GAS_API_URL);

// ── Services (business logic layer) ───────────────────────────────────────────

/**
 * User service with injected repository
 * @type {UserService}
 */
export const userService = new UserService(userRepository);

/**
 * Submission service with injected repository
 * @type {SubmissionService}
 */
export const submissionService = new SubmissionService(submissionRepository);

/**
 * Settings service with injected repository
 * @type {SettingsService}
 */
export const settingsService = new SettingsService(settingsRepository);
