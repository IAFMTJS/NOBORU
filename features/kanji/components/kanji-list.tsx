import { JlptLevelPills } from "@/components/ui/jlpt-level-pills";
import { GlassPanel, StoryTitle } from "@/components/visual";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StudyHubLayout } from "@/features/dojo/components/study-hub-layout";
import { KanjiListRow } from "@/features/kanji/components/kanji-list-row";
import type { JlptLevel } from "@/lib/content/types";
import { getJlptContentHub } from "@/lib/learning/jlpt-content.constants";
import { CONTENT_HUB_TOKENS } from "@/lib/design-system/content-hub-tokens";
import { cn } from "@/lib/utils";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
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
    <StudyHubLayout
      scene="study_atmosphere"
      title={hub.kanjiTitle}
      subtitle={`${list.learnedCount} of ${list.totalCount} ${levelLabel} kanji on your trail`}
    >
      <JlptLevelPills basePath="/learn/kanji" activeLevel={jlptLevel} />

      <GlassPanel className={cn("space-y-4 p-4", tokens.progressCardBorder)}>
        <div className="space-y-1">
          <h2 className="text-heading-6 font-semibold">Your Progress</h2>
          <p className="text-body-sm text-muted-foreground">
            {list.learnedCount} of {list.totalCount} {levelLabel} kanji learned
          </p>
        </div>
        <ProgressBar
          value={list.progressPercent}
          label="Kanji mastery"
          showValue
          indicatorClassName={tokens.progressIndicator}
        />
      </GlassPanel>

      <GlassPanel className="space-y-3 p-4">
        <StoryTitle as="h2" className="text-sm">
          Kanji Catalog
        </StoryTitle>
        <div className="space-y-2">
          {list.entries.length === 0 ? (
            <YamaEmptyState
              surface="generic"
              title="Kanji stones await discovery"
              description="Characters will appear on the grounds shelf as content unlocks."
            />
          ) : (
            list.entries.map((entry) => (
              <KanjiListRow
                key={entry.id}
                entry={entry}
                href={`/learn/kanji/${entry.id}`}
              />
            ))
          )}
        </div>
      </GlassPanel>
    </StudyHubLayout>
  );
}
