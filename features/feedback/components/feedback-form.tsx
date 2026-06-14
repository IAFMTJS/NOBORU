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
import { Label } from "@/components/ui/label";
import { analyticsService } from "@/features/analytics/services/analytics.service";
import {
  FEEDBACK_CATEGORY_HINTS,
  FEEDBACK_CATEGORY_LABELS,
  FEEDBACK_MESSAGE_MAX_LENGTH,
} from "@/features/feedback/constants/feedback.constants";
import type {
  FeedbackCategory,
  FeedbackFormDefaults,
} from "@/features/feedback/types/feedback.types";
import { BETA_RELEASE } from "@/lib/release/beta.constants";

const CATEGORY_OPTIONS: FeedbackCategory[] = [
  "bug",
  "trail_ux",
  "lesson_ux",
  "audio",
  "pwa",
  "content",
  "other",
];

type FeedbackFormProps = {
  defaults?: FeedbackFormDefaults;
  onSubmitted?: () => void;
};

export function FeedbackForm({ defaults, onSubmitted }: FeedbackFormProps) {
  const [category, setCategory] = useState<FeedbackCategory>(
    defaults?.category ?? "lesson_ux",
  );
  const [rating, setRating] = useState<number | null>(defaults?.rating ?? null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          rating,
          message,
          route:
            defaults?.route ??
            (typeof window !== "undefined" ? window.location.pathname : null),
          context: defaults?.context ?? null,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        feedback?: { category: FeedbackCategory; rating: number | null; route: string | null };
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to submit feedback.");
      }

      void analyticsService.track({
        name: "feedback_submitted",
        properties: {
          category: payload.feedback?.category ?? category,
          rating: payload.feedback?.rating ?? rating,
          route: payload.feedback?.route ?? defaults?.route ?? null,
        },
      });

      setSubmitted(true);
      onSubmitted?.();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Card className="border-success/30 shadow-elevation-1">
        <CardHeader>
          <CardTitle className="text-heading-6">Thank you</CardTitle>
          <CardDescription>
            {BETA_RELEASE.enabled
              ? "Your beta feedback helps shape the climb for everyone."
              : "Your feedback helps shape the climb for everyone."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/camp">Back to Camp</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elevation-1">
      <CardHeader>
        <CardTitle className="text-heading-6">
          {BETA_RELEASE.enabled ? "Share Beta Feedback" : "Share Feedback"}
        </CardTitle>
        <CardDescription>
          Tell us what is working and what needs improvement on the trail, in
          lessons, with audio, or during install/offline use.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="feedback-category">Category</Label>
          <select
            id="feedback-category"
            className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-body-sm"
            value={category}
            onChange={(event) => setCategory(event.target.value as FeedbackCategory)}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {FEEDBACK_CATEGORY_LABELS[option]}
              </option>
            ))}
          </select>
          <p className="text-caption text-muted-foreground">
            {FEEDBACK_CATEGORY_HINTS[category]}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Overall rating (optional)</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={rating === value ? "default" : "outline"}
                onClick={() => setRating(value)}
                aria-label={`Rate ${value} out of 5`}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback-message">Message</Label>
          <textarea
            id="feedback-message"
            className="min-h-32 w-full rounded-xl border border-input bg-background px-3 py-2 text-body-sm"
            maxLength={FEEDBACK_MESSAGE_MAX_LENGTH}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="What happened? What did you expect? Which screen or lesson were you on?"
          />
          <p className="text-caption text-muted-foreground">
            {message.length}/{FEEDBACK_MESSAGE_MAX_LENGTH}
          </p>
        </div>

        {error ? (
          <p className="text-caption text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button
          className="w-full"
          loading={submitting}
          onClick={() => void handleSubmit()}
        >
          Submit Feedback
        </Button>
      </CardContent>
    </Card>
  );
}
