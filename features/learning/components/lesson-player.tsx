"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { MotionDiv } from "@/components/motion/motion-div";
import { PrimaryClimbButton } from "@/components/visual/primary-climb-button";
import { GlassPanel } from "@/components/visual";
import type { AchievementUnlockViewModel } from "@/features/achievements/types/achievement.types";
import { analyticsService } from "@/features/analytics/services/analytics.service";
import type { QuestCompletionViewModel } from "@/features/quests/types/quest.types";
import type { ElevationAwardViewModel } from "@/features/elevation/types/elevation.types";
import { yamaService } from "@/features/yama/services/yama.service";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import {
  calculateLessonScore,
  LESSON_EMBEDDED_STEP_PASS_THRESHOLD,
} from "@/features/learning/constants/lesson.constants";
import {
  LESSON_AUTO_ADVANCE_MS,
  LESSON_MAX_HEARTS,
  LESSON_WRONG_EXPLANATION_MS,
} from "@/features/learning/constants/lesson-ui.constants";
import {
  LessonDrillStep,
  LevelUpCeremony,
} from "@/features/learning/components/lesson-drill-loaders";
import { AudioPlayback } from "@/components/media/audio-playback";
import { TrailAnswerPad } from "@/components/visual/world/trail-answer-pad";
import { KnowledgeInventoryCard } from "@/features/learning/components/knowledge-inventory-card";
import { JapaneseText } from "@/features/learning/components/japanese-text";
import { LessonFailScreen } from "@/features/learning/components/lesson-fail-screen";
import {
  LessonHeader,
  LessonIntroPanel,
  LessonShell,
} from "@/features/learning/components/lesson";
import { LessonTeachCard } from "@/features/learning/components/lesson-teach-card";
import { offlineClient } from "@/features/offline/services/offline-client.service";
import type {
  LessonListeningRecallStep,
  LessonReadingStep,
  LessonSessionViewModel,
  LessonStep,
} from "@/features/learning/types/lesson.types";
import { LessonFeedbackPrompt } from "@/features/feedback/components/lesson-feedback-prompt";
import { collectUpcomingLessonAudioUrls } from "@/lib/learning/lesson-audio-prefetch";
import {
  buildFinalRemediationBatch,
  buildRemediationStep,
  getUnresolvedFailureIds,
  insertRemediationStep,
  type LessonFailureRecord,
} from "@/lib/learning/lesson-remediation.service";
import {
  getContentIdFromStep,
  resolveStepPhase,
} from "@/lib/learning/lesson-phase.utils";
import { getRecallAnswer } from "@/features/learning/utils/exercise-steps";
import { getJlptLevelForRegion } from "@/lib/learning/region-jlpt";
import { fadeInUp } from "@/lib/motion/presets";

import { lessonReturnJourneyHref } from "@/features/learning/utils/trail-navigation";

function EmbeddedPlayerSkeleton() {
  return (
    <div
      className="h-40 animate-pulse rounded-lg bg-muted motion-reduce:animate-none"
      aria-hidden
    />
  );
}

const StoryReader = dynamic(
  () =>
    import("@/features/reading/components/story-reader").then(
      (module) => module.StoryReader,
    ),
  { loading: () => <EmbeddedPlayerSkeleton /> },
);

const DialoguePlayer = dynamic(
  () =>
    import("@/features/reading/components/dialogue-player").then(
      (module) => module.DialoguePlayer,
    ),
  { loading: () => <EmbeddedPlayerSkeleton /> },
);

const ListeningExercisePlayer = dynamic(
  () =>
    import("@/features/listening/components/listening-exercise-player").then(
      (module) => module.ListeningExercisePlayer,
    ),
  { loading: () => <EmbeddedPlayerSkeleton /> },
);

const ListeningChallengePlayer = dynamic(
  () =>
    import("@/features/listening/components/listening-challenge-player").then(
      (module) => module.ListeningChallengePlayer,
    ),
  { loading: () => <EmbeddedPlayerSkeleton /> },
);

const AchievementUnlockFeedback = dynamic(
  () =>
    import("@/features/achievements/components/achievement-unlock-feedback").then(
      (module) => module.AchievementUnlockFeedback,
    ),
  { loading: () => null },
);

