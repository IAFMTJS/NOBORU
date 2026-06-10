# Quests Feature

Purpose: Daily and weekly quest objectives that guide study habits toward educational activities.

## Responsibilities

- Assign 4 daily quests and 2 weekly quests per user (timezone-aware dates)
- Track progress on vocabulary learned, lessons completed, reviews, and EP earned
- Auto-complete and award EP on quest completion
- Display quest progress inside the home expedition hero and on the progress dashboard
- Deep-link quest CTAs to the next incomplete lesson or review queue

## MVP Daily Quests

| Slug | Target | EP Reward |
|------|--------|-----------|
| `learn-vocabulary` | 10 new words today | 50 |
| `complete-lessons` | 2 lessons today | 75 |
| `review-items` | 20 review ratings today | 75 |
| `earn-ep` | 100 EP from learning today | 100 |

## MVP Weekly Quests

| Slug | Target | EP Reward |
|------|--------|-----------|
| `weekly-complete-lessons` | 5 lessons this week | 150 |
| `weekly-review-items` | 100 review ratings this week | 150 |

## Layers

- `constants/quest.constants.ts` — slugs, href resolution, activity event types
- `repositories/` — quest templates, user daily quests, user weekly quests
- `services/quest.service.ts` — assignment, progress, completion, EP award
- `components/trail-quest-cards.tsx` — home expedition and progress UI
- `components/quest-complete-feedback.tsx` — completion feedback on study flows

## Routes

- `GET /api/quests` — daily and weekly quests with progress
- `GET /api/quests/daily` — today's daily quests only

## Integration

- `progress.service.completeLesson` — lesson, vocabulary, and EP events
- `review-server.service.submitReview` — review and EP events
- `reading-progress.service` — EP events on first comprehension completion
- `listening-progress.service` — EP events on first comprehension completion

## Known Limitations

- Gold rewards deferred (EP only for MVP)
- Weekly quest templates are fixed MVP targets (no region mastery quests yet)
