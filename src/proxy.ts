/**
 * Next.js Proxy (formerly Middleware)
 * Protects routes that require authentication.
 * /dashboard and /submit require login.
 * /admin requires admin access (handled at page level after auth check).
 */

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/submit", "/admin"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    if (!isProtected) return NextResponse.next();

    const session = await auth();

    if (!session?.user) {
        const signInUrl = new URL("/", request.url);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/submit/:path*", "/admin/:path*"],
};
