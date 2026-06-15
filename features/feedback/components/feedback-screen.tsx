"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { StudyHubLayout } from "@/features/dojo/components/study-hub-layout";
import { FeedbackForm } from "@/features/feedback/components/feedback-form";
import { BETA_RELEASE } from "@/lib/release/beta.constants";
import type { FeedbackCategory } from "@/features/feedback/types/feedback.types";

function FeedbackPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category") ?? null;
  const lessonId = searchParams?.get("lessonId") ?? null;
  const region = searchParams?.get("region") ?? null;
  const score = searchParams?.get("score") ?? null;

  const category =
    categoryParam === "trail_ux" ||
    categoryParam === "lesson_ux" ||
    categoryParam === "audio" ||
    categoryParam === "pwa" ||
    categoryParam === "content" ||
    categoryParam === "bug" ||
    categoryParam === "other"
      ? (categoryParam as FeedbackCategory)
      : undefined;

  return (
    <StudyHubLayout
      scene="study_atmosphere"
      title={BETA_RELEASE.enabled ? "Beta Feedback" : "Feedback"}
      subtitle="Help us improve trail clarity, lesson interactivity, audio, and PWA install flow."
      backHref="/profile"
      backLabel="Profile"
    >
      <FeedbackForm
        defaults={{
          category,
          route: "/feedback",
          context: {
            lessonId,
            region,
            score,
          },
        }}
      />
    </StudyHubLayout>
  );
}

export function FeedbackScreen() {
  return (
    <Suspense fallback={null}>
      <FeedbackPageContent />
    </Suspense>
  );
}
