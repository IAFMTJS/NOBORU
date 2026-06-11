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
import { cn } from "@/lib/utils";

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

      <Card className="overflow-hidden border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-card to-card">
        <CardHeader className="space-y-4">
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
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl",
                "border border-amber-500/20 bg-card/80 font-japanese text-heading-1 shadow-elevation-1",
              )}
            >
              {kanji.character}
            </div>
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-heading-4">{kanji.meaning}</CardTitle>
              <CardDescription>On-yomi and kun-yomi readings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {kanji.onyomi.length > 0 ? (
            <p className="font-japanese text-body-sm text-muted-foreground">
              On: {kanji.onyomi.join(" · ")}
            </p>
          ) : null}
          {kanji.kunyomi.length > 0 ? (
            <p className="font-japanese text-body-sm text-muted-foreground">
              Kun: {kanji.kunyomi.join(" · ")}
            </p>
          ) : null}

          {kanji.examples.length > 0 ? (
            <div className="space-y-3">
              <p className="text-body-sm font-medium">Examples</p>
              {kanji.examples.map((example) => (
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
