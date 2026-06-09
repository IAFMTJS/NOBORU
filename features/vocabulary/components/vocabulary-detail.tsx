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
  return (
    <PageContainer>
      <ScreenHeader
        title={word.kanji ?? word.kana}
        subtitle={word.kana}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn/vocabulary">Back</Link>
          </Button>
        }
      />

      <Card className="shadow-elevation-1">
        <CardHeader>
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
          <CardTitle className="text-heading-3">{word.meaning}</CardTitle>
          {word.kanji ? (
            <CardDescription>{word.kana}</CardDescription>
          ) : null}
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
                  className="rounded-xl border border-border px-4 py-3"
                >
                  <p className="text-body">{example.japaneseText}</p>
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
