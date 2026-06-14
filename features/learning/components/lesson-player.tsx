"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { regionTrailHref } from "@/features/learning/utils/trail-navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { LessonLayout } from "@/components/layout/lesson-layout";
import { StudyAtmosphere } from "@/components/layout/study-atmosphere";
import { MotionDiv } from "@/components/motion/motion-div";
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
import { ProgressBar } from "@/components/ui/progress-bar";
import { PrimaryClimbButton } from "@/components/visual/primary-climb-button";
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
import { LessonTeachCard } from "@/features/learning/components/lesson-teach-card";
import { offlineClient } from "@/features/offline/services/offline-client.service";
import type {
  LessonReadingStep,
  LessonSessionViewModel,
  LessonStep,
} from "@/features/learning/types/lesson.types";
import { LessonFeedbackPrompt } from "@/features/feedback/components/lesson-feedback-prompt";
import {
  collectUpcomingLessonAudioUrls,
} from "@/lib/learning/lesson-audio-prefetch";
import { getJlptLevelForRegion } from "@/lib/learning/region-jlpt";
import { fadeInUp } from "@/lib/motion/presets";

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

function isScoredLessonStep(step: LessonStep): boolean {
  return (
    step.kind === "recall" ||
    step.kind === "matching" ||
    step.kind === "reading" ||
    step.kind === "application" ||
    step.kind === "fill_blank" ||
    step.kind === "word_bank" ||
    step.kind === "sentence_typed" ||
    step.kind === "story" ||
    step.kind === "dialogue" ||
    step.kind === "listening" ||
    step.kind === "listening_challenge"
  );
}

