import type { ReactNode } from "react";

import type { SceneId } from "@/components/media/scene-image";
import { SecondaryScreenShell } from "@/components/visual/shells/secondary-screen-shell";

type StudyHubLayoutProps = {
  children: ReactNode;
  /** @deprecated App shell provides study tab background */
  scene?: SceneId;
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  action?: ReactNode;
};

export function StudyHubLayout({
  children,
  title,
  subtitle,
  backHref,
  backLabel,
  action,
}: StudyHubLayoutProps) {
  return (
    <SecondaryScreenShell
      title={title}
      subtitle={subtitle}
      backHref={backHref ?? "/study"}
      backLabel={backLabel ?? "Study"}
      headerAction={action}
      contentClassName="pb-2"
    >
      <div className="mx-auto max-w-md space-y-4">{children}</div>
    </SecondaryScreenShell>
  );
}
