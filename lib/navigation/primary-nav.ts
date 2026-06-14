import type { ImmersiveNavTab } from "@/lib/navigation/immersive-nav.constants";

export type PrimaryNavItem = {
  href: string;
  label: string;
  navTab: ImmersiveNavTab;
};

/** Immersive navigation — Camp · Journey · Dojo · World · Profile */
export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { href: "/camp", label: "Camp", navTab: "camp" },
  { href: "/learn", label: "Journey", navTab: "journey" },
  { href: "/dojo", label: "Dojo", navTab: "dojo" },
  { href: "/world", label: "World", navTab: "world" },
  { href: "/profile", label: "Profile", navTab: "profile" },
];
