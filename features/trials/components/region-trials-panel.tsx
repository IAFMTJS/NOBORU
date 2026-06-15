import Link from "next/link";

import { GlassPanel } from "@/components/visual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TRIAL_KIND_LABELS } from "@/features/trials/constants/trial.constants";
import type { TrialListEntryViewModel } from "@/features/trials/types/trial.types";
import { cn } from "@/lib/utils";

type RegionTrialsPanelProps = {
  regionSlug: string;
  trials: TrialListEntryViewModel[];
  variant?: "default" | "peak";
};

export function RegionTrialsPanel({
  regionSlug,
  trials,
  variant = "default",
}: RegionTrialsPanelProps) {
  const regionTrials = trials.filter((trial) => trial.regionSlug === regionSlug);
  if (regionTrials.length === 0) return null;

  const readyTrial = regionTrials.find((trial) => trial.availability === "available");
  const isPeak = variant === "peak";

  return (
    <GlassPanel
      className={cn(
        "space-y-3 p-4",
        isPeak && readyTrial && "border-trail-glow/40 trail-glow-warm",
      )}
    >
      <div className="space-y-1">
        <p className="text-heading-6 font-semibold">
          {isPeak ? "Trial Peak" : "Region Trials"}
        </p>
        <p className="text-body-sm text-muted-foreground">
          {isPeak && readyTrial
            ? `${readyTrial.title} is ready — prove your mastery.`
            : "Validate mastery with timed recall challenges"}
        </p>
      </div>
      {isPeak && readyTrial ? (
        <Button className="w-full" size="lg" asChild>
          <Link href={`/trials/${readyTrial.slug}`}>
            Attempt Trial · {readyTrial.title}
          </Link>
        </Button>
      ) : null}
      {regionTrials.map((trial) => (
        <div
          key={trial.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-3"
        >
          <div className="space-y-1">
            <p className="text-body-sm font-medium">{trial.title}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{TRIAL_KIND_LABELS[trial.kind]}</Badge>
              {trial.progress?.passed ? (
                <Badge variant="success">Passed</Badge>
              ) : trial.availability === "locked" ? (
                <Badge variant="secondary">Locked</Badge>
              ) : (
                <Badge variant="outline">Available</Badge>
              )}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={trial.availability === "locked"}
            asChild={trial.availability !== "locked"}
          >
            {trial.availability === "locked" ? (
              <span>Locked</span>
            ) : (
              <Link href={`/trials/${trial.slug}`}>Open</Link>
            )}
          </Button>
        </div>
      ))}
      <Button variant="ghost" className="w-full" asChild>
        <Link href="/trials">View all trials</Link>
      </Button>
    </GlassPanel>
  );
}
