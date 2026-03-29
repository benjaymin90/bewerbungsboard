import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ApplicationForm } from "./application-form";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  const job = await db.job.findUnique({
    where: { id: jobId, status: "OPEN" },
    select: { id: true, title: true, location: true, description: true },
  });

  if (!job) notFound();

  return (
    <div className="light mx-auto max-w-xl px-4 py-12">
      <h1 className="text-2xl font-semibold">
        Jetzt bewerben als {job.title}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{job.location}</p>
      <ApplicationForm jobId={job.id} />
    </div>
  );
}
