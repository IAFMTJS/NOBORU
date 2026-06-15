import type { ReactNode } from "react";

import type { SceneId } from "@/components/media/scene-image";
import { ContentHubScreen } from "@/components/visual/content-hub-screen";
import { StudyHubHeader } from "@/features/dojo/components/study-hub-header";

type StudyHubLayoutProps = {
  children: ReactNode;
  scene?: SceneId;
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  action?: ReactNode;
};

export function StudyHubLayout({
  children,
  scene = "study_atmosphere",
  title,
  subtitle,
  backHref,
  backLabel,
  action,
}: StudyHubLayoutProps) {
  return (
    <ContentHubScreen scene={scene}>
      <div className="relative flex min-h-dvh flex-col">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/80"
          aria-hidden
        />

        <header className="relative z-10 shrink-0 space-y-3 p-4 pt-3">
          <StudyHubHeader
            title={title}
            subtitle={subtitle}
            backHref={backHref}
            backLabel={backLabel}
            action={action}
          />
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto px-4 py-2 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-md space-y-4">{children}</div>
        </main>
      </div>
    </ContentHubScreen>
  );
}
