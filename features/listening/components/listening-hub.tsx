import Link from "next/link";

import { ContentHubBanner } from "@/components/ui/content-hub-banner";
import { JlptLevelPills } from "@/components/ui/jlpt-level-pills";
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
import type { JlptLevel } from "@/lib/content/types";
import { getJlptContentHub } from "@/lib/learning/jlpt-content.constants";
import type { ListeningHubViewModel } from "@/features/listening/types/listening.types";

type ListeningHubProps = {
  hub: ListeningHubViewModel;
  jlptLevel?: JlptLevel;
};

export function ListeningHub({ hub, jlptLevel = "n5" }: ListeningHubProps) {
  const contentHub = getJlptContentHub(jlptLevel);

  return (
    <PageContainer>
      <ScreenHeader
        title={contentHub.listeningTitle}
        subtitle={contentHub.listeningSubtitle}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/learn/${contentHub.regionSlug}`}>Back</Link>
          </Button>
        }
      />

      <ContentHubBanner
        variant="listening"
        title={contentHub.listeningTitle}
        subtitle={`${hub.completedCount} of ${hub.totalCount} listening activities on your trail`}
      />

      <JlptLevelPills basePath="/learn/listening" activeLevel={jlptLevel} />

      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            {hub.completedCount} of {hub.totalCount} listening activities complete
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar
            value={hub.progressPercent}
            label="Listening comprehension"
            showValue
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-heading-6">Audio Lessons</CardTitle>
          <CardDescription>Listen to a phrase and answer one question.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {hub.exercises.map((exercise) => (
            <Link key={exercise.id} href={`/learn/listening/exercises/${exercise.slug}`}>
              <ListRow
                primary={exercise.title}
                secondary={`${exercise.estimatedDuration} min`}
                trailing={
                  exercise.completed ? (
                    <Badge variant="secondary">{exercise.score}%</Badge>
                  ) : (
                    <Badge variant="outline">New</Badge>
                  )
                }
              />
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-heading-6">Listening Challenges</CardTitle>
          <CardDescription>Complete several listening exercises in a row.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {hub.challenges.map((challenge) => (
            <Link key={challenge.id} href={`/learn/listening/challenges/${challenge.slug}`}>
              <ListRow
                primary={challenge.title}
                secondary={
                  challenge.description ??
                  `${challenge.exerciseCount} exercise${challenge.exerciseCount === 1 ? "" : "s"}`
                }
                trailing={
                  challenge.completed ? (
                    <Badge variant="secondary">{challenge.score}%</Badge>
                  ) : (
                    <Badge variant="outline">New</Badge>
                  )
                }
              />
            </Link>
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
