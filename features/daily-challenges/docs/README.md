# Daily Challenges Feature

## Purpose

Bible-aligned retention sessions — memory maintenance, not progression.

## Responsibilities

- Build daily retention queue from `lib/learning/daily-challenge.service.ts`
- Prioritize recently learned, weak, forgotten, and mastered maintenance words
- API + UI at `/daily-challenge`, `GET /api/daily-challenges/session`, `POST /api/daily-challenges/complete`
- Persist one completion per user per local day (`user_daily_challenge_completions`)
- Optional SRS updates per word when a `review_item` exists (`good` / `again` via `/api/review/submit`)

## Distinction

`features/quests/` tracks gamification habit metrics (EP, lesson counts).

`features/daily-challenges/` implements the Learning Architecture Bible retention system.

## Dependencies

- `player-knowledge.service.ts`
- `learned-content.repository.ts`
- `vocabulary.repository.ts`
