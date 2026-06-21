import Link from "next/link";

import { StudyAtmosphere } from "@/components/layout/study-atmosphere";
import { GlassPanel, PrimaryClimbButton, StoryTitle } from "@/components/visual";
import { Button } from "@/components/ui/button";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import type { ReviewStatsViewModel } from "@/features/review/types/review.types";

type ReviewSessionHubProps = {
  stats: ReviewStatsViewModel;
};

const PRESET_MODES = [
  { label: "Daily retention", href: "/daily-challenge" },
  { label: "Quick 5", href: "/review?limit=5" },
  { label: "Quick 10", href: "/review?limit=10" },
  { label: "Quick 20", href: "/review?limit=20" },
  { label: "All Due", href: "/review" },
] as const;

export function ReviewSessionHub({ stats }: ReviewSessionHubProps) {
  if (stats.dueCount === 0) {
    return (
      <StudyAtmosphere>
        <YamaEmptyState
          surface="review"
          title="Review queue is clear"
          description="The path ahead is open — explore a lesson or rest at camp until new cards ripen."
          actionHref="/tree"
          actionLabel="Continue climbing"
        />
      </StudyAtmosphere>
    );
  }

  return (
    <StudyAtmosphere>
      <GlassPanel className="space-y-4 p-4">
        <div className="space-y-1">
          <StoryTitle as="h3" className="text-sm">
            Start a session
          </StoryTitle>
          <p className="text-body-sm text-muted-foreground">
            {stats.dueCount} item{stats.dueCount === 1 ? "" : "s"} due for review
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_MODES.map((mode, index) =>
            index === 0 ? (
              <PrimaryClimbButton key={mode.label} asChild className="col-span-2">
                <Link href={mode.href}>{mode.label}</Link>
              </PrimaryClimbButton>
            ) : index === 1 ? (
              <Button key={mode.label} variant="outline" asChild className="col-span-2">
                <Link href={mode.href}>{mode.label}</Link>
              </Button>
            ) : (
              <Button key={mode.label} variant="outline" asChild>
                <Link href={mode.href}>{mode.label}</Link>
              </Button>
            ),
          )}
        </div>
        {stats.weakAreas.length > 0 ? (
          <div className="space-y-2">
            <p className="text-caption text-muted-foreground">Weak areas</p>
            <div className="flex flex-wrap gap-2">
              {stats.weakAreas.map((area) => (
                <Button key={area.contentType} variant="secondary" size="sm" asChild>
                  <Link
                    href={`/review?contentType=${area.contentType}&weakOnly=true&limit=10`}
                  >
                    {area.label} ({area.count})
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        ) : null}
      </GlassPanel>
    </StudyAtmosphere>
  );
}
