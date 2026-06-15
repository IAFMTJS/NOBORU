import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import { StudyShelfRow } from "@/features/dojo/components/study-shelf-row";
import { JlptLevelPills } from "@/components/ui/jlpt-level-pills";
import { GlassPanel, StoryTitle } from "@/components/visual";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StudyHubLayout } from "@/features/dojo/components/study-hub-layout";
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
    <StudyHubLayout
      scene="study_atmosphere"
      title={contentHub.listeningTitle}
      subtitle={`${hub.completedCount} of ${hub.totalCount} listening activities on your trail`}
    >
      <YamaTrainingPresence location="listening_pavilion" />

      <JlptLevelPills basePath="/learn/listening" activeLevel={jlptLevel} />

      <GlassPanel className={cn("space-y-4 p-4", tokens.progressCardBorder)}>
        <div className="space-y-1">
          <h2 className="text-heading-6 font-semibold">Pavilion progress</h2>
          <p className="text-body-sm text-muted-foreground">
            {hub.completedCount} of {hub.totalCount} lanterns lit along the path
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
            Lantern exercises
          </StoryTitle>
          <p className="text-caption text-muted-foreground">
            Listen beneath the pavilion lanterns.
          </p>
        </div>
        <div className="space-y-2">
          {hub.exercises.length === 0 ? (
            <YamaEmptyState
              surface="generic"
              title="Lantern exercises await discovery"
              description="Listening posts will light up as exercises unlock in this pavilion."
            />
          ) : (
            hub.exercises.map((exercise) => (
              <StudyShelfRow
                key={exercise.id}
                href={`/learn/listening/exercises/${exercise.slug}`}
                variant="listening"
                glyph="聴"
                primary={exercise.title}
                secondary={`${exercise.estimatedDuration} min`}
                trailing={
                  exercise.completed ? (
                    <Badge variant="secondary">{exercise.score}%</Badge>
                  ) : (
                    <Badge variant="outline">Unheard</Badge>
                  )
                }
              />
            ))
          )}
        </div>
      </GlassPanel>

      <GlassPanel className="space-y-3 p-4">
        <div className="space-y-0.5">
          <StoryTitle as="h2" className="text-sm">
            Challenge routes
          </StoryTitle>
          <p className="text-caption text-muted-foreground">
            Longer listening paths through the mist.
          </p>
        </div>
        <div className="space-y-2">
          {hub.challenges.length === 0 ? (
            <YamaEmptyState
              surface="trail"
              title="Challenge routes hidden in mist"
              description="Longer listening paths reveal themselves as you progress."
            />
          ) : (
            hub.challenges.map((challenge) => (
              <StudyShelfRow
                key={challenge.id}
                href={`/learn/listening/challenges/${challenge.slug}`}
                variant="listening"
                glyph="挑"
                primary={challenge.title}
                secondary={
                  challenge.description ??
                  `${challenge.exerciseCount} exercise${challenge.exerciseCount === 1 ? "" : "s"}`
                }
                trailing={
                  challenge.completed ? (
                    <Badge variant="secondary">{challenge.score}%</Badge>
                  ) : (
                    <Badge variant="outline">Awaiting</Badge>
                  )
                }
              />
            ))
          )}
        </div>
      </GlassPanel>
    </StudyHubLayout>
  );
}
