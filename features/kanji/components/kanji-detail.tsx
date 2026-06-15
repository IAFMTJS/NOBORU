import { Badge } from "@/components/ui/badge";
import { GlassPanel, StoryTitle } from "@/components/visual";
import { StudyHubLayout } from "@/features/dojo/components/study-hub-layout";
import type { KanjiDetailViewModel } from "@/features/kanji/types/kanji.types";
import { cn } from "@/lib/utils";

type KanjiDetailProps = {
  kanji: KanjiDetailViewModel;
};

export function KanjiDetail({ kanji }: KanjiDetailProps) {
  return (
    <StudyHubLayout
      scene="study_atmosphere"
      title={kanji.character}
      subtitle={kanji.meaning}
      backHref="/study"
      backLabel="Back to Study"
    >
      <GlassPanel className="space-y-4 p-4">
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
              "border border-trail-glow/20 bg-black/30 font-japanese text-heading-1",
            )}
          >
            {kanji.character}
          </div>
          <div className="min-w-0 space-y-1">
            <StoryTitle as="h2" className="text-lg">
              {kanji.meaning}
            </StoryTitle>
            <p className="text-body-sm text-muted-foreground">
              On-yomi and kun-yomi readings
            </p>
          </div>
        </div>
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
                className="rounded-xl border border-white/10 bg-black/25 px-4 py-3"
              >
                <p className="font-japanese text-body">{example.japaneseText}</p>
                {example.romaji ? (
                  <p className="text-body-sm text-muted-foreground">{example.romaji}</p>
                ) : null}
                <p className="text-body-sm text-muted-foreground">{example.english}</p>
              </div>
            ))}
          </div>
        ) : null}
      </GlassPanel>
    </StudyHubLayout>
  );
}
