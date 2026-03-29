"use client";

import { useOptimistic, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateApplicantStage } from "@/app/(dashboard)/stellen/[jobId]/actions";

type Applicant = {
  id: string;
  firstName: string;
  lastName: string;
  skills: string[];
  score: number | null;
  stage: string;
};

const STAGES = [
  { key: "INBOX", label: "Eingang", color: "bg-kanban-incoming" },
  { key: "INTERVIEW", label: "Interview", color: "bg-kanban-interview" },
  { key: "OFFER", label: "Angebot", color: "bg-kanban-offer" },
  { key: "REJECTED", label: "Abgelehnt", color: "bg-kanban-rejected" },
] as const;

export function KanbanBoard({
  jobId,
  applicants: initialApplicants,
}: {
  jobId: string;
  applicants: Applicant[];
}) {
  const [isPending, startTransition] = useTransition();
  const [applicants, setOptimisticApplicants] = useOptimistic(
    initialApplicants,
    (state, update: { id: string; stage: string }) =>
      state.map((a) => (a.id === update.id ? { ...a, stage: update.stage } : a))
  );

  function handleDrop(applicantId: string, newStage: string) {
    startTransition(async () => {
      setOptimisticApplicants({ id: applicantId, stage: newStage });
      await updateApplicantStage(jobId, applicantId, newStage);
    });
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {STAGES.map((stage) => {
        const stageApplicants = applicants.filter((a) => a.stage === stage.key);
        return (
          <div
            key={stage.key}
            className="rounded-lg border bg-card p-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const applicantId = e.dataTransfer.getData("applicantId");
              if (applicantId) handleDrop(applicantId, stage.key);
            }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${stage.color}`} />
              <span className="text-sm font-medium">{stage.label}</span>
              <span className="ml-auto font-mono text-xs text-muted-foreground">
                {stageApplicants.length}
              </span>
            </div>
            <div className="space-y-2">
              {stageApplicants.map((applicant) => (
                <Card
                  key={applicant.id}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("applicantId", applicant.id)
                  }
                  className="cursor-grab active:cursor-grabbing"
                >
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">
                      {applicant.firstName} {applicant.lastName.charAt(0)}.
                    </p>
                    {applicant.skills.length > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {applicant.skills.slice(0, 3).join(", ")}
                      </p>
                    )}
                    {applicant.score != null && (
                      <Badge variant="outline" className="mt-2 font-mono text-xs">
                        Score: {applicant.score}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
              {stageApplicants.length === 0 && (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  Keine Bewerber
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
