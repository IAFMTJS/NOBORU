"use client";

import { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

type AudioPlaybackProps = {
  audioUrl: string | null;
  japaneseText: string;
  label?: string;
};

export function AudioPlayback({ audioUrl, japaneseText, label }: AudioPlaybackProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(true);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setTtsSupported(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(japaneseText);
    utterance.lang = "ja-JP";
    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
  }, [japaneseText]);

  async function playAudio() {
    if (audioUrl && audioRef.current) {
      try {
        setPlaying(true);
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } catch {
        speak();
      }
      return;
    }

    speak();
  }

  function handleEnded() {
    setPlaying(false);
  }

  return (
    <div className="space-y-2">
      {audioUrl ? (
        <audio ref={audioRef} src={audioUrl} onEnded={handleEnded} preload="none">
          <track kind="captions" />
        </audio>
      ) : null}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={playing}
        onClick={() => void playAudio()}
      >
        {playing ? "Playing…" : label ?? "Play Audio"}
      </Button>
      {!audioUrl && !ttsSupported ? (
        <p className="text-caption text-muted-foreground">
          Audio playback is unavailable in this browser.
        </p>
      ) : null}
      {!audioUrl && ttsSupported ? (
        <p className="text-caption text-muted-foreground">
          Using browser speech synthesis when no audio file is attached.
        </p>
      ) : null}
    </div>
  );
}
