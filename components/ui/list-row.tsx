import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ListRowProps = {
  primary: ReactNode;
  secondary?: ReactNode;
  tertiary?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  icon?: LucideIcon;
  className?: string;
  onClick?: () => void;
};

export function ListRow({
  primary,
  secondary,
  tertiary,
  leading,
  trailing,
  icon: Icon,
  className,
  onClick,
}: ListRowProps) {
  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-card border border-border bg-card px-4 py-3 text-left shadow-elevation-1 transition-colors",
        onClick && "hover:bg-accent/50 active:bg-accent",
        className,
      )}
    >
      {leading ? <div className="shrink-0">{leading}</div> : null}
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="truncate font-medium">{primary}</div>
        {secondary ? (
          <div className="truncate text-body-sm text-muted-foreground">{secondary}</div>
        ) : null}
        {tertiary ? (
          <div className="truncate text-caption">{tertiary}</div>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
      {Icon ? (
        <Icon className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
      ) : null}
    </Comp>
  );
}
