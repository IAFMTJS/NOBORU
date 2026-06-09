# Hiragana Feature

## Purpose

Hiragana catalog, chart progress, and lesson content for the Foothills region.

## Responsibilities

- Published hiragana characters in `hiragana` table
- Chart progress via `hiragana-progress.service.ts`
- Learned state from completed lessons and review items

## Routes

- `/learn/hiragana` — full hiragana chart with learned badges

## Dependencies

- Lesson completion (`user_progress`)
- Review items created after hiragana lessons complete
