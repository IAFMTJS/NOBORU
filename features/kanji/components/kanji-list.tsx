import Link from "next/link";

import { regionTrailHref } from "@/features/learning/utils/trail-navigation";

import { ContentHubBanner } from "@/components/ui/content-hub-banner";
import { JlptLevelPills } from "@/components/ui/jlpt-level-pills";
import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { KanjiListRow } from "@/features/kanji/components/kanji-list-row";
import type { JlptLevel } from "@/lib/content/types";
import { getJlptContentHub } from "@/lib/learning/jlpt-content.constants";
import { CONTENT_HUB_TOKENS } from "@/lib/design-system/content-hub-tokens";
import type { KanjiListViewModel } from "@/features/kanji/types/kanji.types";

type KanjiListProps = {
  list: KanjiListViewModel;
  jlptLevel?: JlptLevel;
};

export function KanjiList({ list, jlptLevel = "n5" }: KanjiListProps) {
  const hub = getJlptContentHub(jlptLevel);
  const levelLabel = jlptLevel.toUpperCase();
  const tokens = CONTENT_HUB_TOKENS.kanji;

  return (
    <PageContainer>
      <ScreenHeader
        title={hub.kanjiTitle}
        subtitle={hub.kanjiSubtitle}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href={regionTrailHref(hub.regionSlug)}>Back</Link>
          </Button>
        }
      />

      <ContentHubBanner
        variant="kanji"
        title={hub.kanjiTitle}
        subtitle={`${list.learnedCount} of ${list.totalCount} ${levelLabel} kanji on your trail`}
      />

      <JlptLevelPills basePath="/learn/kanji" activeLevel={jlptLevel} />

      <Card className={tokens.progressCardBorder}>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            {list.learnedCount} of {list.totalCount} {levelLabel} kanji learned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar
            value={list.progressPercent}
            label="Kanji mastery"
            showValue
            indicatorClassName={tokens.progressIndicator}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-heading-6">Kanji Catalog</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {list.entries.map((entry) => (
            <KanjiListRow
              key={entry.id}
              entry={entry}
              href={`/learn/kanji/${entry.id}`}
            />
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
