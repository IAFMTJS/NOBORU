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
    current: number;
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
};
