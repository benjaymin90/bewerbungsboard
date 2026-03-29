import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireOrgId } from "@/lib/auth";

export async function GET() {
  try {
    const orgId = await requireOrgId();

    const templates = await db.emailTemplate.findMany({
      where: { orgId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(templates);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const orgId = await requireOrgId();
    const body = await request.json();
    const { name, subject, bodyText, trigger, language } = body;

    if (!name || !subject || !bodyText) {
      return NextResponse.json(
        { error: "Pflichtfelder fehlen" },
        { status: 400 }
      );
    }

    const template = await db.emailTemplate.create({
      data: {
        orgId,
        name,
        subject,
        body: bodyText,
        trigger: trigger || null,
        language: language || "de",
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
