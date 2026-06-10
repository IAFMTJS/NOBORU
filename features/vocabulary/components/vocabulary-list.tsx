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
import type { JlptLevel } from "@/lib/content/types";
import { getJlptContentHub } from "@/lib/learning/jlpt-content.constants";
import type { VocabularyListViewModel } from "@/features/vocabulary/types/vocabulary.types";

type VocabularyListProps = {
  list: VocabularyListViewModel;
  jlptLevel?: JlptLevel;
};

export function VocabularyList({ list, jlptLevel = "n5" }: VocabularyListProps) {
  const hub = getJlptContentHub(jlptLevel);
  const levelLabel = jlptLevel.toUpperCase();

  return (
    <PageContainer>
      <ScreenHeader
        title={hub.vocabularyTitle}
        subtitle={hub.vocabularySubtitle}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/learn/${hub.regionSlug}`}>Back</Link>
          </Button>
        }
      />

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            {list.learnedCount} of {list.totalCount} {levelLabel} words learned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar
            value={list.progressPercent}
            label="Vocabulary mastery"
            showValue
          />
        </CardContent>
      </Card>

      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">Word List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {list.entries.map((entry) => (
            <Link key={entry.id} href={`/learn/vocabulary/${entry.id}`}>
              <ListRow
                primary={entry.kanji ? `${entry.kana} · ${entry.kanji}` : entry.kana}
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
