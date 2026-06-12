"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { offlineClient } from "@/features/offline/services/offline-client.service";
import { useOnlineStatus } from "@/features/offline/hooks/use-online-status";
import {
  isJapaneseSpeechSupported,
  preloadJapaneseSpeechVoices,
  speakJapanese,
} from "@/lib/audio/japanese-speech";
import {
  configureHtmlAudioElement,
  playHtmlAudio,
} from "@/lib/audio/play-html-audio";

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
    if (isJapaneseSpeechSupported()) {
      void preloadJapaneseSpeechVoices();
    }
  }, []);

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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    configureHtmlAudioElement(audio);
  }, [resolvedUrl]);

  async function speakWithJapaneseVoice() {
    if (!isJapaneseSpeechSupported()) {
      setTtsSupported(false);
      return;
    }

    try {
      setPlaying(true);
      await speakJapanese(japaneseText);
    } catch {
      setTtsSupported(false);
    } finally {
      setPlaying(false);
    }
  }

  async function playAudio() {
    if (resolvedUrl && audioRef.current) {
      try {
        setPlaying(true);
        await playHtmlAudio(audioRef.current);
        if (audioUrl && online) {
          void offlineClient.prefetchAudio(audioUrl);
        }
        return;
      } catch {
        await speakWithJapaneseVoice();
      }
      return;
    }

    await speakWithJapaneseVoice();
  }

  function handleEnded() {
    setPlaying(false);
  }

  return (
    <div className="space-y-2">
      {resolvedUrl ? (
        <audio
          ref={audioRef}
          src={resolvedUrl}
          onEnded={handleEnded}
          onPause={() => setPlaying(false)}
          playsInline
          preload="auto"
        >
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
        {playing ? "Playing…" : (label ?? "Listen")}
      </Button>
      {!audioUrl && !ttsSupported ? (
        <p className="text-caption text-muted-foreground">
          Audio playback is unavailable in this browser.
        </p>
      ) : null}
    </div>
  );
}
