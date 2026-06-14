import Link from "next/link";

import { RegionHeroImage } from "@/components/media/region-hero-image";
import { AchievementShowcase } from "@/features/achievements/components/achievement-showcase";
import type { AchievementShowcaseViewModel } from "@/features/achievements/types/achievement.types";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassPanel, IllustratedScreen, StoryTitle } from "@/components/visual";
import { ProfileEditSection } from "@/features/profile/components/profile-edit-section";
import { TitleSelector } from "@/features/profile/components/title-selector";
import type { ProfileViewModel } from "@/features/profile/types/profile.types";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";

const STAT_GLYPHS: Record<string, string> = {
  XP: "✦",
  Streak: "🔥",
  Kanji: "字",
};

type ProfileScreenProps = {
  profile: ProfileViewModel;
  achievements: AchievementShowcaseViewModel;
  yama: YamaPresenceViewModel;
};

export function ProfileScreen({ profile, achievements, yama }: ProfileScreenProps) {
  const region = getRegionVisuals(profile.currentRegionSlug);

  return (
    <IllustratedScreen
      scrim="minimal"
      background={
        <RegionHeroImage
          regionSlug={profile.currentRegionSlug}
          alt=""
          className="absolute inset-0 h-full min-h-dvh rounded-none"
          hideOverlay
        />
      }
    >
      <PageContainer className="space-y-5">
        <GlassPanel className="overflow-hidden p-0">
          <div className="relative min-h-[10rem]">
            <RegionHeroImage
              regionSlug={profile.currentRegionSlug}
              alt={`${region.label} region`}
              className="absolute inset-0 h-full min-h-[10rem] rounded-none"
              hideOverlay
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent" />
            <div className="relative z-10 flex min-h-[10rem] flex-col justify-end p-4">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <p className="text-caption text-white/75">Climber profile</p>
                  <StoryTitle as="h1" className="truncate text-lg normal-case text-white">
                    {profile.displayName}
                  </StoryTitle>
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
                  size="sm"
                  className="shrink-0 text-white hover:bg-white/10 hover:text-white"
                  asChild
                >
                  <Link href="/settings" aria-label="Settings">
                    ⚙
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-4">
          <YamaPresence
            presence={yama}
            size="sm"
            layout="horizontal"
            bubbleClassName="border-glass-border bg-glass-bg/80"
          />
        </GlassPanel>

        <GlassPanel className="space-y-3 p-4">
          <TitleSelector />
        </GlassPanel>

        <div className="grid grid-cols-3 gap-3">
          {profile.stats.map((stat) => {
            const glyph = STAT_GLYPHS[stat.label] ?? "登";
            return (
              <GlassPanel key={stat.label} className="space-y-2 p-4 text-center">
                <div
                  className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-base"
                  aria-hidden
                >
                  {glyph}
                </div>
                <p className="text-caption text-muted-foreground">{stat.label}</p>
                <p className="text-heading-5">{stat.value}</p>
              </GlassPanel>
            );
          })}
        </div>

        <GlassPanel className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <StoryTitle as="h3" className="flex items-center gap-2 text-sm normal-case tracking-wide">
              <span aria-hidden>🏆</span>
              Achievements
            </StoryTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/achievements">View all</Link>
            </Button>
          </div>
          <AchievementShowcase showcase={achievements} compact />
        </GlassPanel>

        <GlassPanel className="space-y-3 p-4">
          <StoryTitle as="h3" className="text-sm normal-case tracking-wide">
            Edit Profile
          </StoryTitle>
          <ProfileEditSection initialDisplayName={profile.displayName} />
        </GlassPanel>

        <GlassPanel className="space-y-2 p-4">
          <StoryTitle as="h3" className="text-sm normal-case tracking-wide">
            Account
          </StoryTitle>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/progress">View Progress</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/settings">Settings</Link>
          </Button>
        </GlassPanel>
      </PageContainer>
    </IllustratedScreen>
  );
}
