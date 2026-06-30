import { JapaneseText } from "@/features/learning/components/japanese-text";
import { deriveKanaRomaji } from "@/features/learning/utils/kana-romaji";
import type { LessonFillBlankOption } from "@/features/learning/types/lesson.types";

const JAPANESE_SURFACE_PATTERN = /[\u3040-\u30FF\u4E00-\u9FFF]/;

type JapaneseAnswerLabelProps = {
  text: string;
  reading?: string | null;
  romaji?: string | null;
  size?: "sm" | "md";
};

export function JapaneseAnswerLabel({
  text,
  reading,
  romaji,
  size = "sm",
}: JapaneseAnswerLabelProps) {
  if (!JAPANESE_SURFACE_PATTERN.test(text)) {
    return <span>{text}</span>;
  }

  const resolvedReading =
    reading && reading !== text ? reading : null;
  const resolvedRomaji =
    romaji ??
    (resolvedReading ? deriveKanaRomaji(resolvedReading) || null : null) ??
    (deriveKanaRomaji(text) || null);

  return (
    <JapaneseText
      text={text}
      reading={resolvedReading}
      romaji={resolvedRomaji}
      size={size}
      className="text-left text-foreground"
    />
  );
}

export function japaneseAnswerLabelFromOption(
  option: LessonFillBlankOption,
  size: "sm" | "md" = "sm",
) {
  return (
    <JapaneseAnswerLabel
      text={option.japanese}
      reading={option.reading}
      romaji={option.romaji}
      size={size}
    />
  );
}

export function isJapaneseSurfaceText(text: string): boolean {
  return JAPANESE_SURFACE_PATTERN.test(text);
}
