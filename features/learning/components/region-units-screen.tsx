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
import type { RegionPathViewModel } from "@/features/learning/types/lesson.types";

type RegionUnitsScreenProps = {
  region: RegionPathViewModel;
};

const PROGRESS_LABELS = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Complete",
} as const;

export function RegionUnitsScreen({ region }: RegionUnitsScreenProps) {
  return (
    <PageContainer>
      <ScreenHeader
        title={region.name}
        subtitle={region.description ?? "Region lessons"}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn">Back</Link>
          </Button>
        }
      />

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Region Progress</CardTitle>
          <CardDescription>
            {region.completedCount} of {region.lessonCount} lessons complete
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ProgressBar
            value={region.progressPercent}
            label="Completion"
            showValue
          />
          {region.slug === "foothills" ? (
            <Button variant="outline" className="w-full" asChild>
              <Link href="/learn/hiragana">Open Hiragana Chart</Link>
            </Button>
          ) : null}
          {region.slug === "forest-trail" ? (
            <Button variant="outline" className="w-full" asChild>
              <Link href="/learn/katakana">Open Katakana Chart</Link>
            </Button>
          ) : null}
          {region.slug === "mount-n5" ? (
            <div className="space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/learn/vocabulary">Open N5 Vocabulary</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/learn/grammar">Open N5 Grammar</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/learn/kanji">Open Kanji Academy</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/learn/reading">Open Reading</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/learn/listening">Open Listening</Link>
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {region.units.map((unit) => (
          <Card key={unit.id} className="shadow-elevation-1">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-heading-6">{unit.name}</CardTitle>
                  <CardDescription>{unit.description}</CardDescription>
                </div>
                <Badge variant="outline">
                  {unit.completedCount}/{unit.lessonCount}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {unit.lessons.map((lesson) => (
                <Link key={lesson.id} href={`/learn/lesson/${lesson.id}`}>
                  <ListRow
                    primary={lesson.title}
                    secondary={`${lesson.type} · ${lesson.xpReward} XP`}
                    trailing={
                      <Badge variant="outline">
                        {PROGRESS_LABELS[lesson.progress]}
                      </Badge>
                    }
                  />
                </Link>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
