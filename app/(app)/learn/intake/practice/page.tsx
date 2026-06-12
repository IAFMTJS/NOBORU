import { IntakePracticePlayer } from "@/features/intake/components/intake-practice-player";
import { intakeService } from "@/features/intake/services/intake.service";
import type { IntakePracticeMode } from "@/features/intake/types/intake.types";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";
import { redirect } from "next/navigation";

type PracticePageProps = {
  searchParams: Promise<{ mode?: string }>;
};

function parseMode(value?: string): IntakePracticeMode {
  return value === "reinforce" ? "reinforce" : "grow";
}

export default async function IntakePracticePage({ searchParams }: PracticePageProps) {
  const userId = await requireAuthenticatedUserId();
  const { mode: modeParam } = await searchParams;
  const mode = parseMode(modeParam);

  try {
    const session = await intakeService.getPracticeSession(userId, mode);
    return <IntakePracticePlayer session={session} />;
  } catch {
    redirect("/learn/intake");
  }
}
