import {
  BookOpen,
  Gamepad2,
  Home,
  RotateCcw,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

export type PrimaryNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/** Matches uiux.mdc PRIMARY NAVIGATION */
export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/review", label: "Review", icon: RotateCcw },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/community", label: "Community", icon: Users },
  { href: "/profile", label: "Profile", icon: User },
];
