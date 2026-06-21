import { revalidateTag } from "next/cache";

export function userProgressCacheTag(userId: string): string {
  return `user-progress-${userId}`;
}

export function userElevationCacheTag(userId: string): string {
  return `user-elevation-${userId}`;
}

export function userQuestCacheTag(userId: string): string {
  return `user-quests-${userId}`;
}

export function userReviewStatsCacheTag(userId: string): string {
  return `user-review-stats-${userId}`;
}

export function revalidateUserProgress(userId: string): void {
  revalidateTag(userProgressCacheTag(userId));
}

export function revalidateUserElevation(userId: string): void {
  revalidateTag(userElevationCacheTag(userId));
}

export function revalidateUserQuests(userId: string): void {
  revalidateTag(userQuestCacheTag(userId));
}

export function revalidateUserReviewStats(userId: string): void {
  revalidateTag(userReviewStatsCacheTag(userId));
}

export function revalidateUserLearningSnapshot(userId: string): void {
  revalidateUserProgress(userId);
  revalidateUserElevation(userId);
  revalidateUserQuests(userId);
  revalidateUserReviewStats(userId);
}
