/**
 * Idle-time scheduling for lesson successor prefetch (route + session + audio).
 */

export function parseLessonIdFromHref(href: string): string | null {
  const match = /^\/learn\/lesson\/([^/?#]+)/.exec(href);
  return match?.[1] ?? null;
}

export function scheduleIdleTask(
  task: () => void,
  options?: { timeoutMs?: number; fallbackDelayMs?: number },
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const timeoutMs = options?.timeoutMs ?? 2_000;
  const fallbackDelayMs = options?.fallbackDelayMs ?? 500;
  let cancelled = false;

  const run = () => {
    if (!cancelled) {
      task();
    }
  };

  if ("requestIdleCallback" in window) {
    const idleId = window.requestIdleCallback(run, { timeout: timeoutMs });
    return () => {
      cancelled = true;
      window.cancelIdleCallback(idleId);
    };
  }

  const timeoutId = setTimeout(run, fallbackDelayMs);
  return () => {
    cancelled = true;
    clearTimeout(timeoutId);
  };
}
