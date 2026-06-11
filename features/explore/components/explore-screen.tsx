import Link from "next/link";

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

export function ExploreScreen() {
  return (
    <PageContainer>
      <ScreenHeader
        title="Explore"
        subtitle="Trials, challenges, and fellow climbers"
      />

      <Card className="border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card shadow-elevation-1">
        <CardHeader>
          <CardTitle>Trials</CardTitle>
          <CardDescription>
            Timed regional challenges and boss proving grounds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" asChild>
            <Link href="/trials">Enter Trials</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Mini-Games</CardTitle>
          <CardDescription>
            Sprint drills and seasonal events arrive on a later stretch of the trail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/games">Preview Games Hub</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Community</CardTitle>
          <CardDescription>
            Leagues and social features are still climbing toward launch.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/community">Community Preview</Link>
          </Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/feedback">Share beta feedback</Link>
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
