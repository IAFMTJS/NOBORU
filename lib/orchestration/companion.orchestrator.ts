import { companionService } from "@/features/companion/services/companion.service";
import type { CompanionViewModel } from "@/features/companion/types/companion.types";

export async function getCompanionSummary(
  userId: string,
): Promise<CompanionViewModel> {
  return companionService.getCompanion(userId);
}
