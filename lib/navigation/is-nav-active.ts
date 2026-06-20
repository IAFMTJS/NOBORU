import { PRIMARY_NAV_ITEMS } from "@/lib/navigation/primary-nav";
import type { ImmersiveNavTab } from "@/lib/navigation/immersive-nav.constants";

const STUDY_CHILD_PREFIXES = [
  "/review",
  "/learn/hiragana",
  "/learn/katakana",
  "/learn/vocabulary",
  "/learn/grammar",
  "/learn/kanji",
  "/learn/listening",
  "/learn/reading",
  "/games",
] as const;

const CAMP_CHILD_PREFIXES = [
  "/home",
  "/world/shop",
  "/world/events",
  "/world/social",
  "/world/fox-camp",
  "/community",
] as const;

const BAG_CHILD_PREFIXES = ["/world/inventory"] as const;

const PROFILE_CHILD_PREFIXES = ["/settings", "/achievements", "/progress", "/profile/memory-book"] as const;

const JOURNEY_CHILD_PREFIXES = ["/trials", "/learn/world", "/explore", "/endgame"] as const;

const TREE_CHILD_PREFIXES = [] as const;

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function matchesAnyPrefix(
  pathname: string,
  prefixes: readonly string[],
): boolean {
  return prefixes.some((prefix) => matchesPrefix(pathname, prefix));
}

function isStudyTrainingRoute(pathname: string): boolean {
  return (
    matchesPrefix(pathname, "/study") ||
    matchesPrefix(pathname, "/dojo") ||
    matchesPrefix(pathname, "/world/discover") ||
    pathname === "/world" ||
    matchesAnyPrefix(pathname, STUDY_CHILD_PREFIXES)
  );
}

function isBagRoute(pathname: string): boolean {
  return matchesPrefix(pathname, "/bag") || matchesAnyPrefix(pathname, BAG_CHILD_PREFIXES);
}

function isCampRoute(pathname: string): boolean {
  return matchesPrefix(pathname, "/camp") || matchesAnyPrefix(pathname, CAMP_CHILD_PREFIXES);
}

function isProfileRoute(pathname: string): boolean {
  return (
    matchesPrefix(pathname, "/profile") || matchesAnyPrefix(pathname, PROFILE_CHILD_PREFIXES)
  );
}

function isTreeRoute(pathname: string): boolean {
  return matchesPrefix(pathname, "/tree") || matchesAnyPrefix(pathname, TREE_CHILD_PREFIXES);
}

function isJourneyRoute(pathname: string): boolean {
  if (!matchesPrefix(pathname, "/learn")) return false;
  if (isStudyTrainingRoute(pathname)) return false;
  return true;
}

export function isNavActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;

  if (href === "/learn") {
    return (
      isJourneyRoute(pathname) || matchesAnyPrefix(pathname, JOURNEY_CHILD_PREFIXES)
    );
  }

  if (href === "/tree") {
    return isTreeRoute(pathname);
  }

  if (href === "/camp") {
    return isCampRoute(pathname);
  }

  if (href === "/study") {
    return isStudyTrainingRoute(pathname);
  }

  if (href === "/bag") {
    return isBagRoute(pathname);
  }

  if (href === "/profile") {
    return isProfileRoute(pathname);
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function resolveNavTabFromPath(pathname: string): ImmersiveNavTab {
  const match = PRIMARY_NAV_ITEMS.find((item) => isNavActive(pathname, item.href));
  return match?.navTab ?? "journey";
}
