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
import type { ReadingHubViewModel } from "@/features/reading/types/reading.types";

type ReadingHubProps = {
  hub: ReadingHubViewModel;
  jlptLevel?: JlptLevel;
};

export function ReadingHub({ hub, jlptLevel = "n5" }: ReadingHubProps) {
  const contentHub = getJlptContentHub(jlptLevel);
  const tokens = CONTENT_HUB_TOKENS.reading;

  return (
    <IllustratedScreen scrim="minimal">
    <PageContainer>
      <ScreenHeader
        variant="story"
        title={contentHub.readingTitle}
        subtitle={contentHub.readingSubtitle}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href={regionTrailHref(contentHub.regionSlug)}>Back</Link>
          </Button>
        }
      />

      <ContentHubBanner
        variant="reading"
        title={contentHub.readingTitle}
        subtitle={`${hub.completedCount} of ${hub.totalCount} readings on your trail`}
      />

      <JlptLevelPills basePath="/learn/reading" activeLevel={jlptLevel} />

      <GlassPanel className={cn("space-y-4 p-4", tokens.progressCardBorder)}>
        <div className="space-y-1">
          <h2 className="text-heading-6 font-semibold">Your Progress</h2>
          <p className="text-body-sm text-muted-foreground">
            {hub.completedCount} of {hub.totalCount} readings complete
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
            Stories
          </StoryTitle>
          <p className="text-caption text-muted-foreground">
            Read short passages and answer questions.
          </p>
        </div>
        <div className="space-y-2">
          {hub.stories.map((story) => (
            <Link
              key={story.id}
              href={`/learn/reading/stories/${story.slug}`}
              className="focus-ring block rounded-card"
            >
              <ListRow
                leading={<ContentHubLeading variant="reading" glyph="読" />}
                primary={story.title}
                secondary={story.summary ?? `${story.estimatedReadTime} min read`}
                trailing={
                  story.completed ? (
                    <Badge variant="secondary">{story.score}%</Badge>
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
            Dialogs
          </StoryTitle>
          <p className="text-caption text-muted-foreground">
            Practice conversations with guided choices.
          </p>
        </div>
        <div className="space-y-2">
          {hub.dialogues.map((dialogue) => (
            <Link
              key={dialogue.id}
              href={`/learn/reading/dialogs/${dialogue.slug}`}
              className="focus-ring block rounded-card"
            >
              <ListRow
                leading={<ContentHubLeading variant="reading" glyph="話" />}
                primary={dialogue.title}
                secondary={dialogue.description ?? "Conversation practice"}
                trailing={
                  dialogue.completed ? (
                    <Badge variant="secondary">{dialogue.score}%</Badge>
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
