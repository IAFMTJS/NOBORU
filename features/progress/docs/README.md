# Progress Feature

Purpose: Visualize learner growth across domains, regions, and review systems.

## Responsibilities

- Aggregate mastery from hiragana, katakana, vocabulary, kanji, grammar, reading, and listening
- Region and unit completion from the learning path
- Learning statistics (lessons, scores, reading/listening completion)
- Review statistics (queue, mastery states, weak areas)
- Profile summary stats

## Layers

- `components/progress-dashboard.tsx` — mastery dashboard UI
- `services/progress-dashboard.service.ts` — aggregation from feature progress services
- `types/progress-dashboard.types.ts` — dashboard view models

## Routes

- `/progress` — full mastery dashboard
- `GET /api/progress/dashboard` — typed dashboard JSON

## Data Sources

Progress is computed from authoritative tables — not duplicated:

- `user_progress` — lesson completion
- Domain progress services — content mastery counts
- `reading_progress` / `listening_progress` — comprehension activities
- `review_items` — SRS mastery and weak areas

## Known Limitations

- Overall mastery is an average of domain percentages (elevation system in Phase 15)
- No historical trend charts yet
