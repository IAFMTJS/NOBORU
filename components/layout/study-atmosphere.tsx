import type { ReactNode } from "react";

import { glassSurface } from "@/components/visual/primitives/glass-surface";
import { cn } from "@/lib/utils";

type StudyAtmosphereProps = {
  children: ReactNode;
  className?: string;
};

export function StudyAtmosphere({ children, className }: StudyAtmosphereProps) {
  return <div className={cn(glassSurface.card, "space-y-3 p-4", className)}>{children}</div>;
}
