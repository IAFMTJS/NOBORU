import {
  buildReviewRecommendations,
  computeTrialEpReward,
  computeTrialGrade,
  TRIAL_KIND_LABELS,
} from "@/features/trials/constants/trial.constants";
import { trialTemplateRepository } from "@/features/trials/repositories/trial-template.repository";
import { userTrialRepository } from "@/features/trials/repositories/user-trial.repository";
import type {
  TrialAvailability,
  TrialCompleteInput,
  TrialCompleteViewModel,
  TrialListEntryViewModel,
  TrialPerformanceViewModel,
  TrialProgressViewModel,
  TrialSessionViewModel,
  TrialStepRow,
  TrialStepViewModel,
  TrialTemplateRow,
  UserTrialProgressRow,
} from "@/features/trials/types/trial.types";
import { achievementService } from "@/features/achievements/services/achievement.service";
import { elevationService } from "@/features/elevation/services/elevation.service";
import { questService } from "@/features/quests/services/quest.service";
import { learningPathRepository } from "@/features/learning/repositories/learning-path.repository";
import { learningPathService } from "@/features/learning/services/learning-path.service";
import { getCachedProgressRows } from "@/lib/cache/user-progress-cache";
import { resolveRegionAccess } from "@/lib/learning/region-unlock";

function mapProgress(row: UserTrialProgressRow | null): TrialProgressViewModel | null {
  if (!row) return null;
  return {
    bestScore: row.best_score,
    bestGrade: row.best_grade,
    passed: row.passed,
    passedAt: row.passed_at,
    attemptCount: row.attempt_count,
  };
}

function mapStep(row: TrialStepRow, index: number, total: number): TrialStepViewModel {
  return {
    id: row.id,
    index: index + 1,
    total,
    kind: row.step_kind,
    prompt: row.prompt,
    display: row.display_text,
    acceptedAnswers: row.accepted_answers ?? undefined,
    options: row.options ?? undefined,
    correctIndex: row.correct_index ?? undefined,
    pairs: row.match_pairs ?? undefined,
  };
}

class TrialService {
  private async getRegionProgressMap(userId: string): Promise<Map<string, number>> {
    const [regions, progressRows] = await Promise.all([
      learningPathRepository.listPublishedRegionsWithCurriculum(),
      getCachedProgressRows(userId),
    ]);

    const learningPath = learningPathService.buildLearningPath(regions, progressRows);
    return new Map(
      learningPath.regions.map((region) => [region.slug, region.progressPercent]),
    );
  }

  private resolveAvailability(
    template: TrialTemplateRow,
    regionProgress: number,
    progressByTemplateId: Map<string, UserTrialProgressRow>,
    templatesBySlug: Map<string, TrialTemplateRow>,
    passedTrialSlugs: ReadonlySet<string>,
  ): { availability: TrialAvailability; lockReason: string | null } {
    const userProgress = progressByTemplateId.get(template.id);
    if (userProgress?.passed) {
      return { availability: "passed", lockReason: null };
    }

    const regionAccess = resolveRegionAccess(template.region_slug, passedTrialSlugs);
    if (regionAccess.availability === "locked") {
      return {
        availability: "locked",
        lockReason: regionAccess.lockReason,
      };
    }

    if (regionProgress < template.min_region_progress_percent) {
      return {
        availability: "locked",
        lockReason: `Reach ${template.min_region_progress_percent}% region progress to unlock.`,
      };
    }

    if (template.prerequisite_trial_slug) {
      const prerequisite = templatesBySlug.get(template.prerequisite_trial_slug);
      if (prerequisite) {
        const prerequisiteProgress = progressByTemplateId.get(prerequisite.id);
        if (!prerequisiteProgress?.passed) {
          return {
            availability: "locked",
            lockReason: `Complete ${prerequisite.title} first.`,
          };
        }
      }
    }

    return { availability: "available", lockReason: null };
  }

  async listTrials(userId: string): Promise<TrialListEntryViewModel[]> {
    const [templates, progressRows, regionProgressMap, passedTrialSlugs] =
      await Promise.all([
        trialTemplateRepository.listPublished(),
        userTrialRepository.listProgressByUserId(userId),
        this.getRegionProgressMap(userId),
        learningPathService.getPassedTrialSlugs(userId),
      ]);

    const progressByTemplateId = new Map(
      progressRows.map((row) => [row.trial_template_id, row]),
    );
    const templatesBySlug = new Map(templates.map((template) => [template.slug, template]));
    const stepCounts = await trialTemplateRepository.countStepsByTemplateIds(
      templates.map((template) => template.id),
    );

    return templates.map((template) => {
      const { availability, lockReason } = this.resolveAvailability(
        template,
        regionProgressMap.get(template.region_slug) ?? 0,
        progressByTemplateId,
        templatesBySlug,
        passedTrialSlugs,
      );

      return {
        id: template.id,
        slug: template.slug,
        regionSlug: template.region_slug,
        kind: template.kind,
        title: template.title,
        description: template.description,
        bossName: template.boss_name,
        passScore: template.pass_score,
        timeLimitSeconds: template.time_limit_seconds,
        epReward: template.ep_reward,
        availability,
        lockReason,
        progress: mapProgress(progressByTemplateId.get(template.id) ?? null),
        stepCount: stepCounts.get(template.id) ?? 0,
      };
    });
  }

