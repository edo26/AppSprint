/**
 * Admin Dashboard Page (server component)
 * Admin-only: redirects non-admin users to dashboard.
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ROUTES, ADMIN_EMAILS } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import AdminClient from "./AdminClient";

export const metadata = {
    title: "Admin Dashboard — AppSprint",
    description: "Manage submissions and settings.",
};

export default async function AdminPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect(ROUTES.HOME);
    }

    if (!ADMIN_EMAILS.includes(session.user.email)) {
        redirect(ROUTES.DASHBOARD);
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <AdminClient />
        </div>
    );
}
