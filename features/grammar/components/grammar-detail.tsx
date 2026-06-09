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
import type { GrammarDetailViewModel } from "@/features/grammar/types/grammar.types";

type GrammarDetailProps = {
  grammar: GrammarDetailViewModel;
};

export function GrammarDetail({ grammar }: GrammarDetailProps) {
  return (
    <PageContainer>
      <ScreenHeader
        title={grammar.title}
        subtitle={grammar.meaning}
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learn/grammar">Back</Link>
          </Button>
        }
      />

      <Card className="shadow-elevation-1">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            {grammar.jlptLevel ? (
              <Badge variant="outline">{grammar.jlptLevel.toUpperCase()}</Badge>
            ) : null}
            {grammar.learned ? (
              <Badge variant="secondary">Learned</Badge>
            ) : (
              <Badge variant="outline">Not yet learned</Badge>
            )}
          </div>
          <CardTitle className="text-heading-4">{grammar.meaning}</CardTitle>
          {grammar.explanation ? (
            <CardDescription>{grammar.explanation}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          {grammar.examples.length > 0 ? (
            <div className="space-y-3">
              <p className="text-body-sm font-medium">Examples</p>
              {grammar.examples.map((example) => (
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
