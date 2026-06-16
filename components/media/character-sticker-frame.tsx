import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

type CharacterStickerFrameProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** Clips scaled character art so opaque source padding does not show as a black box. */
export function CharacterStickerFrame({
  children,
  className,
  style,
}: CharacterStickerFrameProps) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)} style={style}>
      {children}
    </div>
  );
}
