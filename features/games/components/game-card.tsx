import Link from "next/link";
import type { ReactNode } from "react";

import { GameArtImage } from "@/components/media/game-art-image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type GameCardProps = {
  href: string;
  title: string;
  description: string;
  gameSlug?: string;
  icon?: ReactNode;
  badge?: string;
  disabled?: boolean;
  className?: string;
};

function GameCardArt({
  gameSlug,
  icon,
  title,
}: {
  gameSlug?: string;
  icon?: ReactNode;
  title: string;
}) {
  if (gameSlug) {
    return (
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-border/60">
        <GameArtImage
          slug={gameSlug}
          alt={title}
          className="h-full w-full object-cover"
          sizes="56px"
        />
      </div>
    );
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      {icon}
    </div>
  );
}

export function GameCard({
  href,
  title,
  description,
  gameSlug,
  icon,
  badge,
  disabled,
  className,
}: GameCardProps) {
  if (disabled) {
    return (
      <div
        className={cn(
          "flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 opacity-80",
          className,
        )}
      >
        <GameCardArt gameSlug={gameSlug} icon={icon} title={title} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-body-sm font-medium">{title}</p>
            <Badge variant="outline" className="text-[10px]">
              Soon
            </Badge>
          </div>
          <p className="text-caption text-muted-foreground">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "focus-ring flex items-start gap-3 rounded-xl border border-white/12 bg-black/40 p-4 shadow-elevation-1 transition-colors hover:border-trail-glow/30 hover:bg-black/50",
        className,
      )}
    >
      <GameCardArt gameSlug={gameSlug} icon={icon} title={title} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-body-sm font-medium">{title}</p>
          {badge ? (
            <Badge variant="secondary" className="text-[10px]">
              {badge}
            </Badge>
          ) : null}
        </div>
        <p className="text-caption text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
