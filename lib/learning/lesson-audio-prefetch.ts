import type {
  LessonSessionViewModel,
  LessonStep,
} from "@/features/learning/types/lesson.types";

function collectAudioUrlFromStep(step: LessonStep): string | null {
  if (step.kind === "teach" && step.content.type === "vocabulary") {
    return step.content.audioUrl;
  }

  if (step.kind === "listening_recall") {
    return step.audioUrl;
  }

  if (step.kind === "listening") {
    return step.content.audioUrl;
  }

  if (step.kind === "listening_challenge") {
    return step.content.exercises[0]?.audioUrl ?? null;
  }

  return null;
}

export function collectUpcomingLessonAudioUrls(
  steps: LessonStep[],
  startIndex = 0,
  limit = 3,
): string[] {
  const urls: string[] = [];

  for (let index = startIndex; index < steps.length && urls.length < limit; index += 1) {
    const url = collectAudioUrlFromStep(steps[index]);
    if (url) {
      urls.push(url);
    }
  }

  return [...new Set(urls)];
}

export function getLessonAudioPrefetchPlan(session: LessonSessionViewModel) {
  return collectUpcomingLessonAudioUrls(session.steps, 0, 3);
}
