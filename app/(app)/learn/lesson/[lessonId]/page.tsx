import { LessonSessionLoader } from "@/features/learning/components/lesson-session-loader";
import { lessonService } from "@/features/learning/services/lesson.service";
import { settingsServerRepository } from "@/features/settings/repositories/settings-server.repository";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

type LessonPageProps = {
  params: Promise<{ lessonId: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const userId = await requireAuthenticatedUserId();
  const [session, settings] = await Promise.all([
    lessonService.getLessonSession(lessonId, userId).catch(() => null),
    settingsServerRepository.ensureSettings(userId),
  ]);

  return (
    <LessonSessionLoader
      lessonId={lessonId}
      initialSession={session}
      soundEnabled={settings.sound_enabled}
    />
  );
}
