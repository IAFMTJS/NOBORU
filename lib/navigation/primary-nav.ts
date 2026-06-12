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
  navTab: "home" | "learn" | "review" | "explore" | "profile";
};

/** Matches approved mockups — 5-tab Explore model (uiux.mdc) */
export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { href: "/home", label: "Home", icon: NoboruHomeIcon, navTab: "home" },
  { href: "/learn", label: "Learn", icon: NoboruLearnIcon, navTab: "learn" },
  { href: "/review", label: "Review", icon: NoboruReviewIcon, navTab: "review" },
  { href: "/explore", label: "Explore", icon: NoboruExploreIcon, navTab: "explore" },
  { href: "/profile", label: "Profile", icon: NoboruProfileIcon, navTab: "profile" },
];
