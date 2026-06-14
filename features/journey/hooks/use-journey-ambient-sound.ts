"use client";

import { useEffect, useRef } from "react";

/**
 * Very subtle wind ambience via Web Audio — no asset files required.
 * Respects user sound preference and cleans up on unmount.
 */
export function useJourneyAmbientSound(
  enabled: boolean,
  active: boolean,
): void {
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!enabled || !active || typeof window === "undefined") {
      if (contextRef.current) {
        void contextRef.current.close();
        contextRef.current = null;
      }
      return;
    }

    const AudioCtx =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const context = new AudioCtx();
    contextRef.current = context;

    const bufferSize = 2 * context.sampleRate;
    const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      output[i] = (Math.random() * 2 - 1) * 0.35;
    }

    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;

    const gain = context.createGain();
    gain.gain.value = 0.018;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start();

    return () => {
      source.stop();
      void context.close();
      contextRef.current = null;
    };
  }, [active, enabled]);
}
