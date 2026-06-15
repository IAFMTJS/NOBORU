import { ExploreScreen } from "@/features/explore/components/explore-screen";
import { yamaService } from "@/features/yama/services/yama.service";

export default async function WorldPage() {
  const yama = yamaService.resolveExplorePresence();
  return <ExploreScreen yama={yama} />;
}
