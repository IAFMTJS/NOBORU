import { describe, expect, it } from "vitest";

import type { LessonSessionViewModel } from "@/features/learning/types/lesson.types";
import {
  collectUpcomingLessonAudioUrls,
  getLessonAudioPrefetchPlan,
} from "@/lib/learning/lesson-audio-prefetch";

const baseSession: LessonSessionViewModel = {
  lessonId: "lesson-1",
  unitId: "unit-1",
  regionSlug: "mount-n5",
  title: "Sample",
  description: null,
  type: "vocabulary",
  xpReward: 12,
  status: "published",
  progress: "not_started",
  score: 0,
  passScore: 70,
  nextLesson: null,
  steps: [
    {
      kind: "intro",
      title: "Intro",
      description: null,
      lessonType: "vocabulary",
      xpReward: 12,
    },
    {
      kind: "teach",
      index: 1,
      total: 2,
      content: {
        type: "vocabulary",
        id: "v1",
        kana: "みず",
        kanji: "水",
        meaning: "water",
        partOfSpeech: "noun",
        audioUrl: "https://cdn.example.com/mizu.mp3",
        examples: [],
      },
    },
    {
      kind: "teach",
      index: 2,
      total: 2,
      content: {
        type: "vocabulary",
        id: "v2",
        kana: "いえ",
        kanji: "家",
        meaning: "house",
        partOfSpeech: "noun",
        audioUrl: "https://cdn.example.com/ie.mp3",
        examples: [],
      },
    },
    {
      kind: "listening",
      content: {
        type: "listening",
        id: "l1",
        title: "Greeting",
        slug: "greeting",
        audioUrl: "https://cdn.example.com/greeting.mp3",
        japaneseText: "こんにちは",
        romaji: "Konnichiwa",
        english: "Hello",
        question: "What did you hear?",
        options: ["Hello", "Goodbye"],
        correctOptionIndex: 0,
      },
    },
    { kind: "complete", xpReward: 12 },
  ],
};

describe("lesson-audio-prefetch", () => {
  it("collects unique upcoming audio urls with a limit", () => {
    const urls = collectUpcomingLessonAudioUrls(baseSession.steps, 1, 2);

    expect(urls).toEqual([
      "https://cdn.example.com/mizu.mp3",
      "https://cdn.example.com/ie.mp3",
    ]);
  });

  it("builds a prefetch plan from the lesson session", () => {
    expect(getLessonAudioPrefetchPlan(baseSession)).toEqual([
      "https://cdn.example.com/mizu.mp3",
      "https://cdn.example.com/ie.mp3",
      "https://cdn.example.com/greeting.mp3",
    ]);
  });
});
