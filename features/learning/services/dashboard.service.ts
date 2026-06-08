import { PLACEHOLDER_HOME_DASHBOARD } from "@/features/learning/constants/placeholder-dashboard";
import type { HomeDashboardViewModel } from "@/features/learning/types/dashboard.types";

class DashboardService {
  /**
   * Returns home dashboard data.
   * Phase 0: placeholder constants. Future: repository + database/CMS.
   */
  async getHomeDashboard(): Promise<HomeDashboardViewModel> {
    return PLACEHOLDER_HOME_DASHBOARD;
  }
}

export const dashboardService = new DashboardService();
