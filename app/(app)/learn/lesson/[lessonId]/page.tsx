import { LessonPlayer } from "@/features/learning/components/lesson-player";
import { getLessonSession } from "@/lib/orchestration/learn.orchestrator";

type LessonPageProps = {
  params: Promise<{ lessonId: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const session = await getLessonSession(lessonId);
  return <LessonPlayer session={session} />;
}
