import { GlassPanel, StoryTitle } from "@/components/visual";
import { Badge } from "@/components/ui/badge";
import { StudyHubLayout } from "@/features/dojo/components/study-hub-layout";
import type { VocabularyDetailViewModel } from "@/features/vocabulary/types/vocabulary.types";

type VocabularyDetailProps = {
  word: VocabularyDetailViewModel;
};

export function VocabularyDetail({ word }: VocabularyDetailProps) {
  const displayJapanese = word.kanji ?? word.kana;

  return (
    <StudyHubLayout
      scene="study_atmosphere"
      title={displayJapanese}
      subtitle={word.kana}
      backHref="/learn/vocabulary"
      backLabel="Vocabulary"
    >
      <GlassPanel className="space-y-4 p-4">
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
            <p className="font-japanese text-body-sm text-muted-foreground">{word.kana}</p>
          ) : null}
          <StoryTitle as="h2" className="text-lg">
            {word.meaning}
          </StoryTitle>
        </div>

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
