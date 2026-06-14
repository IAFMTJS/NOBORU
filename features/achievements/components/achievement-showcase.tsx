import Link from "next/link";

import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import { Button } from "@/components/ui/button";
import { IllustratedScreen, StoryTitle } from "@/components/visual";
import { AchievementBadge } from "@/features/achievements/components/achievement-badge";
import { ACHIEVEMENT_RARITY_LABELS } from "@/features/achievements/constants/achievement.constants";
import type { AchievementShowcaseViewModel } from "@/features/achievements/types/achievement.types";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import { cn } from "@/lib/utils";

type AchievementShowcaseProps = {
  showcase: AchievementShowcaseViewModel;
  compact?: boolean;
};

function MilestoneRow({
  totalUnlocked,
  totalAvailable,
}: {
  totalUnlocked: number;
  totalAvailable: number;
}) {
  const milestones = [1, 5, 10, 25, 50];
  const nextMilestone = milestones.find((milestone) => totalUnlocked < milestone);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <StoryTitle as="h2" className="text-sm">
          Milestones
        </StoryTitle>
        <p className="text-caption text-muted-foreground tabular-nums">
          {totalUnlocked}/{totalAvailable} earned
        </p>
      </div>
      <div className="relative rounded-xl border border-white/10 bg-black/40 px-4 py-4 backdrop-blur-sm">
        <div
          className="absolute left-8 right-8 top-[2.15rem] h-px bg-white/10"
          aria-hidden
        />
        <div className="relative flex items-start justify-between gap-1">
          {milestones.map((milestone) => {
            const reached = totalUnlocked >= milestone;
            const isNext = nextMilestone === milestone;
            return (
              <div key={milestone} className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border bg-black/60",
                    reached
                      ? "border-trail-glow/50 text-trail-glow"
                      : isNext
                        ? "border-primary/40 text-primary"
                        : "border-white/10 text-muted-foreground",
                  )}
                >
                  <UiIconImage
                    name="trophy"
                    size={reached ? 18 : 16}
                    className={cn(!reached && !isNext && "opacity-40")}
                  />
                </span>
                <span
                  className={cn(
                    "text-caption tabular-nums",
                    reached
                      ? "font-medium text-trail-glow"
                      : isNext
                        ? "text-primary"
                        : "text-muted-foreground",
                  )}
                >
                  {milestone}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BadgeGrid({
  achievements,
  unlocked = true,
}: {
  achievements: AchievementShowcaseViewModel["unlocked"];
  unlocked?: boolean;
}) {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
      {achievements.map((achievement) => (
        <div
          key={achievement.id}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl p-2 transition-colors",
            unlocked ? "hover:bg-white/5" : "opacity-80",
          )}
          title={achievement.description ?? achievement.name}
        >
          <AchievementBadge
            slug={achievement.slug}
            name={achievement.name}
            rarity={achievement.rarity}
            unlocked={unlocked}
            showLabel
            size="md"
          />
          <span className="text-caption text-muted-foreground">
            {ACHIEVEMENT_RARITY_LABELS[achievement.rarity]}
          </span>
        </div>
      ))}
    </div>
  );
}

function ShrineBackground() {
  return (
    <>
      <SceneImage scene="shrine_torii" alt="" className="absolute inset-0 min-h-dvh rounded-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background/95" />
    </>
  );
}

export function AchievementShowcase({
  showcase,
  compact = false,
}: AchievementShowcaseProps) {
  if (compact) {
    return (
      <Link href="/achievements" className="focus-ring block overflow-hidden rounded-2xl">
        <div className="relative min-h-[8rem]">
          <SceneImage scene="shrine_torii" alt="Achievement shrine" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3">
            <p className="text-body-sm text-white">
              {showcase.totalUnlocked}/{showcase.totalAvailable} unlocked
            </p>
          </div>
        </div>
      </Link>
    );
  }

  const featured = showcase.unlocked[0] ?? showcase.locked[0] ?? null;

  return (
    <IllustratedScreen scrim="none" background={<ShrineBackground />}>
      <div className="space-y-5 px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-4">
        <header className="space-y-1 text-center">
          <StoryTitle as="h1">Achievement Shrine</StoryTitle>
          <p className="text-body-sm text-muted-foreground">
            Milestones earned beneath the torii
          </p>
        </header>

        {featured ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <AchievementBadge
              slug={featured.slug}
              name={featured.name}
              rarity={featured.rarity}
              unlocked={showcase.unlocked.some((a) => a.id === featured.id)}
              size="lg"
              showLabel
            />
            <p className="max-w-xs text-center text-body-sm text-muted-foreground">
              {featured.description ?? featured.name}
            </p>
          </div>
        ) : null}

        <MilestoneRow
          totalUnlocked={showcase.totalUnlocked}
          totalAvailable={showcase.totalAvailable}
        />

        {showcase.unlocked.length === 0 ? (
          <div className="rounded-xl border border-glass-border bg-glass-bg/60 p-4 backdrop-blur-sm">
            <YamaEmptyState
              surface="achievements"
              title="No achievements yet"
              description="Complete lessons and reviews to earn your first badge."
              actionHref="/learn"
              actionLabel="Continue climbing"
            />
          </div>
        ) : (
          <div className="space-y-3 rounded-xl border border-glass-border bg-glass-bg/40 p-4 backdrop-blur-sm">
            <StoryTitle as="h2" className="text-sm">
              Earned badges
            </StoryTitle>
            <BadgeGrid achievements={showcase.unlocked} unlocked />
          </div>
        )}

        {showcase.locked.length > 0 ? (
          <div className="space-y-3 rounded-xl border border-dashed border-glass-border bg-glass-bg/30 p-4 backdrop-blur-sm">
            <StoryTitle as="h2" className="text-sm">
              Still to earn
            </StoryTitle>
            <p className="text-caption text-muted-foreground">
              Goals waiting on the trail ahead
            </p>
            <BadgeGrid achievements={showcase.locked} unlocked={false} />
          </div>
        ) : null}
      </div>
    </IllustratedScreen>
  );
}
