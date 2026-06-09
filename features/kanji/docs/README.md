# Kanji Feature

## Purpose

N5 kanji catalog, detail pages, lesson content, and mastery tracking for Mount N5.

## Responsibilities

- Published kanji in `kanji` table with readings in `kanji_readings`
- Example words in `kanji_examples`
- N5 list and detail via `kanji-progress.service.ts`
- Learned state from completed lessons and review items

## Routes

- `/learn/kanji` — N5 kanji catalog with learned badges
- `/learn/kanji/[kanjiId]` — kanji detail with readings and examples

## Dependencies

- Lesson completion (`user_progress`)
- Review items created after kanji lessons complete
