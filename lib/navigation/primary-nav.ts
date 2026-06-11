import {
  NoboruExploreIcon,
  NoboruHomeIcon,
  NoboruLearnIcon,
  NoboruProfileIcon,
  NoboruReviewIcon,
  type NoboruIconComponent,
} from "@/components/icons";

export type PrimaryNavItem = {
  href: string;
  label: string;
  icon: NoboruIconComponent;
};

/** Matches approved mockups — 5-tab Explore model (uiux.mdc) */
export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { href: "/home", label: "Home", icon: NoboruHomeIcon },
  { href: "/learn", label: "Learn", icon: NoboruLearnIcon },
  { href: "/review", label: "Review", icon: NoboruReviewIcon },
  { href: "/explore", label: "Explore", icon: NoboruExploreIcon },
  { href: "/profile", label: "Profile", icon: NoboruProfileIcon },
];
