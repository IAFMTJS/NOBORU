"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import { StudyAtmosphere } from "@/components/layout/study-atmosphere";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassPanel, PrimaryClimbButton, StoryTitle } from "@/components/visual";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ChoiceRecallDrill } from "@/features/learning/components/drills/choice-recall-drill";
import type { LessonRecallStep } from "@/features/learning/types/lesson.types";
import { dailyChallengeClientService } from "@/features/daily-challenges/services/daily-challenge-client.service";
import type { DailyChallengeSessionViewModel } from "@/features/daily-challenges/types/daily-challenge.types";
import { YamaCelebration } from "@/features/yama/components/yama-celebration";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import { yamaService } from "@/features/yama/services/yama.service";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

const PRIORITY_LABELS: Record<string, string> = {
  recently_learned: "Recent",
  weak: "Weak",
  forgotten: "Due",
  mastered_maintenance: "Maintain",
};

type DailyChallengePlayerProps = {
  session: DailyChallengeSessionViewModel;
};

function buildRecallOptions(
  item: DailyChallengeSessionViewModel["items"][number],
  allItems: DailyChallengeSessionViewModel["items"],
): string[] {
  const distractors = allItems
    .filter((entry) => entry.vocabularyId !== item.vocabularyId)
    .map((entry) => entry.meaning);
  const unique = Array.from(new Set(distractors.filter((value) => value !== item.meaning)));
  const pool = [item.meaning, ...unique.slice(0, 3)];
  while (pool.length < 4 && unique.length > pool.length - 1) {
    const next = unique[pool.length - 1];
    if (next && !pool.includes(next)) pool.push(next);
    else break;
  }
  return shuffle(pool);
}

export function DailyChallengePlayer({ session }: DailyChallengePlayerProps) {
  const sessionEventIdRef = useRef(crypto.randomUUID());
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [correctVocabularyIds, setCorrectVocabularyIds] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const celebrationPresence = useMemo(
    () => yamaService.resolveCelebration("lesson_complete"),
    [],
  );

  const current = session.items[index];
  const progressPercent =
    session.items.length === 0
      ? 100
      : Math.round(((index + (finished ? 1 : 0)) / session.items.length) * 100);

  const step = useMemo<LessonRecallStep | null>(() => {
    if (!current) return null;
    const options = buildRecallOptions(current, session.items);
    return {
      kind: "recall",
      mode: "choice",
      contentType: "vocabulary",
      prompt: "What does this word mean?",
      display: current.display,
      options,
      correctIndex: options.indexOf(current.meaning),
      phase: "consolidation",
      lifecycleStage: "maintained",
      index: index + 1,
      total: session.items.length,
    };
  }, [current, index, session.items]);

  async function finishSession(nextCorrectCount: number, nextCorrectIds: string[]) {
    setFinished(true);
    setSubmitting(true);
    setSubmitError(null);

    try {
      await dailyChallengeClientService.completeSession({
        correctCount: nextCorrectCount,
        totalCount: session.items.length,
        vocabularyIds: session.items.map((item) => item.vocabularyId),
        correctVocabularyIds: nextCorrectIds,
        clientEventId: sessionEventIdRef.current,
      });
    } catch (caught) {
      setSubmitError(
        caught instanceof Error ? caught.message : "Failed to save today's challenge.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (session.items.length === 0) {
    return (
      <StudyAtmosphere>
        <YamaEmptyState
          surface="review"
          title="No retention challenge today"
          description="Learn a few more words on the trail, then return for memory maintenance."
          actionHref="/learn"
          actionLabel="Continue climbing"
        />
      </StudyAtmosphere>
    );
  }

  if (finished) {
    const score = Math.round((correctCount / session.items.length) * 100);
    return (
      <StudyAtmosphere>
        <YamaCelebration presence={celebrationPresence} title="Retention complete">
          <p className="text-body-sm text-muted-foreground">
            You reinforced {correctCount} of {session.items.length} words today.
          </p>
        </YamaCelebration>
        <GlassPanel className="mt-4 space-y-3 p-4">
          <StoryTitle as="h2" className="text-base">
            Memory maintenance
          </StoryTitle>
          <p className="text-body-sm text-muted-foreground">
            Score: {score}% — this session focused on retention, not new progression.
          </p>
          {submitting ? (
            <p className="text-body-sm text-muted-foreground">Saving today&apos;s progress…</p>
          ) : null}
          {submitError ? (
            <p className="text-body-sm text-destructive">{submitError}</p>
          ) : null}
          <div className="flex flex-col gap-2">
            <PrimaryClimbButton asChild>
              <Link href="/review">Open review queue</Link>
            </PrimaryClimbButton>
            <Button variant="outline" asChild>
              <Link href="/camp">Return to camp</Link>
            </Button>
          </div>
        </GlassPanel>
      </StudyAtmosphere>
    );
  }

  if (!current || !step) return null;

  return (
    <StudyAtmosphere>
      <div className="space-y-4">
        <GlassPanel className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <StoryTitle as="h1" className="text-base">
              Daily retention
            </StoryTitle>
            <Badge variant="secondary">
              {PRIORITY_LABELS[current.priority] ?? current.priority}
            </Badge>
          </div>
          <p className="text-body-sm text-muted-foreground">
            Reinforce words you already know — memory maintenance, not new lessons.
          </p>
          <ProgressBar value={progressPercent} label="Challenge progress" showValue />
        </GlassPanel>

        <ChoiceRecallDrill
          key={current.vocabularyId}
          step={step}
          lifecycleStage="maintained"
          onAnswer={(correct) => {
            const nextCorrectCount = correctCount + (correct ? 1 : 0);
            const nextCorrectIds = correct
              ? [...correctVocabularyIds, current.vocabularyId]
              : correctVocabularyIds;

            if (current.reviewItemId) {
              void dailyChallengeClientService
                .submitReviewRating({
                  reviewItemId: current.reviewItemId,
                  correct,
                  clientEventId: `${sessionEventIdRef.current}:${current.vocabularyId}`,
                })
                .catch(() => undefined);
            }

            setCorrectCount(nextCorrectCount);
            setCorrectVocabularyIds(nextCorrectIds);

            if (index + 1 >= session.items.length) {
              void finishSession(nextCorrectCount, nextCorrectIds);
              return;
            }
            setIndex((value) => value + 1);
          }}
        />
      </div>
    </StudyAtmosphere>
  );
}
