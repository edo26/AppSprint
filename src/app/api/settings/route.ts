/**
 * Public settings API route
 * Returns only non-sensitive settings for use by public/user pages
 */
import { NextResponse } from "next/server";
import { settingsService } from "@/lib/container";

/**
 * GET /api/settings
 * Returns accepting_submissions, char_limit, and pricing for public use
 */
export async function GET() {
    const result = await settingsService.getSettings();
    return NextResponse.json(result);
}
