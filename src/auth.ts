/**
 * NextAuth v5 configuration
 * Configures Google OAuth provider.
 * On sign in, registers the user in our Google Sheets backend.
 */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { userService } from "@/lib/container";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        Credentials({
            name: "Admin Login",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (
                    credentials?.username === process.env.ADMIN_USERNAME &&
                    credentials?.password === process.env.ADMIN_PASSWORD
                ) {
                    // Inject the primary admin email as the user email so the app recognizes them as an admin natively
                    const admins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",");
                    return {
                        id: "admin-system",
                        name: "Admin",
                        email: admins[0] || "admin@appsprint.local",
                    };
                }
                return null;
            },
        }),
    ],

    callbacks: {
        /**
         * Runs after a successful sign-in.
         * Registers user in Google Sheets if new.
         * @param user - The authenticated user object from the provider
         * @returns true to allow sign-in, false to block
         */
        async signIn({ user, account }) {
            // Only attempt to register the user in Google Sheets if they're signing in via Google
            if (account?.provider === "google" && user.email && user.name) {
                try {
                    await userService.registerUser({
                        name: user.name,
                        email: user.email,
                    });
                } catch {
                    // Non-blocking: allow sign-in even if user registration fails
                    console.error("Failed to register user in backend");
                }
            }
            return true;
        },

        /**
         * Extends the JWT token with user info for server-side access
         * @param token - Current JWT token
         * @param user - User object from provider (only available on first sign-in)
         * @returns Updated token
         */
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },

        /**
         * Exposes session data to the client
         * @param session - Current session object
         * @param token - JWT token with user data
         * @returns Updated session
         */
        async session({ session, token }) {
            if (token && session.user) {
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
    },
});
