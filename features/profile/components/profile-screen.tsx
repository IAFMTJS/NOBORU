import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileEditSection } from "@/features/profile/components/profile-edit-section";
import type { ProfileViewModel } from "@/features/profile/types/profile.types";

type ProfileScreenProps = {
  profile: ProfileViewModel;
};

export function ProfileScreen({ profile }: ProfileScreenProps) {
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
        <CardContent>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/settings">Settings</Link>
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
