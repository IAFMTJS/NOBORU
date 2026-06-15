import Link from "next/link";

import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import { AchievementShowcase } from "@/features/achievements/components/achievement-showcase";
import type { AchievementShowcaseViewModel } from "@/features/achievements/types/achievement.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassPanel, IllustratedScreen, StoryTitle } from "@/components/visual";
import { WorldArtImage } from "@/components/visual/world/world-art-image";
import { ProfileEditSection } from "@/features/profile/components/profile-edit-section";
import { TitleSelector } from "@/features/profile/components/title-selector";
import type { ProfileViewModel } from "@/features/profile/types/profile.types";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";
import { NAV_TAB_MASCOT_ASSETS } from "@/lib/assets/art-mappings";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";

type TrailLedgerSignpostProps = {
  href: string;
  scene: "study_atmosphere" | "checkpoint_shrine" | "profile_lantern_path" | "memory_book_journal";
  title: string;
  subtitle: string;
};

function TrailLedgerSignpost({ href, scene, title, subtitle }: TrailLedgerSignpostProps) {
  return (
    <Link href={href} className="focus-ring block overflow-hidden rounded-xl">
      <div className="relative min-h-[4.5rem]">
        <SceneImage scene={scene} alt="" className="absolute inset-0 rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        <div className="relative flex items-center justify-between gap-3 px-3 py-3">
          <div className="min-w-0">
            <p className="font-story text-sm text-trail-glow">{title}</p>
            <p className="text-caption text-white/80">{subtitle}</p>
          </div>
          <span className="shrink-0 text-sm text-trail-glow" aria-hidden>
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

type ProfileScreenProps = {
  profile: ProfileViewModel;
  achievements: AchievementShowcaseViewModel;
  yama: YamaPresenceViewModel;
};

function JourneyStatLantern({
  label,
  value,
  iconName,
}: {
  label: string;
  value: string;
  iconName: "flame" | "gem" | "trophy";
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-center backdrop-blur-sm">
      <UiIconImage name={iconName} size={16} />
      <p className="text-[10px] uppercase tracking-wide text-white/60">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-white">{value}</p>
    </div>
  );
}

export function ProfileScreen({ profile, achievements, yama }: ProfileScreenProps) {
  const region = getRegionVisuals(profile.currentRegionSlug);

  return (
    <IllustratedScreen
      scrim="none"
      className="min-h-dvh"
      background={
        <SceneImage
          scene="profile_lantern_path"
          alt="Lantern-lit mountain path at dusk"
          className="absolute inset-0 min-h-dvh rounded-none"
          priority
        />
      }
    >
      <div className="relative flex min-h-dvh flex-col">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/80"
          aria-hidden
        />

        <header className="relative z-10 shrink-0 p-4 pt-3">
          <div className="rounded-card border border-white/12 bg-black/45 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div
                className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-trail-glow/30 bg-primary/20 shadow-[0_0_16px_hsl(var(--trail-glow)/0.15)]"
                aria-hidden
              >
                <WorldArtImage
                  asset={NAV_TAB_MASCOT_ASSETS.profile}
                  alt=""
                  width={56}
                  height={56}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <StoryTitle as="h2" className="text-[10px] uppercase tracking-[0.2em] text-trail-glow">
                  Travel record
                </StoryTitle>
                <h1 className="truncate text-lg font-bold text-white">{profile.displayName}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
                    {profile.levelLabel}
                  </Badge>
                  <Badge variant="outline" className="border-white/25 text-white/90">
                    {region.label}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link href="/settings" aria-label="Settings">
                  <UiIconImage name="gear" size={20} />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="relative z-10 flex-1 space-y-4 overflow-y-auto px-4 py-2">
          <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
            {profile.stats.map((stat) => {
              const iconName =
                stat.label === "Streak" ? "flame" : stat.label === "XP" ? "gem" : "trophy";
              return (
                <JourneyStatLantern
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  iconName={iconName}
                />
              );
            })}
          </div>

          <div className="rounded-card border border-white/10 bg-black/35 p-4">
            <YamaPresence
              presence={yama}
              size="sm"
              layout="horizontal"
              bubbleClassName="border-glass-border bg-glass-bg/80"
            />
          </div>

          <div className="mx-auto max-w-md rounded-card border border-white/10 bg-black/35 p-4">
            <TitleSelector />
          </div>

          <Link
            href="/achievements"
            className="focus-ring mx-auto block max-w-md overflow-hidden rounded-card"
          >
            <div className="relative min-h-[9rem]">
              <SceneImage scene="shrine_torii" alt="Achievement shrine preview" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <StoryTitle as="h2" className="text-sm text-white">
                  Achievement shrine
                </StoryTitle>
                <p className="mt-1 text-body-sm text-white/85">
                  {achievements.totalUnlocked}/{achievements.totalAvailable} plaques earned
                </p>
                <p className="text-caption text-trail-glow">Walk beneath the torii →</p>
              </div>
            </div>
          </Link>

          <div className="mx-auto max-w-md rounded-card border border-white/10 bg-black/35 p-4">
            <div className="space-y-3">
              <StoryTitle as="h3" className="text-sm">
                Journal notes
              </StoryTitle>
              <ProfileEditSection initialDisplayName={profile.displayName} />
            </div>
            <div className="space-y-2 border-t border-glass-border pt-4">
              <StoryTitle as="h3" className="text-sm">
                Trail ledger
              </StoryTitle>
              <div className="space-y-2">
                <TrailLedgerSignpost
                  href="/progress"
                  scene="study_atmosphere"
                  title="Progress markers"
                  subtitle="Lanterns along your climb"
                />
                <TrailLedgerSignpost
                  href="/collections"
                  scene="checkpoint_shrine"
                  title="Collections museum"
                  subtitle="Artifacts discovered on the trail"
                />
                <TrailLedgerSignpost
                  href="/notifications"
                  scene="profile_lantern_path"
                  title="Trail messages"
                  subtitle="Milestones and festival news"
                />
                <TrailLedgerSignpost
                  href="/profile/memory-book"
                  scene="memory_book_journal"
                  title="Memory book"
                  subtitle="Pages of firsts and discoveries"
                />
                <TrailLedgerSignpost
                  href="/settings"
                  scene="profile_lantern_path"
                  title="Camp preferences"
                  subtitle="Audio, language, and accessibility"
                />
              </div>
            </div>
          </div>
        </main>

        <footer className="relative z-10 shrink-0 pb-[calc(6.5rem+env(safe-area-inset-bottom))]" />
      </div>
    </IllustratedScreen>
  );
}
