"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/visual";
import { ProgressBar } from "@/components/ui/progress-bar";
import { LearningFailurePanel } from "@/features/learning/components/learning-failure-panel";
import { StudyHubLayout } from "@/features/dojo/components/study-hub-layout";
import type { StoryDetailViewModel } from "@/features/reading/types/reading.types";
import { offlineClient } from "@/features/offline/services/offline-client.service";
import { useMountOnceEffect } from "@/lib/hooks/use-mount-once-effect";

type StoryReaderProps = {
  story: StoryDetailViewModel;
  embedded?: boolean;
  onComplete?: (score: number) => void;
};

export function StoryReader({ story, embedded = false, onComplete }: StoryReaderProps) {
  const [phase, setPhase] = useState<"read" | "quiz" | "done">(
    story.completed ? "done" : "read",
  );
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(story.score);

  const currentSection = story.sections[sectionIndex];
  const currentQuestion = story.questions[questionIndex];
  const readProgress = useMemo(() => {
    if (story.sections.length === 0) return 100;
    return Math.round(((sectionIndex + 1) / story.sections.length) * 100);
  }, [sectionIndex, story.sections.length]);

  useMountOnceEffect(() => {
    void offlineClient.saveReadingProgress({
      contentType: "story",
      contentId: story.id,
      status: "in_progress",
      score: 0,
    });
  }, !story.completed && !embedded);

  async function saveProgress(finalScore: number) {
    if (embedded) {
      onComplete?.(finalScore);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const result = await offlineClient.saveReadingProgress({
        contentType: "story",
        contentId: story.id,
        status: "completed",
        score: finalScore,
      });
      if (!result.saved) {
        throw new Error("Unable to save progress.");
      }
      setScore(result.score);
      setPhase("done");
      onComplete?.(finalScore);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save progress.");
    } finally {
      setSaving(false);
    }
  }

  function finishQuiz(totalCorrect: number) {
    const finalScore =
      story.questions.length === 0
        ? 100
        : Math.round((totalCorrect / story.questions.length) * 100);
    void saveProgress(finalScore);
  }

  const content = (
    <div className="space-y-4">
      {error ? <p className="text-caption text-destructive">{error}</p> : null}

      {phase === "read" && currentSection ? (
        <>
          <ProgressBar value={readProgress} label="Story progress" showValue />
          <GlassPanel className="space-y-3 p-4 shadow-elevation-1">
            <p className="text-caption text-muted-foreground">
              Section {sectionIndex + 1} of {story.sections.length}
            </p>
            <p className="font-japanese text-heading-4 leading-relaxed" lang="ja">
              {currentSection.japaneseText}
            </p>
            {currentSection.tokenAnnotations?.some((annotation) => annotation.shouldHighlight) ? (
              <p className="text-caption text-trail-glow">
                Highlighted words are not in your active pool yet — they will be introduced in a
                future lesson.
              </p>
            ) : null}
            {currentSection.romaji ? (
              <p className="text-body-sm text-muted-foreground">{currentSection.romaji}</p>
            ) : null}
            {currentSection.english ? (
              <p className="text-body-sm text-muted-foreground">{currentSection.english}</p>
            ) : null}
          </GlassPanel>
          <Button
            className="w-full"
            onClick={() => {
              if (sectionIndex + 1 >= story.sections.length) {
                setPhase(story.questions.length > 0 ? "quiz" : "done");
                if (story.questions.length === 0) {
                  void saveProgress(100);
                }
                return;
              }
              setSectionIndex((current) => current + 1);
            }}
          >
            {sectionIndex + 1 >= story.sections.length ? "Start Questions" : "Continue"}
          </Button>
        </>
      ) : null}

      {phase === "quiz" && currentQuestion ? (
        <>
          <GlassPanel className="space-y-3 p-4 shadow-elevation-1">
            <p className="text-caption text-muted-foreground">
              Question {questionIndex + 1} of {story.questions.length}
            </p>
            <p className="text-heading-5 font-medium">{currentQuestion.question}</p>
            {currentQuestion.options.map((option, index) => (
              <Button
                key={option}
                variant="outline"
                className="h-auto w-full justify-start whitespace-normal px-4 py-3 text-left"
                disabled={answered}
                onClick={() => {
                  setAnswered(true);
                  setSelectedOption(option);
                  const isCorrect = index === currentQuestion.correctOptionIndex;
                  setAnswers((current) => [...current, isCorrect]);
                }}
              >
                {option}
              </Button>
            ))}
            {answered &&
            selectedOption &&
            selectedOption !==
              currentQuestion.options[currentQuestion.correctOptionIndex] ? (
              <LearningFailurePanel
                userAnswer={selectedOption}
                correctAnswer={
                  currentQuestion.options[currentQuestion.correctOptionIndex] ?? ""
                }
                seed={questionIndex}
              />
            ) : null}
          </GlassPanel>
          <Button
            className="w-full"
            disabled={!answered || saving}
            loading={saving}
            onClick={() => {
              if (questionIndex + 1 >= story.questions.length) {
                const totalCorrect = answers.filter(Boolean).length;
                finishQuiz(totalCorrect);
                return;
              }
              setQuestionIndex((current) => current + 1);
              setAnswered(false);
              setSelectedOption(null);
            }}
          >
            Continue
          </Button>
        </>
      ) : null}

      {phase === "done" && !embedded ? (
        <GlassPanel className="space-y-3 border-success/30 p-4 shadow-elevation-1">
          <p className="font-story text-story-title">Story Complete</p>
          <p className="text-caption text-muted-foreground">Score {score}%</p>
          <Button className="w-full" asChild>
            <Link href="/learn/reading">Back to Reading</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/tree">Back to Realm of First Light</Link>
          </Button>
        </GlassPanel>
      ) : null}
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <StudyHubLayout
      scene="study_atmosphere"
      title={story.title}
      subtitle={story.summary ?? "Reading practice"}
      backHref="/study"
      backLabel="Back to Study"
    >
      <div className="flex flex-wrap items-center gap-2">
        {story.jlptLevel ? (
          <Badge variant="outline">{story.jlptLevel.toUpperCase()}</Badge>
        ) : null}
        <Badge variant="outline">{story.estimatedReadTime} min</Badge>
        {story.completed ? <Badge variant="secondary">Completed</Badge> : null}
      </div>
      {content}
    </StudyHubLayout>
  );
}
