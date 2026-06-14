import Link from "next/link";

import { RegionHeroImage } from "@/components/media/region-hero-image";
import { Button } from "@/components/ui/button";
import { GlassPanel, IllustratedScreen, StoryTitle } from "@/components/visual";
import { AchievementBadge } from "@/features/achievements/components/achievement-badge";
import { ACHIEVEMENT_RARITY_LABELS } from "@/features/achievements/constants/achievement.constants";
import type { AchievementShowcaseViewModel } from "@/features/achievements/types/achievement.types";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import { cn } from "@/lib/utils";

type AchievementShowcaseProps = {
  showcase: AchievementShowcaseViewModel;
  compact?: boolean;
};

function MilestoneCounters({
  totalUnlocked,
  totalAvailable,
}: {
  totalUnlocked: number;
  totalAvailable: number;
}) {
  return (
    <GlassPanel className="grid grid-cols-3 gap-2 p-3 text-center">
      <div>
        <p className="text-heading-5 font-semibold text-trail-glow tabular-nums">
          {totalUnlocked}
        </p>
        <p className="text-caption text-muted-foreground">Unlocked</p>
      </div>
      <div className="border-x border-glass-border">
        <p className="text-heading-5 font-semibold tabular-nums">
          {totalAvailable - totalUnlocked}
        </p>
        <p className="text-caption text-muted-foreground">Remaining</p>
      </div>
      <div>
        <p className="text-heading-5 font-semibold tabular-nums">{totalAvailable}</p>
        <p className="text-caption text-muted-foreground">Total</p>
      </div>
    </GlassPanel>
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
      <RegionHeroImage
        regionSlug="forest-trail"
        alt=""
        className="absolute inset-0 h-full min-h-dvh rounded-none"
        hideOverlay
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/55 to-background/92" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-48 bg-trail-glow/8 blur-3xl"
      />
    </>
  );
}

export function AchievementShowcase({
  showcase,
  compact = false,
}: AchievementShowcaseProps) {
  if (compact) {
    return (
      <GlassPanel className="space-y-3 p-4">
        <div className="space-y-0.5">
          <StoryTitle as="h3" className="text-sm normal-case tracking-wide">
            Achievement Shrine
          </StoryTitle>
          <p className="text-caption text-muted-foreground">
            {showcase.totalUnlocked}/{showcase.totalAvailable} unlocked
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {showcase.unlocked.slice(0, 6).map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              slug={achievement.slug}
              name={achievement.name}
              rarity={achievement.rarity}
              showLabel
              size="sm"
            />
          ))}
          {showcase.unlocked.length === 0 ? (
            <p className="w-full text-body-sm text-muted-foreground">
              Complete lessons and reviews to earn your first badge.
            </p>
          ) : null}
        </div>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href="/achievements">View shrine</Link>
        </Button>
      </GlassPanel>
    );
  }

  const allAchievements = [...showcase.unlocked, ...showcase.locked];

  return (
    <IllustratedScreen scrim="none" background={<ShrineBackground />}>
      <div className="space-y-5 px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-4">
        <header className="space-y-1 text-center">
          <StoryTitle as="h1">Achievement Shrine</StoryTitle>
          <p className="text-body-sm text-muted-foreground">
            Milestones earned beneath the torii
          </p>
        </header>

        <MilestoneCounters
          totalUnlocked={showcase.totalUnlocked}
          totalAvailable={showcase.totalAvailable}
        />

        {showcase.unlocked.length === 0 ? (
          <GlassPanel className="p-4">
            <YamaEmptyState
              surface="achievements"
              title="No achievements yet"
              description="Complete lessons and reviews to earn your first badge."
              actionHref="/learn"
              actionLabel="Continue climbing"
            />
          </GlassPanel>
        ) : (
          <GlassPanel className="space-y-3 p-4">
            <StoryTitle as="h2" className="text-sm normal-case tracking-wide">
              Earned badges
            </StoryTitle>
            <BadgeGrid achievements={showcase.unlocked} unlocked />
          </GlassPanel>
        )}

        {showcase.locked.length > 0 ? (
          <GlassPanel className="space-y-3 border-dashed p-4">
            <StoryTitle as="h2" className="text-sm normal-case tracking-wide">
              Still to earn
            </StoryTitle>
            <p className="text-caption text-muted-foreground">
              Goals waiting on the trail ahead
            </p>
            <BadgeGrid achievements={showcase.locked} unlocked={false} />
          </GlassPanel>
        ) : null}

        {allAchievements.length > 0 ? (
          <p className="text-center text-caption text-muted-foreground">
            Total achievements {showcase.totalUnlocked} / {showcase.totalAvailable}
          </p>
        ) : null}
      </div>
    </IllustratedScreen>
  );
}
