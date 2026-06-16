"use client";

import Link from "next/link";

import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import {
  GlassPanel,
  IllustratedScreen,
  PrimaryClimbButton,
  StoryTitle,
} from "@/components/visual";
import { glassSurface } from "@/components/visual/primitives/glass-surface";
import { cn } from "@/lib/utils";

type LessonFailScreenProps = {
  score: number;
  passScore: number;
  trailHref?: string;
  onRetry: () => void;
};

export function LessonFailScreen({
  score,
  passScore,
  trailHref = "/learn",
  onRetry,
}: LessonFailScreenProps) {
  return (
    <IllustratedScreen className="min-h-[min(28rem,calc(100dvh-10rem))] rounded-card">
      <GlassPanel className="m-4 space-y-4 p-5">
        <div className="space-y-1 text-center">
          <StoryTitle as="h2" className="text-lg">
            Rest at this marker
          </StoryTitle>
          <p className="text-caption text-muted-foreground">
            Score {score}% · Need {passScore}% to clear this lesson
          </p>
        </div>
        <YamaPresence
          presence={yamaService.resolveFailPresence()}
          size="md"
          layout="vertical"
          className="items-center"
        />
        <p className="text-center text-body-sm text-muted-foreground">
          Review what tripped you up, then try the trail again. No rush — the mountain waits.
        </p>
        <PrimaryClimbButton className="w-full" onClick={onRetry}>
          Try Again
        </PrimaryClimbButton>
        <Link
          href={trailHref}
          className={cn(
            "focus-ring flex h-11 w-full items-center justify-center rounded-[var(--radius)] font-sans text-body-sm font-medium",
            glassSurface.buttonSecondary,
          )}
        >
          Return to Journey
        </Link>
      </GlassPanel>
    </IllustratedScreen>
  );
}
