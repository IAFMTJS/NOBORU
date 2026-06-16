"use client";

import { useEffect, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { VISUAL_MOCKUP } from "../tokens";

type CampScenePanelProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
  background?: ReactNode;
};

/** Bottom sheet panel — camp world stays visible behind interaction (mockup). */
export function CampScenePanel({
  open,
  onClose,
  title,
  description,
  children,
  className,
  background,
}: CampScenePanelProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close panel"
        className="absolute inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal
        aria-labelledby="camp-scene-panel-title"
        aria-describedby="camp-scene-panel-description"
        className={cn(
          "absolute bottom-0 left-0 right-0 z-50 mx-auto max-w-phone rounded-t-2xl border-x border-t shadow-elevation-3",
          VISUAL_MOCKUP.glass.sheetClass,
          className,
        )}
      >
        {background}
        <div className="relative z-10 flex max-h-[min(62dvh,28rem)] flex-col">
          <header className="flex items-start justify-between gap-3 border-b border-white/10 p-4">
            <div className="space-y-0.5 text-left">
              <h2
                id="camp-scene-panel-title"
                className="font-story text-body-sm text-trail-glow"
              >
                {title}
              </h2>
              <p id="camp-scene-panel-description" className="text-caption text-white/70">
                {description}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="focus-ring rounded-sm p-1 text-white/70 transition hover:text-white"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
        </div>
      </aside>
    </>
  );
}
