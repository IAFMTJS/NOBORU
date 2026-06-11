import { ExpeditionHero } from "@/features/learning/components/trail/expedition-hero";
import type { HomeDashboardViewModel } from "@/features/learning/types/dashboard.types";
import { PageContainer } from "@/components/layout/page-container";

type HomeDashboardProps = {
  data: HomeDashboardViewModel;
};

export function HomeDashboard({ data }: HomeDashboardProps) {
  return (
    <PageContainer>
      <ExpeditionHero
        greeting={data.greeting}
        regionSlug={data.region.slug}
        regionName={data.region.name}
        regionProgressPercent={data.level.progressPercent}
        continueLessonTitle={data.upcomingLesson.title}
        continueHref={data.upcomingLesson.href}
        lessonNumber={data.upcomingLesson.lessonNumber}
        lessonCount={data.upcomingLesson.lessonCount}
        quests={data.quests}
        yama={data.yama}
        stats={data.stats}
      />
    </PageContainer>
  );
}
