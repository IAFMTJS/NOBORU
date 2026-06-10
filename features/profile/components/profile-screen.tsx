import Link from "next/link";

import { AchievementShowcase } from "@/features/achievements/components/achievement-showcase";
import type { AchievementShowcaseViewModel } from "@/features/achievements/types/achievement.types";
import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileEditSection } from "@/features/profile/components/profile-edit-section";
import type { ProfileViewModel } from "@/features/profile/types/profile.types";

type ProfileScreenProps = {
  profile: ProfileViewModel;
  achievements: AchievementShowcaseViewModel;
};

export function ProfileScreen({ profile, achievements }: ProfileScreenProps) {
  return (
    <PageContainer>
      <ScreenHeader
        title="Profile"
        subtitle={`${profile.displayName} · ${profile.levelLabel}`}
      />

      <div className="grid grid-cols-3 gap-3">
        {profile.stats.map((stat) => (
          <Card key={stat.label} className="shadow-elevation-1">
            <CardContent className="p-4 text-center">
              <p className="text-caption">{stat.label}</p>
              <p className="text-heading-5">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <AchievementShowcase showcase={achievements} compact />

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
            <Link href="/achievements">View All Achievements</Link>
          </Button>
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
