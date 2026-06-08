import { dashboardService } from "@/features/learning/services/dashboard.service";
import type { HomeDashboardViewModel } from "@/features/learning/types/dashboard.types";

/**
 * Application-layer orchestration for the home screen.
 * Composes feature services without coupling feature modules to each other.
 */
export async function getHomeDashboard(): Promise<HomeDashboardViewModel> {
  return dashboardService.getHomeDashboard();
}
