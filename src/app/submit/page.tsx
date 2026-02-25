/**
 * Submit Idea Page (server component)
 * Auth-guarded: redirects to home if not logged in.
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import SubmitForm from "./SubmitForm";

export const metadata = {
    title: "Submit Your Idea — AppSprint",
    description: "Share your software idea with our team for expert evaluation.",
};

export default async function SubmitPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect(ROUTES.HOME);
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <SubmitForm userEmail={session.user.email} />
        </div>
    );
}
