import type { ApplicationLessonContent } from "@/features/application/types/application.types";
import type {
  LessonApplicationStep,
  LessonContent,
  LessonDialogueStep,
  LessonListeningChallengeStep,
  LessonListeningStep,
  LessonReadingStep,
  LessonStep,
  LessonStoryStep,
  ReadingLessonContent,
} from "@/features/learning/types/lesson.types";
import type { EmbeddedLessonType } from "@/lib/learning/embedded-lesson.constants";

const DRILL_CONTENT_TYPES = new Set([
  "vocabulary",
  "kanji",
  "grammar",
  "hiragana",
  "katakana",
]);

export function extractDrillableLessonContents(contents: LessonContent[]): LessonContent[] {
  return contents.filter((content) => DRILL_CONTENT_TYPES.has(content.type));
}

export function buildContextStepsFromLessonContents(
  contents: LessonContent[],
  buildApplicationStep: (
    content: ApplicationLessonContent,
    index: number,
    total: number,
  ) => LessonApplicationStep,
): LessonStep[] {
  const steps: LessonStep[] = [];

  const readingContents = contents.filter(
    (content): content is ReadingLessonContent => content.type === "reading",
  );
  readingContents.forEach((content, index) => {
    steps.push({
      kind: "reading",
      content,
      index: index + 1,
      total: readingContents.length,
      lessonPhase: "context_mastery",
    });
  });

  const storyContent = contents.find((content) => content.type === "story");
  if (storyContent && storyContent.type === "story") {
    steps.push({
      kind: "story",
      content: storyContent,
      lessonPhase: "context_mastery",
    });
  }

  const dialogueContent = contents.find((content) => content.type === "dialogue");
  if (dialogueContent && dialogueContent.type === "dialogue") {
    steps.push({
      kind: "dialogue",
      content: dialogueContent,
      lessonPhase: "context_mastery",
    });
  }

  const listeningContent = contents.find((content) => content.type === "listening");
  if (listeningContent && listeningContent.type === "listening") {
    steps.push({
      kind: "listening",
      content: listeningContent,
      lessonPhase: "context_mastery",
    });
  }

  const challengeContent = contents.find(
    (content) => content.type === "listening_challenge",
  );
  if (challengeContent && challengeContent.type === "listening_challenge") {
    steps.push({
      kind: "listening_challenge",
      content: challengeContent,
      lessonPhase: "context_mastery",
    });
  }

  const applicationContents = contents.filter(
    (content): content is ApplicationLessonContent => content.type === "application",
  );
  applicationContents.forEach((content, index) => {
    const step: LessonApplicationStep = {
      ...buildApplicationStep(content, index + 1, applicationContents.length),
      lessonPhase: "context_mastery",
    };
    steps.push(step);
  });

  return steps;
}

export function buildEmbeddedContextSteps(
  lessonType: EmbeddedLessonType,
  contents: LessonContent[],
  buildApplicationStep: (
    content: ApplicationLessonContent,
    index: number,
    total: number,
  ) => LessonApplicationStep,
): LessonStep[] {
  if (lessonType === "reading") {
    const readingContents = contents.filter(
      (content): content is ReadingLessonContent => content.type === "reading",
    );
    return readingContents.map(
      (content, index): LessonReadingStep => ({
        kind: "reading",
        content,
        index: index + 1,
        total: readingContents.length,
        lessonPhase: "context_mastery",
      }),
    );
  }

  if (lessonType === "story") {
    const storyContent = contents.find((content) => content.type === "story");
    if (!storyContent || storyContent.type !== "story") return [];
    const step: LessonStoryStep = {
      kind: "story",
      content: storyContent,
      lessonPhase: "context_mastery",
    };
    return [step];
  }

  if (lessonType === "dialogue") {
    const dialogueContent = contents.find((content) => content.type === "dialogue");
    if (!dialogueContent || dialogueContent.type !== "dialogue") return [];
    const step: LessonDialogueStep = {
      kind: "dialogue",
      content: dialogueContent,
      lessonPhase: "context_mastery",
    };
    return [step];
  }

  if (lessonType === "listening") {
    const listeningContent = contents.find((content) => content.type === "listening");
    if (!listeningContent || listeningContent.type !== "listening") return [];
    const step: LessonListeningStep = {
      kind: "listening",
      content: listeningContent,
      lessonPhase: "context_mastery",
    };
    return [step];
  }

  if (lessonType === "listening_challenge") {
    const challengeContent = contents.find(
      (content) => content.type === "listening_challenge",
    );
    if (!challengeContent || challengeContent.type !== "listening_challenge") return [];
    const step: LessonListeningChallengeStep = {
      kind: "listening_challenge",
      content: challengeContent,
      lessonPhase: "context_mastery",
    };
    return [step];
  }

  if (lessonType === "application") {
    const applicationContents = contents.filter(
      (content): content is ApplicationLessonContent => content.type === "application",
    );
    return applicationContents.map((content, index): LessonApplicationStep => ({
      ...buildApplicationStep(content, index + 1, applicationContents.length),
      lessonPhase: "context_mastery",
    }));
  }

  return [];
}
