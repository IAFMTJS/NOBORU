import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Parchment / lacquer glass surfaces — art-direction doc 08. */
export const glassSurface = {
  surface:
    "border border-white/60 bg-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_4px_20px_rgba(94,115,87,0.1)] backdrop-blur-md",
  hud: "rounded-card border border-white/55 bg-white/58 shadow-elevation-2 backdrop-blur-md",
  card: "rounded-2xl border border-white/55 bg-white/48 shadow-elevation-1 backdrop-blur-md",
  sheet:
    "rounded-t-2xl border border-white/60 bg-white/62 shadow-elevation-3 backdrop-blur-lg",
  chip:
    "rounded-full border border-white/55 bg-white/52 px-2 py-1 text-caption font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-sm",
  buttonPrimary:
    "rounded-[var(--radius)] border border-primary/35 bg-primary/14 font-semibold text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_2px_12px_rgba(226,61,77,0.12)] backdrop-blur-md transition hover:bg-primary/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45",
  buttonSecondary:
    "rounded-[var(--radius)] border border-white/60 bg-white/45 font-medium text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md transition hover:bg-white/58 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45",
  buttonGhost:
    "rounded-[var(--radius)] border border-transparent bg-white/25 font-medium text-foreground backdrop-blur-sm transition hover:border-white/45 hover:bg-white/42 active:scale-[0.98]",
  buttonIcon:
    "rounded-2xl border border-white/55 bg-white/48 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-md transition hover:bg-white/62 active:scale-[0.98]",
  tabActive:
    "rounded-full border border-primary/30 bg-primary/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-sm",
  tabInactive:
    "rounded-full border border-transparent text-muted-foreground hover:border-white/40 hover:bg-white/35 hover:backdrop-blur-sm",
  navShell:
    "rounded-full border border-white/55 bg-white/58 p-0.5 shadow-elevation-3 backdrop-blur-md",
  navItemActive:
    "rounded-full border border-primary/25 bg-primary/12 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-sm",
  navItemInactive:
    "rounded-full border border-transparent text-muted-foreground hover:bg-white/45 hover:backdrop-blur-sm",
} as const;

type GlassSurfacePanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "hud" | "card" | "sheet";
  children: ReactNode;
};

export function GlassSurfacePanel({
  variant = "card",
  className,
  children,
  ...props
}: GlassSurfacePanelProps) {
  const variantClass =
    variant === "hud"
      ? glassSurface.hud
      : variant === "sheet"
        ? glassSurface.sheet
        : glassSurface.card;

  const paddingClass = variant === "card" || variant === "sheet" ? "p-4" : "";

  return (
    <div className={cn(variantClass, paddingClass, className)} {...props}>
      {children}
    </div>
  );
}

type GlassSurfaceButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
};

export function GlassSurfaceButton({
  variant = "primary",
  fullWidth = true,
  className,
  children,
  type = "button",
  ...props
}: GlassSurfaceButtonProps) {
  const variantClass =
    variant === "primary"
      ? glassSurface.buttonPrimary
      : variant === "secondary"
        ? glassSurface.buttonSecondary
        : glassSurface.buttonGhost;

  return (
    <button
      type={type}
      className={cn(
        "focus-ring motion-button inline-flex h-11 items-center justify-center px-5 font-sans text-body-sm",
        variantClass,
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type GlassSurfaceCardProps = {
  children: ReactNode;
  padding?: "sm" | "md";
  className?: string;
};

export function GlassSurfaceCard({ padding = "md", className, children }: GlassSurfaceCardProps) {
  const paddingClass = padding === "sm" ? "p-2" : "p-4";
  return <div className={cn(glassSurface.card, paddingClass, className)}>{children}</div>;
}

type GlassSurfaceCardButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  padding?: "sm" | "md";
};

export function GlassSurfaceCardButton({
  padding = "md",
  className,
  children,
  type = "button",
  ...props
}: GlassSurfaceCardButtonProps) {
  const paddingClass = padding === "sm" ? "p-2" : "p-4";
  return (
    <button
      type={type}
      className={cn(
        glassSurface.card,
        "focus-ring transition hover:bg-white/58 active:scale-[0.98]",
        paddingClass,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type GlassSurfaceChipProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function GlassSurfaceChip({ className, children, ...props }: GlassSurfaceChipProps) {
  return (
    <span className={cn(glassSurface.chip, "inline-flex items-center gap-1", className)} {...props}>
      {children}
    </span>
  );
}
