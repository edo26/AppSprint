/**
 * API Route: /api/submissions
 * Handles idea submission creation and retrieval.
 * Protected: requires authenticated session.
 *
 * GET  /api/submissions?email=xxx  -> get user's submission
 * POST /api/submissions            -> create new submission
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { submissionService } from "@/lib/container";
import type { CreateSubmissionPayload } from "@/types";

/**
 * GET /api/submissions
 * Retrieves submission for the currently logged-in user.
 * @param request - Incoming request with email query param
 * @returns JSON with submission data or null
 */
export async function GET(request: NextRequest) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const email = request.nextUrl.searchParams.get("email");

    if (!email || email !== session.user.email) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const result = await submissionService.getUserSubmission(email);
    return NextResponse.json(result);
}

/**
 * POST /api/submissions
 * Creates a new idea submission for the logged-in user.
 * @param request - Incoming request with submission payload
 * @returns JSON with created submission or error
 */
export async function POST(request: NextRequest) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body: Omit<CreateSubmissionPayload, "user_email"> = await request.json();

    const payload: CreateSubmissionPayload = {
        ...body,
        user_email: session.user.email,
    };

    const result = await submissionService.submitIdea(payload);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
