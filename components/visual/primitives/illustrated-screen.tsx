import type { HTMLAttributes, ReactNode } from "react";

import { TabScene } from "@/components/visual/shells/viewport-background";
import { cn } from "@/lib/utils";

type IllustratedScreenProps = HTMLAttributes<HTMLDivElement> & {
  /** @deprecated App layout provides tab backgrounds */
  background?: ReactNode;
  /** @deprecated */
  scrim?: "minimal" | "full" | "none";
  /** @deprecated */
  fullBleedBackground?: boolean;
};

/** Secondary route shell — sits above app viewport backgrounds. */
export function IllustratedScreen({ className, children, ...props }: IllustratedScreenProps) {
  return (
    <TabScene className={cn("min-h-dvh", className)} {...props}>
      {children}
    </TabScene>
  );
}
