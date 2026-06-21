import type { ImmersiveNavTab } from "@/lib/navigation/immersive-nav.constants";

export type PrimaryNavItem = {
  href: string;
  label: string;
  navTab: ImmersiveNavTab;
};

/** VISUAL MD FILES Doc 01 — Tree · Camp · Study · Bag · Profile */
export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { href: "/tree", label: "Tree", navTab: "tree" },
  { href: "/camp", label: "Camp", navTab: "camp" },
  { href: "/study", label: "Study", navTab: "study" },
  { href: "/bag", label: "Bag", navTab: "bag" },
  { href: "/profile", label: "Profile", navTab: "profile" },
];
