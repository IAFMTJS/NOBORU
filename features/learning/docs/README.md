# Learning Feature

## Purpose

Home dashboard, learning paths, lesson delivery, and progress tracking.

## Responsibilities

- Home dashboard via `dashboard-server.service.ts` (orchestrated in `lib/orchestration/home.orchestrator.ts`)
- Learning path via `learning-path.service.ts` (orchestrated in `lib/orchestration/learn.orchestrator.ts`)
- Lesson assembly and player steps via `lesson.service.ts`
- Progress persistence via `progress.service.ts` and `user_progress` table

## Routes

- `/learn` — region and unit overview
- `/learn/[regionSlug]` — lessons in a region
- `/learn/lesson/[lessonId]` — interactive lesson player

## Dependencies

- Profile and settings for personalized dashboard
- Published CMS content (regions, units, lessons, lesson items)

## Known Limitations

- Recall quizzes use in-lesson distractors only (no global pool yet)
- Elevation XP from lessons is recorded as progress only; EP awards arrive in Phase 15
