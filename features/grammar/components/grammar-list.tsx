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
import type { GrammarListViewModel } from "@/features/grammar/types/grammar.types";

type GrammarListProps = {
  list: GrammarListViewModel;
  jlptLevel?: JlptLevel;
};

export function GrammarList({ list, jlptLevel = "n5" }: GrammarListProps) {
  const hub = getJlptContentHub(jlptLevel);
  const levelLabel = jlptLevel.toUpperCase();
  const tokens = CONTENT_HUB_TOKENS.grammar;

  return (
    <PageContainer>
      <ScreenHeader
        title={hub.grammarTitle}
        subtitle={hub.grammarSubtitle}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href={regionTrailHref(hub.regionSlug)}>Back</Link>
          </Button>
        }
      />

      <ContentHubBanner
        variant="grammar"
        title={hub.grammarTitle}
        subtitle={`${list.learnedCount} of ${list.totalCount} ${levelLabel} grammar points on your trail`}
      />

      <JlptLevelPills basePath="/learn/grammar" activeLevel={jlptLevel} />

      <Card className={tokens.progressCardBorder}>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            {list.learnedCount} of {list.totalCount} {levelLabel} grammar points learned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar
            value={list.progressPercent}
            label="Grammar mastery"
            showValue
            indicatorClassName={tokens.progressIndicator}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-heading-6">Grammar Points</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {list.entries.map((entry) => (
            <Link
              key={entry.id}
              href={`/learn/grammar/${entry.id}`}
              className="focus-ring block rounded-card"
            >
              <ListRow
                leading={
                  <ContentHubLeading
                    variant="grammar"
                    glyph={entry.title[0] ?? "文"}
                  />
                }
                primary={
                  <span lang="ja" className="font-japanese">
                    {entry.title}
                  </span>
                }
                secondary={entry.meaning}
                trailing={
                  entry.learned ? (
                    <Badge variant="secondary">Learned</Badge>
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
