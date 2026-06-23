"use client";

import { useMemo, useState } from "react";

import { JapaneseText } from "@/features/learning/components/japanese-text";
import { TokenGlossSheet } from "@/features/learning/components/token-gloss-sheet";
import { useOptionalComprehensionSupport } from "@/features/learning/context/comprehension-support-context";
import type {
  ComprehensionSupportContext,
  ComprehensionSupportMode,
  SentenceTokenAnnotation,
} from "@/lib/learning/comprehension-support.types";
import { annotateJapaneseSentence } from "@/lib/learning/sentence-annotation.service";
import { cn } from "@/lib/utils";

type AnnotatedJapaneseTextProps = {
  text: string;
  reading?: string | null;
  romaji?: string | null;
  english?: string | null;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  className?: string;
  comprehensionSupport?: ComprehensionSupportContext | null;
  supportMode?: ComprehensionSupportMode;
  glossActivePool?: boolean;
};

const SIZE_CLASSES = {
  sm: "text-body-sm",
  md: "text-body",
  lg: "text-heading-5",
  xl: "text-heading-3",
  hero: "text-5xl font-semibold leading-tight sm:text-6xl",
} as const;

function AnnotatedToken({
  annotation,
  supportMode,
  size,
  onSelect,
}: {
  annotation: SentenceTokenAnnotation;
  supportMode: ComprehensionSupportMode;
  size: AnnotatedJapaneseTextProps["size"];
  onSelect: (annotation: SentenceTokenAnnotation) => void;
}) {
  const sizeClass = SIZE_CLASSES[size ?? "md"];
  const interactive = annotation.shouldGloss && supportMode !== "none";

  if (!interactive) {
    if (annotation.showFurigana && annotation.reading) {
      return (
        <ruby lang="ja" className={cn("font-japanese leading-relaxed", sizeClass)}>
          {annotation.surface}
          <rt className="text-caption font-normal text-muted-foreground">
            {annotation.reading}
          </rt>
        </ruby>
      );
    }

    return (
      <span lang="ja" className={cn("font-japanese leading-relaxed", sizeClass)}>
        {annotation.surface}
      </span>
    );
  }

  const markerClass =
    supportMode === "full"
      ? "border-b border-dotted border-trail-glow/70 text-trail-glow"
      : "border-b border-dotted border-muted-foreground/50";

  if (annotation.showFurigana && annotation.reading) {
    return (
      <button
        type="button"
        className={cn(
          "inline rounded-sm font-japanese leading-relaxed focus-ring",
          markerClass,
          sizeClass,
        )}
        lang="ja"
        aria-label={`${annotation.surface}, tap for meaning`}
        onClick={() => onSelect(annotation)}
      >
        <ruby>
          {annotation.surface}
          <rt className="text-caption font-normal text-muted-foreground">
            {annotation.reading}
          </rt>
        </ruby>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "inline rounded-sm font-japanese leading-relaxed focus-ring",
        markerClass,
        sizeClass,
      )}
      lang="ja"
      aria-label={`${annotation.surface}, tap for meaning`}
      onClick={() => onSelect(annotation)}
    >
      {annotation.surface}
    </button>
  );
}

export function AnnotatedJapaneseText({
  text,
  reading,
  romaji,
  english,
  size = "md",
  className,
  comprehensionSupport,
  supportMode = "tap",
  glossActivePool = false,
}: AnnotatedJapaneseTextProps) {
  const support = useOptionalComprehensionSupport(comprehensionSupport);
  const [selectedAnnotation, setSelectedAnnotation] =
    useState<SentenceTokenAnnotation | null>(null);

  const segments = useMemo(() => {
    if (!support || supportMode === "none") return null;
    return annotateJapaneseSentence(text, support, { glossActivePool });
  }, [glossActivePool, support, supportMode, text]);

  const hasGlossableTokens = segments?.some(
    (segment) => segment.kind === "token" && segment.annotation.shouldGloss,
  );

  if (!segments || !hasGlossableTokens) {
    return (
      <JapaneseText
        text={text}
        reading={reading}
        romaji={romaji}
        english={english}
        size={size}
        className={className}
      />
    );
  }

  const sizeClass = SIZE_CLASSES[size];

  return (
    <div className={cn("space-y-1", className)}>
      <p className={cn("font-japanese leading-relaxed", sizeClass)} lang="ja">
        {segments.map((segment, index) => {
          if (segment.kind === "plain") {
            return <span key={`plain-${index}`}>{segment.text}</span>;
          }

          return (
            <AnnotatedToken
              key={`token-${index}-${segment.annotation.surface}`}
              annotation={segment.annotation}
              supportMode={supportMode}
              size={size}
              onSelect={setSelectedAnnotation}
            />
          );
        })}
      </p>
      {supportMode === "full" && hasGlossableTokens ? (
        <p className="text-caption text-muted-foreground">
          Dotted words are new — tap for reading and meaning.
        </p>
      ) : null}
      {romaji ? <p className="text-caption text-muted-foreground">{romaji}</p> : null}
      {english ? <p className="text-body-sm text-muted-foreground">{english}</p> : null}
      <TokenGlossSheet
        annotation={selectedAnnotation}
        open={selectedAnnotation !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedAnnotation(null);
        }}
      />
    </div>
  );
}
