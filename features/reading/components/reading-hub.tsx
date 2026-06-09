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
import type { ReadingHubViewModel } from "@/features/reading/types/reading.types";

type ReadingHubProps = {
  hub: ReadingHubViewModel;
};

export function ReadingHub({ hub }: ReadingHubProps) {
  return (
    <PageContainer>
      <ScreenHeader
        title="Reading"
        subtitle="Stories and dialogs for N5 comprehension."
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn/mount-n5">Back</Link>
          </Button>
        }
      />

      <Card className="shadow-elevation-1">
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
          />
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">Stories</CardTitle>
          <CardDescription>Read short passages and answer questions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {hub.stories.map((story) => (
            <Link key={story.id} href={`/learn/reading/stories/${story.slug}`}>
              <ListRow
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

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">Dialogs</CardTitle>
          <CardDescription>Practice conversations with guided choices.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {hub.dialogues.map((dialogue) => (
            <Link key={dialogue.id} href={`/learn/reading/dialogs/${dialogue.slug}`}>
              <ListRow
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
