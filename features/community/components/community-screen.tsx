import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BETA_RELEASE } from "@/lib/release/beta.constants";
import { OFFICIAL_RELEASE } from "@/lib/release/release.constants";

export function CommunityScreen() {
  return (
    <PageContainer>
      <ScreenHeader
        title="Community"
        subtitle="Social features and challenges are still on the ascent."
      />

      <Card className="mb-4 border-primary/20 shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">
            {BETA_RELEASE.enabled ? "Beta climbers welcome" : OFFICIAL_RELEASE.label}
          </CardTitle>
          <CardDescription>
            Community leagues arrive soon. Share feedback on lessons, audio, and install
            flow while we keep improving the climb.
          </CardDescription>
        </CardHeader>
        <Button asChild>
          <Link href="/feedback">Share feedback</Link>
        </Button>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">Leagues (opt-in)</CardTitle>
          <CardDescription>
            Weekly leagues will be optional — no streak-loss pressure, just friendly
            climbing with fellow learners.
          </CardDescription>
        </CardHeader>
        <Button variant="outline" disabled className="w-full">
          Join league — coming soon
        </Button>
      </Card>
    </PageContainer>
  );
}