const QuestCompleteFeedback = dynamic(
  () =>
    import("@/features/quests/components/quest-complete-feedback").then(
      (module) => module.QuestCompleteFeedback,
    ),
  { loading: () => null },
);

const LessonCompletePanel = dynamic(
  () =>
    import("@/features/gamification/components/lesson-complete-panel").then(
      (module) => module.LessonCompletePanel,
    ),
  { loading: () => null },
);

const CheckpointShrine = dynamic(
  () =>
    import("@/features/gamification/components/checkpoint-shrine").then(
      (module) => module.CheckpointShrine,
    ),
  { loading: () => null },
);

type LessonPlayerProps = {
  session: LessonSessionViewModel;
  soundEnabled?: boolean;
};

function isAutoAdvanceDrillStep(step: LessonStep): boolean {
  return (
    step.kind === "recall" ||
    step.kind === "listening_recall" ||
    step.kind === "matching" ||
    step.kind === "reading" ||
    step.kind === "application" ||
    step.kind === "fill_blank" ||
    step.kind === "word_bank" ||
    step.kind === "sentence_typed"
  );
}

function ListeningRecallDrill({
  step,
  onAnswer,
  disabled = false,
}: {
  step: LessonListeningRecallStep;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <p className="text-body text-muted-foreground">{step.prompt}</p>
      <div className="flex justify-center">
        <AudioPlayback
          audioUrl={step.audioUrl}
          japaneseText={step.display}
          label="Listen"
        />
      </div>
      <TrailAnswerPad
        options={step.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = index === step.correctIndex;
          const showResult = selected !== null;
          let state: "default" | "selected" | "correct" | "incorrect" | "disabled" = "default";
          if (showResult && isCorrect) state = "correct";
          else if (showResult && isSelected && !isCorrect) state = "incorrect";
          else if (disabled || selected !== null) state = "disabled";

          return {
            id: option,
            label: option,
            state,
            onSelect:
              disabled || selected !== null
                ? undefined
                : () => {
                    setSelected(index);
                    onAnswer(isCorrect);
                  },
          };
        })}
      />
    </div>
  );
}

