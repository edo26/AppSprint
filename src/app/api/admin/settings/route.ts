/**
 * API Route: /api/admin/settings
 * Admin-only: Get and update app settings.
 *
 * GET  /api/admin/settings -> retrieve current settings
 * POST /api/admin/settings -> update settings
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { settingsService } from "@/lib/container";
import { ADMIN_EMAILS } from "@/lib/constants";
import type { Setting } from "@/types";

function isAdmin(email: string | null | undefined): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email);
}

/**
 * GET /api/admin/settings
 * Returns app-wide settings (parsed AppSettings object).
 * @returns JSON with AppSettings
 */
export async function GET() {
    const session = await auth();

    if (!isAdmin(session?.user?.email)) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const result = await settingsService.getSettings();
    return NextResponse.json(result);
}

/**
 * POST /api/admin/settings
 * Saves updated settings key-value pairs.
 * @param request - Request body with `settings: Setting[]`
 * @returns JSON indicating success
 */
export async function POST(request: NextRequest) {
    const session = await auth();

    if (!isAdmin(session?.user?.email)) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body: { settings: Setting[] } = await request.json();
    const result = await settingsService.updateSettings(body.settings);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
}

/**
 * GET /api/settings (public)
 * Returns accepting_submissions flag for public pages
 */
export async function OPTIONS() {
    return NextResponse.json({}, { headers: { Allow: "GET, POST" } });
}
