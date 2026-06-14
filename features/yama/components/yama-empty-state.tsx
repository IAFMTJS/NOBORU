"use client";

import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import type { YamaEmptySurface } from "@/features/yama/types/yama.types";
import { cn } from "@/lib/utils";

type YamaEmptyStateProps = {
  title: string;
  description: string;
  surface?: YamaEmptySurface;
  seed?: number;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  icon?: ReactNode;
  className?: string;
};

export function YamaEmptyState({
  title,
  description,
  surface = "generic",
  seed = 0,
  actionLabel,
  onAction,
  actionHref,
  icon,
  className,
}: YamaEmptyStateProps) {
  const presence = yamaService.resolveEmptyPresence(surface, seed);

  return (
    <div className={cn("space-y-4", className)}>
      <YamaPresence
        presence={presence}
        size="md"
        layout="vertical"
        className="items-center"
      />
      <EmptyState
        title={title}
        description={description}
        actionLabel={actionLabel}
        onAction={onAction}
        actionHref={actionHref}
        icon={icon}
      />
    </div>
  );
}
