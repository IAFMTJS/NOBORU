"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  CINEMATIC_SCRIPTS,
  type CinematicSlug,
} from "@/features/cinematics/constants/cinematic.constants";

type CinematicPlayerProps = {
  slug: CinematicSlug;
  onComplete: () => void;
};

export function CinematicPlayer({ slug, onComplete }: CinematicPlayerProps) {
  const panels = CINEMATIC_SCRIPTS[slug];
  const [panelIndex, setPanelIndex] = useState(0);
  const panel = panels[panelIndex];

  const advance = useCallback(() => {
    if (panelIndex + 1 >= panels.length) {
      onComplete();
      return;
    }
    setPanelIndex((i) => i + 1);
  }, [onComplete, panelIndex, panels.length]);

  useEffect(() => {
    if (!panel) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const timer = window.setTimeout(advance, panel.durationMs);
    return () => window.clearTimeout(timer);
  }, [advance, panel]);

  if (!panel) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 p-6">
      <div className="max-w-sm space-y-6 text-center">
        <div
          className="mx-auto flex h-48 w-full items-center justify-center rounded-2xl bg-gradient-to-b from-primary/20 to-muted"
          role="img"
          aria-label={panel.imageAlt}
        >
          <span className="text-heading-4 text-muted-foreground">{panel.imageAlt}</span>
        </div>
        <p className="text-body-lg font-medium">{panel.caption}</p>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onComplete}>
            Skip
          </Button>
          <Button className="flex-1" onClick={advance}>
            {panelIndex + 1 >= panels.length ? "Continue" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
