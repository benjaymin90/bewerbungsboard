import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireOrgId } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string; applicantId: string }> }
) {
  try {
    const orgId = await requireOrgId();
    const { jobId, applicantId } = await params;
    const { stage } = await request.json();

    const validStages = ["INBOX", "INTERVIEW", "OFFER", "REJECTED"];
    if (!validStages.includes(stage)) {
      return NextResponse.json({ error: "Ungueltiger Status" }, { status: 400 });
    }

    // Verify job belongs to org
    const job = await db.job.findFirst({
      where: { id: jobId, orgId },
    });
    if (!job) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const applicant = await db.applicant.update({
      where: { id: applicantId },
      data: { stage, stageChangedAt: new Date() },
    });

    return NextResponse.json(applicant);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
