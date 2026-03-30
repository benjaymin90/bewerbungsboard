import { getSession } from "./session";

/**
 * Returns the current user's orgId (internal DB ID) after verifying they are authenticated.
 * Throws if not authenticated or no org selected.
 */
export async function requireOrgId(): Promise<string> {
  const session = await getSession();

  if (!session?.orgId) {
    throw new Error("Unauthorized");
  }

  return session.orgId;
}

/**
 * Returns the full session or throws if not authenticated.
 */
export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
