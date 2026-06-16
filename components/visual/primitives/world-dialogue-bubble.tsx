"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type WorldDialogueBubbleProps = {
  speaker: string;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
};

/** Doc 03 conversation — world-themed speech bubble, not chat-app UI. */
export function WorldDialogueBubble({
  speaker,
  children,
  align = "left",
  className,
}: WorldDialogueBubbleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        align === "right" ? "items-end text-right" : "items-start text-left",
        className,
      )}
    >
      <span className="text-caption font-medium text-trail-glow/90">{speaker}</span>
      <div
        className={cn(
          "max-w-[min(100%,22rem)] rounded-2xl border border-white/15 bg-black/45 px-4 py-3 backdrop-blur-sm",
          align === "right" ? "rounded-br-md" : "rounded-bl-md",
        )}
      >
        {children}
      </div>
    </div>
  );
}
