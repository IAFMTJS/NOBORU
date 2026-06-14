"use client";

import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import type {
  YamaSize,
  YamaTrainingGroundLocation,
} from "@/features/yama/types/yama.types";
import { cn } from "@/lib/utils";

type YamaTrainingPresenceProps = {
  location: YamaTrainingGroundLocation;
  seed?: number;
  size?: YamaSize;
  className?: string;
};

export function YamaTrainingPresence({
  location,
  seed = 0,
  size = "sm",
  className,
}: YamaTrainingPresenceProps) {
  const presence = yamaService.resolveTrainingGroundsPresence(location, seed);

  return (
    <YamaPresence
      presence={presence}
      size={size}
      className={cn("mb-4", className)}
    />
  );
}
