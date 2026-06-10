# Listening Feature

Purpose: N5 listening comprehension through audio lessons and multi-part challenges.

## Responsibilities

- Listening exercise catalog with audio playback
- Multi-exercise listening challenges
- Comprehension questions after each clip
- User listening progress (`listening_progress` table)
- Integration with lesson engine (`listening` and `listening_challenge` lesson types)

## Layers

- `components/` — hub, exercise player, challenge player, audio playback
- `repositories/listening.repository.ts` — Supabase access
- `services/listening-progress.service.ts` — view models and progress rules
- `types/listening.types.ts` — domain and view model types

## Routes

- `/learn/listening` — catalog hub
- `/learn/listening/exercises/[slug]` — single audio lesson
- `/learn/listening/challenges/[slug]` — multi-part challenge
- `POST /api/listening/progress` — save in-progress or completed listening state

## Audio Playback

Exercises may include an `audio_url`. When absent, `AudioPlayback` uses browser speech synthesis for Japanese text as an MVP fallback until hosted audio is attached.

## Dependencies

- Mount N5 region unit "Listening Practice"
- Lesson player for curriculum-linked listening lessons

## Known Limitations

- No dedicated audio asset pipeline yet; most seed exercises use TTS fallback
- Listening progress is separate from SRS review queue
