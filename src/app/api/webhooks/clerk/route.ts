import { Webhook } from "svix";
import { headers } from "next/headers";
import { db } from "@/lib/db";

type WebhookEvent = {
  type: string;
  data: Record<string, unknown>;
};

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: WebhookEvent;
  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "organization.created": {
      const { id, name } = event.data as { id: string; name: string };
      await db.organization.create({
        data: {
          clerkOrgId: id,
          name,
        },
      });
      break;
    }

    case "organization.updated": {
      const { id, name } = event.data as { id: string; name: string };
      await db.organization.update({
        where: { clerkOrgId: id },
        data: { name },
      });
      break;
    }

    case "organization.deleted": {
      const { id } = event.data as { id: string };
      await db.organization.delete({
        where: { clerkOrgId: id },
      });
      break;
    }

    case "organizationMembership.created": {
      const { organization, public_user_data, role } = event.data as {
        organization: { id: string };
        public_user_data: { user_id: string };
        role: string;
      };

      const org = await db.organization.findUnique({
        where: { clerkOrgId: organization.id },
      });
      if (!org) break;

      const orgRole =
        role === "org:admin" ? "ADMIN" : role === "org:viewer" ? "VIEWER" : "RECRUITER";

      await db.orgMember.upsert({
        where: {
          clerkUserId_orgId: {
            clerkUserId: public_user_data.user_id,
            orgId: org.id,
          },
        },
        create: {
          clerkUserId: public_user_data.user_id,
          orgId: org.id,
          role: orgRole,
        },
        update: {
          role: orgRole,
        },
      });
      break;
    }

    case "organizationMembership.deleted": {
      const { organization, public_user_data } = event.data as {
        organization: { id: string };
        public_user_data: { user_id: string };
      };

      const org = await db.organization.findUnique({
        where: { clerkOrgId: organization.id },
      });
      if (!org) break;

      await db.orgMember.deleteMany({
        where: {
          clerkUserId: public_user_data.user_id,
          orgId: org.id,
        },
      });
      break;
    }
  }

  return new Response("OK", { status: 200 });
}
