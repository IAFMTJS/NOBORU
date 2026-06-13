/** Deep link to a region's immersive trail on the Learn tab. */
export function regionTrailHref(regionSlug: string): string {
  return `/learn?region=${encodeURIComponent(regionSlug)}`;
}
