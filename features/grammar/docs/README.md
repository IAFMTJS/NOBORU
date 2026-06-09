# Grammar Feature

## Purpose

N5 grammar catalog, pattern detail views, lesson content, and mastery tracking for Mount N5.

## Responsibilities

- Published grammar points in `grammar_points` table
- Example sentences in `grammar_examples`
- N5 list and detail via `grammar-progress.service.ts`
- Learned state from completed lessons and review items

## Routes

- `/learn/grammar` — N5 grammar list with learned badges
- `/learn/grammar/[grammarId]` — grammar detail with examples

## Dependencies

- Lesson completion (`user_progress`)
- Review items created after grammar lessons complete
