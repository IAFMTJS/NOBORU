import type { ImmersiveNavTab } from "@/lib/navigation/immersive-nav.constants";

export type PrimaryNavItem = {
  href: string;
  label: string;
  navTab: ImmersiveNavTab;
};

/** VISUAL MD FILES Doc 01 — Journey · Camp · Study · Bag · Profile */
export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { href: "/learn", label: "Journey", navTab: "journey" },
  { href: "/camp", label: "Camp", navTab: "camp" },
  { href: "/study", label: "Study", navTab: "study" },
  { href: "/bag", label: "Bag", navTab: "bag" },
  { href: "/profile", label: "Profile", navTab: "profile" },
];
