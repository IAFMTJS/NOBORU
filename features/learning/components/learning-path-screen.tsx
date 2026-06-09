"use client";

import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListRow } from "@/components/ui/list-row";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { LearningPathViewModel } from "@/features/learning/types/lesson.types";

type LearningPathScreenProps = {
  path: LearningPathViewModel;
};

export function LearningPathScreen({ path }: LearningPathScreenProps) {
  return (
    <PageContainer>
      <ScreenHeader
        title="Learn"
        subtitle="Your trail, units, and lessons."
      />

      {path.nextLesson && path.nextLessonHref ? (
        <Card className="border-primary/30 shadow-elevation-1">
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>{path.nextLesson.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href={path.nextLessonHref}>Start Lesson</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        {path.regions.map((region) => (
          <Card key={region.id} className="shadow-elevation-1">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{region.name}</CardTitle>
                  <CardDescription>{region.description}</CardDescription>
                </div>
                <Badge variant="secondary">
                  {region.completedCount}/{region.lessonCount}
                </Badge>
              </div>
              <ProgressBar
                value={region.progressPercent}
                label="Region progress"
                showValue
              />
            </CardHeader>
            <CardContent className="space-y-2">
              {region.units.map((unit) => (
                <Link key={unit.id} href={`/learn/${region.slug}`}>
                  <ListRow
                    primary={unit.name}
                    secondary={`${unit.completedCount}/${unit.lessonCount} lessons complete`}
                    trailing={
                      <Badge variant="outline">
                        {unit.completedCount === unit.lessonCount &&
                        unit.lessonCount > 0
                          ? "Complete"
                          : "Open"}
                      </Badge>
                    }
                  />
                </Link>
              ))}
              <Button variant="outline" className="mt-2 w-full" asChild>
                <Link href={`/learn/${region.slug}`}>Open Region</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
