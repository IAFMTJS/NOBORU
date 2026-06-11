import Link from "next/link";
import type { ReactNode } from "react";

import { YamaExpressionImage } from "@/components/media/yama-expression-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { YamaExpression } from "@/features/yama/types/yama.types";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  icon?: ReactNode;
  yamaExpression?: YamaExpression;
  className?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  icon,
  yamaExpression,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className,
      )}
    >
      {yamaExpression ? (
        <div className="relative h-20 w-20">
          <YamaExpressionImage
            expression={yamaExpression}
            alt=""
            fill
            sizes="80px"
          />
        </div>
      ) : icon ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          {icon}
        </div>
      ) : null}
      <h3 className="text-heading-5">{title}</h3>
      <p className="max-w-sm text-body-sm text-muted-foreground">{description}</p>
      {actionLabel && actionHref ? (
        <Button className="mt-2" asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : actionLabel && onAction ? (
        <Button className="mt-2" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
