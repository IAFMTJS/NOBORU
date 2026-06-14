"use client";

import {
  useCallback,
  useEffect,
  useState,
  type RefObject,
} from "react";

type UseJourneySectionVisibilityOptions = {
  scrollRef: RefObject<HTMLElement | null>;
  sectionSlugs: readonly string[];
  rootMargin?: string;
  maxLoadedSections?: number;
  prioritySlugs?: readonly string[];
};

type JourneySectionVisibility = {
  /** Sections currently intersecting the viewport (with margin). */
  visibleSlugs: ReadonlySet<string>;
  /** Sections whose artwork has been loaded at least once. */
  loadedSlugs: ReadonlySet<string>;
  shouldLoadArt: (slug: string) => boolean;
};

export function useJourneySectionVisibility({
  scrollRef,
  sectionSlugs,
  rootMargin = "400px 0px",
  maxLoadedSections = 0,
  prioritySlugs = [],
}: UseJourneySectionVisibilityOptions): JourneySectionVisibility {
  const [visibleSlugs, setVisibleSlugs] = useState<Set<string>>(
    () => new Set(prioritySlugs),
  );
  const [loadedSlugs, setLoadedSlugs] = useState<Set<string>>(
    () => new Set(prioritySlugs),
  );

  useEffect(() => {
    setLoadedSlugs((prev) => {
      const next = new Set(prev);
      for (const slug of prioritySlugs) {
        next.add(slug);
      }
      return next;
    });
  }, [prioritySlugs]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || sectionSlugs.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSlugs((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            const slug = (entry.target as HTMLElement).dataset
              .journeyRegionSection;
            if (!slug) continue;
            if (entry.isIntersecting) {
              next.add(slug);
            } else {
              next.delete(slug);
            }
          }
          return next;
        });

        setLoadedSlugs((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const slug = (entry.target as HTMLElement).dataset
              .journeyRegionSection;
            if (slug) next.add(slug);
          }
          return next;
        });
      },
      { root, rootMargin, threshold: 0.01 },
    );

    for (const slug of sectionSlugs) {
      const section = root.querySelector(
        `[data-journey-region-section="${slug}"]`,
      );
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, [rootMargin, scrollRef, sectionSlugs]);

  const shouldLoadArt = useCallback(
    (slug: string) => {
      if (prioritySlugs.includes(slug)) return true;
      if (!loadedSlugs.has(slug) && !visibleSlugs.has(slug)) return false;
      if (loadedSlugs.has(slug)) return true;
      if (maxLoadedSections <= 0) return visibleSlugs.has(slug);
      return loadedSlugs.size < maxLoadedSections;
    },
    [loadedSlugs, maxLoadedSections, prioritySlugs, visibleSlugs],
  );

  return {
    visibleSlugs,
    loadedSlugs,
    shouldLoadArt,
  };
}
