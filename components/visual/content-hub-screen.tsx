import type { ReactNode } from "react";

import type { SceneId } from "@/components/media/scene-image";
import { SceneImage } from "@/components/media/scene-image";
import { IllustratedScreen } from "@/components/visual/illustrated-screen";

type ContentHubScreenProps = {
  children: ReactNode;
  scene?: SceneId;
};

/** Study hall pages with full-bleed painterly backgrounds per mockup style. */
export function ContentHubScreen({
  children,
  scene = "study_atmosphere",
}: ContentHubScreenProps) {
  return (
    <IllustratedScreen
      scrim="minimal"
      background={
        <SceneImage
          scene={scene}
          alt=""
          className="absolute inset-0 min-h-dvh rounded-none"
        />
      }
    >
      {children}
    </IllustratedScreen>
  );
}
