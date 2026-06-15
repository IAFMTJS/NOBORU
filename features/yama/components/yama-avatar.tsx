"use client";

import { YamaExpressionImage } from "@/components/media/yama-expression-image";
import { YAMA_EXPRESSION_STYLES } from "@/features/yama/constants/yama.constants";
import type { YamaExpression, YamaSize } from "@/features/yama/types/yama.types";
import type { NoboruPoseId } from "@/lib/assets/art-mappings";
import { cn } from "@/lib/utils";

const SIZE_CLASSES: Record<YamaSize, string> = {
  xs: "h-10 w-10",
  sm: "h-14 w-14",
  md: "h-20 w-20",
  lg: "h-24 w-24",
  xl: "h-32 w-32 sm:h-36 sm:w-36",
};

const SIZE_PX: Record<YamaSize, string> = {
  xs: "40px",
  sm: "56px",
  md: "80px",
  lg: "96px",
  xl: "(max-width: 512px) 128px, 144px",
};

type YamaAvatarProps = {
  expression?: YamaExpression;
  poseId?: NoboruPoseId;
  size?: YamaSize;
  fit?: "sticker" | "full";
  alt?: string;
  className?: string;
  priority?: boolean;
};

export function YamaAvatar({
  expression = "main",
  poseId,
  size = "md",
  fit = "sticker",
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
        poseId={poseId}
        alt={alt}
        fill
        fit={fit}
        priority={priority}
        sizes={SIZE_PX[size]}
        className={styles.imageClass}
      />
    </div>
  );
}
