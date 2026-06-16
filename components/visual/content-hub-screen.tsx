import type { ReactNode } from "react";

import { TabScene } from "@/components/visual/shells/viewport-background";

type ContentHubScreenProps = {
  children: ReactNode;
};

/** Study hall pages — background from app shell (study tab). */
export function ContentHubScreen({ children }: ContentHubScreenProps) {
  return <TabScene className="min-h-dvh">{children}</TabScene>;
}
