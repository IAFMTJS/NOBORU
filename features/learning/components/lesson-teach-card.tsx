"use client";

import { AudioPlayback } from "@/components/media/audio-playback";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JapaneseText } from "@/features/learning/components/japanese-text";
import type { LessonTeachStep } from "@/features/learning/types/lesson.types";

type LessonTeachCardProps = {
  step: LessonTeachStep;
  soundEnabled?: boolean;
};

export function LessonTeachCard({ step, soundEnabled = true }: LessonTeachCardProps) {
  const { content } = step;

  if (content.type === "vocabulary") {
    return (
      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardDescription>
            Vocabulary · {step.index}/{step.total}
          </CardDescription>
          <JapaneseText
            text={content.kanji ?? content.kana}
            reading={content.kanji ? content.kana : null}
            size="xl"
          />
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-body">{content.meaning}</p>
          {content.partOfSpeech ? (
            <Badge variant="secondary">{content.partOfSpeech}</Badge>
          ) : null}
          {soundEnabled ? (
            <AudioPlayback
              audioUrl={content.audioUrl}
              japaneseText={content.kana}
              label="Listen to pronunciation"
            />
          ) : null}
          {content.examples.length > 0 ? (
            <div className="space-y-3 border-t border-border pt-3">
              <p className="text-caption text-muted-foreground">Examples</p>
              {content.examples.map((example) => (
                <JapaneseText
                  key={example.japaneseText}
                  text={example.japaneseText}
                  romaji={example.romaji}
                  english={example.english}
                  size="sm"
                />
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  if (content.type === "hiragana") {
    return (
      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardDescription>
            Hiragana · {step.index}/{step.total}
          </CardDescription>
          <CardTitle className="text-heading-1">{content.character}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-heading-5">{content.romaji}</p>
          <Badge variant="secondary">{content.rowLabel}</Badge>
          {soundEnabled ? (
            <AudioPlayback
              audioUrl={null}
              japaneseText={content.character}
              label="Listen"
            />
          ) : null}
        </CardContent>
      </Card>
    );
  }

  if (content.type === "katakana") {
    return (
      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardDescription>
            Katakana · {step.index}/{step.total}
          </CardDescription>
          <CardTitle className="text-heading-1">{content.character}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-heading-5">{content.romaji}</p>
          <Badge variant="secondary">{content.rowLabel}</Badge>
          {soundEnabled ? (
            <AudioPlayback
              audioUrl={null}
              japaneseText={content.character}
              label="Listen"
            />
          ) : null}
        </CardContent>
      </Card>
    );
  }

  if (content.type === "kanji") {
    return (
      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardDescription>
            Kanji · {step.index}/{step.total}
          </CardDescription>
          <CardTitle className="text-heading-1">{content.character}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-body">{content.meaning}</p>
          {content.strokeCount ? (
            <Badge variant="outline">{content.strokeCount} strokes</Badge>
          ) : null}
          {soundEnabled ? (
            <AudioPlayback
              audioUrl={null}
              japaneseText={content.character}
              label="Listen"
            />
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
            <div className="space-y-3 border-t border-border pt-3">
              <p className="text-caption text-muted-foreground">Examples</p>
              {content.examples.map((example) => (
                <JapaneseText
                  key={example.japaneseText}
                  text={example.japaneseText}
                  romaji={example.romaji}
                  english={example.english}
                  size="sm"
                />
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  if (content.type === "grammar") {
    return (
      <Card className="shadow-elevation-1">
        <CardHeader>
          <CardDescription>
            Grammar · {step.index}/{step.total}
          </CardDescription>
          <CardTitle className="text-heading-4">{content.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-body">{content.meaning}</p>
          {content.explanation ? (
            <p className="text-body-sm text-muted-foreground">{content.explanation}</p>
          ) : null}
          {content.examples.length > 0 ? (
            <div className="space-y-3 border-t border-border pt-3">
              <p className="text-caption text-muted-foreground">Examples</p>
              {content.examples.map((example) => (
                <JapaneseText
                  key={example.japaneseText}
                  text={example.japaneseText}
                  romaji={example.romaji}
                  english={example.english}
                  size="sm"
                />
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return null;
}
