/**
 * API Route: /api/admin/submissions
 * Admin-only: Get all submissions, update submission status.
 *
 * GET  /api/admin/submissions             -> all submissions
 * POST /api/admin/submissions             -> update status
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { submissionService } from "@/lib/container";
import { ADMIN_EMAILS } from "@/lib/constants";
import type { UpdateSubmissionStatusPayload } from "@/types";

/**
 * Checks if the current session user is an admin
 * @param email - User's email to check
 * @returns true if the user is in the admin list
 */
function isAdmin(email: string | null | undefined): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email);
}

/**
 * GET /api/admin/submissions
 * Returns all submissions for admin dashboard.
 * @returns JSON with all submissions
 */
export async function GET() {
    const session = await auth();

    if (!isAdmin(session?.user?.email)) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const result = await submissionService.getAllSubmissions();
    return NextResponse.json(result);
}

/**
 * POST /api/admin/submissions
 * Updates a submission's status (admin action).
 * @param request - Request body with id, status, and optional rejection_reason
 * @returns JSON indicating success or failure
 */
export async function POST(request: NextRequest) {
    const session = await auth();

    if (!isAdmin(session?.user?.email)) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body: UpdateSubmissionStatusPayload = await request.json();
    const result = await submissionService.updateStatus(body);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
