"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
import { ApplicationDrill } from "@/features/learning/components/drills/application-drill";
import { ChoiceRecallDrill } from "@/features/learning/components/drills/choice-recall-drill";
import { FillBlankDrill } from "@/features/learning/components/drills/fill-blank-drill";
import { MatchingDrill } from "@/features/learning/components/drills/matching-drill";
import { TypedRecallDrill } from "@/features/learning/components/drills/typed-recall-drill";
import { TypedSentenceDrill } from "@/features/learning/components/drills/typed-sentence-drill";
import { WordBankDrill } from "@/features/learning/components/drills/word-bank-drill";
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
  LessonReadingStep,
  LessonSessionViewModel,
  LessonStep,
} from "@/features/learning/types/lesson.types";
import { LessonFeedbackPrompt } from "@/features/feedback/components/lesson-feedback-prompt";
import { collectUpcomingLessonAudioUrls } from "@/lib/learning/lesson-audio-prefetch";
import { getJlptLevelForRegion } from "@/lib/learning/region-jlpt";
import { LevelUpCeremony } from "@/components/visual/world/level-up-ceremony";
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
    step.kind === "matching" ||
    step.kind === "reading" ||
    step.kind === "application" ||
    step.kind === "fill_blank" ||
    step.kind === "word_bank" ||
    step.kind === "sentence_typed"
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
  const currentStep: LessonStep | undefined = session.steps[stepIndex];

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
    const urls = collectUpcomingLessonAudioUrls(session.steps, stepIndex, 2);
    if (urls.length === 0) return;

    const timeoutId = window.setTimeout(() => {
      void offlineClient.prefetchAudioBatch(urls);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [session.steps, stepIndex]);

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
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save progress.");
    } finally {
      setSaving(false);
    }
  }, [session.lessonId, session.regionSlug]);

  const goNext = useCallback(() => {
    clearAdvanceTimer();
    const nextIndex = stepIndex + 1;
    const nextStep = session.steps[nextIndex];

    if (nextStep?.kind === "complete") {
      const score = calculateLessonScore(recallCorrect, recallTotal);

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
    recallCorrect,
    recallTotal,
    session.lessonId,
    session.passScore,
    session.regionSlug,
    session.steps,
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
    (correct: boolean) => {
      const nextTotal = recallTotal + 1;
      const nextCorrect = recallCorrect + (correct ? 1 : 0);

      setRecallTotal(nextTotal);

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
          scheduleAdvance(LESSON_WRONG_EXPLANATION_MS);
          window.setTimeout(() => {
            setFailedScore(calculateLessonScore(nextCorrect, nextTotal));
            setLessonFailed(true);
          }, LESSON_WRONG_EXPLANATION_MS);
          return 0;
        }
        scheduleAdvance(LESSON_WRONG_EXPLANATION_MS);
        return next;
      });
    },
    [recallCorrect, recallTotal, scheduleAdvance],
  );

  const handleRetry = useCallback(() => {
    setLessonFailed(false);
    setFailedScore(0);
    setRecallCorrect(0);
    setRecallTotal(0);
    setEmbeddedComplete(false);
    setHeartsRemaining(LESSON_MAX_HEARTS);
    setStreakCount(0);
    setError(null);
    const firstDrillIndex = session.steps.findIndex(
      (step, index) => index > 0 && step.kind !== "intro",
    );
    setStepIndex(firstDrillIndex >= 0 ? firstDrillIndex : 1);
  }, [session.steps]);

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
            totalSteps={session.steps.length}
            heartsRemaining={heartsRemaining}
            streakCount={streakCount}
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

        {currentStep.kind === "application" ? (
          <ApplicationDrill step={currentStep} onAnswer={handleRecallAnswer} />
        ) : null}

        {currentStep.kind === "recall" ? (
          currentStep.mode === "typed" ? (
            <TypedRecallDrill step={currentStep} onAnswer={handleRecallAnswer} />
          ) : (
            <ChoiceRecallDrill
              step={currentStep}
              onAnswer={handleRecallAnswer}
              soundEnabled={soundEnabled}
            />
          )
        ) : null}

        {currentStep.kind === "fill_blank" ? (
          <FillBlankDrill step={currentStep} onAnswer={handleRecallAnswer} />
        ) : null}

        {currentStep.kind === "word_bank" ? (
          <WordBankDrill step={currentStep} onAnswer={handleRecallAnswer} />
        ) : null}

        {currentStep.kind === "sentence_typed" ? (
          <TypedSentenceDrill
            prompt={currentStep.prompt}
            display={currentStep.englishHint}
            acceptedAnswers={currentStep.acceptedAnswers}
            onAnswer={handleRecallAnswer}
          />
        ) : null}

        {currentStep.kind === "matching" ? (
          <MatchingDrill step={currentStep} onAnswer={handleRecallAnswer} />
        ) : null}

        {currentStep.kind === "reading" ? (
          <ReadingDrill step={currentStep} onAnswer={handleRecallAnswer} />
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
