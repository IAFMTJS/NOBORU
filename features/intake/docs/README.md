# Knowledge Intake Feature

## Purpose

Let learners self-report hiragana, katakana, and vocabulary they already know, then practice with scaffolded drills that mostly use known kana combined with romaji and English prompts.

## Responsibilities

- Multi-step knowledge questionnaire (`intake-wizard.tsx`)
- Seed mastered review items from self-reported inventory
- Build adaptive practice sessions (`intake-practice.service.ts`)

## Routes

- `/learn/intake` — knowledge questionnaire
- `/learn/intake/practice?mode=grow|reinforce` — scaffolded practice session

## APIs

- `POST /api/intake/save` — persist known content inventory
- `GET /api/intake/practice?mode=grow|reinforce` — build practice session

## Dependencies

- Hiragana, katakana, vocabulary repositories for chart data
- Application exercises CMS for kana scaffold drills
- Review repository `seedKnownItemsBatch` for authoritative known state

## Practice modes

- **reinforce** — only exercises using kana the learner already marked
- **grow** — exercises with at most two new kana characters per prompt
