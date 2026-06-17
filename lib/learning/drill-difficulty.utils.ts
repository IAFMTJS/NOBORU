import type { DifficultyProfile } from "@/lib/learning/difficulty-scaling.service";

export function applyDifficultyToChoiceOptions(
  options: string[],
  correctIndex: number,
  choiceCount: number,
): { options: string[]; correctIndex: number } {
  if (choiceCount >= options.length || choiceCount < 2) {
    return { options, correctIndex };
  }

  const correctAnswer = options[correctIndex];
  if (!correctAnswer) {
    return { options, correctIndex };
  }

  const distractors = options.filter((_, index) => index !== correctIndex);
  const trimmedDistractors = distractors.slice(0, Math.max(choiceCount - 1, 0));
  const nextOptions = shuffleOptions([correctAnswer, ...trimmedDistractors]);
  const nextCorrectIndex = nextOptions.indexOf(correctAnswer);

  return {
    options: nextOptions,
    correctIndex: nextCorrectIndex >= 0 ? nextCorrectIndex : 0,
  };
}

function shuffleOptions(options: string[]): string[] {
  const copy = [...options];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex]!, copy[index]!];
  }
  return copy;
}

export function resolveFuriganaReading(input: {
  display: string;
  reading?: string | null;
  profile: DifficultyProfile;
}): string | null {
  const reading = input.reading?.trim();
  if (!reading || reading === input.display) return null;

  switch (input.profile.furiganaSupport) {
    case "full":
      return reading;
    case "partial":
      return input.display.length > 1 ? reading : null;
    case "none":
    default:
      return null;
  }
}

export function shouldShowDrillHints(profile: DifficultyProfile): boolean {
  return profile.hintSupport !== "minimal";
}

export function recognitionTimerSeconds(
  profile: DifficultyProfile,
): number | null {
  switch (profile.recognitionTimePressure) {
    case "soft":
      return 30;
    case "firm":
      return 20;
    case "none":
    default:
      return null;
  }
}

export function shouldAutoFailOnRecognitionTimeout(
  profile: DifficultyProfile,
): boolean {
  return profile.recognitionTimePressure === "firm";
}
