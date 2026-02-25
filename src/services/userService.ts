/**
 * User Service
 * Orchestrates user registration business logic.
 * 
 * SOLID:
 * - SRP: Only responsible for user business logic
 * - DIP: Depends on IUserRepository interface, not concrete class
 */

import type { IUserRepository } from "@/interfaces/repositories";
import type { IUserService } from "@/interfaces/services";
import type { User, CreateUserPayload, ApiResponse } from "@/types";

export class UserService implements IUserService {
    /**
     * @param userRepository - Injected user repository following DIP
     */
    constructor(private readonly userRepository: IUserRepository) { }

    /**
     * Registers a user after Google login.
     * Idempotent: creates user if not exists, returns existing if present.
     * @param payload - User name and email from Google OAuth
     * @returns API response with user data
     */
    async registerUser(payload: CreateUserPayload): Promise<ApiResponse<User>> {
        try {
            return await this.userRepository.createUser(payload);
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to register user",
            };
        }
    }
}
