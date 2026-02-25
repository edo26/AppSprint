/**
 * Dashboard Page (layout)
 * Wraps dashboard sections with Navbar.
 * Requires authentication — redirects to home if not logged in.
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect(ROUTES.HOME);
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <DashboardClient
                userEmail={session.user.email}
                userName={session.user.name ?? "User"}
            />
        </div>
    );
}
