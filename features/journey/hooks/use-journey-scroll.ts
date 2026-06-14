"use client";

import {
  useCallback,
  useEffect,
  useState,
  type RefObject,
} from "react";
import { useReducedMotion } from "framer-motion";

export type JourneyScrollState = {
  /** Map Y coordinate (0–100) at the center of the viewport. */
  viewportCenterY: number;
  /** Normalized scroll progress through the map (0–1). */
  scrollProgress: number;
  /** Subtle parallax offset in pixels for background art. */
  parallaxOffsetPx: number;
};

const INITIAL_STATE: JourneyScrollState = {
  viewportCenterY: 50,
  scrollProgress: 0,
  parallaxOffsetPx: 0,
};

type UseJourneyScrollOptions = {
  scrollRef: RefObject<HTMLDivElement | null>;
  mapContentRef: RefObject<HTMLDivElement | null>;
  currentNodeId: string | null;
  regionSlug: string;
};

export function useJourneyScroll({
  scrollRef,
  mapContentRef,
  currentNodeId,
  regionSlug,
}: UseJourneyScrollOptions): JourneyScrollState {
  const prefersReducedMotion = useReducedMotion();
  const [state, setState] = useState<JourneyScrollState>(INITIAL_STATE);

  const updateScrollState = useCallback(() => {
    const scrollEl = scrollRef.current;
    const mapEl = mapContentRef.current;
    if (!scrollEl || !mapEl) return;

    const mapHeight = mapEl.offsetHeight;
    if (mapHeight <= 0) return;

    const scrollTop = scrollEl.scrollTop;
    const viewportCenter = scrollTop + scrollEl.clientHeight / 2;
    const viewportCenterY = Math.min(
      100,
      Math.max(0, (viewportCenter / mapHeight) * 100),
    );
    const maxScroll = Math.max(1, mapHeight - scrollEl.clientHeight);
    const scrollProgress = Math.min(1, Math.max(0, scrollTop / maxScroll));
    const parallaxOffsetPx = prefersReducedMotion ? 0 : scrollTop * 0.06;

    setState({ viewportCenterY, scrollProgress, parallaxOffsetPx });
  }, [mapContentRef, prefersReducedMotion, scrollRef]);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    updateScrollState();
    scrollEl.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      scrollEl.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [regionSlug, scrollRef, updateScrollState]);

  useEffect(() => {
    if (!currentNodeId || !scrollRef.current) return;

    const activeElement = scrollRef.current.querySelector(
      `[data-journey-node-id="${currentNodeId}"]`,
    );
    if (!activeElement) return;

    activeElement.scrollIntoView({
      block: "center",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    updateScrollState();
    const settleMs = prefersReducedMotion ? 0 : 480;
    const timer = window.setTimeout(updateScrollState, settleMs);

    return () => window.clearTimeout(timer);
  }, [
    currentNodeId,
    prefersReducedMotion,
    regionSlug,
    scrollRef,
    updateScrollState,
  ]);

  return state;
}
