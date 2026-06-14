import { SeasonalEventScreen } from "@/features/events/components/seasonal-event-screen";
import { seasonalEventService } from "@/features/events/services/seasonal-event.service";

export default function EventsPage() {
  const event = seasonalEventService.getActiveEvent();
  return <SeasonalEventScreen event={event} />;
}
