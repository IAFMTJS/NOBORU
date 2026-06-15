import Link from "next/link";

import { JlptLevelPills } from "@/components/ui/jlpt-level-pills";
import { GlassPanel, StoryTitle } from "@/components/visual";
import { StudyShelfRow } from "@/features/dojo/components/study-shelf-row";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StudyHubLayout } from "@/features/dojo/components/study-hub-layout";
import type { JlptLevel } from "@/lib/content/types";
import { getJlptContentHub } from "@/lib/learning/jlpt-content.constants";
import { CONTENT_HUB_TOKENS } from "@/lib/design-system/content-hub-tokens";
import { cn } from "@/lib/utils";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import type { GrammarListViewModel } from "@/features/grammar/types/grammar.types";
import { YamaTrainingPresence } from "@/features/yama/components/yama-training-presence";

type GrammarListProps = {
  list: GrammarListViewModel;
  jlptLevel?: JlptLevel;
};

export function GrammarList({ list, jlptLevel = "n5" }: GrammarListProps) {
  const hub = getJlptContentHub(jlptLevel);
  const levelLabel = jlptLevel.toUpperCase();
  const tokens = CONTENT_HUB_TOKENS.grammar;

  return (
    <StudyHubLayout
      scene="study_atmosphere"
      title={hub.grammarTitle}
      subtitle={`${list.learnedCount} of ${list.totalCount} ${levelLabel} grammar points on your trail`}
    >
      <YamaTrainingPresence location="grammar_shrine" />

      <JlptLevelPills basePath="/learn/grammar" activeLevel={jlptLevel} />

      <GlassPanel className={cn("space-y-4 p-4", tokens.progressCardBorder)}>
        <div className="space-y-1">
          <h2 className="text-heading-6 font-semibold">Your Progress</h2>
          <p className="text-body-sm text-muted-foreground">
            {list.learnedCount} of {list.totalCount} {levelLabel} grammar points learned
          </p>
        </div>
        <ProgressBar
          value={list.progressPercent}
          label="Grammar mastery"
          showValue
          indicatorClassName={tokens.progressIndicator}
        />
      </GlassPanel>

      <GlassPanel className="space-y-3 p-4">
        <StoryTitle as="h2" className="text-sm">
          Shrine panels
        </StoryTitle>
        <div className="space-y-2">
          {list.entries.length === 0 ? (
            <YamaEmptyState
              surface="generic"
              title="Grammar panels await discovery"
              description="Shrine panels will appear as grammar content unlocks on your trail."
            />
          ) : (
            list.entries.map((entry) => (
              <StudyShelfRow
                key={entry.id}
                href={`/learn/grammar/${entry.id}`}
                variant="grammar"
                glyph={entry.title[0] ?? "文"}
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
