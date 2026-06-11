import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { VocabularyDetailViewModel } from "@/features/vocabulary/types/vocabulary.types";

type VocabularyDetailProps = {
  word: VocabularyDetailViewModel;
};

export function VocabularyDetail({ word }: VocabularyDetailProps) {
  const displayJapanese = word.kanji ?? word.kana;

  return (
    <PageContainer>
      <ScreenHeader
        title={displayJapanese}
        subtitle={word.kana}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn/vocabulary">Back</Link>
          </Button>
        }
      />

      <Card className="overflow-hidden border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {word.jlptLevel ? (
              <Badge variant="outline">{word.jlptLevel.toUpperCase()}</Badge>
            ) : null}
            {word.partOfSpeech ? (
              <Badge variant="secondary">{word.partOfSpeech}</Badge>
            ) : null}
            {word.learned ? (
              <Badge variant="secondary">Learned</Badge>
            ) : (
              <Badge variant="outline">Not yet learned</Badge>
            )}
          </div>
          <div className="space-y-1">
            <p className="font-japanese text-heading-2">{displayJapanese}</p>
            {word.kanji ? (
              <CardDescription className="font-japanese">{word.kana}</CardDescription>
            ) : null}
            <CardTitle className="text-heading-4">{word.meaning}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {word.audioUrl ? (
            <audio controls className="w-full" src={word.audioUrl}>
              <track kind="captions" />
            </audio>
          ) : null}

          {word.examples.length > 0 ? (
            <div className="space-y-3">
              <p className="text-body-sm font-medium">Examples</p>
              {word.examples.map((example) => (
                <div
                  key={example.japaneseText}
                  className="rounded-xl border border-border bg-background/60 px-4 py-3"
                >
                  <p className="font-japanese text-body">{example.japaneseText}</p>
                  {example.romaji ? (
                    <p className="text-body-sm text-muted-foreground">
                      {example.romaji}
                    </p>
                  ) : null}
                  <p className="text-body-sm text-muted-foreground">
                    {example.english}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
