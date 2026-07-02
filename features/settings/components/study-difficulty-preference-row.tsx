"use client";

import { useEffect, useState } from "react";

import {
  getStudyDifficulty,
  setStudyDifficulty,
} from "@/lib/learning/study-difficulty.storage";
import type { StudyDifficulty } from "@/lib/learning/hint-policy.types";
import { cn } from "@/lib/utils";

const OPTIONS: Array<{ id: StudyDifficulty; label: string }> = [
  { id: "easy", label: "Easy" },
  { id: "normal", label: "Normal" },
  { id: "hard", label: "Hard" },
];

export function StudyDifficultyPreferenceRow() {
  const [value, setValue] = useState<StudyDifficulty>("normal");

  useEffect(() => {
    setValue(getStudyDifficulty());
  }, []);

  return (
    <div className="space-y-2">
      <p className="text-body-sm font-medium">Study difficulty</p>
      <p className="text-caption text-muted-foreground">
        Controls furigana, romaji, and translation hints during lessons.
      </p>
      <div className="flex gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={cn(
              "focus-ring flex-1 rounded-lg border px-3 py-2 text-caption transition-colors",
              value === option.id
                ? "border-trail-glow bg-trail-glow/10 text-foreground"
                : "border-white/15 text-muted-foreground",
            )}
            onClick={() => {
              setValue(option.id);
              setStudyDifficulty(option.id);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
