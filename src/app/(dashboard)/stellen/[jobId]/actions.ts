"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireOrgId } from "@/lib/auth";

export async function updateApplicantStage(
  jobId: string,
  applicantId: string,
  stage: string
) {
  const orgId = await requireOrgId();

  // Verify job belongs to org
  const job = await db.job.findFirst({
    where: { id: jobId, orgId },
  });
  if (!job) throw new Error("Not found");

  await db.applicant.update({
    where: { id: applicantId },
    data: {
      stage: stage as "INBOX" | "INTERVIEW" | "OFFER" | "REJECTED",
      stageChangedAt: new Date(),
    },
  });
  revalidatePath(`/stellen/${jobId}`);
}

export async function createJob(formData: FormData) {
  const orgId = await requireOrgId();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const team = formData.get("team") as string | null;
  const location = formData.get("location") as string;
  const locationType = formData.get("locationType") as string;

  const job = await db.job.create({
    data: {
      orgId,
      title,
      description,
      team: team || null,
      location,
      locationType: locationType as "ON_SITE" | "REMOTE" | "HYBRID",
    },
  });

  revalidatePath("/stellen");
  return job;
}
