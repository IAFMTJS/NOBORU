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
import type { VocabularyListViewModel } from "@/features/vocabulary/types/vocabulary.types";
import { YamaTrainingPresence } from "@/features/yama/components/yama-training-presence";

function vocabularyLeadingGlyph(entry: { kana: string; kanji: string | null }) {
  return entry.kanji?.[0] ?? entry.kana[0] ?? "語";
}

type VocabularyListProps = {
  list: VocabularyListViewModel;
  jlptLevel?: JlptLevel;
};

export function VocabularyList({ list, jlptLevel = "n5" }: VocabularyListProps) {
  const hub = getJlptContentHub(jlptLevel);
  const levelLabel = jlptLevel.toUpperCase();
  const tokens = CONTENT_HUB_TOKENS.vocabulary;

  return (
    <IllustratedScreen scrim="minimal">
    <PageContainer>
      <ScreenHeader
        variant="story"
        title={hub.vocabularyTitle}
        subtitle={hub.vocabularySubtitle}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href={regionTrailHref(hub.regionSlug)}>Back</Link>
          </Button>
        }
      />

      <ContentHubBanner
        variant="vocabulary"
        title={hub.vocabularyTitle}
        subtitle={`${list.learnedCount} of ${list.totalCount} ${levelLabel} words on your trail`}
      />

      <YamaTrainingPresence location="vocabulary_hall" />

      <JlptLevelPills basePath="/learn/vocabulary" activeLevel={jlptLevel} />

      <GlassPanel className={cn("space-y-4 p-4", tokens.progressCardBorder)}>
        <div className="space-y-1">
          <h2 className="text-heading-6 font-semibold">Your Progress</h2>
          <p className="text-body-sm text-muted-foreground">
            {list.learnedCount} of {list.totalCount} {levelLabel} words learned
          </p>
        </div>
        <ProgressBar
          value={list.progressPercent}
          label="Vocabulary mastery"
          showValue
          indicatorClassName={tokens.progressIndicator}
        />
      </GlassPanel>

      <GlassPanel className="space-y-3 p-4">
        <StoryTitle as="h2" className="text-sm">
          Word List
        </StoryTitle>
        <div className="space-y-2">
          {list.entries.map((entry) => (
            <Link
              key={entry.id}
              href={`/learn/vocabulary/${entry.id}`}
              className="focus-ring block rounded-card"
            >
              <ListRow
                leading={
                  <ContentHubLeading
                    variant="vocabulary"
                    glyph={vocabularyLeadingGlyph(entry)}
                  />
                }
                primary={
                  <span lang="ja" className="font-japanese">
                    {entry.kanji ? `${entry.kana} · ${entry.kanji}` : entry.kana}
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
        </div>
      </GlassPanel>
    </PageContainer>
    </IllustratedScreen>
  );
}
