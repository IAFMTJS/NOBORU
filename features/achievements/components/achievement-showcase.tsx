import Link from "next/link";

import { GlassPanel, StoryTitle } from "@/components/visual";
import { AchievementBadge } from "@/features/achievements/components/achievement-badge";
import { ACHIEVEMENT_RARITY_LABELS } from "@/features/achievements/constants/achievement.constants";
import type { AchievementShowcaseViewModel } from "@/features/achievements/types/achievement.types";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import { WorldArtImage } from "@/components/visual/world/world-art-image";
import { INVENTORY_ITEM_ASSETS } from "@/lib/assets/lesson-node-assets";
import { SecondaryScreenShell } from "@/components/visual/shells/secondary-screen-shell";

import { glassSurface } from "@/components/visual/primitives/glass-surface";
import { cn } from "@/lib/utils";

type AchievementShowcaseProps = {
  showcase: AchievementShowcaseViewModel;
  compact?: boolean;
};

function MilestoneLanterns({
  totalUnlocked,
  totalAvailable,
}: {
  totalUnlocked: number;
  totalAvailable: number;
}) {
  const milestones = [1, 5, 10, 25, 50];
  const nextMilestone = milestones.find((milestone) => totalUnlocked < milestone);

  return (
    <GlassPanel className="space-y-3 rounded-card p-4">
      <div className="flex items-center justify-between gap-2">
        <StoryTitle as="h2" className="text-sm">
          Shrine milestones
        </StoryTitle>
        <p className="text-caption text-muted-foreground tabular-nums">
          {totalUnlocked}/{totalAvailable} earned
        </p>
      </div>
      <div className="relative px-2 py-3">
        <div
          className="absolute left-6 right-6 top-[1.65rem] h-px bg-trail-glow/20"
          aria-hidden
        />
        <div className="relative flex items-start justify-between gap-1">
          {milestones.map((milestone) => {
            const reached = totalUnlocked >= milestone;
            const isNext = nextMilestone === milestone;
            return (
              <div key={milestone} className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold tabular-nums shadow-[0_0_10px_rgba(0,0,0,0.35)]",
                    reached
                      ? "border-trail-glow/60 bg-trail-glow/15 text-trail-glow"
                      : isNext
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-white/10 bg-black/50 text-muted-foreground",
                  )}
                >
                  {milestone}
                </span>
                <span className="text-[9px] uppercase tracking-wide text-muted-foreground">
                  {reached ? "Lit" : isNext ? "Next" : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </GlassPanel>
  );
}

function ShrinePlaque({
  achievement,
  unlocked,
  elevated,
}: {
  achievement: AchievementShowcaseViewModel["unlocked"][number];
  unlocked: boolean;
  elevated?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-transform",
        unlocked
          ? cn(glassSurface.card, "border-trail-glow/25 shadow-elevation-1")
          : "border-dashed border-white/55 bg-white/30",
        elevated && "-translate-y-1",
      )}
      title={achievement.description ?? achievement.name}
    >
      <AchievementBadge
        slug={achievement.slug}
        name={achievement.name}
        rarity={achievement.rarity}
        unlocked={unlocked}
        size={elevated ? "lg" : "md"}
      />
      <span className="max-w-[5rem] truncate text-caption font-medium">{achievement.name}</span>
      <span className="text-[10px] text-muted-foreground">
        {ACHIEVEMENT_RARITY_LABELS[achievement.rarity]}
      </span>
    </div>
  );
}

function ShrineWall({
  achievements,
  unlocked,
  title,
  subtitle,
}: {
  achievements: AchievementShowcaseViewModel["unlocked"];
  unlocked: boolean;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-0.5 text-center">
        <StoryTitle as="h2" className="text-sm">
          {title}
        </StoryTitle>
        {subtitle ? <p className="text-caption text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="relative mx-auto max-w-sm py-2">
        <div
          className="absolute bottom-0 left-1/2 top-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-trail-glow/5 via-trail-glow/25 to-trail-glow/5"
          aria-hidden
        />
        <ul className="relative flex flex-col gap-5">
          {achievements.map((achievement, index) => {
            const alignLeft = index % 2 === 0;
            const tier =
              achievement.rarity === "legendary"
                ? "trophy"
                : achievement.rarity === "epic"
                  ? "banner"
                  : "plaque";
            return (
              <li
                key={achievement.id}
                className={cn(
                  "flex",
                  alignLeft ? "justify-start pr-10" : "justify-end pl-10",
                )}
              >
                <div className="relative max-w-[9rem]">
                  {tier === "trophy" && unlocked ? (
                    <span
                      className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-trail-glow"
                      aria-hidden
                    >
                      Trophy
                    </span>
                  ) : null}
                  <ShrinePlaque
                    achievement={achievement}
                    unlocked={unlocked}
                    elevated={tier !== "plaque" && unlocked}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}


export function AchievementShowcase({
  showcase,
  compact = false,
}: AchievementShowcaseProps) {
  if (compact) {
    return (
      <Link href="/achievements" className="focus-ring block overflow-hidden rounded-2xl">
        <GlassPanel className="relative min-h-[8rem] p-4">
          <p className="font-sans text-body-sm font-semibold">
            {showcase.totalUnlocked}/{showcase.totalAvailable} achievements unlocked
          </p>
          <p className="mt-1 text-caption text-muted-foreground">Open the shrine</p>
        </GlassPanel>
      </Link>
    );
  }

  const featured = showcase.unlocked[0] ?? showcase.locked[0] ?? null;
  const trophyAchievement =
    showcase.unlocked.find((a) => a.rarity === "legendary") ?? featured;
  const yama = yamaService.resolveProfilePresence();

  return (
    <SecondaryScreenShell
      title="Achievement Shrine"
      subtitle="Milestones earned beneath the torii"
      backHref="/profile"
      backLabel="Profile"
      contentClassName="space-y-4 pb-2"
    >
          {trophyAchievement ? (
            <div className="mx-auto flex max-w-md flex-col items-center gap-2 py-2">
              <p className="font-story text-xs uppercase tracking-[0.25em] text-trail-glow">
                Trophy pedestal
              </p>
              <GlassPanel className="relative flex flex-col items-center gap-3 px-8 py-6">
                <WorldArtImage
                  asset={INVENTORY_ITEM_ASSETS.stone_lantern}
                  alt=""
                  width={56}
                  height={56}
                  className="opacity-90 drop-shadow-lg"
                />
                <AchievementBadge
                  slug={trophyAchievement.slug}
                  name={trophyAchievement.name}
                  rarity={trophyAchievement.rarity}
                  unlocked={showcase.unlocked.some((a) => a.id === trophyAchievement.id)}
                  size="lg"
                  showLabel
                />
              </GlassPanel>
            </div>
          ) : null}

          {featured && featured.id !== trophyAchievement?.id ? (
            <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-2">
              <GlassPanel className="px-6 py-5 text-center">
                <AchievementBadge
                  slug={featured.slug}
                  name={featured.name}
                  rarity={featured.rarity}
                  unlocked={showcase.unlocked.some((a) => a.id === featured.id)}
                  size="lg"
                  showLabel
                />
              </GlassPanel>
              <p className="max-w-xs text-center text-body-sm text-muted-foreground">
                {featured.description ?? featured.name}
              </p>
            </div>
          ) : null}

          <div className="mx-auto max-w-md">
            <MilestoneLanterns
              totalUnlocked={showcase.totalUnlocked}
              totalAvailable={showcase.totalAvailable}
            />
          </div>

          {showcase.unlocked.length === 0 ? (
            <div className="mx-auto max-w-md">
              <YamaEmptyState
                surface="achievements"
                title="Plaques await discovery"
                description="Hidden treasures remain along the trail. Continue climbing to reveal shrine milestones."
                actionHref="/tree"
                actionLabel="Continue your journey"
              />
            </div>
          ) : (
            <GlassPanel className="mx-auto max-w-md rounded-card p-4">
              <ShrineWall
                achievements={showcase.unlocked}
                unlocked
                title="Earned plaques"
                subtitle="Displayed on the shrine wall"
              />
            </GlassPanel>
          )}

          {showcase.locked.length > 0 ? (
            <GlassPanel className="mx-auto max-w-md rounded-card border-dashed p-4 opacity-90">
              <ShrineWall
                achievements={showcase.locked}
                unlocked={false}
                title="Awaiting the trail"
                subtitle="Goals still ahead on your ascent"
              />
            </GlassPanel>
          ) : null}

        <footer className="shrink-0 pt-2">
          <GlassPanel className="mx-auto max-w-md p-3">
            <YamaPresence presence={yama} size="sm" layout="horizontal" />
          </GlassPanel>
        </footer>
    </SecondaryScreenShell>
  );
}
