/** Art-direction asset URL builder — paths follow art-direction/06_asset_inventory_and_naming.md */

export const ART_PUBLIC_ROOT = "/art";

export type ArtCategory =
  | "backgrounds/camp"
  | "backgrounds/core"
  | "backgrounds/study"
  | "backgrounds/shrine"
  | "backgrounds/events"
  | "backgrounds/weather"
  | "backgrounds/utility"
  | "backgrounds/loading"
  | "characters/noboru/base"
  | "characters/noboru/reactions"
  | "characters/noboru/weather"
  | "characters/noboru/cosmetics"
  | "ui/navbars"
  | "ui/icons/nav"
  | "ui/icons/nodes"
  | "ui/icons/ui"
  | "ui/panels"
  | "ui/buttons"
  | "ui/progress"
  | "rewards"
  | "props/inventory"
  | "props/camp"
  | "props/particles"
  | "brand";

export function artPublicPath(category: ArtCategory, assetId: string): string {
  return `${ART_PUBLIC_ROOT}/${category}/${assetId}.webp`;
}

export function artSourcePath(category: ArtCategory, assetId: string): string {
  return `assets/art/${category}/${assetId}.webp`;
}
