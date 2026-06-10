# Reading Feature

Purpose: N5 reading comprehension through stories, dialogs, and questions.

## Responsibilities

- Story catalog with multi-section passages
- Dialog scenarios with branching choices
- Comprehension questions per story
- User reading progress (`reading_progress` table)
- Integration with lesson engine (`story` and `dialogue` lesson types)

## Layers

- `components/` — reading hub, story reader, dialogue player
- `repositories/reading.repository.ts` — Supabase access
- `services/reading-progress.service.ts` — view models and progress rules
- `types/reading.types.ts` — domain and view model types

## Routes

- `/learn/reading` — catalog hub
- `/learn/reading/stories/[slug]` — story reader + quiz
- `/learn/reading/dialogs/[slug]` — dialogue player
- `POST /api/reading/progress` — save in-progress or completed reading state

## Dependencies

- Mount N5 region unit "Reading Comprehension"
- Lesson player for curriculum-linked story/dialog lessons
- Existing `reading_exercises` table for hiragana/katakana short passages

## Known Limitations

- Audio narration for stories is planned via `audio_url` on future content rows
- Dialogues use linear or simple branching flows only
- Reading progress is separate from SRS review queue
