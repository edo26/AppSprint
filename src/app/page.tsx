/**
 * Landing Page (Home)
 * Public-facing page with hero, features, and pricing.
 * Server component — fetches settings for pricing display.
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import LandingClient from "./LandingClient";

/**
 * Home page — redirects to dashboard if already logged in
 */
export default async function HomePage() {
    const session = await auth();

    if (session?.user) {
        redirect(ROUTES.DASHBOARD);
    }

    return <LandingClient />;
}
