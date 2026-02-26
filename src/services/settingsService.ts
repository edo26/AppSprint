/**
 * Settings Service
 * Handles app settings retrieval and updates.
 * Parses raw key-value pairs into typed AppSettings object.
 *
 * SOLID:
 * - SRP: Only responsible for settings business logic and parsing
 * - DIP: Depends on ISettingsRepository interface
 */

import type { ISettingsRepository } from "@/interfaces/repositories";
import type { ISettingsService } from "@/interfaces/services";
import type { AppSettings, Setting, ApiResponse } from "@/types";

/** Default settings used when no settings are stored */
const DEFAULT_SETTINGS: AppSettings = {
    char_limit: 300,
    max_free_submissions: 1,
    pricing_free: "Free",
    pricing_pro: "$29/mo",
    pricing_enterprise: "Custom",
    accepting_submissions: true,
};

export class SettingsService implements ISettingsService {
    /**
     * @param settingsRepository - Injected settings repository (DIP)
     */
    constructor(private readonly settingsRepository: ISettingsRepository) { }

    /**
     * Fetches settings from the backend and parses them into AppSettings.
     * Falls back to DEFAULT_SETTINGS if a key is missing.
     * @returns API response with parsed AppSettings
     */
    async getSettings(): Promise<ApiResponse<AppSettings>> {
        try {
            const response = await this.settingsRepository.getSettings();

            if (!response.success || !response.data) {
                return { success: true, data: DEFAULT_SETTINGS };
            }

            // Convert array of {key, value} to typed AppSettings
            const settingsMap = Object.fromEntries(
                response.data.map(({ key, value }) => [key, value])
            );

            const parsed: AppSettings = {
                char_limit: parseInt(settingsMap.char_limit ?? "300", 10),
                max_free_submissions: parseInt(
                    settingsMap.max_free_submissions ?? "1",
                    10
                ),
                pricing_free: settingsMap.pricing_free ?? DEFAULT_SETTINGS.pricing_free,
                pricing_pro: settingsMap.pricing_pro ?? DEFAULT_SETTINGS.pricing_pro,
                pricing_enterprise:
                    settingsMap.pricing_enterprise ??
                    DEFAULT_SETTINGS.pricing_enterprise,
                accepting_submissions:
                    settingsMap.accepting_submissions !== "false",
            };

            return { success: true, data: parsed };
        } catch (error) {
            // Return defaults on error so app remains functional
            return { success: true, data: DEFAULT_SETTINGS };
        }
    }

    /**
     * Saves updated settings to the backend
     * @param settings - Array of {key, value} pairs to persist
     * @returns API response indicating success/failure
     */
    async updateSettings(settings: Setting[]): Promise<ApiResponse<void>> {
        try {
            return await this.settingsRepository.updateSettings(settings);
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to update settings",
            };
        }
    }
}
