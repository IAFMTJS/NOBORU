import { WorldArtImage } from "@/components/visual/world/world-art-image";
import { NAV_TAB_MASCOT_ASSETS } from "@/lib/assets/art-mappings";

type CharacterStageProps = {
  speaker: string;
  size?: number;
};

/** Conversation character staging — Noboru vs traveler presence. */
export function CharacterStage({ speaker, size = 72 }: CharacterStageProps) {
  const isNoboru =
    speaker.toLowerCase().includes("noboru") || speaker.toLowerCase().includes("yama");

  return (
    <div className="flex flex-col items-center gap-2">
      <WorldArtImage
        asset={isNoboru ? NAV_TAB_MASCOT_ASSETS.study : NAV_TAB_MASCOT_ASSETS.profile}
        alt=""
        width={size}
        height={size}
        className="drop-shadow-lg"
      />
      <p className="font-story text-xs uppercase tracking-widest text-trail-glow/90">{speaker}</p>
    </div>
  );
}
