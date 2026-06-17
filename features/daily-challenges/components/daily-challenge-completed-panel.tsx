import Link from "next/link";

import { StudyAtmosphere } from "@/components/layout/study-atmosphere";
import { Button } from "@/components/ui/button";
import { GlassPanel, PrimaryClimbButton, StoryTitle } from "@/components/visual";
import type { DailyChallengeCompletionViewModel } from "@/features/daily-challenges/types/daily-challenge.types";
import { YamaCelebration } from "@/features/yama/components/yama-celebration";
import { yamaService } from "@/features/yama/services/yama.service";

type DailyChallengeCompletedPanelProps = {
  completion: DailyChallengeCompletionViewModel;
};

export function DailyChallengeCompletedPanel({
  completion,
}: DailyChallengeCompletedPanelProps) {
  const presence = yamaService.resolveCelebration("lesson_complete");

  return (
    <StudyAtmosphere>
      <YamaCelebration presence={presence} title="Today's retention is complete">
        <p className="text-body-sm text-muted-foreground">
          You reinforced {completion.correctCount} of {completion.totalCount} words (
          {completion.scorePercent}%).
        </p>
      </YamaCelebration>
      <GlassPanel className="mt-4 space-y-3 p-4">
        <StoryTitle as="h2" className="text-base">
          Come back tomorrow
        </StoryTitle>
        <p className="text-body-sm text-muted-foreground">
          Daily retention is memory maintenance, not progression. Return tomorrow for
          another reinforcement session.
        </p>
        <div className="flex flex-col gap-2">
          <PrimaryClimbButton asChild>
            <Link href="/review">Open review queue</Link>
          </PrimaryClimbButton>
          <Button variant="outline" asChild>
            <Link href="/camp">Return to camp</Link>
          </Button>
        </div>
      </GlassPanel>
    </StudyAtmosphere>
  );
}
