import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

/**
 * Returns the current user's orgId (internal DB ID) after verifying
 * they are authenticated and have an active Clerk organization.
 * Throws if not authenticated or no org selected.
 */
export async function requireOrgId(): Promise<string> {
  const { userId, orgId: clerkOrgId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!clerkOrgId) {
    throw new Error("No organization selected");
  }

  const org = await db.organization.findUnique({
    where: { clerkOrgId },
    select: { id: true },
  });

  if (!org) {
    throw new Error("Organization not found");
  }

  return org.id;
}
