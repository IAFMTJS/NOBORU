"use client";

import { useEffect, useState, type RefObject } from "react";

import {
  computeN5BackdropScrollState,
  N5_BACKDROP_IDLE_STATE,
  type N5BackdropScrollState,
} from "@/features/worlds/utils/n5-world-backdrop-scroll.utils";

export function useN5BackdropScroll(
  scrollContainerRef: RefObject<HTMLElement | null>,
): N5BackdropScrollState {
  const [state, setState] = useState<N5BackdropScrollState>(N5_BACKDROP_IDLE_STATE);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let frame = 0;

    const update = () => {
      setState(
        computeN5BackdropScrollState(
          container.scrollTop,
          container.scrollHeight,
          container.clientHeight,
        ),
      );
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    const resizeObserver = new ResizeObserver(onScroll);

    container.addEventListener("scroll", onScroll, { passive: true });
    resizeObserver.observe(container);
    update();

    return () => {
      container.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [scrollContainerRef]);

  return state;
}