function ReadingDrill({
  step,
  onAnswer,
}: {
  step: LessonReadingStep;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const { content } = step;

  return (
    <div className="flex min-h-[min(32rem,calc(100dvh-12rem))] flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center space-y-4 py-4">
        <JapaneseText text={content.japaneseText} size="hero" />
        {content.romaji ? (
          <p className="text-center text-body-sm text-muted-foreground">{content.romaji}</p>
        ) : null}
        <p className="text-center text-body font-medium">{content.question}</p>
      </div>
      <GlassPanel className="mt-auto space-y-2 p-3">
        {content.options.map((option, index) => (
          <button
            key={option}
            type="button"
            disabled={selected !== null}
            onClick={() => {
              setSelected(index);
              onAnswer(index === content.correctOptionIndex);
            }}
            className="focus-ring w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-left text-body-sm transition-colors hover:border-trail-glow/40"
          >
            {option}
          </button>
        ))}
      </GlassPanel>
    </div>
  );
}

export function LessonPlayer({ session, soundEnabled = true }: LessonPlayerProps) {
  const router = useRouter();
  const regionJlpt = getJlptLevelForRegion(session.regionSlug);
  const [lessonCompleted, setLessonCompleted] = useState(session.progress === "completed");
  const journeyTrailHref = useMemo(
    () =>
      lessonReturnJourneyHref(session, {
        regionUnlocked: lessonCompleted && Boolean(session.unlocksRegionSlug),
      }),
    [session, lessonCompleted],
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [lessonSteps, setLessonSteps] = useState<LessonStep[]>(session.steps);
  const [failureTracker, setFailureTracker] = useState<Map<string, LessonFailureRecord>>(
    () => new Map(),
  );
  const [started, setStarted] = useState(session.progress === "completed");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recallCorrect, setRecallCorrect] = useState(0);
  const [recallTotal, setRecallTotal] = useState(0);
  const [embeddedComplete, setEmbeddedComplete] = useState(false);
  const [completedScore, setCompletedScore] = useState(session.score);
  const [elevationAward, setElevationAward] = useState<ElevationAwardViewModel | null>(null);
  const [achievementUnlocks, setAchievementUnlocks] = useState<AchievementUnlockViewModel[]>(
    [],
  );
  const [questCompletions, setQuestCompletions] = useState<QuestCompletionViewModel[]>([]);
  const [reviewItemsEnqueued, setReviewItemsEnqueued] = useState(0);
  const [lessonFailed, setLessonFailed] = useState(false);
  const [failedScore, setFailedScore] = useState(0);
  const [heartsRemaining, setHeartsRemaining] = useState(LESSON_MAX_HEARTS);
  const [streakCount, setStreakCount] = useState(0);
  const [showLevelUpCeremony, setShowLevelUpCeremony] = useState(false);

  const advanceTimerRef = useRef<number | null>(null);

  const isReviewSession = session.progress === "completed";
  const currentStep: LessonStep | undefined = lessonSteps[stepIndex];
  const currentPhase = currentStep ? resolveStepPhase(currentStep) : null;

  const contentById = session.contentById ?? {};
  const allAnswers = useMemo(
    () => Object.values(contentById).map(getRecallAnswer).filter(Boolean),
    [contentById],
  );
  const allSurfaces = useMemo(
    () =>
      Object.values(contentById).map((content) => {
        switch (content.type) {
          case "vocabulary":
            return content.kanji ?? content.kana;
          case "kanji":
          case "hiragana":
          case "katakana":
            return content.character;
          case "grammar":
            return content.title;
          default:
            return "";
        }
      }),
    [contentById],
  );

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    setEmbeddedComplete(false);
    clearAdvanceTimer();
  }, [stepIndex, clearAdvanceTimer]);

  useEffect(() => clearAdvanceTimer, [clearAdvanceTimer]);

  useEffect(() => {
    const urls = collectUpcomingLessonAudioUrls(lessonSteps, stepIndex, 2);
    if (urls.length === 0) return;

    const timeoutId = window.setTimeout(() => {
      void offlineClient.prefetchAudioBatch(urls);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [lessonSteps, stepIndex]);

  const handleStart = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      await offlineClient.startLesson(session.lessonId);
      setStarted(true);
      void analyticsService.track({
        name: "lesson_started",
        properties: {
          lessonId: session.lessonId,
          regionSlug: session.regionSlug,
          lessonType: session.type,
        },
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to start lesson.");
    } finally {
      setSaving(false);
    }
  }, [session.lessonId, session.regionSlug, session.type]);

  const handleComplete = useCallback(async (score: number) => {
    setSaving(true);
    setError(null);
    setCompletedScore(score);
    try {
      const result = await offlineClient.completeLesson(session.lessonId, score);
      setCompletedScore(result.score);
      setElevationAward(result.elevation);
      if (result.elevation?.leveledUp) {
        setShowLevelUpCeremony(true);
      }
      setAchievementUnlocks(result.achievements);
      setQuestCompletions(result.quests);
      setReviewItemsEnqueued(result.reviewItemsEnqueued);
      setLessonCompleted(true);
      void analyticsService.track({
        name: "lesson_completed",
        properties: {
          lessonId: session.lessonId,
          regionSlug: session.regionSlug,
          score: result.score,
          queuedOffline: result.queuedOffline,
        },
      });
      if (result.queuedOffline) {
        setError("Saved offline. Progress will sync when you reconnect.");
      } else {
        router.refresh();
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save progress.");
    } finally {
      setSaving(false);
    }
  }, [router, session.lessonId, session.regionSlug]);

  const goNext = useCallback(() => {
    clearAdvanceTimer();
    const nextIndex = stepIndex + 1;
    const nextStep = lessonSteps[nextIndex];

    if (nextStep?.kind === "complete") {
      const score = calculateLessonScore(recallCorrect, recallTotal);
      const unresolved = getUnresolvedFailureIds(failureTracker);

      if (
        !isReviewSession &&
        score < session.passScore &&
        unresolved.length > 0 &&
        session.contentById
      ) {
        const remediationBatch = buildFinalRemediationBatch(
          unresolved,
          session.contentById,
          recallTotal,
        );
        if (remediationBatch.length > 0) {
          const completeIndex = lessonSteps.findIndex((step) => step.kind === "complete");
          const insertAt = completeIndex >= 0 ? completeIndex : lessonSteps.length;
          const updated = [
            ...lessonSteps.slice(0, insertAt),
            ...remediationBatch,
            ...lessonSteps.slice(insertAt),
          ];
          setLessonSteps(updated);
          setStepIndex(nextIndex);
          return;
        }
      }

      if (!isReviewSession && score < session.passScore) {
        setFailedScore(score);
        setLessonFailed(true);
        void analyticsService.track({
          name: "lesson_failed",
          properties: {
            lessonId: session.lessonId,
            regionSlug: session.regionSlug,
            score,
            passScore: session.passScore,
          },
        });
        return;
      }

      void handleComplete(score);
    }

    setStepIndex(nextIndex);
  }, [
    clearAdvanceTimer,
    failureTracker,
    recallCorrect,
    recallTotal,
    session.contentById,
    session.lessonId,
    session.passScore,
    session.regionSlug,
    lessonSteps,
    stepIndex,
    handleComplete,
    isReviewSession,
  ]);

  const scheduleAdvance = useCallback(
    (delayMs: number) => {
      clearAdvanceTimer();
      advanceTimerRef.current = window.setTimeout(() => {
        goNext();
      }, delayMs);
    },
    [clearAdvanceTimer, goNext],
  );

  const handleRecallAnswer = useCallback(
    (correct: boolean, answeredStep?: LessonStep) => {
      const step = answeredStep ?? currentStep;
      const nextTotal = recallTotal + 1;
      const nextCorrect = recallCorrect + (correct ? 1 : 0);

      setRecallTotal(nextTotal);

      if (step) {
        const contentId = getContentIdFromStep(step);
        if (contentId) {
          if (correct) {
            setFailureTracker((current) => {
              const existing = current.get(contentId);
              if (!existing || existing.remediated) return current;
              const next = new Map(current);
              next.set(contentId, { ...existing, remediated: true });
              return next;
            });
          } else {
            setFailureTracker((current) => {
              const existing = current.get(contentId);
              const failureCount = (existing?.failureCount ?? 0) + 1;
              const next = new Map(current);
              next.set(contentId, {
                contentId,
                failureCount,
                remediated: false,
              });
              return next;
            });

            const content = contentById[contentId];
            const failureCount =
              (failureTracker.get(contentId)?.failureCount ?? 0) + 1;
            if (content && allAnswers.length > 0) {
              const remediation = buildRemediationStep(
                content,
                allAnswers,
                allSurfaces,
                failureCount,
                nextTotal + 1,
                lessonSteps.length + 1,
              );
              if (remediation) {
                setLessonSteps((current) =>
                  insertRemediationStep(current, stepIndex, remediation),
                );
              }
            }
          }
        }
      }

      if (correct) {
        setRecallCorrect(nextCorrect);
        setStreakCount((current) => current + 1);
        scheduleAdvance(LESSON_AUTO_ADVANCE_MS);
        return;
      }

      setStreakCount(0);
      setHeartsRemaining((current) => {
        const next = current - 1;
        if (next <= 0) {
          const scoreAfterWrong = calculateLessonScore(nextCorrect, nextTotal);
          const scoreMeetsPassThreshold =
            isReviewSession || scoreAfterWrong >= session.passScore;
          scheduleAdvance(LESSON_WRONG_EXPLANATION_MS);
          if (!scoreMeetsPassThreshold) {
            window.setTimeout(() => {
              setFailedScore(scoreAfterWrong);
              setLessonFailed(true);
            }, LESSON_WRONG_EXPLANATION_MS);
          }
          return 0;
        }
        scheduleAdvance(LESSON_WRONG_EXPLANATION_MS);
        return next;
      });
    },
    [
      allAnswers,
      allSurfaces,
      contentById,
      currentStep,
      failureTracker,
      isReviewSession,
      lessonSteps.length,
      recallCorrect,
      recallTotal,
      scheduleAdvance,
      session.passScore,
      stepIndex,
    ],
  );

  const handleRetry = useCallback(() => {
    setLessonFailed(false);
    setFailedScore(0);
    setRecallCorrect(0);
    setRecallTotal(0);
    setEmbeddedComplete(false);
    setHeartsRemaining(LESSON_MAX_HEARTS);
    setStreakCount(0);
    setFailureTracker(new Map());
    setLessonSteps(session.steps);
    setError(null);
    const firstDrillIndex = lessonSteps.findIndex(
      (step, index) => index > 0 && step.kind !== "intro",
    );
    setStepIndex(firstDrillIndex >= 0 ? firstDrillIndex : 1);
  }, [lessonSteps, session.steps]);

  const showLessonHeader =
    currentStep?.kind !== "complete" && !lessonFailed;

  const stickyFooter = useMemo(() => {
    if (!currentStep || lessonFailed) return null;
    if (isAutoAdvanceDrillStep(currentStep)) return null;

    if (currentStep.kind === "teach" || currentStep.kind === "knowledge_inventory") {
      return (
        <PrimaryClimbButton className="w-full" onClick={goNext}>
          Continue
        </PrimaryClimbButton>
      );
    }

    if (
      currentStep.kind === "story" ||
      currentStep.kind === "dialogue" ||
      currentStep.kind === "listening" ||
      currentStep.kind === "listening_challenge"
    ) {
      return (
        <PrimaryClimbButton className="w-full" onClick={goNext} disabled={!embeddedComplete}>
          Continue
        </PrimaryClimbButton>
      );
    }

    if (currentStep.kind === "intro" && started) {
      return (
        <PrimaryClimbButton className="w-full" onClick={goNext}>
          Continue
        </PrimaryClimbButton>
      );
    }

    return null;
  }, [currentStep, embeddedComplete, goNext, lessonFailed, started]);

  if (!currentStep) {
    return null;
  }

  if (lessonFailed) {
    return (
      <LessonShell>
        <LessonFailScreen
          score={failedScore}
          passScore={session.passScore}
          trailHref={journeyTrailHref}
          onRetry={handleRetry}
        />
      </LessonShell>
    );
  }

  return (
    <>
      <LevelUpCeremony
        level={elevationAward?.currentLevel ?? 1}
        open={showLevelUpCeremony}
        onComplete={() => setShowLevelUpCeremony(false)}
      />
      <LessonShell
      header={
        showLessonHeader ? (
          <LessonHeader
            backHref={journeyTrailHref}
            stepIndex={stepIndex}
            totalSteps={lessonSteps.length}
            heartsRemaining={heartsRemaining}
            streakCount={streakCount}
            phaseSummary={session.phaseSummary}
            currentPhase={currentPhase}
          />
        ) : null
      }
      footer={stickyFooter ?? undefined}
    >
      {error ? <p className="text-caption text-destructive">{error}</p> : null}

      <MotionDiv
        key={stepIndex}
        {...fadeInUp}
        initial="initial"
        animate="animate"
        className="flex min-h-0 flex-1 flex-col"
      >
        {currentStep.kind === "intro" ? (
          started ? (
            <div className="flex flex-1 flex-col justify-center py-8">
              <YamaPresence
                presence={yamaService.resolveLessonIntroPresence(stepIndex)}
                size="md"
                layout="vertical"
                showMessage={false}
                className="items-center"
              />
            </div>
          ) : (
            <LessonIntroPanel
              title={currentStep.title}
              description={currentStep.description}
              lessonType={currentStep.lessonType}
              xpReward={currentStep.xpReward}
              isReview={isReviewSession}
              alreadyCompleted={session.progress === "completed"}
              loading={saving}
              onStart={() => void handleStart()}
            />
          )
        ) : null}

        {currentStep.kind === "teach" ? (
          <LessonTeachCard step={currentStep} soundEnabled={soundEnabled} />
        ) : null}

        {currentStep.kind === "knowledge_inventory" ? (
          <KnowledgeInventoryCard step={currentStep} />
        ) : null}

        {currentStep.kind === "application" ||
        currentStep.kind === "recall" ||
        currentStep.kind === "fill_blank" ||
        currentStep.kind === "word_bank" ||
        currentStep.kind === "sentence_typed" ||
        currentStep.kind === "matching" ? (
          <LessonDrillStep
            step={currentStep}
            onAnswer={(correct) => handleRecallAnswer(correct, currentStep)}
            soundEnabled={soundEnabled}
          />
        ) : null}

        {currentStep.kind === "listening_recall" ? (
          <ListeningRecallDrill
            step={currentStep}
            onAnswer={(correct) => handleRecallAnswer(correct, currentStep)}
          />
        ) : null}

        {currentStep.kind === "reading" ? (
          <ReadingDrill
            step={currentStep}
            onAnswer={(correct) => handleRecallAnswer(correct, currentStep)}
          />
        ) : null}

        {currentStep.kind === "story" ? (
          <StoryReader
            embedded
            story={{
              id: currentStep.content.id,
              title: currentStep.content.title,
              slug: currentStep.content.slug,
              summary: currentStep.content.summary,
              jlptLevel: regionJlpt,
              estimatedReadTime: currentStep.content.sections.length * 2,
              sections: currentStep.content.sections,
              questions: currentStep.content.questions,
              completed: false,
              score: 0,
            }}
            onComplete={(score) => {
              setRecallTotal(1);
              if (score >= LESSON_EMBEDDED_STEP_PASS_THRESHOLD) setRecallCorrect(1);
              setEmbeddedComplete(true);
            }}
          />
        ) : null}

        {currentStep.kind === "dialogue" ? (
          <DialoguePlayer
            embedded
            dialogue={{
              id: currentStep.content.id,
              title: currentStep.content.title,
              slug: currentStep.content.slug,
              description: currentStep.content.description,
              jlptLevel: regionJlpt,
              nodes: currentStep.content.nodes,
              completed: false,
              score: 0,
            }}
            onComplete={(score) => {
              setRecallTotal(1);
              if (score >= LESSON_EMBEDDED_STEP_PASS_THRESHOLD) setRecallCorrect(1);
              setEmbeddedComplete(true);
            }}
          />
        ) : null}

        {currentStep.kind === "listening" ? (
          <ListeningExercisePlayer
            embedded
            exercise={{
              ...currentStep.content,
              jlptLevel: regionJlpt,
              completed: false,
              score: 0,
            }}
            onComplete={(score) => {
              setRecallTotal(1);
              if (score >= LESSON_EMBEDDED_STEP_PASS_THRESHOLD) setRecallCorrect(1);
              setEmbeddedComplete(true);
            }}
          />
        ) : null}

        {currentStep.kind === "listening_challenge" ? (
          <ListeningChallengePlayer
            embedded
            challenge={{
              id: currentStep.content.id,
              title: currentStep.content.title,
              slug: currentStep.content.slug,
              description: currentStep.content.description,
              jlptLevel: regionJlpt,
              exercises: currentStep.content.exercises,
              completed: false,
              score: 0,
            }}
            onComplete={(score) => {
              setRecallTotal(1);
              if (score >= LESSON_EMBEDDED_STEP_PASS_THRESHOLD) setRecallCorrect(1);
              setEmbeddedComplete(true);
            }}
          />
        ) : null}

        {currentStep.kind === "complete" ? (
          session.type === "practice" ? (
            <CheckpointShrine
              xpReward={session.xpReward}
              gemsReward={elevationAward ? 5 : 0}
              itemsEarned={[{ label: "Lantern", icon: "🏮", quantity: 1 }]}
              continueHref={journeyTrailHref}
              footerSlot={
                <>
                  <AchievementUnlockFeedback achievements={achievementUnlocks} />
                  <QuestCompleteFeedback completions={questCompletions} />
                  <LessonFeedbackPrompt
                    lessonId={session.lessonId}
                    regionSlug={session.regionSlug}
                    lessonType={session.type}
                    score={completedScore}
                  />
                </>
              }
            />
          ) : (
            <LessonCompletePanel
              score={completedScore}
              passScore={session.passScore}
              xpReward={session.xpReward}
              regionSlug={session.regionSlug}
              elevationAward={elevationAward}
              nextLessonHref={session.nextLesson?.href ?? null}
              nextLessonTitle={session.nextLesson?.title ?? null}
              reviewItemsEnqueued={reviewItemsEnqueued}
              trailHref={journeyTrailHref}
              trailPreview={{
                regionSlug: session.regionSlug,
                nextNodeLabel: session.nextLesson?.title ?? null,
                unlocksRegionSlug: session.unlocksRegionSlug ?? null,
              }}
              achievementSlot={
                <AchievementUnlockFeedback achievements={achievementUnlocks} />
              }
              questSlot={<QuestCompleteFeedback completions={questCompletions} />}
              feedbackSlot={
                <LessonFeedbackPrompt
                  lessonId={session.lessonId}
                  regionSlug={session.regionSlug}
                  lessonType={session.type}
                  score={completedScore}
                />
              }
            />
          )
        ) : null}
      </MotionDiv>
    </LessonShell>
    </>
  );
}
