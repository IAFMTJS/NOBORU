import { dashboardServerService } from "@/features/learning/services/dashboard-server.service";
import { CampBelowFoldClient } from "@/features/camp/components/camp-below-fold-client";

type CampBelowFoldProps = {
  userId: string;
};

export async function CampBelowFold({ userId }: CampBelowFoldProps) {
  const belowFold = await dashboardServerService.getCampBelowFold(userId);
  return <CampBelowFoldClient belowFold={belowFold} />;
}
