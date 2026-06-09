import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SelectionCardProps = {
  label: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  className?: string;
};

export function SelectionCard({
  label,
  description,
  selected = false,
  onClick,
  icon,
  className,
}: SelectionCardProps) {
  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-card border bg-card p-4 text-left shadow-elevation-1 transition-colors motion-standard",
        selected
          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
          : "border-border hover:border-primary/30 hover:bg-accent/30",
        className,
      )}
    >
      {icon ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
          {icon}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="font-medium">{label}</p>
        {description ? (
          <p className="text-body-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </Comp>
  );
}
