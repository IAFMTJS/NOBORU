# Noboru Learning & Competitive Audit — Action Plan

Version: 0.4

Status: **ACTIVE WORKING DOCUMENT**

This document consolidates audits comparing Noboru’s gameplay, pedagogy, and competitive position against leading Japanese learning apps. Complete each section in order; the **Consolidated Implementation Plan** at the end is written only after all audits are done.

**Related documents:** [product-strategy.md](./product-strategy.md), [gamification.md](./gamification.md), [game-design.md](./game-design.md), [jlpt-content-architecture.md](./jlpt-content-architecture.md), [mvp-roadmap.md](./mvp-roadmap.md)

---

## Audit tracker

| # | Audit | Status | Owner | Notes |
|---|--------|--------|-------|-------|
| 1 | [Gameplay gap matrix](#1-gameplay-gap-matrix) (per screen vs Duolingo) | **Complete** | — | Home, Learn, Review, Games/Explore |
| 2 | [Pedagogy audit](#2-pedagogy-audit) (lesson-by-lesson JLPT N5 coverage) | **Complete** | — | 72 lessons inventoried; JLPT N5 coverage scored |
| 3 | [Competitive scan](#3-competitive-scan) (Duolingo, Bunpro, WaniKani, LingoDeer) | **Complete** | — | Positioning matrix + implications |
| 4 | [Mini-games implementation plan](#4-mini-games-implementation-plan) (Word Match + Vocabulary Rush) | **Complete** | — | Content rules from §2–3 |
| 5 | [Consolidated implementation plan](#5-consolidated-implementation-plan) | **In progress** | — | Phases A+B shipped; C–F underway |

---

## Executive summary (cross-audit)

*Updated after each section completes.*

| Lens | Current verdict | Primary gap |
|------|-----------------|-------------|
| **Language teacher** | Strong pedagogy per lesson (4.4/5 avg); kanji trail complete | **Vocab 4% of N5** (35 words); grammar 19%; speaking/writing absent |
| **Gameplay vs Duolingo** | ~3.5/5 on “game feel” | Session brevity improved; trials still under-surfaced on region |
| **Gameplay vs Bunpro** | ~3/5 game feel; **lose on grammar depth** | No sentence production; 17 vs 900+ grammar points |
| **Gameplay vs WaniKani** | ~3/5; **tie on N5 kanji count** | No radicals/mnemonics; broader than kanji-only |
| **Gameplay vs LingoDeer** | ~3.5/5; **lose on session brevity** | Closest course peer; lacks 10-min unit rhythm + writing drills |
| **Doc vs code** | Partial alignment | Games 2 & 4 shipped; Games 1/3/5 still planned |

**Strategic position (from [product-strategy.md](./product-strategy.md)):** Noboru is intentionally not a Duolingo clone. Audits measure gaps for **habit formation** and **perceived polish**, not for copying streak anxiety or hearts.

---

## 1. Gameplay gap matrix

**Status:** Complete  
**Scope:** Home, Learn (overview + region + lesson), Review, Games/Explore  
**Benchmark:** Duolingo-style session design and retention hooks

### 1.1 Cross-screen patterns

| Pattern | Duolingo | Noboru today | Gap severity |
|---------|----------|--------------|--------------|
| Primary CTA | One big “Continue” + streak/goal ring | “Continue Climbing” on Home + Learn | Low |
| Session length | ~5 min units | Full lessons (10–20+ min) | **High** |
| Quick play | Practice hub, timed drills | None | **High** |
| Reward moment | XP pop, streak, league rank | EP badge, Yama celebration (lessons) | Medium |
| Mistake tension | Hearts | None (intentional) | N/A |
| Social competition | Leagues | Stub in Explore | **High** |

**Nav context:** Bottom tabs = Home · Learn · Review · Explore · Profile. `/games` is only reachable via Explore.

### 1.2 Home (`/home`)

#### Current UI (shipped)

```
┌─────────────────────────────────────┐
│ Home                                │
├─────────────────────────────────────┤
│ ┌─ Expedition Hero ───────────────┐ │
│ │ Greeting · Region · Level/EP    │ │
│ │ [Yama]                          │ │
│ │ Region progress bar             │ │
│ │ [Continue Climbing · Lesson X]  │ │
│ │ Trail preview (5 nodes)         │ │
│ │ Today's Quests + Weekly         │ │
│ └─────────────────────────────────┘ │
│ PWA install prompt                  │
│ ┌─ Recent Achievements ───────────┐ │
│ │ badges…                         │ │
│ │ [Review Queue (N)]              │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Key files:** `features/learning/components/home-dashboard.tsx`, `features/learning/components/trail/expedition-hero.tsx`, `features/learning/services/dashboard-server.service.ts`

**Data available but not surfaced:** `elevation.progressPercent`, `epToNextLevel`, `nextMilestone`, streak (`HomeDashboardViewModel`).

#### Gaps

| Gap | Impact |
|-----|--------|
| No daily goal ring (minutes/EP from onboarding) | Weak “done for today” feeling |
| Review queue buried in achievements card | Practice not front-and-center when due |
| No Quick Climb (5-item sprint) | No bite-sized return visit |
| Streak not on Home | Less habit hook (by design) |
| Trials unlock not surfaced | Misses best “game moment” |
| Level-up EP progress not visualized | EP feels abstract |

#### Recommended wireframe (Home v2)

```
┌─────────────────────────────────────┐
│  🔥 3-day climb    ○○○○○ 12/20 min │
├─────────────────────────────────────┤
│ ┌─ Continue Your Climb ───────────┐ │
│ │ Region · Trail    [Yama]        │ │
│ │ ████████░░ 68% region           │ │
│ │  [ ▶ Continue Lesson ]          │ │
│ │  [ ⚡ Quick Review (12 due) ]   │ │
│ │  [ 🏔 Trial Ready: N5 Sentinel] │ │
│ └─────────────────────────────────┘ │
│ Level 14  ████████░░ 340/425 EP     │
│ Today's Quests (2/4) — horizontal   │
│ Trail ahead (compact map)           │
└─────────────────────────────────────┘
```

**Priority:** P0

---

### 1.3 Learn (`/learn` → region → lesson)

#### 1.3a Learn overview

**Key files:** `features/learning/components/learning-path-screen.tsx`, `app/(app)/learn/page.tsx`

#### Gaps

| Gap | Impact |
|-----|--------|
| Duplicate CTA with Home | OK but undifferentiated |
| Locked regions feel static | Less “map to conquer” |
| No domain quick links at Learn root | N5 hubs only inside region screen |
| No estimated time on next lesson | Duolingo shows “~5 min” |

#### Recommended wireframe (Learn v2)

```
┌─────────────────────────────────────┐
│ Learn                    [Progress] │
├─────────────────────────────────────┤
│ NEXT UP · ~8 min · +35 EP           │
│ [ ▶ Start ]                         │
│ YOUR REGIONS (progress + hub chips) │
│ Locked regions → [View Trial]       │
└─────────────────────────────────────┘
```

**Priority:** P1

#### 1.3b Region trail (`/learn/[regionSlug]`)

**Key files:** `features/learning/components/region-units-screen.tsx`, `features/trials/components/region-trials-panel.tsx`

#### Gaps

| Gap | Impact |
|-----|--------|
| Trials panel below progress + hub links | Boss fights should feel like trail peaks |
| No sticky “next node” footer | Extra scroll/tap friction |
| Content hubs disconnected from trail | Feels like separate corners |

#### Recommended wireframe (Region v2)

```
┌─────────────────────────────────────┐
│ ╭─── TRIAL PEAK (pinned) ─────────╮ │
│ │ [ Attempt Trial ]               │ │
│ ╰─────────────────────────────────╯ │
│ UNIT trail map · STUDY HUB chips    │
├─────────────────────────────────────┤
│ [ ▶ Continue: Lesson 8 ]  sticky  │
└─────────────────────────────────────┘
```

**Priority:** P1

#### 1.3c Lesson player (`/learn/lesson/[lessonId]`)

**Key files:** `features/learning/components/lesson-player.tsx`, `features/learning/components/drills/*`

#### Gaps

| Gap | Impact |
|-----|--------|
| Long teach blocks before recall | Slower game pace |
| No combo / streak within lesson | Less session excitement |
| Mixed “XP” and “EP” on complete screen | Polish issue |
| No “Next lesson” one-tap after complete | Navigation friction |
| No skip-teach for known items | Frustrating for restarters |

#### Recommended wireframe (Lesson complete v2)

```
┌─────────────────────────────────────┐
│  🎉 Lesson Complete! +42 EP         │
│  Quest progress · [Yama]            │
│  [ ▶ Next Lesson ]  [ Review 12 ]   │
│  [ Back to Trail ]                  │
└─────────────────────────────────────┘
```

**Priority:** P0 post-lesson flow; P2 in-lesson combo

---

### 1.4 Review (`/review`)

**Key files:** `features/review/components/review-session.tsx`, `features/review/components/review-stats-panel.tsx`, `features/review/services/srs.service.ts`

#### Gaps

| Gap | Impact |
|-----|--------|
| Reveal-then-rate only (no typed recall in review) | Less gamey than active recall |
| No session complete screen | Abrupt end |
| Weak areas = badges only, no action | Data exists, no loop |
| No review sprint (5/10/20) | No quick session |
| No timer / speed mode | Missing arcade layer |

#### Recommended wireframe (Review v2)

```
┌─────────────────────────────────────┐
│ START A SESSION                     │
│ [Quick 5] [All Due] [Weak: Kanji]   │
│ Session 3/10 · card · Again/Good/Strong
│ ── end: summary + EP + [Continue Climb] │
└─────────────────────────────────────┘
```

**Priority:** P0 session modes; P1 session summary

---

### 1.5 Games (`/games`) + Explore (`/explore`)

**Key files:** `features/games/components/games-screen.tsx`, `features/explore/components/explore-screen.tsx`, `features/trials/components/trial-hub.tsx`

#### Gaps

| Gap | Impact |
|-----|--------|
| Zero playable mini-games (docs list 5 MVP) | Critical credibility gap |
| Explore is link directory, not playground | “Coming soon” feel |
| Trials two taps deep | Should be first-class |
| Games not in bottom nav | Low discoverability |
| Community/leagues cards are dead ends | Trust erosion |

#### Recommended wireframe (Explore as Challenge Camp)

```
┌─────────────────────────────────────┐
│ DAILY SPRINTS                       │
│ [Word Match] [Vocab Rush] [Review]  │
│ TRIALS (inline card + See all)      │
│ LEADERBOARD opt-in (future)         │
└─────────────────────────────────────┘
```

**Priority:** P0 — ship 2 mini-games; remove empty preview cards

---

### 1.6 Gameplay priority matrix

| Screen | Change | Effort | Impact |
|--------|--------|--------|--------|
| Home | Review CTA + trial banner + EP level bar | Small | ★★★★★ |
| Home | Quick Review (5-card sprint) | Medium | ★★★★★ |
| Review | Session modes + complete summary | Medium | ★★★★☆ |
| Explore | 2 real mini-games | Medium | ★★★★★ |
| Lesson | Post-lesson “Next lesson” CTA | Small | ★★★★☆ |
| Region | Pin trial peak + sticky continue | Small | ★★★☆☆ |
| Learn | Time estimate + hub chips | Small | ★★★☆☆ |

### 1.7 Do not copy from Duolingo

- Hearts / mistake punishment
- Streak-loss anxiety notifications
- Gem-gated learning
- XP-only leagues
- Crown grinding without mastery depth

**Noboru playable identity:** Trail + Trials + Quick Sprints + SRS.

---

## 2. Pedagogy audit

**Status:** Complete (2026-06-11)  
**Scope:** Lesson-by-lesson coverage against JLPT N5 expectations  
**Benchmark:** JLPT N5 scope (vocab ~600–800, kanji ~103, grammar ~70–90), [jlpt-content-architecture.md](./jlpt-content-architecture.md) balance targets  
**Data source:** `supabase/migrations/` (CMS seeds), `features/hiragana|katakana/constants/*-catalog.ts`  
**Machine-readable inventory:** `scripts/audit-pedagogy-inventory.mjs` → `scripts/audit-pedagogy-inventory.json`

### 2.1 Objectives

1. Map every published lesson in Foothills → Forest Trail → Mount N5 to JLPT N5 domains.
2. Identify **coverage gaps** (vocab, grammar, kanji, reading, listening not taught).
3. Identify **pedagogy gaps** (teach without sufficient recall, missing production, wrong drill type).
4. Score **lesson sequence** (prerequisites, difficulty curve, balance vs [jlpt-content-architecture.md](./jlpt-content-architecture.md) targets).

### 2.2 Content balance targets (authoritative)

From [jlpt-content-architecture.md](./jlpt-content-architecture.md):

| Domain | Target % per JLPT level |
|--------|-------------------------|
| Vocabulary | 30% |
| Kanji | 20% |
| Grammar | 20% |
| Reading | 10% |
| Listening | 10% |
| Speaking | 5% |
| Writing | 5% |

### 2.3 Audit methodology

#### Step A — Inventory CMS content

| Source | Path / query |
|--------|----------------|
| Regions & units | `supabase/migrations/*_n5_*.sql`, `features/learning/repositories/curriculum.repository.ts` |
| Lessons & items | `lessons`, `lesson_items` tables |
| Vocabulary | `features/vocabulary/` + migrations |
| Kanji | `features/kanji/` + migrations |
| Grammar | `features/grammar/` + migrations |
| Reading | `features/reading/` + migrations |
| Listening | `features/listening/` + migrations |
| Trials | `supabase/migrations/*_trial_*.sql` |

**Deliverable:** Spreadsheet or table — one row per lesson:

| Column | Description |
|--------|-------------|
| `lesson_id` | CMS id |
| `region` | foothills / forest-trail / mount-n5 |
| `unit` | Unit name |
| `lesson_type` | default / practice / reading / story / dialogue / listening |
| `content_items` | Count by type (vocab, kanji, grammar, …) |
| `drill_types` | teach, typed_recall, choice, matching, … |
| `jlpt_tags` | n5 / pre-n5 |
| `estimated_minutes` | TBD |
| `coverage_notes` | Free text |

#### Step B — JLPT N5 reference checklist

Build checklist from:

- [x] JLPT N5 official vocabulary (~800 words) — 38 published (§2.6.1)
- [x] JLPT N5 grammar points (~80 patterns) — 17 published (§2.6.1)
- [x] JLPT N5 kanji (~100 characters) — 103 published (§2.6.1)
- [x] Hiragana / katakana — 71 each, full syllabary (§2.6.1)
- [x] Reading: 3 stories + 2 dialogues + 6 script passages (§2.6.6)
- [x] Listening: 4 exercises + 1 challenge (§2.6.6)

**External references to cite in audit:**

| Reference | Use |
|-----------|-----|
| JLPT official test content specification | Scope boundaries |
| Tango N5 / common frequency lists | Vocab completeness |
| Genki I / Minna no Nihongo I overlap | Sequence sanity check |

#### Step C — Per-lesson pedagogy rubric

Score each lesson 1–5 on:

| Criterion | Question |
|-----------|----------|
| Exposure | Does teach step present reading, meaning, context, audio? |
| Recall | Is there at least one recall step per taught item? |
| Production | Typed recall where appropriate (kana, vocab, kanji)? |
| Recognition | Choice/matching where grammar/listening needs it? |
| Balance | Practice lesson vs teach+recall appropriate? |
| Assessment | Trial or embedded quiz validates unit outcomes? |
| Retention path | Items enqueued to SRS on complete? |

#### Step D — Region-level summary

| Region | Lessons | Vocab | Kanji | Grammar | Reading | Listening | Trials |
|--------|---------|-------|-------|---------|---------|-----------|--------|
| Foothills | 20 | 3 (Base Camp) | 2 (Base Camp) | 2 (Base Camp) | 3 hiragana passages | — | 1 (Guardian) |
| Forest Trail | 17 | — | — | — | 3 katakana passages | — | 1 (Spirit) |
| Mount N5 | 35 | 35 words | 103 | 15 on trail (+2 Base Camp) | 3 stories + 2 dialogues | 4 exercises + 1 challenge | 3 (Proving Ground, Sentinel, Final) |

**Full N5 path:** 72 published lessons · ~5.5 hours estimated trail time (sum of `estimated_duration` fields).

### 2.4 Known issues — verified

- [x] Onboarding JLPT placement does **not** affect trail start (everyone → Foothills)
- [x] Reading/listening progress **not** in SRS queue (only vocab/kanji/grammar/hiragana/katakana)
- [x] Speaking/writing **not** in lesson engine
- [x] Deferred drill types: ordering, tap-to-build, fill-in-blank (`features/learning/docs/README.md`)
- [x] Trial completion does **not** feed quests/achievements/streaks
- [x] `は (wa)` and `です` exist in CMS but only appear in **Base Camp**, not Mount N5 grammar units

### 2.5 Pedagogy audit deliverables

- [x] **N5 coverage matrix** — §2.6.1
- [x] **Gap list** — §2.6.3
- [x] **Lesson sequence report** — §2.6.4
- [x] **Per-region pedagogy scores** — §2.6.2
- [x] **Recommendations** — §2.6.5

### 2.6 Results

#### 2.6.1 N5 coverage summary

| Domain | Published | JLPT N5 reference | Coverage | Verdict |
|--------|-----------|-------------------|----------|---------|
| Hiragana | **71** characters | ~71 (full syllabary) | **100%** | Complete |
| Katakana | **71** characters | ~71 | **100%** | Complete |
| Kanji | **103** characters | ~103 | **100%** | Complete — strong MVP asset |
| Vocabulary | **38** unique N5 words* | ~600–800 | **~5%** | Critical gap for “N5 complete” claim |
| Grammar | **17** points (15 on Mount N5 trail) | ~70–90 | **~19%** | Major gap — missing core patterns |
| Reading | 3 stories + 2 dialogues + 6 script passages | Ongoing exposure | **Starter** | Adequate for MVP slice, not exam depth |
| Listening | 4 exercises + 1 challenge | Ongoing exposure | **Starter** | Adequate for MVP slice |
| Speaking | 0 | Required pillar (5%) | **0%** | Post-MVP |
| Writing | 0 | Required pillar (5%) | **0%** | Post-MVP |

\*38 = 35 Mount N5 seed words + 3 Base Camp greetings (`こんにちは`, `ありがとう`, `さようなら`). No deduplication overlap.

**Published grammar points (CMS):**

`を`, `が`, `に`, `で`, `と`, `も`, `へ`, `の`, `か`, `ません`, `ましょう`, `あります・います`, `い-adjective + です`, `な-adjective + です`, `くない`, `が好き` — plus Base Camp: `は (wa)`, `です`.

**Notable N5 grammar absent from CMS:** polite past `ました`, `て-form`, plain `ない`, question words as patterns (`どこ`, `何`, `いつ`), `から`/`まで`, counters, `たい`, `てください`, comparative `より`, potential `できる`, etc.

#### 2.6.2 Per-region pedagogy scores

Scored via rubric in §2.3 Step C (1–5 per criterion, averaged). Engine behavior from `lesson.service.ts`: default lessons = teach → typed/choice recall → optional matching (≥3 items).

| Region | Lessons | Avg score | Strengths | Weaknesses |
|--------|---------|-----------|-----------|------------|
| **Foothills** | 20 | **4.5** | Full hiragana pipeline; typed production; SRS; reading intro | Base Camp introduces kanji before full kana mastery |
| **Forest Trail** | 17 | **4.5** | Mirrors hiragana pedagogy for katakana | Same sequence note as foothills |
| **Mount N5** | 35 | **4.3** | Logical vocab→grammar→kanji→reading/listening order; practice checks | Grammar choice-only; reading/listening skip SRS |

**Lesson type averages:**

| Type | Count | Avg | Drill pattern | SRS on complete |
|------|-------|-----|---------------|-----------------|
| hiragana / katakana | 26 | 4.6 | teach + typed recall | Yes |
| vocabulary / kanji | 24 | 4.5 | teach + typed recall + matching | Yes |
| grammar | 5 | 4.0 | teach + choice recall | Yes |
| practice | 5 | 3.4 | recall-only mixed review | Yes |
| reading | 9 | 4.1 | passage + MCQ | Partial (hiragana/katakana script only in review) |
| story / dialogue | 5 | 4.2 | comprehension / branching | **No** |
| listening / challenge | 5 | 4.2 | audio + MCQ | **No** |

#### 2.6.3 Content gap list (priority)

| Priority | Gap | Impact |
|----------|-----|--------|
| **P0** | Vocabulary: 765+ words short of N5 breadth | Cannot honestly market “complete N5 vocabulary” |
| **P0** | Grammar: ~55+ core patterns missing | Learners fail real N5 grammar section |
| **P1** | `は` / `です` not in Mount N5 grammar trail | Foundational patterns orphaned in Base Camp |
| **P1** | Reading/listening not in SRS | Comprehension decays without review loop |
| **P1** | No sentence production drills | Grammar stays recognition-only vs Bunpro/LingoDeer |
| **P2** | No radicals before kanji | WaniKani learners expect radical scaffolding |
| **P2** | Kanji lesson size (10 chars) may spike difficulty | Lesson 1 of Kanji Part I is heavy |
| **P2** | Speaking/writing pillars missing | JLPT balance target unmet |

#### 2.6.4 Lesson sequence & balance

**Mount N5 unit order (correct pedagogical arc):**

```
Units 1–4: Vocabulary → Unit 4: Vocab practice
Units 5–9: Grammar → Unit 9: Grammar practice
Units 10–13: Kanji (10 chars/lesson) → Unit 14: Kanji practice
Unit 15: Reading (stories + dialogues)
Unit 16: Listening (exercises + challenge)
```

**Balance vs [jlpt-content-architecture.md](./jlpt-content-architecture.md) targets (Mount N5 lesson count proxy):**

| Domain | Target % | Lesson share (35) | Content share | Assessment |
|--------|----------|-------------------|---------------|------------|
| Vocabulary | 30% | 23% (8 lessons) | **~5% of words** | Underweight in content |
| Kanji | 20% | 34% (12 lessons) | **100% of kanji** | Overweight in lesson count, complete in content |
| Grammar | 20% | 14% (5 lessons) | **~19% of patterns** | Underweight |
| Reading | 10% | 14% (5 lessons) | Starter set | Lesson share OK; depth thin |
| Listening | 10% | 14% (5 lessons) | Starter set | Lesson share OK |
| Speaking / Writing | 10% | 0% | 0% | Absent |

**Sequence issues:**

1. **Base Camp** (Foothills unit 0) teaches 2 kanji + 3 greetings before hiragana row lessons — acceptable as motivation, but kanji recall may frustrate absolute beginners.
2. **Duplicate kanji exposure:** 人 and 日 appear in Base Camp and again in Kanji Academy — intentional spiral, but not signaled to learners.
3. **Final N5 Trial** tests comprehension/recall, but curriculum vocabulary is 35 words — trial difficulty may outpace taught content unless steps pull from full kanji/hiragana pools.
4. **N4 content** exists in migrations (`mount-n4`) — out of scope for this N5 audit but creates product messaging risk if labeled “N5 MVP.”

#### 2.6.5 Top pedagogy recommendations

1. **Reframe MVP claim:** “N5 **foundations**” or “N5 **starter path**” until vocab ≥300 and grammar ≥40 patterns.
2. **Content sprint P0:** Expand vocabulary in thematic units (family, time, transport, adjectives, question words) using existing lesson template — 5 words/lesson scales well.
3. **Grammar sprint P0:** Add units for `は`/`です`/ます/ました, question words, counters, `て-form` basics — prioritize sentence production drills.
4. **Integrate orphaned grammar:** Move or re-teach `は` and `です` in Mount N5 Unit 5 before particles `を`/`が`.
5. **SRS expansion:** Enqueue story/listening key vocab OR add “comprehension review” cards.
6. **Pedagogy win to preserve:** Kanji at 103/103 — market as differentiator vs Duolingo; don’t dilute with rushed content.
7. **Trial alignment:** Audit trial step content pools against taught vocabulary; add review recommendations on fail.

#### 2.6.6 Lesson-by-lesson inventory

Drills: **T** = teach, **R** = recall (typed/choice), **M** = matching (if ≥3 items), **MCQ** = comprehension quiz. Score = rubric average (§2.3 Step C).

##### Foothills (20 lessons)

| # | Unit | Lesson | Type | Items | ~min | Drills | SRS | Score |
|---|------|--------|------|-------|------|--------|-----|-------|
| 1 | Base Camp | Greetings | vocabulary | 3 | 5 | T+R | Yes | 4.6 |
| 2 | Base Camp | Essential Kanji | kanji | 2 | 5 | T+R | Yes | 4.4 |
| 3 | Base Camp | First Sentences | grammar | 2 | 5 | T+R (choice) | Yes | 4.2 |
| 4 | Hiragana Part I | A Row + ん | hiragana | 6 | 5 | T+R | Yes | 4.6 |
| 5 | Hiragana Part I | Ka Row | hiragana | 5 | 5 | T+R | Yes | 4.6 |
| 6 | Hiragana Part I | Sa Row | hiragana | 5 | 5 | T+R | Yes | 4.6 |
| 7 | Hiragana Part II | Ta Row | hiragana | 5 | 5 | T+R | Yes | 4.6 |
| 8 | Hiragana Part II | Na Row | hiragana | 5 | 5 | T+R | Yes | 4.6 |
| 9 | Hiragana Part II | Ha Row | hiragana | 5 | 5 | T+R | Yes | 4.6 |
| 10 | Hiragana Part II | Ma Row | hiragana | 5 | 5 | T+R | Yes | 4.6 |
| 11 | Hiragana Part II | Ya Row | hiragana | 3 | 5 | T+R | Yes | 4.6 |
| 12 | Hiragana Part II | Ra Row | hiragana | 5 | 5 | T+R | Yes | 4.6 |
| 13 | Hiragana Part II | Wa Row | hiragana | 3 | 5 | T+R | Yes | 4.6 |
| 14 | Hiragana Advanced | Voiced Hiragana | hiragana | 20 | 6 | T+R+M | Yes | 4.6 |
| 15 | Hiragana Advanced | Semi-voiced Hiragana | hiragana | 5 | 6 | T+R | Yes | 4.6 |
| 16 | Hiragana Advanced | Combination Hiragana | hiragana | 21 | 6 | T+R+M | Yes | 4.6 |
| 17 | Hiragana Reading | Morning Routine | reading | 1 | 5 | MCQ | Partial | 4.0 |
| 18 | Hiragana Reading | Studying Japanese | reading | 1 | 5 | MCQ | Partial | 4.0 |
| 19 | Hiragana Reading | Meeting a Friend | reading | 1 | 5 | MCQ | Partial | 4.0 |
| 20 | Hiragana Practice | Hiragana Mastery Check | practice | 10 | 8 | R+M | Yes | 3.4 |

**Trial:** Foothills Guardian (80% region progress, hiragana typed recall).

##### Forest Trail (17 lessons)

| # | Unit | Lesson | Type | Items | ~min | Drills | SRS | Score |
|---|------|--------|------|-------|------|--------|-----|-------|
| 1–10 | Katakana Part I–II | A Row through Wa Row | katakana | 3–6 each | 5 | T+R | Yes | 4.6 |
| 11–13 | Katakana Advanced | Voiced / Semi-voiced / Combination | katakana | 5–21 | 6 | T+R+M | Yes | 4.6 |
| 14–16 | Katakana Reading | Coffee Break, Send Email, Party Night | reading | 1 | 5 | MCQ | Partial | 4.0 |
| 17 | Katakana Practice | Katakana Mastery Check | practice | 10 | 8 | R+M | Yes | 3.4 |

**Trial:** Forest Spirit Challenge (katakana typed recall).

##### Mount N5 (35 lessons)

| # | Unit | Lesson | Type | Items | ~min | Drills | SRS | Score |
|---|------|--------|------|-------|------|--------|-----|-------|
| 1 | People & Places | People | vocabulary | 5 | 6 | T+R+M | Yes | 4.6 |
| 2 | People & Places | Places | vocabulary | 5 | 6 | T+R+M | Yes | 4.6 |
| 3 | Time & Numbers | Time | vocabulary | 5 | 6 | T+R+M | Yes | 4.6 |
| 4 | Time & Numbers | Numbers | vocabulary | 5 | 6 | T+R+M | Yes | 4.6 |
| 5 | Actions & Descriptions | Food & Drink | vocabulary | 5 | 6 | T+R+M | Yes | 4.6 |
| 6 | Actions & Descriptions | Common Verbs | vocabulary | 5 | 6 | T+R+M | Yes | 4.6 |
| 7 | Actions & Descriptions | Descriptors | vocabulary | 5 | 6 | T+R+M | Yes | 4.6 |
| 8 | Vocabulary Practice | N5 Vocabulary Check | practice | 7 | 8 | R+M | Yes | 3.4 |
| 9 | Core Particles I | Object & Subject | grammar | 4 | 6 | T+R (choice) | Yes | 4.0 |
| 10 | Core Particles I | Connection & Possession | grammar | 4 | 6 | T+R (choice) | Yes | 4.0 |
| 11 | Sentence Patterns | Questions & Negation | grammar | 4 | 6 | T+R (choice) | Yes | 4.0 |
| 12 | Adjective Patterns | Describing Things | grammar | 4 | 6 | T+R (choice) | Yes | 4.0 |
| 13 | Grammar Practice | N5 Grammar Check | practice | 8 | 8 | R (choice) | Yes | 3.4 |
| 14–24 | Kanji Part I–IV | Kanji Part · Lessons 1–11 | kanji | 3–10 | 6 | T+R+M | Yes | 4.5 |
| 25 | Kanji Practice | N5 Kanji Check | practice | 12 | 8 | R+M | Yes | 3.4 |
| 26 | Reading | Tanaka's Morning | story | 1 | 3 | read+MCQ | No | 4.2 |
| 27 | Reading | First Day at School | story | 1 | 4 | read+MCQ | No | 4.2 |
| 28 | Reading | Weekend Plans | story | 1 | 5 | read+MCQ | No | 4.2 |
| 29 | Reading | At the Cafe | dialogue | 1 | 4 | branch+MCQ | No | 4.2 |
| 30 | Reading | Meeting a Friend | dialogue | 1 | 4 | branch+MCQ | No | 4.2 |
| 31–34 | Listening | Greeting / Intro / Shop / Station | listening | 1 | 2–3 | audio+MCQ | No | 4.2 |
| 35 | Listening | Daily Conversations | listening_challenge | 3 | 8 | audio+MCQ | No | 4.2 |

**Trials:** N5 Proving Ground → N5 Sentinel → Final N5 Trial (gates Mount N4).

#### 2.6.7 Pedagogy verdict

| Question | Answer |
|----------|--------|
| Is the **lesson engine** sound? | **Yes** — teach→recall, practice checks, trials, SRS integration for core types. |
| Is the **N5 curriculum complete**? | **No** — kanji complete; vocabulary and grammar are MVP **slices** (~5% and ~19%). |
| Can a learner pass JLPT N5 with this content alone? | **No** — not without major supplementation. |
| What is the honest product promise? | “Structured climb through hiragana, katakana, and an **N5 starter core** with full kanji coverage and room to expand.” |

---

## 3. Competitive scan

**Status:** Complete (2026-06-11)  
**Scope:** Duolingo, Bunpro, WaniKani, LingoDeer (+ Anki SRS baseline)  
**Purpose:** Document strengths/weaknesses per competitor; position Noboru without becoming any clone  
**Sources:** Public product pages, App Store listings, Bunpro/WaniKani community docs (2025–2026), Noboru §2 pedagogy inventory

### 3.1 Comparison dimensions

Use the same rubric for each app:

| Dimension | What to evaluate |
|-----------|------------------|
| **Curriculum model** | JLPT, CEFR, textbook, user-built |
| **Session shape** | Length, variety, bite-sized vs deep |
| **Drill types** | MCQ, type, speak, listen, match, build sentence |
| **SRS / retention** | Algorithm transparency, scheduling, weak areas |
| **Gamification** | XP, streaks, hearts, leagues, cosmetics |
| **Progression gating** | Skill tree, levels, placement, bosses |
| **Japanese-specific** | Kanji/WaniKani-style; grammar depth; furigana |
| **Offline** | Core features without network |
| **Monetization** | What’s free vs paid; pay-to-win risk |
| **Noboru opportunity** | Where we win, tie, or should not compete |

### 3.2 Duolingo Japanese

**Profile:** Mass-market gamified app; streak/league-driven; bite-sized skill tree; variable Japanese quality.

| Dimension | Duolingo | Noboru | Winner |
|-----------|----------|--------|--------|
| Curriculum model | CEFR-ish tree; not JLPT-native | JLPT regions + trail | **Noboru** (JLPT students) |
| Session shape | ~5 min, high drill rotation | 5–8 min lessons, lower rotation | **Duolingo** (habit) |
| Drill types | MCQ, type, match, speak, listen | Teach, typed recall, choice, match, embedded read/listen | **Tie** (Duolingo more variety per minute) |
| SRS | Lightweight skill strength | Full SRS (Again/Good/Strong, 8 intervals) | **Noboru** |
| Gamification | Streaks, hearts, leagues, gems | EP, quests, trials, calm streak | **Duolingo** (retention hooks) |
| Progression gating | Crowns, placement skips | Linear trail + graded trials | **Noboru** (mastery framing) |
| Japanese-specific | Furigana; inconsistent particles/keigo | Furigana, JLPT-honest CMS content | **Noboru** (serious learners) |
| Offline | Limited / Plus-gated | PWA offline for core learning | **Noboru** |
| Monetization | Freemium + energy pressure | MVP free learning (no energy) | **Noboru** (ethics) |
| Content depth (N5) | Broad, often shallow | Kanji complete; vocab/grammar slice (§2) | **Mixed** |

**Noboru opportunity:** Do not compete on streak anxiety. Compete on **trials**, **SRS depth**, and **JLPT honesty**. Close the **session brevity** gap via mini-games + quick review (§4).

---

### 3.3 Bunpro

**Profile:** Grammar-and-vocab SRS with **manual sentence input**; 900+ grammar points; JLPT-tagged paths; 25 free full JLPT practice tests (2025); subscription for full access.

| Dimension | Bunpro | Noboru | Winner |
|-----------|--------|--------|--------|
| Curriculum model | Grammar-first SRS index + textbook paths | Integrated JLPT trail (all domains) | **Noboru** (breadth); **Bunpro** (grammar depth) |
| Session shape | Review queue + optional cram | Lessons + review + trials | **Bunpro** (always a queue) |
| Drill types | **Typed sentence production** | Choice recall for grammar; typed for kana/vocab/kanji | **Bunpro** (production) |
| SRS | 12 intervals to “master”; per-grammar sentences | 8 intervals; per-item cards | **Tie** (both serious) |
| Gamification | Streak, stats, badges, JLPT test badges | EP, quests, trials, Yama | **Noboru** (game layer) |
| Progression gating | Self-add grammar to queue; JLPT level filter | Linear trail + trials | Different models |
| Kanji / vocab | Vocab decks + links; not primary | 103 N5 kanji + 38 vocab in CMS | **Noboru** (integrated) |
| Reading / listening | Via JLPT practice tests (free) | Stories, dialogues, listening lessons | **Bunpro** (exam-format tests at scale) |
| Offline | JLPT tests offline (app listing) | Core PWA offline | **Tie** |
| Monetization | Subscription; JLPT tests free | No paywall on learning (MVP) | **Noboru** (ethics) |

**Grammar coverage gap:** Bunpro ~900 points vs Noboru **17** (§2). Noboru grammar lessons score **4.0** on production rubric; Bunpro’s core loop is production-first.

**Noboru opportunity:** Position as **“Bunpro + WaniKani + course” in one trail** — but only credible after grammar content sprint. Short-term: **trials** approximate Bunpro’s “proof” moment; **mini-games** approximate **Cram** mode.

**Do not compete on:** Sentence-input grammar volume until CMS catches up.

---

### 3.4 WaniKani

**Profile:** Kanji + vocabulary via **radicals → kanji → vocab**; 60 levels; ~2,000 kanji; mnemonic-driven; 9 SRS stages (Apprentice → Burned); levels 1–3 free.

| Dimension | WaniKani | Noboru | Winner |
|-----------|----------|--------|--------|
| Curriculum model | Kanji/vocab only; 60-level highway | Full Japanese trail to N1 architecture | **Noboru** (scope) |
| Session shape | Lessons in stacks of 5 + reviews | Full lessons (6–8 min) + reviews | **WaniKani** (frequent small hits) |
| Drill types | Meaning + reading recall; radicals | Typed meaning recall; no radical layer | **WaniKani** (kanji pedagogy) |
| SRS | Fixed published intervals; Guru to level | Again/Good/Strong; mastery states | **Tie** (both rigorous) |
| Gamification | Level #, progress %, community | EP, regions, trials, quests | **Noboru** (adventure) |
| Progression gating | 90% kanji to Guru → next level | Sequential trail + boss trials | **Tie** (both gate) |
| N5 kanji coverage | ~99% of N5 kanji by WK level 10–12 | **103/103 N5 kanji in CMS** (§2) | **Tie** (N5 complete) |
| Radicals / mnemonics | Core teaching method | Absent | **WaniKani** |
| Grammar / listening | None | Integrated | **Noboru** |
| Offline | Limited (web-first) | PWA offline core | **Noboru** |
| Monetization | Subscription after level 3 | Learning not gated | **Noboru** (ethics) |

**Noboru opportunity:** Market **“N5 kanji complete without a second app”** — rare vs Duolingo/LingoDeer. Long-term radical layer is P2 (§2). **Kanji Hunter** mini-game (post Word Match) targets WaniKani-style speed recognition.

**Do not compete on:** Mnemonic community or 2,000-kanji highway until content pipeline scales.

---

### 3.5 LingoDeer

**Profile:** Structured **grammar-forward** courses for Asian languages; A1–B1; ~10 min/day positioning; native audio; handwriting drills; offline on mobile premium.

| Dimension | LingoDeer | Noboru | Winner |
|-----------|-----------|--------|--------|
| Curriculum model | Main course + phrasebook; level units | JLPT mountain regions | **Noboru** (JLPT explicit) |
| Session shape | **~10 min** bite-sized units | 5–8 min per lesson; 72-lesson path ~5.5h | **LingoDeer** (daily unit feel) |
| Drill types | Grammar notes, writing, listen, speak, MCQ | Teach + recall; no handwriting | **LingoDeer** (variety + writing) |
| SRS | Built-in review tab | Dedicated review center + weak areas | **Tie** |
| Gamification | Mild XP/streak vs Duolingo | EP, quests, trials, climb metaphor | **Noboru** (stronger theme) |
| Progression gating | Unit unlock in course | Trail + trials | **Tie** |
| Grammar explanations | Dedicated grammar tips per lesson | Teach cards + CMS explanations | **LingoDeer** (depth per lesson) |
| Reading / stories | In-course stories | 3 stories + 2 dialogues (N5) | **LingoDeer** (volume) |
| Offline | Premium download (mobile) | PWA offline (broader) | **Noboru** (web PWA) |
| Speaking | Some exercises | Not in MVP | **LingoDeer** |
| Monetization | Premium for full course + offline | MVP learning free | **Noboru** (ethics) |

**Closest pedagogical peer** — both teach grammar explicitly (not Duolingo-style drill roulette). Noboru wins **JLPT architecture + trials**; LingoDeer wins **session packaging + writing practice**.

**Noboru opportunity:** Match **10-minute daily unit** feel via **Quick Review + mini-game sprint** without dumbing down lessons. Story/dialogue players are competitive; need **more content volume**.

---

### 3.6 Anki (SRS baseline)

**Profile:** User-built flashcard utility; gold-standard scheduling flexibility; zero gamification.

| Dimension | Anki | Noboru |
|-----------|------|--------|
| Curriculum | User decks | Authoritative CMS + trail |
| UX | Utility / configuration-heavy | Guided adventure PWA |
| SRS | Fully customizable SM-2 variants | Opinionated 8-interval + mastery states |
| Session shape | User decides | Lessons + review + trials |
| Gamification | None (plugins) | EP, quests, trials |
| Offline | Full | Core learning offline |
| Effort required | High (deck building) | Low (guided path) |

**Role in positioning:** Noboru = **“Anki-quality retention without deck-building”** for learners who want structure. Review UX should stay simpler than Anki; depth comes from scheduling + weak areas.

---

### 3.7 Competitive positioning matrix

Rating key: **Strong** · **Good** · **Partial** · **Weak** · **None**

| Capability | Duolingo | Bunpro | WaniKani | LingoDeer | Noboru |
|------------|----------|--------|----------|-----------|--------|
| JLPT N5 curriculum | Partial | Strong (grammar/tests) | Partial (kanji only) | Good (A1–B1) | **Partial** (kanji strong; vocab/grammar slice) |
| Grammar depth | Weak | **Strong** | None | **Strong** | **Weak** (17 points; choice-only) |
| Kanji system | Weak | Partial | **Strong** | Good | **Strong** (103/103; no radicals) |
| SRS quality | Partial | **Strong** | **Strong** | Good | **Strong** |
| Session brevity | **Strong** | Good | **Strong** | **Strong** | **Weak** |
| Game / retention hooks | **Strong** | Partial | Partial | Good | **Partial** (trials yes; mini-games no) |
| Integrated path (all skills) | Good | Partial | Weak | **Strong** | **Good** |
| Exam-style assessment | Weak | **Strong** (JLPT tests) | None | Partial | **Good** (trials) |
| Offline core | Partial | Good | Weak | Good (mobile) | **Strong** |
| Speaking | Good | Weak | None | Good | **None** |
| Premium ethics | Partial (hearts) | Good | Good | Good | **Strong** |

### 3.8 Competitive takeaways → product implications

| Insight | Implication for Noboru |
|---------|------------------------|
| **No competitor owns “JLPT trail + full N5 kanji + calm ethics”** | Lead marketing on integrated climb + kanji completeness |
| **Bunpro owns grammar production** | Content sprint before competing; add sentence drills post-MVP |
| **WaniKani owns radical mnemonics** | Optional radical layer later; ship **Kanji Hunter** sprint for recognition |
| **LingoDeer owns 10-min daily unit** | Ship **Quick Review + 2 mini-games** (§4) — closes biggest UX gap |
| **Duolingo owns habit hooks** | Quests + sprints yes; streak anxiety no |
| **Bunpro’s free JLPT tests set exam bar** | Trials are differentiated but need **listening/reading sections** at scale eventually |
| **Noboru offline PWA is a real moat** | Maintain offline-first as competitors stay cloud/mobile-gated |

**Positioning statement (refined):**

> Noboru is the **JLPT mountain path** for learners who outgrow Duolingo but don’t want three apps (WaniKani + Bunpro + Anki). Today it delivers **complete N5 kanji + strong pedagogy**; vocabulary and grammar breadth are the known gaps (§2).

---

## 4. Mini-games implementation plan

**Status:** Complete (2026-06-11)  
**Scope:** Smallest path to ship **Word Match** + **Vocabulary Rush**  
**Authority:** [game-design.md](./game-design.md) Games 4 & 2  
**Informed by:** §2 (38 vocab words → learned pools are small early), §3 (LingoDeer/WaniKani session brevity; Bunpro cram equivalent)

### 4.1 Goals

1. Close doc/code gap (`game-design.md` MVP games vs `games-screen.tsx` stub).
2. Deliver **2–4 minute** sessions — competitive parity with LingoDeer “10 min/day” via splittable sprints.
3. Wire `sourceType: "game"` EP (already in `elevation.constants.ts`) + analytics.
4. Surface from **Explore** (Challenge Camp) and **Home** quick-action (§1).
5. **Educational rule:** games reinforce **already-learned** content only ([game-design.md](./game-design.md)).

### 4.2 Content rules (from pedagogy + competitive)

| Rule | Decision | Rationale |
|------|----------|-----------|
| **Content pool** | **Learned items only** via `learned-content.repository.ts` | §2: teaching integrity; matches Bunpro/WK “review what you know” |
| **Minimum pool** | ≥4 items to start a session | Below → empty state with CTA to next lesson |
| **Early-learner fallback** | **Kana Match** mode (hiragana/katakana learned sets) when vocab learned < 4 | §2: only 38 CMS words; Foothills/Forest learners need playable content |
| **Distractors (Rush)** | Same `part_of_speech` when possible; else random learned vocab | Avoids “obvious wrong answer” when pool is tiny |
| **Weak-area mode** | **P1** — filter to `review-stats` weak vocabulary after launch | Bunpro/Cram + Noboru SRS data |
| **Unlock** | Available after **first completed lesson** in region (any type) | Always something to play; kana match for pre-vocab |
| **Daily limit** | **Unlimited** (no energy) | Product strategy; vs Duolingo hearts |
| **Offline** | **P1** — cache last session pool in `features/offline/` | Competitive moat; not blocking MVP |
| **EP range** | 10–25 EP per completion ([game-design.md](./game-design.md)) | Scale by accuracy tier |

### 4.3 Reuse inventory

| Asset | Path | Reuse |
|-------|------|-------|
| Matching drill | `features/learning/components/drills/matching-drill.tsx` | Word Match / Kana Match UI |
| Choice recall drill | `features/learning/components/drills/choice-recall-drill.tsx` | Vocabulary Rush |
| Lesson matching builder | `lesson.service.ts` (`buildRecallOptions`) | Distractor generation |
| Trial timer | `features/trials/components/trial-timer.tsx` | Rush countdown |
| Learned content | `features/learning/repositories/learned-content.repository.ts` | Eligible item IDs |
| Vocabulary repo | `features/vocabulary/repositories/vocabulary.repository.ts` | Load word details |
| Hiragana/katakana catalogs | `features/*/constants/*-catalog.ts` | Kana Match pairs |
| Elevation | `features/elevation/services/elevation.service.ts` | `awardEp({ sourceType: "game" })` |
| Yama | `features/yama/services/yama.service.ts` | Game complete feedback |

### 4.4 Architecture

```
features/games/
  components/
    word-match-game.tsx
    vocabulary-rush-game.tsx
    game-complete-card.tsx      # score, EP, Yama, replay
    game-empty-state.tsx        # insufficient learned pool
  services/
    game.service.ts             # orchestration, EP tiers, idempotency
    word-match.service.ts       # build LessonMatchingStep from learned items
    vocabulary-rush.service.ts  # build choice queue + timer ramp
  repositories/
    game-content.repository.ts  # learned vocab/kana resolution
  types/
    game.types.ts
  constants/
    game.constants.ts           # slugs, pair counts, EP table, timer defaults
  tests/
    word-match.service.test.ts
    vocabulary-rush.service.test.ts

app/(app)/games/word-match/page.tsx
app/(app)/games/vocabulary-rush/page.tsx
app/api/games/[slug]/complete/route.ts
lib/orchestration/games.orchestrator.ts
```

### 4.5 Word Match (Game 4)

**Modes at launch:**

| Mode | Pool | Pairs | Unlock |
|------|------|-------|--------|
| **Word Match** | Learned `vocabulary` | 6 | ≥4 learned vocab |
| **Kana Match** | Learned `hiragana` or `katakana` | 8 | ≥4 learned kana; auto-pick script with more learned |

**Flow:**

1. Server loads learned IDs → `game-content.repository` resolves to term/meaning (or character/romaji).
2. `word-match.service` builds `LessonMatchingStep` (same shape lessons use).
3. Client renders `MatchingDrill` inside game chrome (timer optional P1; score = wrong attempts).
4. On complete → `POST /api/games/word-match/complete` with `{ correctCount, totalPairs, durationMs }`.
5. `game.service` awards EP, fires `analyticsService.track({ name: "game_completed", ... })`.
6. EP contributes to existing `earn_ep` quest via `ep_earned` activity (no new quest migration required for MVP).

**EP tiers (Word Match):**

| Result | EP |
|--------|-----|
| All matched, 0 wrong | 20 |
| All matched, 1–2 wrong | 15 |
| Completed with 3+ wrong | 10 |

### 4.6 Vocabulary Rush (Game 2)

**Flow:**

1. Queue **10** learned vocabulary items (shuffle).
2. Each round: `ChoiceRecallDrill` — prompt = kana/kanji; 4 options from `buildRecallOptions`.
3. `TrialTimer` per question: start **12s** → **-1s** per streak (min 6s) — WaniKani/Bunpro “speed” feel.
4. Session ends after 10 questions or 3 lives lost (optional light tension without Duolingo hearts).
5. Complete → API → EP by accuracy:

| Accuracy | EP |
|----------|-----|
| ≥90% | 25 |
| ≥70% | 18 |
| ≥50% | 12 |
| <50% | 10 (participation) |

**Insufficient vocab:** redirect to Kana Match or show empty state — do **not** pull unseen CMS words.

### 4.7 Shared infrastructure

| Piece | Spec |
|-------|------|
| `POST /api/games/[slug]/complete` | Auth required; validate slug enum; Zod body; idempotent EP per session id |
| `game.constants.ts` | `GAME_SLUGS`, `GAME_EP`, `RUSH_TIMER_*`, `MIN_POOL_SIZE` |
| Explore screen | Replace Mini-Games stub with playable cards + best score |
| Home (§1 P0) | Optional “Quick Sprint” chip → `/games/word-match` |
| Analytics | `game_started`, `game_completed` with `slug`, `accuracy`, `durationMs` |
| Trials integration | **Out of scope** — trials remain separate boss assessments |

**Quest integration (MVP):** No new quest template. Game EP flows through existing **Earn 100 EP** daily quest. Post-MVP: add `complete_sprint` metric + daily quest via migration.

### 4.8 Implementation phases

#### Phase A — Ship (1 sprint, ~5–7 dev days)

| # | Task | Size |
|---|------|------|
| A1 | `game.types.ts`, `game.constants.ts` | S |
| A2 | `game-content.repository.ts` + learned pool queries | M |
| A3 | `word-match.service.ts` + unit tests | M |
| A4 | `word-match-game.tsx` + page + orchestrator | M |
| A5 | `vocabulary-rush.service.ts` + unit tests | M |
| A6 | `vocabulary-rush-game.tsx` + page | M |
| A7 | `game.service.ts` + `POST complete` API | S |
| A8 | Update `explore-screen.tsx`, `games-screen.tsx` | S |
| A9 | Analytics events | S |

#### Phase B — Polish (follow-up)

| # | Task |
|---|------|
| B1 | Home “Quick Sprint” CTA (§1) |
| B2 | Weak-area Rush mode (review stats) |
| B3 | Offline pool cache |
| B4 | Daily “Complete 1 sprint” quest (migration) |
| B5 | **Kanji Hunter** (typed/choice, Game 1) — WaniKani competitive response |

### 4.9 Test plan

- [x] Word Match builds pairs only from learned vocabulary IDs (unit tests)
- [x] Kana Match activates when vocab pool < 4 (`word-match.service.test.ts`)
- [x] Rush distractors never equal correct answer; no unseen words (learned pool only)
- [x] EP awards via `sourceType: "game"` in `elevation.service.awardEp`
- [x] `earn_ep` quest increments after game complete (`game.service.completeGame`)
- [x] Empty state when learned pool < 4 (games-screen disabled state)
- [x] Explore links launch playable sessions (not stub)

### 4.10 Success criteria

| Metric | Target |
|--------|--------|
| Session duration | 2–4 min median |
| Code reuse | ≥80% drill UI from `features/learning/components/drills/` |
| Doc/code alignment | `game-design.md` Games 2 & 4 marked **shipped** |
| Competitive gap closed | Session brevity **Weak → Partial** in §3.7 matrix |

---

## 5. Consolidated implementation plan

**Status:** Active (Phases A+B shipped 2026-06-11; C–F in progress)

### 5.1 Recommended phased roadmap

| Phase | Focus | Effort | Source |
|-------|-------|--------|--------|
| **A — Playable sprints** | Word Match + Vocabulary Rush + Explore UI | **Shipped** | §4 |
| **B — Habit loop** | Home quick actions, Review Quick 5, lesson complete CTA | **Shipped** | §1 |
| **C — Content credibility** | Vocab expansion (→300+ words), grammar units (`は`/`です`/ます/ました) | Multi-sprint | §2, §3 |
| **D — Differentiators** | Trial surfacing, trial→quest/streak, reading/listening SRS hooks | 1 sprint | §1, §2 |
| **E — Competitive depth** | Kanji Hunter, weak-area Rush, sentence production grammar | Post-MVP | §3 |
| **F — Social** | Leagues (opt-in), community | Post-MVP | §3 |

**Parallel tracks:** **A + B** (engagement) can run alongside **C** (content) with different owners.

### 5.2 Decision log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-11 | Mini-games use **learned-only** pools + **Kana Match** fallback | §2 tiny vocab; §3 session brevity |
| 2026-06-11 | No new daily quest for games in MVP | EP feeds existing `earn_ep` quest |
| 2026-06-11 | Do not compete with Bunpro on grammar volume short-term | 17 vs 900+ points |
| 2026-06-11 | Lead positioning: **JLPT trail + complete N5 kanji** | §2 kanji 100%; unique vs Duolingo/LingoDeer |

### 5.3 Final prioritized backlog (draft)

| P | Item | Audit |
|---|------|-------|
| P0 | Ship Word Match + Vocabulary Rush | §4 — **Shipped** |
| P0 | Home review CTA + EP progress bar | §1 — **Shipped** |
| P0 | Review “Quick 5” session mode | §1, §3 — **Shipped** (+ hub modes) |
| P0 | Vocabulary content sprint (CMS) | §2 — **Shipped** (+260 words, 3 waves) |
| P0 | Grammar content sprint (は/です/ます/ました + question words) | §2, §3 — **Shipped** (+15 patterns) |
| P1 | Post-lesson “Next lesson” button | §1 — **Shipped** |
| P1 | Trial peak on region screen + Home trial chip | §1, §3 — **Shipped** |
| P1 | Integrate trials with quests/streaks | §2 — **Shipped** |
| P1 | Weak-area Rush mode | §4 B2 — **Shipped** |
| P2 | Kanji Hunter mini-game | §3, §4 B5 — **Shipped** |
| P2 | Radical introduction layer | §2, §3 — **Scaffold** (10 radicals migration) |
| P2 | Leagues opt-in | §3 — **Preview** (community card) |

---

## Appendix A — Key file index

| Area | Path |
|------|------|
| Home dashboard | `features/learning/components/home-dashboard.tsx` |
| Expedition hero | `features/learning/components/trail/expedition-hero.tsx` |
| Learn path | `features/learning/components/learning-path-screen.tsx` |
| Region trail | `features/learning/components/region-units-screen.tsx` |
| Lesson player | `features/learning/components/lesson-player.tsx` |
| Drills | `features/learning/components/drills/` |
| Review session | `features/review/components/review-session.tsx` |
| SRS | `features/review/services/srs.service.ts` |
| Games hub | `features/games/components/games-screen.tsx` |
| Explore | `features/explore/components/explore-screen.tsx` |
| Trials | `features/trials/` |
| Game design spec | `docs/game-design.md` |
| Gamification spec | `docs/gamification.md` |
| JLPT architecture | `docs/jlpt-content-architecture.md` |
| N5 content seed | `supabase/migrations/20260608220000_n5_vocabulary_region.sql` |

---

## Appendix B — Audit session log

| Date | Section | Activity |
|------|---------|----------|
| 2026-06-11 | §1 | Gameplay gap matrix completed (Duolingo benchmark) |
| 2026-06-11 | §2 | Pedagogy audit complete — 72 lessons, JLPT N5 coverage matrix |
| 2026-06-11 | §3 | Competitive scan complete — Bunpro, WaniKani, LingoDeer, matrix |
| 2026-06-11 | §4 | Mini-games plan finalized — learned pools, Kana Match fallback, phases |
| 2026-06-11 | §5 | Draft consolidated roadmap from §1–4 |
| 2026-06-11 | Impl | Phases C–F: content expansion, P1 polish, games polish, Kanji Hunter |

---

END OF learning-audit-action-plan.md
