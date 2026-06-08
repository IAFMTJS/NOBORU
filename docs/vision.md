# Noboru Vision

Version: 1.0

Status: AUTHORITATIVE

This document defines the mission, identity, and long-term direction of Noboru. All product, design, engineering, and content decisions must align with this vision.

**Related documents:** [MASTER_PROMPT.md](./MASTER_PROMPT.md), [prd.md](./prd.md), [art-direction.md](./art-direction.md), [design-system.md](./design-system.md)

---

## Mission

Create the world's best Japanese learning platform.

Noboru must combine:

- Educational effectiveness
- Beautiful design
- Long-term retention
- Deep gamification
- Modern technology
- Offline capability
- Premium user experience

The platform should feel like a learning platform, an adventure game, and a personal growth journey — simultaneously.

---

## The Climb Metaphor

**Noboru** (登る) means *to climb*, *to rise*, *to ascend*.

Learning Japanese is not a checklist. Learning Japanese is a climb.

| Concept | Metaphor | Meaning |
|---------|----------|---------|
| Lesson | Step on the trail | Each lesson moves the learner upward |
| Review session | Strength training | Reviews build retention and endurance |
| Challenge | Preparation | Challenges ready the learner for higher elevations |
| JLPT level | Summit | Each level is a new peak to reach |
| Progress | Elevation | Forward momentum, not box-checking |
| Companion (Yama) | Fellow climber | Yama climbs alongside — never lectures from above |

Users are not completing lessons. Users are **ascending**.

Every system, screen, animation, and reward should reinforce ascent — calmly, meaningfully, and without manipulation.

---

## Brand Promise

> Every day you climb a little higher.
>
> Every lesson matters. Every review strengthens you. Every challenge prepares you. Every summit leads to another horizon.

---

## Product Pillars

From [MASTER_PROMPT.md](./MASTER_PROMPT.md):

1. **Mastery** — The goal is fluency, not engagement metrics.
2. **Progress** — Users should always feel forward momentum.
3. **Adventure** — Learning should feel like exploration.
4. **Achievement** — Every accomplishment should feel meaningful.
5. **Consistency** — Small daily actions create mastery.
6. **Wonder** — Japan should feel fascinating and worth discovering.

---

## What Noboru Is

- A **mastery-focused** Japanese learning platform from absolute beginner through JLPT N1
- A **mobile-first PWA** designed for offline study and native-feeling interaction
- An **adventure-oriented** learning journey structured around regions, trails, and summits
- A **systems platform** built for years of growth — not a demo or screen collection
- A **premium educational product** with Apple-level polish and Nintendo-level charm

---

## What Noboru Is Not

Noboru must never feel like:

- Homework
- Corporate training software
- A productivity tracker
- A streak addiction machine
- A Duolingo clone
- A gacha game or pay-to-win experience

Forbidden design patterns (see [game-design.md](./game-design.md)):

- Grinding for its own sake
- Energy systems and artificial waiting
- Fear-of-loss mechanics
- Guilt-driven retention
- Reward addiction loops

---

## Core Experience Goal

The user should consistently feel:

> "I am getting better."

Not:

> "I am maintaining a streak."
> "I am checking boxes."
> "I am completing chores."

Motivation comes through achievement and visible mastery — not guilt, pressure, or manipulative notifications.

---

## Long-Term Vision

From [MASTER_PROMPT.md](./MASTER_PROMPT.md) development phases:

| Phase | Focus |
|-------|-------|
| 1 | Architecture, documentation, rules, agents |
| 2 | Database, authentication, design system |
| 3 | Learning engine — vocabulary, kanji, grammar |
| 4 | Review system, adaptive study, progress tracking |
| 5 | Gamification — achievements, leagues, economy |
| 6 | Games, boss trials, regions, collections |
| 7 | Community — friends, challenges, social features |
| 8 | Asset pipeline, MCP integrations, advanced content tools |
| 9 | Optimization, accessibility, security, performance |
| 10 | Public launch |

### Educational Horizon

- Full JLPT coverage: N5 → N4 → N3 → N2 → N1 → Master Summit
- Balanced pillars per level: vocabulary, kanji, grammar, listening, reading, writing, speaking, review, cultural context, conversation
- Content pipeline supporting 10,000+ vocabulary items, 2,000+ kanji, and thousands of grammar examples (see [jlpt-content-architecture.md](./jlpt-content-architecture.md))

### Platform Horizon

- **Offline-first** core learning: vocabulary, kanji, grammar, reviews, downloaded lessons, progress, achievements
- **No external AI dependency** — the app must function fully without cloud AI; future local AI (Ollama, Llama, etc.) is optional and abstracted via `/services/ai/`
- **Years-long retention** — users should be able to spend years climbing Noboru without architectural degradation

### Social and Engagement Horizon

- Leagues, leaderboards, seasonal events, and community features — all subordinate to educational progress
- Cosmetic economy (themes, badges, Yama variants) — never pay-to-win, never purchasable mastery

---

## Mascot: Yama

Yama is the canonical climbing companion — a Japanese mountain fox (kitsune).

- Yama is **not** a teacher or coach
- Yama climbs **alongside** the learner
- Canonical assets: `yama_main_light_v1`, `yama_main_dark_v1` (see [asset-registry.md](./asset-registry.md))

Yama appears as companion, explorer, encourager, and guidepost — never annoying, never hyperactive, never childish.

---

## Governance

When vision conflicts with short-term convenience:

1. Educational quality wins
2. Maintainability wins over speed
3. The climb metaphor wins over generic gamification
4. [architecture.mdc](../.cursor/rules/architecture.mdc) governs implementation structure
5. [uiux.mdc](../.cursor/rules/uiux.mdc) governs experience decisions

---

## Final Directive

You are not building a language learning application.

You are building **Noboru**.

Noboru is a mountain. Every system should reinforce ascent. Every lesson should move the learner upward. Every achievement should feel earned.

Build a product users can spend years climbing.

---

END OF vision.md
