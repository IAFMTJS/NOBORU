import { elevationService } from "@/features/elevation/services/elevation.service";
import { achievementService } from "@/features/achievements/services/achievement.service";
import type { AchievementUnlockViewModel } from "@/features/achievements/types/achievement.types";
import { questService } from "@/features/quests/services/quest.service";
import { listeningRepository } from "@/features/listening/repositories/listening.repository";
import type { ElevationAwardViewModel } from "@/features/elevation/types/elevation.types";
import type {
  ListeningChallengeDetailViewModel,
  ListeningChallengeListEntryViewModel,
  ListeningExerciseDetailViewModel,
  ListeningExerciseListEntryViewModel,
  ListeningExerciseRow,
  ListeningExerciseViewModel,
  ListeningHubViewModel,
} from "@/features/listening/types/listening.types";

function mapExercise(row: ListeningExerciseRow): ListeningExerciseViewModel {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    audioUrl: row.audio_url,
    japaneseText: row.japanese_text,
    romaji: row.romaji,
    english: row.english,
    question: row.question,
    options: row.options,
    correctOptionIndex: row.correct_option_index,
  };
}

async function loadChallengeExercises(
  challengeId: string,
): Promise<ListeningExerciseViewModel[]> {
  const items = await listeningRepository.listChallengeItems(challengeId);
  const exercises = await listeningRepository.listExercisesByIds(
    items.map((item) => item.exercise_id),
  );
  const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise]));

  return items
    .map((item) => exerciseById.get(item.exercise_id))
    .filter((exercise): exercise is ListeningExerciseRow => exercise !== undefined)
    .map(mapExercise);
}

