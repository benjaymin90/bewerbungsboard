import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireOrgId } from "@/lib/auth";

// GET is protected — only org members can list applicants
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const orgId = await requireOrgId();
    const { jobId } = await params;

    // Verify job belongs to org
    const job = await db.job.findFirst({
      where: { id: jobId, orgId },
    });
    if (!job) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const applicants = await db.applicant.findMany({
      where: { jobId },
      orderBy: { stageChangedAt: "desc" },
    });

    return NextResponse.json(applicants);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST is public — applicants submit via the public form
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const body = await request.json();

  const { firstName, lastName, email, phone, linkedIn, salary, availableFrom, skills, privacyAccepted } = body;

  if (!firstName || !lastName || !email || !privacyAccepted) {
    return NextResponse.json(
      { error: "Pflichtfelder fehlen" },
      { status: 400 }
    );
  }

  // Verify job exists and is open
  const job = await db.job.findFirst({
    where: { id: jobId, status: "OPEN" },
  });
  if (!job) {
    return NextResponse.json({ error: "Stelle nicht gefunden" }, { status: 404 });
  }

  const applicant = await db.applicant.create({
    data: {
      jobId,
      firstName,
      lastName,
      email,
      phone: phone || null,
      linkedIn: linkedIn || null,
      salary: salary || null,
      availableFrom: availableFrom || null,
      skills: skills || [],
      privacyAccepted,
    },
  });

  return NextResponse.json(applicant, { status: 201 });
}
