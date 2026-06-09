"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { PageContainer } from "@/components/layout/page-container";
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
import type { DialogueDetailViewModel } from "@/features/reading/types/reading.types";

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

  useEffect(() => {
    if (dialogue.completed || embedded) return;
    void fetch("/api/reading/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentType: "dialogue",
        contentId: dialogue.id,
        status: "in_progress",
        score: 0,
      }),
    });
  }, [dialogue.completed, dialogue.id, embedded]);

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
      const response = await fetch("/api/reading/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: "dialogue",
          contentId: dialogue.id,
          status: "completed",
          score: finalScore,
        }),
      });
      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };
      if (!result.success) {
        throw new Error(result.error ?? "Unable to save progress.");
      }
      setScore(finalScore);
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

  const content = (
    <div className="space-y-4">
      {error ? <p className="text-caption text-destructive">{error}</p> : null}

      {!finished && currentNode ? (
        <>
          <Card className="shadow-elevation-1">
            <CardHeader>
              <CardDescription>{currentNode.speaker}</CardDescription>
              <CardTitle className="text-heading-4 leading-relaxed">
                {currentNode.japaneseText}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentNode.romaji ? (
                <p className="text-body-sm text-muted-foreground">{currentNode.romaji}</p>
              ) : null}
              {currentNode.english ? (
                <p className="text-body-sm text-muted-foreground">{currentNode.english}</p>
              ) : null}
            </CardContent>
          </Card>

          {currentNode.choices.length > 0 ? (
            <div className="space-y-2">
              {currentNode.choices.map((choice) => (
                <Button
                  key={choice.id}
                  variant="outline"
                  className="h-auto w-full justify-start whitespace-normal px-4 py-3 text-left"
                  disabled={saving}
                  onClick={() =>
                    handleChoice(choice.id, choice.nextNodeId, choice.isCorrect)
                  }
                >
                  {choice.choiceText}
                </Button>
              ))}
            </div>
          ) : (
            <Button className="w-full" disabled={saving} onClick={handleContinue}>
              Continue
            </Button>
          )}
        </>
      ) : null}

      {finished ? (
        <Card className="border-success/30 shadow-elevation-1">
          <CardHeader>
            <CardTitle>Dialog Complete</CardTitle>
            <CardDescription>Score {score}%</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!embedded ? (
              <>
                <Button className="w-full" asChild>
                  <Link href="/learn/reading">Back to Reading</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/learn/mount-n5">Back to Mount N5</Link>
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <PageContainer>
      <ScreenHeader
        title={dialogue.title}
        subtitle={dialogue.description ?? "Conversation practice"}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn/reading">Back</Link>
          </Button>
        }
      />
      <div className="flex flex-wrap items-center gap-2">
        {dialogue.jlptLevel ? (
          <Badge variant="outline">{dialogue.jlptLevel.toUpperCase()}</Badge>
        ) : null}
        {dialogue.completed ? <Badge variant="secondary">Completed</Badge> : null}
      </div>
      {content}
    </PageContainer>
  );
}
