const EXPLORE_CHILD_PREFIXES = ["/games", "/community", "/trials"] as const;

export function isNavActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (pathname === href || pathname.startsWith(`${href}/`)) return true;

  if (href === "/explore") {
    return EXPLORE_CHILD_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
  }

  return false;
}
