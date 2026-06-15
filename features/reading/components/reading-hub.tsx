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
import type { ReadingHubViewModel } from "@/features/reading/types/reading.types";

type ReadingHubProps = {
  hub: ReadingHubViewModel;
  jlptLevel?: JlptLevel;
};

export function ReadingHub({ hub, jlptLevel = "n5" }: ReadingHubProps) {
  const contentHub = getJlptContentHub(jlptLevel);
  const tokens = CONTENT_HUB_TOKENS.reading;

  return (
    <StudyHubLayout
      scene="study_atmosphere"
      title={contentHub.readingTitle}
      subtitle={`${hub.completedCount} of ${hub.totalCount} readings on your trail`}
    >
      <JlptLevelPills basePath="/learn/reading" activeLevel={jlptLevel} />

      <GlassPanel className={cn("space-y-4 p-4", tokens.progressCardBorder)}>
        <div className="space-y-1">
          <h2 className="text-heading-6 font-semibold">Library progress</h2>
          <p className="text-body-sm text-muted-foreground">
            {hub.completedCount} of {hub.totalCount} readings discovered
          </p>
        </div>
        <ProgressBar
          value={hub.progressPercent}
          label="Reading comprehension"
          showValue
          indicatorClassName={tokens.progressIndicator}
        />
      </GlassPanel>

      <GlassPanel className="space-y-3 p-4">
        <div className="space-y-0.5">
          <StoryTitle as="h2" className="text-sm">
            Story scrolls
          </StoryTitle>
          <p className="text-caption text-muted-foreground">
            Unroll passages from the library shelf.
          </p>
        </div>
        <div className="space-y-2">
          {hub.stories.length === 0 ? (
            <YamaEmptyState
              surface="search"
              title="Story scrolls await discovery"
              description="Passages will appear on this shelf as reading content unlocks on your trail."
            />
          ) : (
            hub.stories.map((story) => (
              <StudyShelfRow
                key={story.id}
                href={`/learn/reading/stories/${story.slug}`}
                variant="reading"
                glyph="読"
                primary={story.title}
                secondary={story.summary ?? `${story.estimatedReadTime} min read`}
                trailing={
                  story.completed ? (
                    <Badge variant="secondary">{story.score}%</Badge>
                  ) : (
                    <Badge variant="outline">Unread</Badge>
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
            Conversation paths
          </StoryTitle>
          <p className="text-caption text-muted-foreground">
            Meet travelers along the reading pavilion.
          </p>
        </div>
        <div className="space-y-2">
          {hub.dialogues.length === 0 ? (
            <YamaEmptyState
              surface="generic"
              title="Travelers await discovery"
              description="Conversation paths open when dialogue practice unlocks along the pavilion."
            />
          ) : (
            hub.dialogues.map((dialogue) => (
              <StudyShelfRow
                key={dialogue.id}
                href={`/learn/reading/dialogs/${dialogue.slug}`}
                variant="reading"
                glyph="話"
                primary={dialogue.title}
                secondary={dialogue.description ?? "Conversation practice"}
                trailing={
                  dialogue.completed ? (
                    <Badge variant="secondary">{dialogue.score}%</Badge>
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
