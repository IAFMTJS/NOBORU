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
        journeyPreview={data.journeyPreview}
        currentJourneyNodeId={data.currentJourneyNodeId}
        quests={data.quests}
        yama={data.yama}
        stats={data.stats}
        profile={{
          displayName: data.greeting.replace(/^Kon'nichiwa, /, ""),
          levelLabel: data.level.label,
          xpProgressPercent: data.elevation.progressPercent,
        }}
        companion={data.companion}
        progressionPreview={data.progressionPreview}
      />
    </PageContainer>
  );
}
