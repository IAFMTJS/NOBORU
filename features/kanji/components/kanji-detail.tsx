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
import type { KanjiDetailViewModel } from "@/features/kanji/types/kanji.types";

type KanjiDetailProps = {
  kanji: KanjiDetailViewModel;
};

export function KanjiDetail({ kanji }: KanjiDetailProps) {
  return (
    <PageContainer>
      <ScreenHeader
        title={kanji.character}
        subtitle={kanji.meaning}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn/kanji">Back</Link>
          </Button>
        }
      />

      <Card className="shadow-elevation-1">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            {kanji.jlptLevel ? (
              <Badge variant="outline">{kanji.jlptLevel.toUpperCase()}</Badge>
            ) : null}
            {kanji.strokeCount ? (
              <Badge variant="outline">{kanji.strokeCount} strokes</Badge>
            ) : null}
            {kanji.learned ? (
              <Badge variant="secondary">Learned</Badge>
            ) : (
              <Badge variant="outline">Not yet learned</Badge>
            )}
          </div>
          <CardTitle className="text-heading-1">{kanji.character}</CardTitle>
          <CardDescription>{kanji.meaning}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {kanji.onyomi.length > 0 ? (
            <p className="text-body-sm text-muted-foreground">
              On: {kanji.onyomi.join(" · ")}
            </p>
          ) : null}
          {kanji.kunyomi.length > 0 ? (
            <p className="text-body-sm text-muted-foreground">
              Kun: {kanji.kunyomi.join(" · ")}
            </p>
          ) : null}

          {kanji.examples.length > 0 ? (
            <div className="space-y-3">
              <p className="text-body-sm font-medium">Examples</p>
              {kanji.examples.map((example) => (
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
