"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { offlineClient } from "@/features/offline/services/offline-client.service";
import { useOnlineStatus } from "@/features/offline/hooks/use-online-status";

type AudioPlaybackProps = {
  audioUrl: string | null;
  japaneseText: string;
  label?: string;
  disabled?: boolean;
};

export function AudioPlayback({
  audioUrl,
  japaneseText,
  label,
  disabled = false,
}: AudioPlaybackProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(audioUrl);
  const [playing, setPlaying] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(true);
  const online = useOnlineStatus();

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    async function resolveAudio() {
      if (!audioUrl) {
        setResolvedUrl(null);
        return;
      }

      if (online) {
        setResolvedUrl(audioUrl);
        void offlineClient.prefetchAudio(audioUrl);
        return;
      }

      const cachedUrl = await offlineClient.getCachedAudioUrl(audioUrl);
      if (cancelled) return;
      objectUrl = cachedUrl;
      setResolvedUrl(cachedUrl ?? audioUrl);
    }

    void resolveAudio();
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [audioUrl, online]);

  const speak = () => {
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
  };

  async function playAudio() {
    if (resolvedUrl && audioRef.current) {
      try {
        setPlaying(true);
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        if (audioUrl && online) {
          void offlineClient.prefetchAudio(audioUrl);
        }
        return;
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
      {resolvedUrl ? (
        <audio ref={audioRef} src={resolvedUrl} onEnded={handleEnded} preload="none">
          <track kind="captions" />
        </audio>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full sm:w-auto"
        disabled={disabled || playing}
        onClick={() => void playAudio()}
      >
        {playing ? "Playing…" : label ?? "Listen"}
      </Button>
      {!audioUrl && !ttsSupported ? (
        <p className="text-caption text-muted-foreground">
          Audio playback is unavailable in this browser.
        </p>
      ) : null}
    </div>
  );
}
