import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireOrgId } from "@/lib/auth";

export async function GET() {
  try {
    const orgId = await requireOrgId();

    const jobs = await db.job.findMany({
      where: { orgId },
      include: { _count: { select: { applicants: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(jobs);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const orgId = await requireOrgId();
    const body = await request.json();
    const { title, description, team, location, locationType } = body;

    if (!title || !description || !location) {
      return NextResponse.json(
        { error: "Pflichtfelder fehlen" },
        { status: 400 }
      );
    }

    const job = await db.job.create({
      data: {
        orgId,
        title,
        description,
        team: team || null,
        location,
        locationType: locationType || "ON_SITE",
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
