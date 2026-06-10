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

export function GamesScreen() {
  return (
    <PageContainer>
      <ScreenHeader
        title="Games"
        subtitle="Educational challenges that reinforce mastery"
      />
      <Card className="border-primary/20 shadow-elevation-1">
        <CardHeader>
          <CardTitle>Trials</CardTitle>
          <CardDescription>
            Timed regional and N5 boss challenges using interactive recall drills.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" asChild>
            <Link href="/trials">Open Trials</Link>
          </Button>
        </CardContent>
      </Card>
      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Mini-Games</CardTitle>
          <CardDescription>
            Sprint modes and seasonal events arrive in a later phase.
          </CardDescription>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