class ListeningProgressService {
  async getHubByJlpt(
    userId: string,
    jlptLevel: "n5" | "n4",
  ): Promise<ListeningHubViewModel> {
    const [exercises, challenges, progressRows] = await Promise.all([
      listeningRepository.listPublishedExercisesByJlpt(jlptLevel),
      listeningRepository.listPublishedChallengesByJlpt(jlptLevel),
      listeningRepository.listProgressByUserId(userId),
    ]);

    const progressByKey = new Map(
      progressRows.map((row) => [`${row.content_type}:${row.content_id}`, row]),
    );

    const exerciseEntries: ListeningExerciseListEntryViewModel[] = exercises.map(
      (exercise) => {
        const progress = progressByKey.get(`exercise:${exercise.id}`);
        return {
          id: exercise.id,
          title: exercise.title,
          slug: exercise.slug,
          estimatedDuration: exercise.estimated_duration,
          completed: progress?.status === "completed",
          score: progress?.score ?? 0,
        };
      },
    );

    const challengeItemCounts = new Map<string, number>();
    const allChallengeItems = await listeningRepository.listAllChallengeItems();
    for (const item of allChallengeItems) {
      challengeItemCounts.set(
        item.challenge_id,
        (challengeItemCounts.get(item.challenge_id) ?? 0) + 1,
      );
    }

    const challengeEntries: ListeningChallengeListEntryViewModel[] =
      challenges.map((challenge) => {
        const progress = progressByKey.get(`challenge:${challenge.id}`);
        return {
          id: challenge.id,
          title: challenge.title,
          slug: challenge.slug,
          description: challenge.description,
          exerciseCount: challengeItemCounts.get(challenge.id) ?? 0,
          completed: progress?.status === "completed",
          score: progress?.score ?? 0,
        };
      });

    const totalCount = exerciseEntries.length + challengeEntries.length;
    const completedCount =
      exerciseEntries.filter((entry) => entry.completed).length +
      challengeEntries.filter((entry) => entry.completed).length;

    return {
      exercises: exerciseEntries,
      challenges: challengeEntries,
      completedCount,
      totalCount,
      progressPercent:
        totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100),
    };
  }

  async getHub(userId: string): Promise<ListeningHubViewModel> {
    return this.getHubByJlpt(userId, "n5");
  }

  async getExerciseDetail(
    userId: string,
    slug: string,
  ): Promise<ListeningExerciseDetailViewModel | null> {
    const exercise = await listeningRepository.findExerciseBySlug(slug);
    if (!exercise) return null;

    const progress = await listeningRepository.findProgress(
      userId,
      "exercise",
      exercise.id,
    );

    return {
      ...mapExercise(exercise),
      jlptLevel: exercise.jlpt_level,
      completed: progress?.status === "completed",
      score: progress?.score ?? 0,
    };
  }

  async getChallengeDetail(
    userId: string,
    slug: string,
  ): Promise<ListeningChallengeDetailViewModel | null> {
    const challenge = await listeningRepository.findChallengeBySlug(slug);
    if (!challenge) return null;

    const [exercises, progress] = await Promise.all([
      loadChallengeExercises(challenge.id),
      listeningRepository.findProgress(userId, "challenge", challenge.id),
    ]);

    return {
      id: challenge.id,
      title: challenge.title,
      slug: challenge.slug,
      description: challenge.description,
      jlptLevel: challenge.jlpt_level,
      exercises,
      completed: progress?.status === "completed",
      score: progress?.score ?? 0,
    };
  }

  async markInProgress(
    userId: string,
    contentType: "exercise" | "challenge",
    contentId: string,
  ): Promise<void> {
    const existing = await listeningRepository.findProgress(
      userId,
      contentType,
      contentId,
    );

    if (existing?.status === "completed") return;

    await listeningRepository.upsertProgress({
      userId,
      contentType,
      contentId,
      status: "in_progress",
      score: existing?.score ?? 0,
    });
  }

  async saveExerciseProgress(
    userId: string,
    exerciseId: string,
    score: number,
  ): Promise<{
    elevation: ElevationAwardViewModel | null;
    achievements: AchievementUnlockViewModel[];
  }> {
    const existing = await listeningRepository.findProgress(
      userId,
      "exercise",
      exerciseId,
    );
    const isFirstCompletion = existing?.status !== "completed";
    const exercise = await listeningRepository.findExerciseById(exerciseId);

    await listeningRepository.upsertProgress({
      userId,
      contentType: "exercise",
      contentId: exerciseId,
      status: "completed",
      score: Math.max(0, Math.min(100, Math.round(score))),
    });

    if (!isFirstCompletion || !exercise) {
      return {
        elevation: null,
        achievements: await achievementService.afterStudyActivity(userId),
      };
    }

    const [elevation, achievements] = await Promise.all([
      elevationService.awardComprehensionComplete(
        userId,
        "listening_complete",
        exerciseId,
        exercise.title,
        true,
      ),
      achievementService.afterStudyActivity(userId),
    ]);

    if (elevation) {
      await questService.recordActivities(userId, [
        { type: "ep_earned", amount: elevation.epAwarded },
      ]);
    }

    return { elevation, achievements };
  }

  async saveChallengeProgress(
    userId: string,
    challengeId: string,
    score: number,
  ): Promise<{
    elevation: ElevationAwardViewModel | null;
    achievements: AchievementUnlockViewModel[];
  }> {
    const existing = await listeningRepository.findProgress(
      userId,
      "challenge",
      challengeId,
    );
    const isFirstCompletion = existing?.status !== "completed";
    const challenge = await listeningRepository.findChallengeById(challengeId);

    await listeningRepository.upsertProgress({
      userId,
      contentType: "challenge",
      contentId: challengeId,
      status: "completed",
      score: Math.max(0, Math.min(100, Math.round(score))),
    });

    if (!isFirstCompletion || !challenge) {
      return {
        elevation: null,
        achievements: await achievementService.afterStudyActivity(userId),
      };
    }

    const [elevation, achievements] = await Promise.all([
      elevationService.awardComprehensionComplete(
        userId,
        "listening_complete",
        challengeId,
        challenge.title,
        true,
      ),
      achievementService.afterStudyActivity(userId),
    ]);

    if (elevation) {
      await questService.recordActivities(userId, [
        { type: "ep_earned", amount: elevation.epAwarded },
      ]);
    }

    return { elevation, achievements };
  }

  async loadExerciseLessonContent(exerciseId: string) {
    const exercise = await listeningRepository.findExerciseById(exerciseId);
    if (!exercise || exercise.status !== "published") return null;

    return {
      type: "listening" as const,
      ...mapExercise(exercise),
    };
  }

  async loadChallengeLessonContent(challengeId: string) {
    const challenge = await listeningRepository.findChallengeById(challengeId);
    if (!challenge || challenge.status !== "published") return null;

    const exercises = await loadChallengeExercises(challenge.id);

    return {
      type: "listening_challenge" as const,
      id: challenge.id,
      title: challenge.title,
      slug: challenge.slug,
      description: challenge.description,
      exercises,
    };
  }
}

export const listeningProgressService = new ListeningProgressService();
