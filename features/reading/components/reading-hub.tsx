import Link from "next/link";

import { regionTrailHref } from "@/features/learning/utils/trail-navigation";

import { ContentHubBanner } from "@/components/ui/content-hub-banner";
import { ContentHubLeading } from "@/components/ui/content-hub-leading";
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
import { CONTENT_HUB_TOKENS } from "@/lib/design-system/content-hub-tokens";
import type { ReadingHubViewModel } from "@/features/reading/types/reading.types";

type ReadingHubProps = {
  hub: ReadingHubViewModel;
  jlptLevel?: JlptLevel;
};

export function ReadingHub({ hub, jlptLevel = "n5" }: ReadingHubProps) {
  const contentHub = getJlptContentHub(jlptLevel);
  const tokens = CONTENT_HUB_TOKENS.reading;

  return (
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

      <Card className={tokens.progressCardBorder}>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            {hub.completedCount} of {hub.totalCount} readings complete
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar
            value={hub.progressPercent}
            label="Reading comprehension"
            showValue
            indicatorClassName={tokens.progressIndicator}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-heading-6">Stories</CardTitle>
          <CardDescription>Read short passages and answer questions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-heading-6">Dialogs</CardTitle>
          <CardDescription>Practice conversations with guided choices.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
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
        </CardContent>
      </Card>
    </PageContainer>
  );
}
