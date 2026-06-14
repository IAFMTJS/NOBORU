import Link from "next/link";

import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
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
        <SceneImage
          scene="profile_lantern_path"
          alt=""
          className="absolute inset-0 min-h-dvh rounded-none"
        />
      }
    >
      <PageContainer className="space-y-4">
        <GlassPanel className="overflow-hidden p-0">
          <div className="relative min-h-[11rem]">
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-transparent" />
            <div className="relative z-10 flex min-h-[11rem] flex-col justify-end p-4">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <StoryTitle as="h2" className="text-xs text-white/80">
                    Climber profile
                  </StoryTitle>
                  <h1 className="truncate text-heading-3 font-bold text-white">
                    {profile.displayName}
                  </h1>
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
          </div>
          <div className="border-t border-glass-border p-3">
            <YamaPresence
              presence={yama}
              size="sm"
              layout="horizontal"
              bubbleClassName="border-glass-border bg-glass-bg/80"
            />
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-3 p-4">
          <TitleSelector />
        </GlassPanel>

        <div className="grid grid-cols-3 gap-2 rounded-card border border-glass-border bg-glass-bg/60 px-2 py-3 backdrop-blur-sm">
          {profile.stats.map((stat) => {
            const iconName =
              stat.label === "Streak"
                ? "flame"
                : stat.label === "XP"
                  ? "gem"
                  : "trophy";
            return (
              <div key={stat.label} className="space-y-1 px-2 text-center">
                <div
                  className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary/10"
                  aria-hidden
                >
                  <UiIconImage name={iconName} size={18} />
                </div>
                <p className="text-caption text-muted-foreground">{stat.label}</p>
                <p className="text-heading-5">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <StoryTitle as="h3" className="text-sm">
              Achievements
            </StoryTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/achievements">View shrine</Link>
            </Button>
          </div>
          <Link href="/achievements" className="focus-ring block overflow-hidden rounded-2xl">
            <div className="relative min-h-[10rem]">
              <SceneImage scene="shrine_torii" alt="Achievement shrine preview" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-body-sm font-medium text-white">
                  {achievements.totalUnlocked}/{achievements.totalAvailable} badges earned
                </p>
                <p className="text-caption text-white/70">Enter the torii shrine</p>
              </div>
            </div>
          </Link>
        </div>

        <GlassPanel className="space-y-4 p-4">
          <div className="space-y-3">
            <StoryTitle as="h3" className="text-sm">
              Edit Profile
            </StoryTitle>
            <ProfileEditSection initialDisplayName={profile.displayName} />
          </div>
          <div className="space-y-2 border-t border-glass-border pt-4">
            <StoryTitle as="h3" className="text-sm">
              Account
            </StoryTitle>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/progress">View Progress</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/settings">Settings</Link>
            </Button>
          </div>
        </GlassPanel>
      </PageContainer>
    </IllustratedScreen>
  );
}
