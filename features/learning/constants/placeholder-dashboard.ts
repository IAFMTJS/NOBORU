import type { HomeDashboardViewModel } from "@/features/learning/types/dashboard.types";

/**
 * Phase 0 placeholder data only.
 * Replace with database/CMS content via dashboard.service.ts when backend is connected.
 */
export const PLACEHOLDER_HOME_DASHBOARD: HomeDashboardViewModel = {
  greeting: "Konnichiwa, Climber",
  region: {
    name: "Mount N4",
    trail: "Forest Trail",
  },
  level: {
    label: "N4",
    progressPercent: 41,
  },
  elevation: {
    level: 1,
    totalEp: 1240,
    currentEp: 40,
    epToNextLevel: 100,
    progressPercent: 40,
    activeTitle: "Base Camper",
    nextMilestone: "Level 2: Trail Walker",
  },
  dailyQuest: {
    title: "Today's Quest",
    description: "Review 20 flashcards",
    current: 12,
    target: 20,
  },
  upcomingLesson: {
    title: "Lesson 23: ~て form",
    href: "/learn",
  },
  recentAchievements: [
    { id: "first-step", title: "First Step" },
    { id: "week-climber", title: "Week Climber" },
  ],
  reviewQueueCount: 8,
  overallMasteryPercent: 0,
};
