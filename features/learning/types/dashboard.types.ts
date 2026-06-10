export type HomeDashboardViewModel = {
  greeting: string;
  region: {
    name: string;
    trail: string;
  };
  level: {
    label: string;
    progressPercent: number;
  };
  elevation: {
    level: number;
    totalEp: number;
    currentEp: number;
    epToNextLevel: number;
    progressPercent: number;
    activeTitle: string | null;
    nextMilestone: string;
  };
  dailyQuest: {
    title: string;
    description: string;
    current: number;
    target: number;
  };
  upcomingLesson: {
    title: string;
    href: string;
  };
  recentAchievements: Array<{
    id: string;
    title: string;
  }>;
  reviewQueueCount: number;
  overallMasteryPercent: number;
};
