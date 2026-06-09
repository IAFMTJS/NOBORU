# Review Feature

## Purpose

Spaced repetition review sessions, SRS scheduling, mastery tracking, and weak-area detection.

## Responsibilities

- Review queue from `review_items`
- SRS scheduling via `srs.service.ts` (1, 3, 7, 14, 30, 90, 180, 365 day intervals)
- Review history in `review_history`
- Weak area grouping by content type
- Enqueue from completed lessons

## Routes

- `/review` — review center with stats, current card, and recent history
- `GET /api/review/stats` — mastery and weak-area summary
- `POST /api/review/submit` — submit Again / Good / Strong ratings

## Dependencies

- Hiragana, katakana, vocabulary, grammar, and kanji content repositories for card display
