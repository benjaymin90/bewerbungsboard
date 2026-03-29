import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { requireOrgId } from "@/lib/auth";
import type { Job } from "@/generated/prisma/client";

type JobWithCount = Job & { _count: { applicants: number } };

export default async function StellenPage() {
  const orgId = await requireOrgId();
  const jobs: JobWithCount[] = await db.job.findMany({
    where: { orgId },
    include: { _count: { select: { applicants: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stellen</h1>
          <p className="text-sm text-muted-foreground">
            Alle offenen und geschlossenen Stellen im Ueberblick.
          </p>
        </div>
        <Link href="/stellen/neu" className={buttonVariants()}>
          Neu +
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            Noch keine Stellen vorhanden.
          </p>
          <Link href="/stellen/neu" className={buttonVariants({ className: "mt-4" })}>
            Erste Stelle anlegen
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Ort</TableHead>
                <TableHead className="text-right">Bewerbungen</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/stellen/${job.id}`}
                      className="font-medium hover:underline"
                    >
                      {job.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.team ?? "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.location}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {job._count.applicants}
                  </TableCell>
                  <TableCell>
                    <JobStatusBadge status={job.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function JobStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
    OPEN: { label: "Offen", variant: "default" },
    DRAFT: { label: "Entwurf", variant: "secondary" },
    CLOSED: { label: "Geschlossen", variant: "outline" },
  };
  const info = map[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={info.variant}>{info.label}</Badge>;
}
