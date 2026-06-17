import type { ReviewState } from "@/features/review/repositories/review.repository";

export type ReviewItemSnapshot = {
  contentType: string;
  contentId: string;
  state: ReviewState;
  masteryScore: number;
  nextReviewAt: string;
};

export type LearnedContentSnapshot = {
  completedLessonIds: string[];
  reviewIdsByType: Map<string, Set<string>>;
  lessonItemIdsByType: Map<string, Set<string>>;
  reviewItems: ReviewItemSnapshot[];
};

const MASTERED_REVIEW_STATES = new Set<ReviewState>(["mastered", "legendary"]);

function isWeakReviewItem(item: ReviewItemSnapshot): boolean {
  if (item.state === "new" || item.state === "learning") return true;
  return item.masteryScore < 60;
}

function isDueReviewItem(item: ReviewItemSnapshot, now = Date.now()): boolean {
  return new Date(item.nextReviewAt).getTime() <= now;
}

export function getKnownIdsFromSnapshot(
  snapshot: LearnedContentSnapshot,
  contentType: string,
): string[] {
  const learned = new Set<string>();

  for (const id of snapshot.reviewIdsByType.get(contentType) ?? []) {
    learned.add(id);
  }

  for (const id of snapshot.lessonItemIdsByType.get(contentType) ?? []) {
    learned.add(id);
  }

  return Array.from(learned);
}

export function getMasteredIdsFromSnapshot(
  snapshot: LearnedContentSnapshot,
  contentType: string,
): string[] {
  return snapshot.reviewItems
    .filter(
      (item) =>
        item.contentType === contentType &&
        MASTERED_REVIEW_STATES.has(item.state),
    )
    .map((item) => item.contentId);
}

export function getWeakIdsFromSnapshot(
  snapshot: LearnedContentSnapshot,
  contentType: string,
): string[] {
  return snapshot.reviewItems
    .filter((item) => item.contentType === contentType && isWeakReviewItem(item))
    .map((item) => item.contentId);
}

export function getScheduledReviewIdsFromSnapshot(
  snapshot: LearnedContentSnapshot,
  contentType: string,
  now = Date.now(),
): string[] {
  return snapshot.reviewItems
    .filter(
      (item) =>
        item.contentType === contentType && isDueReviewItem(item, now),
    )
    .map((item) => item.contentId);
}

export function prioritizeReviewContentIds(
  snapshot: LearnedContentSnapshot,
  contentType: string,
  options?: { excludeIds?: ReadonlySet<string>; limit?: number },
): string[] {
  const exclude = options?.excludeIds ?? new Set<string>();
  const limit = options?.limit ?? 20;
  const ordered: string[] = [];
  const seen = new Set<string>();

  const push = (id: string) => {
    if (exclude.has(id) || seen.has(id)) return;
    seen.add(id);
    ordered.push(id);
  };

  for (const item of snapshot.reviewItems) {
    if (item.contentType !== contentType) continue;
    if (!isWeakReviewItem(item) && !isDueReviewItem(item)) continue;
    push(item.contentId);
    if (ordered.length >= limit) return ordered;
  }

  for (const id of getKnownIdsFromSnapshot(snapshot, contentType)) {
    push(id);
    if (ordered.length >= limit) return ordered;
  }

  return ordered;
}
