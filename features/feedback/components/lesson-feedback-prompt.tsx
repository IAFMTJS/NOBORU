"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card className="border-border/80 shadow-elevation-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-heading-6">How was this lesson?</CardTitle>
        <CardDescription>
          Your feedback on {lessonType} lessons helps us improve interactivity and trail
          clarity.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button className="flex-1" variant="outline" asChild>
          <Link href={feedbackHref}>Share feedback</Link>
        </Button>
        <Button variant="ghost" onClick={() => setDismissed(true)}>
          Not now
        </Button>
      </CardContent>
    </Card>
  );
}
