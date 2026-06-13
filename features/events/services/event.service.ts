import { createClient } from "@/lib/supabase/server";

import {
  RANDOM_EVENTS,
  type RandomEventDefinition,
  type RandomEventSlug,
} from "@/features/events/constants/event.constants";
import { elevationService } from "@/features/elevation/services/elevation.service";

class EventRepository {
  async listRecentEncounters(
    userId: string,
    limit = 10,
  ): Promise<Array<{ event_slug: string; encountered_at: string }>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_event_encounters")
      .select("event_slug, encountered_at")
      .eq("user_id", userId)
      .order("encountered_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return (data ?? []) as Array<{ event_slug: string; encountered_at: string }>;
  }

  async recordEncounter(userId: string, eventSlug: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("user_event_encounters").insert({
      user_id: userId,
      event_slug: eventSlug,
    });

    if (error) throw new Error(error.message);
  }
}

class EventService {
  private readonly repo = new EventRepository();

  async rollEligibleEvent(userId: string): Promise<RandomEventDefinition | null> {
    const recent = await this.repo.listRecentEncounters(userId);
    const now = Date.now();

    const eligible = RANDOM_EVENTS.filter((event) => {
      const last = recent.find((r) => r.event_slug === event.slug);
      if (!last) return true;
      const daysSince =
        (now - new Date(last.encountered_at).getTime()) / 86400000;
      return daysSince >= event.minDaysBetween;
    });

    if (eligible.length === 0) return null;

    const daySeed = new Date().toISOString().slice(0, 10);
    const hash = daySeed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const index = hash % eligible.length;
    return eligible[index] ?? null;
  }

  async triggerEvent(
    userId: string,
    slug: RandomEventSlug,
  ): Promise<RandomEventDefinition | null> {
    const event = RANDOM_EVENTS.find((e) => e.slug === slug);
    if (!event) return null;

    await this.repo.recordEncounter(userId, slug);

    if (event.epBonus > 0) {
      await elevationService.awardEp({
        userId,
        amount: event.epBonus,
        sourceType: "quest",
        sourceId: null,
        description: event.title,
      });
    }

    return event;
  }
}

export const eventService = new EventService();
