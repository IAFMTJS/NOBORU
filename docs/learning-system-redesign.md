# Noboru Learning System Redesign

Status: **AUTHORITATIVE** (promoted from product design session, 2026-07-02)

This document defines the curriculum and exercise architecture for Noboru. It supersedes exercise-first lesson assembly with **knowledge-first** progression.

## Philosophy

```
Teach → Practice → Combine → Master → Review → Apply
```

## Golden Rule

Every exercise may ONLY test concepts that have already been introduced.

## Knowledge Blocks (algorithmic)

Knowledge blocks are **derived at runtime** from ordered `lesson_items` — no CMS block table.

Implementation: [`lib/learning/knowledge-block/`](../lib/learning/knowledge-block/)

| Content | Block sequence |
|---------|----------------|
| Vocabulary | teach → recognition → recall → listening (if audio) |
| Particle grammar | teach → particle MCQ only |
| Conjugation grammar | teach chain → conjugation drill |
| After atomic blocks | combine (word bank, fill blank, translation) |
| End of lesson | mastery challenge |

## Learning Layers

Nine independent skills: vocab recognition, vocab recall, listening, reading, sentence comprehension, grammar, conjugation, sentence construction, production.

Each scored `LessonStep` carries `learningLayer` and `learningObjective`.

## Hint Policy

| Difficulty | Furigana | Romaji | Translation |
|------------|----------|--------|-------------|
| Easy | yes | yes | yes |
| Normal | yes | on demand | yes |
| Hard | no | on demand | no |

Configured in Settings → Study difficulty. Applied via `hintPolicy` on steps.

## Mastery

- Per-content depth: `user_content_mastery` with layer exercise types (`layer:vocab_recognition`, etc.)
- SRS: `review_items` with mapped ratings (`hard`/`easy` → RPC `good`/`strong`)

## Related docs

- [NOBORU LEARNING ARCHITECTURE BIBLE.md](./NOBORU%20LEARNING%20ARCHITECTURE%20BIBLE.md)
- [jlpt-content-architecture.md](./jlpt-content-architecture.md)
