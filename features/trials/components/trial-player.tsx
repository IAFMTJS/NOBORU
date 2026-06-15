"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { GlassPanel, StoryTitle } from "@/components/visual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StudyHubLayout } from "@/features/dojo/components/study-hub-layout";
import { analyticsService } from "@/features/analytics/services/analytics.service";
import { offlineClient } from "@/features/offline/services/offline-client.service";
import { TRIAL_GRADE_LABELS, TRIAL_KIND_LABELS } from "@/features/trials/constants/trial.constants";
import { TrialStepCard } from "@/features/trials/components/trial-step-card";
import { TrialTimer } from "@/features/trials/components/trial-timer";
import type {
  TrialCompleteViewModel,
  TrialSessionViewModel,
} from "@/features/trials/types/trial.types";
import { AchievementUnlockFeedback } from "@/features/achievements/components/achievement-unlock-feedback";
import { QuestCompleteFeedback } from "@/features/quests/components/quest-complete-feedback";
import { YamaCelebration } from "@/features/yama/components/yama-celebration";
import { yamaService } from "@/features/yama/services/yama.service";

type TrialPlayerProps = {
  session: TrialSessionViewModel;
};

export function TrialPlayer({ session }: TrialPlayerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startedAt] = useState(() => new Date().toISOString());
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrialCompleteViewModel | null>(null);
  const [timeExpired, setTimeExpired] = useState(false);

  useEffect(() => {
    void offlineClient.cacheTrialSession(session);
  }, [session]);

  const currentStep = session.steps[stepIndex];
  const progressPercent = Math.round(
    ((stepIndex + (finished ? 1 : 0)) / session.steps.length) * 100,
  );

  const finishTrial = useCallback(async () => {
    if (submitting || finished) return;
    setSubmitting(true);
    setError(null);
    setFinished(true);

    const elapsedSeconds = Math.max(
      1,
      Math.round((Date.now() - new Date(startedAt).getTime()) / 1000),
    );

    try {
      const payload = await offlineClient.completeTrial({
        slug: session.slug,
        correctCount,
        totalCount: session.steps.length,
        timeSpentSeconds: elapsedSeconds,
        startedAt,
      });
      setResult(payload.result);
      void analyticsService.track({
        name: "trial_completed",
        properties: {
          trialSlug: session.slug,
          passed: payload.result.passed,
          scorePercent: payload.result.scorePercent,
          grade: payload.result.grade,
        },
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to save trial results.");
    } finally {
      setSubmitting(false);
    }
  }, [correctCount, finished, session.slug, session.steps.length, startedAt, submitting]);

  const handleExpired = useCallback(() => {
    setTimeExpired(true);
    void finishTrial();
  }, [finishTrial]);

  function handleAnswer(correct: boolean) {
    if (finished) return;
    const nextCorrect = correctCount + (correct ? 1 : 0);
    setCorrectCount(nextCorrect);

    const nextIndex = stepIndex + 1;
    if (nextIndex >= session.steps.length) {
      void finishTrial();
      return;
    }
    setStepIndex(nextIndex);
  }

  const celebrationPresence = useMemo(() => {
    if (!result?.passed) {
      return yamaService.resolveDrillFeedback("incorrect");
    }
    if (result.grade === "legendary" || result.grade === "mastery") {
      return yamaService.resolveCelebration("trial_boss");
    }
    return yamaService.resolveCelebration(result.passed ? "trial_boss" : "lesson_complete");
  }, [result]);

  const headerAction = session.timeLimitSeconds ? (
    <TrialTimer
      timeLimitSeconds={session.timeLimitSeconds}
      running={started && !finished && !result}
      onExpired={handleExpired}
    />
  ) : null;

  if (result) {
    return (
      <StudyHubLayout
        scene="shrine_torii"
        title={session.title}
        subtitle={`${session.bossName} Trial`}
        backHref="/trials"
        backLabel="Trials"
      >
        <GlassPanel
          className={
            result.passed ? "space-y-4 border-success/30 p-4" : "space-y-4 border-destructive/30 p-4"
          }
        >
          <div className="space-y-1">
            <StoryTitle as="h2" className="text-lg">
              {result.passed ? "Trial Cleared" : "Trial Incomplete"}
            </StoryTitle>
            <p className="text-body-sm text-muted-foreground">
              Score {result.scorePercent}% · Pass mark {session.passScore}%
              {result.grade ? ` · ${TRIAL_GRADE_LABELS[result.grade]}` : ""}
            </p>
          </div>
          <YamaCelebration
            presence={celebrationPresence}
            title={result.passed ? "Summit foothold secured" : "Review and climb again"}
          />
          {result.epAwarded ? (
            <Badge variant="secondary">+{result.epAwarded} EP</Badge>
          ) : null}
          <AchievementUnlockFeedback achievements={result.achievements} />
          <QuestCompleteFeedback completions={result.quests} />
          {!result.passed && result.reviewRecommendations.length > 0 ? (
            <div className="space-y-2 rounded-lg border border-border p-3">
              <p className="text-body-sm font-medium">Review recommendations</p>
              <ul className="list-disc space-y-1 pl-5 text-body-sm text-muted-foreground">
                {result.reviewRecommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <Button className="w-full" asChild>
            <Link href="/trials">Back to Trials</Link>
          </Button>
          {!result.passed ? (
            <Button variant="outline" className="w-full" asChild>
              <Link href="/review">Open Review Queue</Link>
            </Button>
          ) : null}
        </GlassPanel>
      </StudyHubLayout>
    );
  }

  return (
    <StudyHubLayout
      scene="shrine_torii"
      title={session.title}
      subtitle={`${TRIAL_KIND_LABELS[session.kind]} · ${session.bossName}`}
      backHref="/trials"
      backLabel="Trials"
      action={headerAction}
    >
      <GlassPanel className="space-y-4 p-4">
        <p className="text-body-sm text-muted-foreground">{session.description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Pass {session.passScore}%</Badge>
          <Badge variant="outline">{session.steps.length} challenges</Badge>
          <Badge variant="outline">+{session.epReward} EP on first pass</Badge>
        </div>
        <ProgressBar value={progressPercent} label="Trial progress" showValue />
        {error ? (
          <p className="text-body-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {timeExpired ? (
          <p className="text-body-sm text-warning-foreground" role="status">
            Time expired. Saving your progress…
          </p>
        ) : null}
        {!started ? (
          <div className="space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-body font-medium">{session.bossName} awaits</p>
            <p className="text-body-sm text-muted-foreground">
              {session.steps.length} phases · Pass {session.passScore}% to clear the gate
            </p>
            <Button className="w-full" onClick={() => setStarted(true)}>
              Face the Boss
            </Button>
          </div>
        ) : currentStep ? (
          <>
            <p className="text-caption text-muted-foreground">
              Phase {stepIndex + 1} of {session.steps.length}
            </p>
            <TrialStepCard step={currentStep} onAnswer={handleAnswer} />
          </>
        ) : null}
      </GlassPanel>
    </StudyHubLayout>
  );
}
