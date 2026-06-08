import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { MascotImage } from "@/components/media/mascot-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { HomeDashboardViewModel } from "@/features/learning/types/dashboard.types";

type HomeDashboardProps = {
  data: HomeDashboardViewModel;
};

export function HomeDashboard({ data }: HomeDashboardProps) {
  return (
    <PageContainer>
      <ScreenHeader
        subtitle={data.greeting}
        title="Dashboard"
        action={
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-secondary">
            <MascotImage alt="Yama" fill className="object-cover" />
          </div>
        }
      />

      <Card className="overflow-hidden border-primary/20 shadow-elevation-1">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardDescription>
                Current Region · {data.region.trail}
              </CardDescription>
              <CardTitle className="text-heading-4">{data.region.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{data.level.label}</Badge>
                <span className="text-body-sm text-muted-foreground">
                  {data.level.progressPercent}% to next milestone
                </span>
              </div>
            </div>
            <div className="relative h-20 w-20 shrink-0">
              <MascotImage
                alt="Yama climbing companion"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <ProgressBar
            value={data.level.progressPercent}
            label="Trail progress"
            showValue
          />
          <p className="text-body-sm text-muted-foreground">
            Elevation {data.elevation.current.toLocaleString()} · Next:{" "}
            {data.elevation.nextMilestone}
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/30 shadow-elevation-1">
        <CardHeader>
          <CardTitle>{data.dailyQuest.title}</CardTitle>
          <CardDescription>{data.dailyQuest.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressBar
            value={data.dailyQuest.current}
            max={data.dailyQuest.target}
            label="Progress"
            showValue
          />
          <Button className="w-full" asChild>
            <Link href="/review">
              Continue Review ({data.reviewQueueCount})
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
          <CardDescription>{data.upcomingLesson.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" asChild>
            <Link href={data.upcomingLesson.href}>Continue Learning</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {data.recentAchievements.map((achievement) => (
            <Badge key={achievement.id} variant="outline">
              {achievement.title}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
