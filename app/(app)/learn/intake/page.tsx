import { IntakeWizard } from "@/features/intake/components/intake-wizard";
import { intakeService } from "@/features/intake/services/intake.service";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

export default async function IntakePage() {
  const userId = await requireAuthenticatedUserId();
  const chartData = await intakeService.getChartData(userId);
  return <IntakeWizard chartData={chartData} />;
}
