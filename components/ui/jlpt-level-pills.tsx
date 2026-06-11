import Link from "next/link";

import { JLPT_LEVELS, type JlptLevel } from "@/lib/content/types";
import { getJlptQueryString } from "@/lib/learning/jlpt-content.constants";
import { cn } from "@/lib/utils";

type JlptLevelPillsProps = {
  basePath: string;
  activeLevel: JlptLevel;
  className?: string;
};

export function JlptLevelPills({
  basePath,
  activeLevel,
  className,
}: JlptLevelPillsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="tablist">
      {JLPT_LEVELS.map((level) => {
        const isActive = level === activeLevel;
        const href = `${basePath}${getJlptQueryString(level)}`;

        return (
          <Link
            key={level}
            href={href}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "rounded-full border px-3 py-1 text-caption font-medium transition-colors",
              isActive
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {level.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