  async getTrialSession(
    userId: string,
    slug: string,
  ): Promise<TrialSessionViewModel | null> {
    const template = await trialTemplateRepository.findBySlug(slug);
    if (!template || template.status !== "published") return null;

    const [steps, progressRow, regionProgressMap, templates, passedTrialSlugs] =
      await Promise.all([
        trialTemplateRepository.listStepsByTemplateId(template.id),
        userTrialRepository.findProgress(userId, template.id),
        this.getRegionProgressMap(userId),
        trialTemplateRepository.listPublished(),
        learningPathService.getPassedTrialSlugs(userId),
      ]);

    const progressByTemplateId = new Map(
      (await userTrialRepository.listProgressByUserId(userId)).map((row) => [
        row.trial_template_id,
        row,
      ]),
    );
    const templatesBySlug = new Map(templates.map((entry) => [entry.slug, entry]));
    const { availability, lockReason } = this.resolveAvailability(
      template,
      regionProgressMap.get(template.region_slug) ?? 0,
      progressByTemplateId,
      templatesBySlug,
      passedTrialSlugs,
    );

    if (availability === "locked") {
      throw new Error(lockReason ?? "This trial is locked.");
    }

    return {
      slug: template.slug,
      title: template.title,
      description: template.description,
      bossName: template.boss_name,
      kind: template.kind,
      regionSlug: template.region_slug,
      passScore: template.pass_score,
      timeLimitSeconds: template.time_limit_seconds,
      epReward: template.ep_reward,
      steps: steps.map((step, index) => mapStep(step, index, steps.length)),
      progress: mapProgress(progressRow),
    };
  }

  async completeTrial(
    userId: string,
    slug: string,
    input: TrialCompleteInput,
  ): Promise<TrialCompleteViewModel> {
    const template = await trialTemplateRepository.findBySlug(slug);
    if (!template) throw new Error("Trial not found.");

    const existingProgress = await userTrialRepository.findProgress(
      userId,
      template.id,
    );
    const totalCount = Math.max(input.totalCount, 1);
    const scorePercent = Math.round((input.correctCount / totalCount) * 100);
    const passed = scorePercent >= template.pass_score;
    const grade = computeTrialGrade(scorePercent, passed);
    const isFirstPass = passed && !existingProgress?.passed;
    const epAwarded = computeTrialEpReward(template.ep_reward, grade, isFirstPass);

    let elevation = null;
    if (epAwarded > 0) {
      elevation = await elevationService.awardEp({
        userId,
        sourceType: "trial",
        sourceId: template.id,
        amount: epAwarded,
        description: `${TRIAL_KIND_LABELS[template.kind]}: ${template.title} (${grade})`,
      });
    }

    const completedAt = new Date().toISOString();
    await userTrialRepository.insertAttempt({
      userId,
      trialTemplateId: template.id,
      scorePercent,
      grade,
      correctCount: input.correctCount,
      totalCount,
      timeSpentSeconds: input.timeSpentSeconds,
      passed,
      epAwarded: epAwarded > 0 ? epAwarded : null,
      startedAt: input.startedAt,
      completedAt,
    });

    const nextProgress = await userTrialRepository.upsertProgress({
      userId,
      trialTemplateId: template.id,
      bestScore: Math.max(existingProgress?.best_score ?? 0, scorePercent),
      bestGrade:
        grade &&
        (!existingProgress?.best_grade ||
          scorePercent >= (existingProgress.best_score ?? 0))
          ? grade
          : existingProgress?.best_grade ?? grade,
      passed: existingProgress?.passed || passed,
      passedAt:
        existingProgress?.passed_at ??
        (passed ? completedAt : null),
      attemptCount: (existingProgress?.attempt_count ?? 0) + 1,
      lastAttemptAt: completedAt,
    });

    const achievements = await achievementService.afterStudyActivity(userId);
    const quests = await questService.recordActivities(userId, [
      { type: "trial_complete", amount: 1 },
      ...(elevation
        ? [{ type: "ep_earned" as const, amount: elevation.epAwarded }]
        : []),
    ]);

    return {
      passed,
      scorePercent,
      grade,
      epAwarded: elevation?.epAwarded ?? (epAwarded > 0 ? epAwarded : null),
      elevation,
      achievements,
      quests,
      reviewRecommendations: passed
        ? []
        : buildReviewRecommendations(scorePercent, template.region_slug),
      progress: mapProgress(nextProgress)!,
    };
  }

  async getPerformance(userId: string): Promise<TrialPerformanceViewModel> {
    const [trials, progressRows, recentAttempts, totalAttempts] = await Promise.all([
      this.listTrials(userId),
      userTrialRepository.listProgressByUserId(userId),
      userTrialRepository.listRecentAttempts(userId, 5),
      userTrialRepository.countAttempts(userId),
    ]);

    const bestGrades = progressRows
      .filter((row) => row.best_grade)
      .map((row) => {
        const trial = trials.find((entry) => entry.id === row.trial_template_id);
        return {
          slug: trial?.slug ?? "",
          title: trial?.title ?? "Trial",
          grade: row.best_grade!,
          score: row.best_score,
        };
      })
      .filter((entry) => entry.slug);

    return {
      totalAttempts,
      trialsPassed: progressRows.filter((row) => row.passed).length,
      trialsAvailable: trials.filter((trial) => trial.availability === "available").length,
      bestGrades,
      recentAttempts: recentAttempts.map((attempt) => ({
        id: attempt.id,
        trialTitle: attempt.trial_title ?? "Trial",
        scorePercent: attempt.score_percent,
        grade: attempt.grade,
        passed: attempt.passed,
        completedAt: attempt.completed_at,
      })),
    };
  }
}

export const trialService = new TrialService();
