# Vocabulary Feature

## Purpose

N5 vocabulary catalog, word detail views, lesson content, and mastery tracking for Mount N5.

## Responsibilities

- Published vocabulary in `vocabulary` table
- Example sentences in `vocabulary_examples`
- N5 list and word detail via `vocabulary-progress.service.ts`
- Learned state from completed lessons and review items

## Routes

- `/learn/vocabulary` — N5 word list with learned badges
- `/learn/vocabulary/[wordId]` — word detail with examples and audio

## Dependencies

- Lesson completion (`user_progress`)
- Review items created after vocabulary lessons complete
