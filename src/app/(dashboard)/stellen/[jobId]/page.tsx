import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireOrgId } from "@/lib/auth";
import { KanbanBoard } from "@/components/kanban/kanban-board";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const orgId = await requireOrgId();
  const { jobId } = await params;

  const job = await db.job.findFirst({
    where: { id: jobId, orgId },
    include: {
      applicants: {
        orderBy: { stageChangedAt: "desc" },
      },
    },
  });

  if (!job) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{job.title}</h1>
        <p className="text-sm text-muted-foreground">
          {job.location} &middot; {job.team ?? "Kein Team"}
        </p>
      </div>
      <KanbanBoard jobId={job.id} applicants={job.applicants} />
    </div>
  );
}
