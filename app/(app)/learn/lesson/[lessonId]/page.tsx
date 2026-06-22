import { LessonSessionLoader } from "@/features/learning/components/lesson-session-loader";
import {
  LessonAccessDeniedError,
  LessonNotFoundError,
} from "@/features/learning/errors/lesson.errors";
import { lessonService } from "@/features/learning/services/lesson.service";
import { settingsServerRepository } from "@/features/settings/repositories/settings-server.repository";
import { requireAuthenticatedUserId } from "@/lib/orchestration/require-authenticated-user";

type LessonPageProps = {
  params: Promise<{ lessonId: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const userId = await requireAuthenticatedUserId();

  let session = null;
  let initialError: string | null = null;

  try {
    session = await lessonService.getLessonSession(lessonId, userId);
  } catch (caught) {
    if (
      caught instanceof LessonAccessDeniedError ||
      caught instanceof LessonNotFoundError
    ) {
      initialError = caught.message;
    } else {
      throw caught;
    }
  }

  const soundEnabled = await settingsServerRepository.getSoundEnabled(userId);

  return (
    <LessonSessionLoader
      lessonId={lessonId}
      initialSession={session}
      initialError={initialError}
      soundEnabled={soundEnabled}
    />
  );
}
