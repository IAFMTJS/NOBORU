import { unauthorized } from "@/lib/api/responses";
import {
  getCachedAuthSession,
  getCachedProfile,
  getCachedAuthenticatedContext,
} from "@/lib/cache/request-cache";

export type { AuthSession } from "@/lib/auth/get-auth-session";

export async function getAuthSession() {
  return getCachedAuthSession();
}

export async function requireAuthSession() {
  const session = await getCachedAuthSession();

  if (!session) {
    return { session: null, error: unauthorized() };
  }

  return { session, error: null };
}

export { getCachedProfile, getCachedAuthenticatedContext };
