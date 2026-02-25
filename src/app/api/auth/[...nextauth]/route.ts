/**
 * NextAuth route handler
 * Exposes /api/auth/* endpoints for OAuth flow
 */
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
