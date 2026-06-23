"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { SentenceTokenAnnotation } from "@/lib/learning/comprehension-support.types";

type TokenGlossSheetProps = {
  annotation: SentenceTokenAnnotation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TokenGlossSheet({
  annotation,
  open,
  onOpenChange,
}: TokenGlossSheetProps) {
  if (!annotation) return null;

  const readingLabel =
    annotation.reading && annotation.reading !== annotation.surface
      ? annotation.reading
      : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="font-japanese text-3xl" lang="ja">
            {annotation.surface}
          </SheetTitle>
          <SheetDescription>
            {readingLabel ? `${readingLabel} · ` : ""}
            {annotation.meaning ?? "New on the trail"}
          </SheetDescription>
        </SheetHeader>
        {annotation.unknownKanji.length > 0 ? (
          <div className="mt-4 space-y-2">
            <p className="text-caption text-muted-foreground">Kanji in this word</p>
            <ul className="space-y-2">
              {annotation.unknownKanji.map((kanji) => (
                <li
                  key={kanji.id}
                  className="flex items-baseline justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2"
                >
                  <span className="font-japanese text-2xl" lang="ja">
                    {kanji.character}
                  </span>
                  <span className="text-body-sm text-muted-foreground">{kanji.meaning}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="mt-4 text-caption text-muted-foreground">
          This word will be taught on the trail soon. Tap any dotted word while learning to see
          its reading and meaning.
        </p>
      </SheetContent>
    </Sheet>
  );
}