function ReadingCard({
  step,
  onAnswer,
}: {
  step: LessonReadingStep;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const { content } = step;

  return (
    <Card className="shadow-elevation-1">
      <CardHeader>
        <CardDescription>
          Reading · {step.index}/{step.total}
        </CardDescription>
        <CardTitle className="text-heading-5">{content.title}</CardTitle>
        <JapaneseText text={content.japaneseText} size="lg" />
      </CardHeader>
      <CardContent className="space-y-4">
        {content.romaji ? (
          <p className="text-body-sm text-muted-foreground">{content.romaji}</p>
        ) : null}
        {content.english ? (
          <p className="text-body-sm text-muted-foreground">{content.english}</p>
        ) : null}
        <p className="text-body font-medium">{content.question}</p>
        {content.options.map((option, index) => (
          <Button
            key={option}
            variant="outline"
            className="h-auto w-full justify-start whitespace-normal px-4 py-3 text-left"
            disabled={selected !== null}
            onClick={() => {
              setSelected(index);
              onAnswer(index === content.correctOptionIndex);
            }}
          >
            {option}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

export function LessonPlayer({ session, soundEnabled = true }: LessonPlayerProps) {
  const regionJlpt = getJlptLevelForRegion(session.regionSlug);
  const [stepIndex, setStepIndex] = useState(0);
  const [started, setStarted] = useState(session.progress === "completed");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recallCorrect, setRecallCorrect] = useState(0);
  const [recallTotal, setRecallTotal] = useState(0);
  const [recallAnswered, setRecallAnswered] = useState(false);
  const [embeddedComplete, setEmbeddedComplete] = useState(false);
  const [completedScore, setCompletedScore] = useState(session.score);
  const [elevationAward, setElevationAward] = useState<ElevationAwardViewModel | null>(
    null,
  );
  const [achievementUnlocks, setAchievementUnlocks] = useState<
    AchievementUnlockViewModel[]
  >([]);
  const [questCompletions, setQuestCompletions] = useState<
    QuestCompletionViewModel[]
  >([]);
  const [reviewItemsEnqueued, setReviewItemsEnqueued] = useState(0);
  const [lessonFailed, setLessonFailed] = useState(false);
  const [failedScore, setFailedScore] = useState(0);

  const checkStepCount = useMemo(
    () => session.steps.filter(isScoredLessonStep).length,
    [session.steps],
  );
  const isReviewSession = session.progress === "completed";

  const currentStep: LessonStep | undefined = session.steps[stepIndex];
  const progressPercent = Math.round(
    ((stepIndex + 1) / session.steps.length) * 100,
  );

  useEffect(() => {
    setRecallAnswered(false);
    setEmbeddedComplete(false);
  }, [stepIndex]);

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
      setAchievementUnlocks(result.achievements);
      setQuestCompletions(result.quests);
      setReviewItemsEnqueued(result.reviewItemsEnqueued);
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

  const handleRecallAnswer = useCallback((correct: boolean) => {
    setRecallTotal((current) => current + 1);
    if (correct) setRecallCorrect((current) => current + 1);
    setRecallAnswered(true);
  }, []);

  const handleRetry = useCallback(() => {
    setLessonFailed(false);
    setFailedScore(0);
    setRecallCorrect(0);
    setRecallTotal(0);
    setRecallAnswered(false);
    setEmbeddedComplete(false);
    setError(null);
    const firstDrillIndex = session.steps.findIndex(
      (step, index) => index > 0 && step.kind !== "intro",
    );
    setStepIndex(firstDrillIndex >= 0 ? firstDrillIndex : 1);
  }, [session.steps]);

  if (!currentStep) {
    return null;
  }

  if (lessonFailed) {
    return (
      <LessonLayout>
        <ScreenHeader
          title={session.title}
          subtitle={`${session.type} lesson · ${session.xpReward} XP`}
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link href={regionTrailHref(session.regionSlug)}>Exit</Link>
            </Button>
          }
        />
        <LessonFailScreen
          score={failedScore}
          passScore={session.passScore}
          regionSlug={session.regionSlug}
          onRetry={handleRetry}
        />
      </LessonLayout>
    );
  }

  const stickyFooter =
    currentStep.kind === "teach" || currentStep.kind === "knowledge_inventory" ? (
      <PrimaryClimbButton className="w-full" onClick={goNext}>
        Continue
      </PrimaryClimbButton>
    ) : currentStep.kind === "application" ? (
      <PrimaryClimbButton className="w-full" onClick={goNext} disabled={!recallAnswered}>
        Continue
      </PrimaryClimbButton>
    ) : currentStep.kind === "recall" ||
        currentStep.kind === "fill_blank" ||
        currentStep.kind === "word_bank" ||
        currentStep.kind === "sentence_typed" ||
        currentStep.kind === "matching" ||
        currentStep.kind === "reading" ? (
      <PrimaryClimbButton className="w-full" onClick={goNext} disabled={!recallAnswered}>
        Continue
      </PrimaryClimbButton>
    ) : currentStep.kind === "story" ||
        currentStep.kind === "dialogue" ||
        currentStep.kind === "listening" ||
        currentStep.kind === "listening_challenge" ? (
      <PrimaryClimbButton className="w-full" onClick={goNext} disabled={!embeddedComplete}>
        Continue
      </PrimaryClimbButton>
    ) : null;

  return (
    <LessonLayout footer={stickyFooter}>
      <ScreenHeader
        title={session.title}
        subtitle={`${session.type} lesson · ${session.xpReward} XP`}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href={regionTrailHref(session.regionSlug)}>Exit</Link>
          </Button>
        }
      />

      <ProgressBar value={progressPercent} label="Lesson progress" showValue />

      {error ? <p className="text-caption text-destructive">{error}</p> : null}

      <StudyAtmosphere>
      <MotionDiv
        key={stepIndex}
        {...fadeInUp}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
      {currentStep.kind === "intro" ? (
        <Card className="shadow-elevation-1">
          <CardHeader>
            <CardDescription className="capitalize">
              {currentStep.lessonType} lesson
            </CardDescription>
            <CardTitle className="text-heading-4">{currentStep.title}</CardTitle>
            {currentStep.description ? (
              <CardDescription>{currentStep.description}</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-4">
            <YamaPresence
              presence={yamaService.resolveLessonIntroPresence(stepIndex)}
              size="sm"
            />
            <p className="text-body-sm text-muted-foreground">
              {checkStepCount} checks · Pass {session.passScore}% ·{" "}
              {currentStep.xpReward} XP reward
            </p>
            {!isReviewSession ? (
              <p className="text-caption text-muted-foreground">
                You need at least {session.passScore}% to unlock the next trail node.
              </p>
            ) : null}
            {session.progress === "completed" ? (
              <Badge variant="secondary">Already completed · {session.score}%</Badge>
            ) : null}
            {!started ? (
              <Button className="w-full" loading={saving} onClick={() => void handleStart()}>
                {session.progress === "completed" ? "Review Lesson" : "Start Lesson"}
              </Button>
            ) : (
              <Button className="w-full" onClick={goNext}>
                Continue
              </Button>
            )}
          </CardContent>
        </Card>
      ) : null}

      {currentStep.kind === "teach" ? (
        <>
          <YamaPresence
            presence={yamaService.resolveTeachPresence(stepIndex)}
            size="sm"
            className="mb-2"
          />
          <LessonTeachCard step={currentStep} soundEnabled={soundEnabled} />
        </>
      ) : null}

      {currentStep.kind === "knowledge_inventory" ? (
        <>
          <KnowledgeInventoryCard step={currentStep} />
        </>
      ) : null}

      {currentStep.kind === "application" ? (
        <ApplicationDrill step={currentStep} onAnswer={handleRecallAnswer} />
      ) : null}

      {currentStep.kind === "recall" ? (
        <>
          {currentStep.phase === "consolidation" ? (
            <p className="text-caption text-muted-foreground">
              Final recall round · no hints
            </p>
          ) : null}
          {currentStep.mode === "typed" ? (
            <TypedRecallDrill step={currentStep} onAnswer={handleRecallAnswer} />
          ) : (
            <ChoiceRecallDrill step={currentStep} onAnswer={handleRecallAnswer} />
          )}
        </>
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
        <ReadingCard step={currentStep} onAnswer={handleRecallAnswer} />
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
            continueHref={regionTrailHref(session.regionSlug)}
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
            trailHref={regionTrailHref(session.regionSlug)}
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
      </StudyAtmosphere>
    </LessonLayout>
  );
}
