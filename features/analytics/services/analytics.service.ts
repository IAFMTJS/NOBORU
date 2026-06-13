import type { AnalyticsEventPayload } from "@/features/analytics/types/analytics.types";

const ANALYTICS_BUFFER_KEY = "noboru-analytics-buffer";
const FLUSH_EVENT_COUNT = 5;
const FLUSH_INTERVAL_MS = 30_000;

type BufferedAnalyticsEvent = AnalyticsEventPayload & {
  bufferId: string;
};

function createBufferId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `analytics-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readPersistedBuffer(): BufferedAnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ANALYTICS_BUFFER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BufferedAnalyticsEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePersistedBuffer(events: BufferedAnalyticsEvent[]): void {
  if (typeof window === "undefined") return;
  try {
    if (events.length === 0) {
      window.localStorage.removeItem(ANALYTICS_BUFFER_KEY);
      return;
    }
    window.localStorage.setItem(ANALYTICS_BUFFER_KEY, JSON.stringify(events));
  } catch {
    // Analytics persistence is best-effort.
  }
}

type TrackAnalyticsEventInput = {
  name: AnalyticsEventPayload["name"];
  properties?: AnalyticsEventPayload["properties"];
};

class AnalyticsService {
  private buffer: BufferedAnalyticsEvent[] = readPersistedBuffer();
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private flushInFlight: Promise<void> | null = null;
  private listenersRegistered = false;

  async track(input: TrackAnalyticsEventInput): Promise<void> {
    const payload: BufferedAnalyticsEvent = {
      name: input.name,
      occurredAt: new Date().toISOString(),
      properties: input.properties,
      bufferId: createBufferId(),
    };

    if (typeof window === "undefined") {
      return;
    }

    this.ensureListeners();
    this.buffer.push(payload);
    writePersistedBuffer(this.buffer);
    this.scheduleFlush();

    if (this.buffer.length >= FLUSH_EVENT_COUNT) {
      await this.flush();
    }
  }

  private ensureListeners(): void {
    if (this.listenersRegistered || typeof window === "undefined") return;
    this.listenersRegistered = true;

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        void this.flush();
      }
    });

    window.addEventListener("pagehide", () => {
      void this.flush({ useBeacon: true });
    });
  }

  private scheduleFlush(): void {
    if (this.flushTimer) return;
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      void this.flush();
    }, FLUSH_INTERVAL_MS);
  }

  private async flush(options?: { useBeacon?: boolean }): Promise<void> {
    if (this.flushInFlight) {
      await this.flushInFlight;
      return;
    }

    if (this.buffer.length === 0) return;

    const batch = [...this.buffer];
    this.flushInFlight = this.sendBatch(batch, options)
      .then(() => {
        const sentIds = new Set(batch.map((event) => event.bufferId));
        this.buffer = this.buffer.filter((event) => !sentIds.has(event.bufferId));
        writePersistedBuffer(this.buffer);
      })
      .catch(() => undefined)
      .finally(() => {
        this.flushInFlight = null;
      });

    await this.flushInFlight;
  }

  private async sendBatch(
    batch: BufferedAnalyticsEvent[],
    options?: { useBeacon?: boolean },
  ): Promise<void> {
    const body = JSON.stringify({
      events: batch.map(({ bufferId: _bufferId, ...event }) => event),
    });

    if (options?.useBeacon && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/events/batch", blob);
      return;
    }

    await fetch("/api/analytics/events/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      keepalive: true,
    });
  }
}

export const analyticsService = new AnalyticsService();
