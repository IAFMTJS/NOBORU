import { JlptLevelPills } from "@/components/ui/jlpt-level-pills";
import { GlassPanel, StoryTitle } from "@/components/visual";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StudyHubLayout } from "@/features/dojo/components/study-hub-layout";
import { VocabularyListRow } from "@/features/vocabulary/components/vocabulary-list-row";
import type { JlptLevel } from "@/lib/content/types";
import { getJlptContentHub } from "@/lib/learning/jlpt-content.constants";
import { CONTENT_HUB_TOKENS } from "@/lib/design-system/content-hub-tokens";
import { cn } from "@/lib/utils";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import type { VocabularyListViewModel } from "@/features/vocabulary/types/vocabulary.types";
import { YamaTrainingPresence } from "@/features/yama/components/yama-training-presence";

type VocabularyListProps = {
  list: VocabularyListViewModel;
  jlptLevel?: JlptLevel;
};

export function VocabularyList({ list, jlptLevel = "n5" }: VocabularyListProps) {
  const hub = getJlptContentHub(jlptLevel);
  const levelLabel = jlptLevel.toUpperCase();
  const tokens = CONTENT_HUB_TOKENS.vocabulary;

  return (
    <StudyHubLayout
      scene="study_atmosphere"
      title={hub.vocabularyTitle}
      subtitle={`${list.learnedCount} of ${list.totalCount} ${levelLabel} words on your trail`}
    >
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

      <GlassPanel className="space-y-2 p-3">
        <h2 className="font-sans text-body font-semibold">Word shelf</h2>
        <p className="text-caption text-muted-foreground">
          Scroll the trail lexicon — tap a word to study it in place.
        </p>
        <div className="space-y-2">
          {list.entries.length === 0 ? (
            <YamaEmptyState
              surface="search"
              title="Word shelf awaits discovery"
              description="Vocabulary will appear here as lessons unlock along the trail."
            />
          ) : (
            list.entries.map((entry) => (
              <VocabularyListRow
                key={entry.id}
                entry={entry}
                href={`/learn/vocabulary/${entry.id}`}
              />
            ))
          )}
        </div>
      </GlassPanel>
    </StudyHubLayout>
  );
}
