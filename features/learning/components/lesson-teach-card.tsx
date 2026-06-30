"use client";

import { AudioPlayback } from "@/components/media/audio-playback";
import { Badge } from "@/components/ui/badge";
import { GlassPanel, StoryTitle } from "@/components/visual";
import { AnnotatedJapaneseText } from "@/features/learning/components/annotated-japanese-text";
import type { LessonTeachStep } from "@/features/learning/types/lesson.types";
import { getJapaneseRomaji } from "@/features/learning/utils/exercise-steps";
import type { ComprehensionSupportMode } from "@/lib/learning/comprehension-support.types";

type LessonTeachCardProps = {
  step: LessonTeachStep;
  soundEnabled?: boolean;
  supportMode?: ComprehensionSupportMode;
};

export function LessonTeachCard({
  step,
  soundEnabled = true,
  supportMode = "full",
}: LessonTeachCardProps) {
  const { content } = step;

  if (content.type === "vocabulary") {
    return (
      <div className="flex flex-1 flex-col justify-center space-y-6 py-4">
        <div className="space-y-4 text-center">
          <p className="text-caption text-muted-foreground">
            Vocabulary · {step.index}/{step.total}
          </p>
          <AnnotatedJapaneseText
            text={content.kanji ?? content.kana}
            reading={content.kanji ? content.kana : null}
            romaji={getJapaneseRomaji(content)}
            size="hero"
            supportMode="none"
          />
          {soundEnabled ? (
            <div className="flex justify-center">
              <AudioPlayback
                audioUrl={content.audioUrl}
                japaneseText={content.kana}
                label="Listen to pronunciation"
              />
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-white/12 bg-black/40 p-4 backdrop-blur-sm">
          <p className="text-center font-story text-xl text-trail-glow">{content.meaning}</p>
          {content.partOfSpeech ? (
            <div className="mt-3 flex justify-center">
              <Badge variant="secondary">{content.partOfSpeech}</Badge>
            </div>
          ) : null}
          {content.examples.length > 0 ? (
            <div className="mt-4 space-y-3 border-t border-white/10 pt-3">
              {content.examples.map((example) => (
                <AnnotatedJapaneseText
                  key={example.japaneseText}
                  text={example.japaneseText}
                  romaji={example.romaji}
                  english={example.english}
                  size="sm"
                  supportMode={supportMode}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (content.type === "hiragana" || content.type === "katakana") {
    const label = content.type === "hiragana" ? "Hiragana" : "Katakana";
    return (
      <div className="flex flex-1 flex-col items-center justify-center space-y-4 py-8 text-center">
        <p className="text-caption text-muted-foreground">
          {label} · {step.index}/{step.total}
        </p>
        <p className="font-japanese text-6xl font-semibold sm:text-7xl" lang="ja">
          {content.character}
        </p>
        <p className="text-heading-4 text-foreground">{content.romaji}</p>
        <Badge variant="secondary">{content.rowLabel}</Badge>
        {soundEnabled ? (
          <AudioPlayback audioUrl={null} japaneseText={content.character} label="Listen" />
        ) : null}
      </div>
    );
  }

  if (content.type === "kanji") {
    return (
      <div className="flex flex-1 flex-col justify-center space-y-6 py-4">
        <div className="space-y-3 text-center">
          <p className="text-caption text-muted-foreground">
            Kanji · {step.index}/{step.total}
          </p>
          <p className="font-japanese text-6xl font-semibold sm:text-7xl" lang="ja">
            {content.character}
          </p>
          <p className="text-heading-4 text-foreground">{getJapaneseRomaji(content)}</p>
          {soundEnabled ? (
            <div className="flex justify-center">
              <AudioPlayback audioUrl={null} japaneseText={content.character} label="Listen" />
            </div>
          ) : null}
        </div>
        <div className="rounded-2xl border border-white/12 bg-black/40 p-4 backdrop-blur-sm">
          <p className="text-center text-body-lg">{content.meaning}</p>
          {content.strokeCount ? (
            <p className="text-center text-caption text-muted-foreground">
              {content.strokeCount} strokes
            </p>
          ) : null}
          {content.onyomi.length > 0 ? (
            <p className="text-body-sm text-muted-foreground">
              On: {content.onyomi.join(" · ")}
            </p>
          ) : null}
          {content.kunyomi.length > 0 ? (
            <p className="text-body-sm text-muted-foreground">
              Kun: {content.kunyomi.join(" · ")}
            </p>
          ) : null}
          {content.examples.length > 0 ? (
            <div className="mt-4 space-y-3 border-t border-white/10 pt-3">
              {content.examples.map((example) => (
                <AnnotatedJapaneseText
                  key={example.japaneseText}
                  text={example.japaneseText}
                  romaji={example.romaji}
                  english={example.english}
                  size="sm"
                  supportMode={supportMode}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (content.type === "grammar") {
    const titleRomaji = getJapaneseRomaji(content);
    return (
      <GlassPanel className="space-y-4 p-5">
        <p className="text-caption text-muted-foreground">
          Grammar · {step.index}/{step.total}
        </p>
        <StoryTitle as="h2" className="font-japanese text-2xl normal-case" lang="ja">
          {content.title}
        </StoryTitle>
        {titleRomaji ? (
          <p className="text-caption text-muted-foreground">{titleRomaji}</p>
        ) : null}
        <p className="text-body">{content.meaning}</p>
        {content.explanation ? (
          <p className="text-body-sm text-muted-foreground">{content.explanation}</p>
        ) : null}
        {content.examples.length > 0 ? (
          <div className="space-y-3 border-t border-glass-border pt-3">
            {content.examples.map((example) => (
              <AnnotatedJapaneseText
                key={example.japaneseText}
                text={example.japaneseText}
                romaji={example.romaji}
                english={example.english}
                size="sm"
                supportMode={supportMode}
              />
            ))}
          </div>
        ) : null}
      </GlassPanel>
    );
  }

  return null;
}
