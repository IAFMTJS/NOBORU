import { StudyHubLayout } from "@/features/dojo/components/study-hub-layout";
import { YamaLoading } from "@/components/ui/yama-loading";

export default function DailyChallengeLoading() {
  return (
    <StudyHubLayout title="Daily retention" backHref="/review">
      <YamaLoading
        mode="compact"
        profile="review"
        title="Preparing retention challenge…"
        statusMessage="Gathering words to reinforce…"
      />
    </StudyHubLayout>
  );
}
