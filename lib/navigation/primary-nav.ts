import {
  NoboruExploreIcon,
  NoboruHomeIcon,
  NoboruLearnIcon,
  NoboruProfileIcon,
  NoboruReviewIcon,
  type NoboruIconComponent,
} from "@/components/icons";

import type { ImmersiveNavTab } from "@/lib/navigation/immersive-nav.constants";

export type PrimaryNavItem = {
  href: string;
  label: string;
  icon: NoboruIconComponent;
  navTab: ImmersiveNavTab;
};

/** Immersive navigation — Camp · Journey · Dojo · World · Profile */
export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { href: "/camp", label: "Camp", icon: NoboruHomeIcon, navTab: "camp" },
  { href: "/learn", label: "Journey", icon: NoboruLearnIcon, navTab: "journey" },
  { href: "/dojo", label: "Dojo", icon: NoboruReviewIcon, navTab: "dojo" },
  { href: "/world", label: "World", icon: NoboruExploreIcon, navTab: "world" },
  { href: "/profile", label: "Profile", icon: NoboruProfileIcon, navTab: "profile" },
];
