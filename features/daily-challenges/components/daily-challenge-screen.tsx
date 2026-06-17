import Link from "next/link";

import { GlassPanel, PrimaryClimbButton, StoryTitle } from "@/components/visual";
import { Button } from "@/components/ui/button";
import type { DailyChallengeSessionViewModel } from "@/features/daily-challenges/types/daily-challenge.types";
import { DailyChallengeCompletedPanel } from "@/features/daily-challenges/components/daily-challenge-completed-panel";
import { DailyChallengePlayer } from "@/features/daily-challenges/components/daily-challenge-player";

type DailyChallengeScreenProps = {
  session: DailyChallengeSessionViewModel;
};

export function DailyChallengeScreen({ session }: DailyChallengeScreenProps) {
  const alreadyCompleted = session.completedToday > 0 && session.todayCompletion;

  return (
    <div className="space-y-4">
      <GlassPanel className="flex items-center justify-between gap-3 p-4">
        <div>
          <StoryTitle as="h1" className="text-base">
            Daily retention challenge
          </StoryTitle>
          <p className="text-body-sm text-muted-foreground">
            {alreadyCompleted
              ? "You already reinforced your memory today."
              : `${session.totalCount} word${session.totalCount === 1 ? "" : "s"} selected for long-term memory.`}
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/review">Review hub</Link>
        </Button>
      </GlassPanel>
      {session.todayCompletion ? (
        <DailyChallengeCompletedPanel completion={session.todayCompletion} />
      ) : (
        <DailyChallengePlayer session={session} />
      )}
    </div>
  );
}
