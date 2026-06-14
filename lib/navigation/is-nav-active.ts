const WORLD_CHILD_PREFIXES = [
  "/games",
  "/community",
  "/trials",
  "/achievements",
  "/progress",
  "/endgame",
  "/learn/world",
  "/explore",
] as const;

const DOJO_CHILD_PREFIXES = [
  "/review",
  "/learn/hiragana",
  "/learn/katakana",
  "/learn/vocabulary",
  "/learn/grammar",
  "/learn/kanji",
  "/learn/listening",
  "/learn/reading",
] as const;

const CAMP_CHILD_PREFIXES = ["/home"] as const;

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function matchesAnyPrefix(
  pathname: string,
  prefixes: readonly string[],
): boolean {
  return prefixes.some((prefix) => matchesPrefix(pathname, prefix));
}

function isDojoTrainingRoute(pathname: string): boolean {
  return matchesAnyPrefix(pathname, DOJO_CHILD_PREFIXES);
}

function isWorldDiscoveryRoute(pathname: string): boolean {
  return matchesAnyPrefix(pathname, WORLD_CHILD_PREFIXES);
}

export function isNavActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;

  if (href === "/learn") {
    if (!matchesPrefix(pathname, "/learn")) return false;
    if (isDojoTrainingRoute(pathname)) return false;
    if (matchesPrefix(pathname, "/learn/world")) return false;
    return true;
  }

  if (href === "/dojo") {
    return matchesPrefix(pathname, "/dojo") || isDojoTrainingRoute(pathname);
  }

  if (href === "/world") {
    return matchesPrefix(pathname, "/world") || isWorldDiscoveryRoute(pathname);
  }

  if (href === "/camp") {
    return matchesPrefix(pathname, "/camp") || matchesAnyPrefix(pathname, CAMP_CHILD_PREFIXES);
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
