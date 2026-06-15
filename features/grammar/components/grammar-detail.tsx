import { Badge } from "@/components/ui/badge";
import { GlassPanel, StoryTitle } from "@/components/visual";
import { StudyHubLayout } from "@/features/dojo/components/study-hub-layout";
import type { GrammarDetailViewModel } from "@/features/grammar/types/grammar.types";

type GrammarDetailProps = {
  grammar: GrammarDetailViewModel;
};

export function GrammarDetail({ grammar }: GrammarDetailProps) {
  return (
    <StudyHubLayout
      scene="study_atmosphere"
      title={grammar.title}
      subtitle={grammar.meaning}
      backHref="/study"
      backLabel="Back to Study"
    >
      <GlassPanel className="space-y-4 p-4">
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
        <div className="space-y-1">
          <p className="font-japanese text-heading-3">{grammar.title}</p>
          <StoryTitle as="h2" className="text-lg">
            {grammar.meaning}
          </StoryTitle>
          {grammar.explanation ? (
            <p className="text-body-sm text-muted-foreground">{grammar.explanation}</p>
          ) : null}
        </div>
        {grammar.examples.length > 0 ? (
          <div className="space-y-3">
            <p className="text-body-sm font-medium">Examples</p>
            {grammar.examples.map((example) => (
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
