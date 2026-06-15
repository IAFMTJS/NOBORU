"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { UiIconImage } from "@/components/media/ui-icon-image";
import { TrailAnswerPad } from "@/components/visual/world/trail-answer-pad";
import { CharacterStage } from "@/components/visual/world/character-stage";
import { WorldDialogueBubble } from "@/components/visual/world-dialogue-bubble";
import { PrimaryClimbButton, StoryTitle } from "@/components/visual";
import { LessonDrillLayout } from "@/features/learning/components/lesson/lesson-drill-layout";
import { LessonShell } from "@/features/learning/components/lesson/lesson-shell";
import { JapaneseText } from "@/features/learning/components/japanese-text";
import type { DialogueDetailViewModel } from "@/features/reading/types/reading.types";
import { offlineClient } from "@/features/offline/services/offline-client.service";
import { useMountOnceEffect } from "@/lib/hooks/use-mount-once-effect";

type DialoguePlayerProps = {
  dialogue: DialogueDetailViewModel;
  embedded?: boolean;
  onComplete?: (score: number) => void;
};

function getEntryNode(dialogue: DialogueDetailViewModel) {
  return (
    dialogue.nodes.find((node) => node.isEntry) ??
    dialogue.nodes.sort((left, right) => left.orderIndex - right.orderIndex)[0]
  );
}

export function DialoguePlayer({
  dialogue,
  embedded = false,
  onComplete,
}: DialoguePlayerProps) {
  const entryNode = useMemo(() => getEntryNode(dialogue), [dialogue]);
  const [currentNodeId, setCurrentNodeId] = useState(entryNode?.id ?? "");
  const [choiceAttempts, setChoiceAttempts] = useState(0);
  const [correctChoices, setCorrectChoices] = useState(0);
  const [finished, setFinished] = useState(dialogue.completed);
  const [score, setScore] = useState(dialogue.score);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nodesById = useMemo(
    () => new Map(dialogue.nodes.map((node) => [node.id, node])),
    [dialogue.nodes],
  );
  const currentNode = nodesById.get(currentNodeId);

  useMountOnceEffect(() => {
    void offlineClient.saveReadingProgress({
      contentType: "dialogue",
      contentId: dialogue.id,
      status: "in_progress",
      score: 0,
    });
  }, !dialogue.completed && !embedded);

  async function saveProgress(finalScore: number) {
    if (embedded) {
      onComplete?.(finalScore);
      setFinished(true);
      setScore(finalScore);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const result = await offlineClient.saveReadingProgress({
        contentType: "dialogue",
        contentId: dialogue.id,
        status: "completed",
        score: finalScore,
      });
      if (!result.saved) {
        throw new Error("Unable to save progress.");
      }
      setScore(result.score);
      setFinished(true);
      onComplete?.(finalScore);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save progress.");
    } finally {
      setSaving(false);
    }
  }

  function advanceToNode(nextNodeId: string | null, isCorrect: boolean) {
    if (nextNodeId) {
      setCurrentNodeId(nextNodeId);
      return;
    }

    const attempts = choiceAttempts + 1;
    const correct = correctChoices + (isCorrect ? 1 : 0);
    const finalScore = Math.round((correct / attempts) * 100);
    void saveProgress(finalScore);
  }

  function handleChoice(choiceId: string, nextNodeId: string | null, isCorrect: boolean) {
    setChoiceAttempts((current) => current + 1);
    if (isCorrect) {
      setCorrectChoices((current) => current + 1);
    }
    advanceToNode(nextNodeId, isCorrect);
  }

  function handleContinue() {
    const orderedNodes = [...dialogue.nodes].sort(
      (left, right) => left.orderIndex - right.orderIndex,
    );
    const currentIndex = orderedNodes.findIndex((node) => node.id === currentNodeId);
    const nextNode = orderedNodes[currentIndex + 1];

    if (!nextNode) {
      void saveProgress(100);
      return;
    }

    setCurrentNodeId(nextNode.id);
  }

  function renderConversation() {
    if (finished) {
      return (
        <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-success/30 bg-black/45 p-5 text-center">
          <StoryTitle as="h2" className="text-lg">
            Conversation complete
          </StoryTitle>
          <p className="text-caption text-muted-foreground">Score {score}%</p>
          {!embedded ? (
            <PrimaryClimbButton asChild className="w-full">
              <Link href="/learn/reading">Return to reading trail</Link>
            </PrimaryClimbButton>
          ) : null}
        </div>
      );
    }

    if (!currentNode) return null;

    return (
      <LessonDrillLayout
        prompt={dialogue.title}
        hero={
          <div className="grid w-full max-w-md gap-4 sm:grid-cols-[5rem_1fr] sm:items-start">
            <CharacterStage speaker={currentNode.speaker} />
            <WorldDialogueBubble speaker={currentNode.speaker}>
              <JapaneseText text={currentNode.japaneseText} size="lg" className="text-foreground" />
              {currentNode.romaji ? (
                <p className="mt-2 text-body-sm text-muted-foreground">{currentNode.romaji}</p>
              ) : null}
              {currentNode.english ? (
                <p className="mt-1 text-body-sm text-muted-foreground">{currentNode.english}</p>
              ) : null}
            </WorldDialogueBubble>
          </div>
        }
        footer={
          currentNode.choices.length > 0 ? (
            <TrailAnswerPad
              options={currentNode.choices.map((choice) => ({
                id: choice.id,
                label: choice.choiceText,
                state: saving ? "disabled" : "default",
                onSelect: saving
                  ? undefined
                  : () => handleChoice(choice.id, choice.nextNodeId, choice.isCorrect),
              }))}
            />
          ) : (
            <PrimaryClimbButton className="w-full" disabled={saving} onClick={handleContinue}>
              Continue
            </PrimaryClimbButton>
          )
        }
      />
    );
  }

  const body = (
    <>
      {error ? <p className="mb-3 text-caption text-destructive">{error}</p> : null}
      {renderConversation()}
    </>
  );

  if (embedded) {
    return body;
  }

  return (
    <LessonShell
      scene="study_atmosphere"
      header={
        <div className="absolute left-0 right-0 top-0 z-30 flex items-center gap-2 border-b border-white/10 bg-black/50 px-4 py-3 backdrop-blur-md">
          <Link
            href="/study"
            className="inline-flex items-center gap-1.5 text-body-sm text-white/75 hover:text-white"
          >
            <UiIconImage name="arrow_left" size={16} />
            Study
          </Link>
          <StoryTitle as="h1" className="truncate text-sm">
            {dialogue.title}
          </StoryTitle>
        </div>
      }
    >
      {body}
    </LessonShell>
  );
}
