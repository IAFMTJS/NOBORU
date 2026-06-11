"use client";

import { YamaExpressionImage } from "@/components/media/yama-expression-image";
import { YAMA_EXPRESSION_STYLES } from "@/features/yama/constants/yama.constants";
import type { YamaExpression, YamaSize } from "@/features/yama/types/yama.types";
import { cn } from "@/lib/utils";

const SIZE_CLASSES: Record<YamaSize, string> = {
  xs: "h-10 w-10",
  sm: "h-14 w-14",
  md: "h-20 w-20",
  lg: "h-24 w-24",
};

type YamaAvatarProps = {
  expression?: YamaExpression;
  size?: YamaSize;
  alt?: string;
  className?: string;
  priority?: boolean;
};

export function YamaAvatar({
  expression = "main",
  size = "md",
  alt = "Yama",
  className,
  priority,
}: YamaAvatarProps) {
  const styles = YAMA_EXPRESSION_STYLES[expression];

  return (
    <div
      className={cn(
        "relative shrink-0",
        SIZE_CLASSES[size],
        styles.containerClass,
        className,
      )}
    >
      <YamaExpressionImage
        expression={expression}
        alt={alt}
        fill
        priority={priority}
        sizes={size === "lg" ? "96px" : size === "md" ? "80px" : "56px"}
        className={styles.imageClass}
      />
    </div>
  );
}
