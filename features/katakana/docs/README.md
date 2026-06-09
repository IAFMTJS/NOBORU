# Katakana Feature

## Purpose

Katakana catalog, chart progress, and lesson content for the Forest Trail region.

## Responsibilities

- Published katakana characters in `katakana` table
- Chart progress via `katakana-progress.service.ts`
- Learned state from completed lessons and review items

## Routes

- `/learn/katakana` — full katakana chart with learned badges

## Dependencies

- Lesson completion (`user_progress`)
- Review items created after katakana lessons complete
