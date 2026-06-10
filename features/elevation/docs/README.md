# Elevation Feature

Purpose: Elevation Points (EP), levels, and level rewards for learning progression identity.

## Responsibilities

- Award EP from lessons, reviews, reading, and listening (first completion only for content)
- Level calculation (levels 1–100, increasing thresholds)
- Level reward titles and badges
- Elevation event log

## EP Rules (MVP)

| Source | EP |
|--------|-----|
| Lesson complete (first time) | `lesson.xp_reward` |
| Review Good | 3 |
| Review Strong | 5 |
| Reading/Listening complete (first time) | 15 |

EP is never deducted. Re-completing lessons does not re-award EP.

## Layers

- `constants/elevation.constants.ts` — thresholds and calculation
- `repositories/elevation.repository.ts` — `user_elevation`, `elevation_events`, `level_rewards`
- `services/elevation.service.ts` — award and summary logic
- `components/elevation-summary.tsx` — dashboard UI

## Routes

- `GET /api/elevation/summary` — current level, EP, rewards

## Integration

- `progress.service.completeLesson` — lesson EP
- `review-server.service.submitReview` — review EP
- `reading-progress.service` / `listening-progress.service` — comprehension EP

## Known Limitations

- Daily quests and achievement EP deferred to Phase 16
- Cosmetics and Yama variants not yet implemented
