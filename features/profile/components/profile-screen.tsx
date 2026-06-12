import Link from "next/link";
import { Flame, Gem, Mountain, Settings, Star, Trophy } from "lucide-react";

import { RegionHeroImage } from "@/components/media/region-hero-image";
import { AchievementShowcase } from "@/features/achievements/components/achievement-showcase";
import type { AchievementShowcaseViewModel } from "@/features/achievements/types/achievement.types";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileEditSection } from "@/features/profile/components/profile-edit-section";
import type { ProfileViewModel } from "@/features/profile/types/profile.types";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";

const STAT_ICONS: Record<string, typeof Flame> = {
  XP: Gem,
  Streak: Flame,
  Kanji: Star,
};

type ProfileScreenProps = {
  profile: ProfileViewModel;
  achievements: AchievementShowcaseViewModel;
  yama: YamaPresenceViewModel;
};

export function ProfileScreen({ profile, achievements, yama }: ProfileScreenProps) {
  const region = getRegionVisuals(profile.currentRegionSlug);

  return (
    <PageContainer>
      <div className="relative -mx-4 overflow-hidden sm:mx-0 sm:rounded-2xl">
        <div className="relative min-h-[14rem]">
          <RegionHeroImage
            regionSlug={profile.currentRegionSlug}
            alt={`${region.label} region`}
            className="absolute inset-0 h-full min-h-[14rem] rounded-none"
            hideOverlay
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
          <div className="relative z-10 flex min-h-[14rem] flex-col justify-end p-4">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="text-caption text-white/75">Climber profile</p>
                <h1 className="truncate text-heading-4 text-white">{profile.displayName}</h1>
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
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card shadow-elevation-1">
        <CardContent className="p-4">
          <YamaPresence
            presence={yama}
            size="sm"
            layout="horizontal"
            bubbleClassName="border-primary/20 bg-card/80"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        {profile.stats.map((stat) => {
          const Icon = STAT_ICONS[stat.label] ?? Mountain;
          return (
            <Card
              key={stat.label}
              className="border-primary/10 bg-gradient-to-b from-card to-primary/5 shadow-elevation-1"
            >
              <CardContent className="space-y-2 p-4 text-center">
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <p className="text-caption text-muted-foreground">{stat.label}</p>
                <p className="text-heading-5">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-elevation-1">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-heading-6">
            <Trophy className="h-4 w-4 text-warning" aria-hidden />
            Achievements
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/achievements">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <AchievementShowcase showcase={achievements} compact />
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileEditSection initialDisplayName={profile.displayName} />
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/progress">View Progress</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/settings">Settings</Link>
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
