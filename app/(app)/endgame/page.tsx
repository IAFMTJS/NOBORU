import { redirect } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { AUTH_ROUTES } from "@/features/authentication/constants/auth.constants";
import { profileServerService } from "@/features/profile/services/profile-server.service";

export default async function EndgamePage() {
  const profile = await profileServerService.getProfileCore();
  if (!profile) redirect(AUTH_ROUTES.login);

  return (
    <PageContainer>
      <ScreenHeader
        title="Mastery Mountains"
        subtitle="Post-N1 endgame — infinite challenges and seasonal climbs"
      />
      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Master Summit</CardTitle>
          <CardDescription>
            Reach N1 and clear the final trial to unlock the celestial realm.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-body-sm text-muted-foreground">
            Mastery Mountains offer repeatable kanji hunts, community goals, and seasonal
            events. Educational progress remains authoritative — endgame rewards are
            cosmetic and prestige only.
          </p>
          <Button className="w-full" asChild>
            <Link href="/learn/world">View world map</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/explore">Seasonal events</Link>
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
