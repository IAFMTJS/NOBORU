"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/visual";

type LessonFeedbackPromptProps = {
  lessonId: string;
  regionSlug: string;
  lessonType: string;
  score: number;
};

export function LessonFeedbackPrompt({
  lessonId,
  regionSlug,
  lessonType,
  score,
}: LessonFeedbackPromptProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const feedbackHref = `/feedback?category=lesson_ux&lessonId=${encodeURIComponent(lessonId)}&region=${encodeURIComponent(regionSlug)}&score=${score}`;

  return (
    <GlassPanel className="space-y-3 p-4 shadow-elevation-1">
      <div className="space-y-1">
        <p className="text-heading-6 font-medium">How was this lesson?</p>
        <p className="text-caption text-muted-foreground">
          Your feedback on {lessonType} lessons helps us improve interactivity and trail
          clarity.
        </p>
      </div>
      <div className="flex gap-2">
        <Button className="flex-1" variant="outline" asChild>
          <Link href={feedbackHref}>Share feedback</Link>
        </Button>
        <Button variant="ghost" onClick={() => setDismissed(true)}>
          Not now
        </Button>
      </div>
    </GlassPanel>
  );
}
