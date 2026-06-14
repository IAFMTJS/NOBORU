import type { ReactNode } from "react";

import { StoryTitle } from "@/components/visual/story-title";
import { cn } from "@/lib/utils";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  variant?: "default" | "story";
};

export function ScreenHeader({
  title,
  subtitle,
  action,
  className,
  variant = "default",
}: ScreenHeaderProps) {
  return (
    <header
      className={cn("flex items-start justify-between gap-4", className)}
    >
      <div className="min-w-0 space-y-1">
        {subtitle ? (
          <p className="text-caption">{subtitle}</p>
        ) : null}
        {variant === "story" ? (
          <StoryTitle as="h1" className="text-xl">
            {title}
          </StoryTitle>
        ) : (
          <h1 className="truncate text-heading-4">{title}</h1>
        )}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
