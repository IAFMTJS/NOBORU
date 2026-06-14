import Link from "next/link";

import { regionTrailHref } from "@/features/learning/utils/trail-navigation";

import { ContentHubBanner } from "@/components/ui/content-hub-banner";
import { ContentHubLeading } from "@/components/ui/content-hub-leading";
import { JlptLevelPills } from "@/components/ui/jlpt-level-pills";
import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { GlassPanel, IllustratedScreen, StoryTitle } from "@/components/visual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListRow } from "@/components/ui/list-row";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { JlptLevel } from "@/lib/content/types";
import { getJlptContentHub } from "@/lib/learning/jlpt-content.constants";
import { CONTENT_HUB_TOKENS } from "@/lib/design-system/content-hub-tokens";
import { cn } from "@/lib/utils";
import type { ListeningHubViewModel } from "@/features/listening/types/listening.types";
import { YamaTrainingPresence } from "@/features/yama/components/yama-training-presence";

type ListeningHubProps = {
  hub: ListeningHubViewModel;
  jlptLevel?: JlptLevel;
};

export function ListeningHub({ hub, jlptLevel = "n5" }: ListeningHubProps) {
  const contentHub = getJlptContentHub(jlptLevel);
  const tokens = CONTENT_HUB_TOKENS.listening;

  return (
    <IllustratedScreen scrim="minimal">
    <PageContainer>
      <ScreenHeader
        variant="story"
        title={contentHub.listeningTitle}
        subtitle={contentHub.listeningSubtitle}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href={regionTrailHref(contentHub.regionSlug)}>Back</Link>
          </Button>
        }
      />

      <ContentHubBanner
        variant="listening"
        title={contentHub.listeningTitle}
        subtitle={`${hub.completedCount} of ${hub.totalCount} listening activities on your trail`}
      />

      <YamaTrainingPresence location="listening_pavilion" />

      <JlptLevelPills basePath="/learn/listening" activeLevel={jlptLevel} />

      <GlassPanel className={cn("space-y-4 p-4", tokens.progressCardBorder)}>
        <div className="space-y-1">
          <h2 className="text-heading-6 font-semibold">Your Progress</h2>
          <p className="text-body-sm text-muted-foreground">
            {hub.completedCount} of {hub.totalCount} listening activities complete
          </p>
        </div>
        <ProgressBar
          value={hub.progressPercent}
          label="Listening comprehension"
          showValue
          indicatorClassName={tokens.progressIndicator}
        />
      </GlassPanel>

      <GlassPanel className="space-y-3 p-4">
        <div className="space-y-0.5">
          <StoryTitle as="h2" className="text-sm">
            Audio Lessons
          </StoryTitle>
          <p className="text-caption text-muted-foreground">
            Listen to a phrase and answer one question.
          </p>
        </div>
        <div className="space-y-2">
          {hub.exercises.map((exercise) => (
            <Link
              key={exercise.id}
              href={`/learn/listening/exercises/${exercise.slug}`}
              className="focus-ring block rounded-card"
            >
              <ListRow
                leading={<ContentHubLeading variant="listening" glyph="聴" />}
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
        </div>
      </GlassPanel>

      <GlassPanel className="space-y-3 p-4">
        <div className="space-y-0.5">
          <StoryTitle as="h2" className="text-sm">
            Listening Challenges
          </StoryTitle>
          <p className="text-caption text-muted-foreground">
            Complete several listening exercises in a row.
          </p>
        </div>
        <div className="space-y-2">
          {hub.challenges.map((challenge) => (
            <Link
              key={challenge.id}
              href={`/learn/listening/challenges/${challenge.slug}`}
              className="focus-ring block rounded-card"
            >
              <ListRow
                leading={<ContentHubLeading variant="listening" glyph="挑" />}
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
        </div>
      </GlassPanel>
    </PageContainer>
    </IllustratedScreen>
  );
}
