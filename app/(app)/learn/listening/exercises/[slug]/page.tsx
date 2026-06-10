import { notFound } from "next/navigation";

import { ListeningExercisePlayer } from "@/features/listening/components/listening-exercise-player";
import { getListeningExerciseDetail } from "@/lib/orchestration/learn.orchestrator";

type ExercisePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ListeningExercisePage({ params }: ExercisePageProps) {
  const { slug } = await params;
  const exercise = await getListeningExerciseDetail(slug);

  if (!exercise) {
    notFound();
  }

  return <ListeningExercisePlayer exercise={exercise} />;
}
