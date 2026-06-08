# Noboru Learner Personas

Version: 1.0

Status: AUTHORITATIVE

This document defines primary learner personas for Noboru. Product, UX, content, and gamification decisions should address these personas' goals and needs.

**Related documents:** [product-strategy.md](./product-strategy.md), [prd.md](./prd.md), [user-flows.md](./user-flows.md), [uiux.mdc](../.cursor/rules/uiux.mdc)

---

## Persona Overview

| Persona | Archetype | Onboarding Goal | Starting Level |
|---------|-----------|-----------------|----------------|
| Hana | Complete Beginner | Culture / general interest | None |
| Kenji | Anime Learner | Anime | None – N4 |
| Sofia | Traveler | Travel | None – N5 |
| Marcus | JLPT Student | JLPT | N5 – N1 |
| Yuki | Returning Learner | Work / JLPT | N4 – N2 |

---

## Persona 1: Hana — The Complete Beginner

### Profile

- **Age:** 22
- **Background:** University student, no prior Japanese exposure
- **Device:** Smartphone (primary), occasional tablet
- **Study time:** 10–15 minutes daily

### Goals

- Learn hiragana and katakana confidently
- Understand basic greetings and introductions
- Feel progress without overwhelm
- Build a sustainable daily habit

### Motivations

- Fascination with Japanese culture
- Plans to visit Japan someday
- Wants a structured path — not random YouTube tutorials

### Frustrations

- Too many apps assume prior knowledge
- Intimidated by kanji before foundations exist
- Abandons apps that feel like chores or guilt machines

### Needs from Noboru

| Need | Noboru Response |
|------|-----------------|
| Gentle start | Foothills region, step-by-step lessons |
| Clear direction | Home dashboard with "Continue Learning" |
| Encouragement without pressure | Yama companion, elevation feedback — no streak guilt |
| Visible progress | Trail progress, region map, first achievements |
| Short sessions | 5–10 min daily goal option in onboarding |

### Success Criteria

Completes hiragana, begins vocabulary, maintains 2+ weeks of study without feeling overwhelmed.

---

## Persona 2: Kenji — The Anime Learner

### Profile

- **Age:** 19
- **Background:** Watches anime with English subtitles, recognizes some words
- **Device:** Smartphone, late-night study sessions
- **Study time:** 20–30 minutes daily

### Goals

- Understand anime dialogue without subtitles
- Read manga in Japanese
- Learn vocabulary from media contexts
- Improve listening comprehension

### Motivations

- Emotional connection to characters and stories
- Wants to catch nuances lost in translation
- Enjoys games and challenges

### Frustrations

- Textbook Japanese feels unlike real anime speech
- Memorizes words but cannot recognize them in fast dialogue
- Gets bored with repetitive drills

### Needs from Noboru

| Need | Noboru Response |
|------|-----------------|
| Vocabulary depth | Word detail pages with audio and examples |
| Recognition practice | Vocabulary Rush, Word Match games |
| Reading progression | Reading Challenge, stories (post-MVP expansion) |
| Fun without distraction | Learning games that teach — see [game-design.md](./game-design.md) |
| Progress that feels cool | Achievements, elevation, region exploration |

### Success Criteria

Recognizes 500+ common words, completes Forest Trail, uses review center daily.

---

## Persona 3: Sofia — The Traveler

### Profile

- **Age:** 34
- **Background:** Professional, planning a 2-week Japan trip in 8 months
- **Device:** Smartphone during commute
- **Study time:** 15–20 minutes daily, intensive before trip

### Goals

- Navigate transit, restaurants, and hotels
- Ask for help and directions politely
- Read signs and menus
- Feel confident, not fluent

### Motivations

- Practical travel preparation
- Respect for local culture
- Efficient use of limited study time

### Frustrations

- JLPT-focused apps teach grammar she may never use on a trip
- Cannot assess "am I ready for my trip?"
- Needs offline study on flights

### Needs from Noboru

| Need | Noboru Response |
|------|-----------------|
| Practical vocabulary | Categorized vocabulary with situational examples |
| Conversation basics | Dialogues and grammar for polite requests |
| Time-efficient path | Daily goal customization, focused review queue |
| Offline access | Downloaded lessons, offline vocabulary/kanji/reviews |
| Confidence feedback | Mastery stats, weak area alerts in Review Center |

### Success Criteria

Completes N5-relevant practical units, maintains review habit, feels confident ordering food and asking directions.

---

## Persona 4: Marcus — The JLPT Student

### Profile

- **Age:** 27
- **Background:** Studied Japanese in college, targeting JLPT N3
- **Device:** Smartphone + desktop for longer sessions
- **Study time:** 30–60 minutes daily

### Goals

- Pass JLPT N3 (then N2)
- Systematic kanji and grammar coverage
- Track mastery by JLPT level
- Identify and fix weak areas

### Motivations

- Career opportunities requiring Japanese certification
- Structured accountability
- Data-driven study optimization

### Frustrations

- Apps lack JLPT alignment or depth
- Cannot see granular mastery breakdown
- Review tools disconnected from curriculum

### Needs from Noboru

| Need | Noboru Response |
|------|-----------------|
| JLPT alignment | [jlpt-content-architecture.md](./jlpt-content-architecture.md) per-level structure |
| Kanji depth | Kanji Academy — readings, stroke order, radicals |
| Grammar precision | Grammar cards with exercises and SRS integration |
| Assessment | Boss trials as educational assessments |
| Analytics | Mastery stats, weak areas, review history |

### Success Criteria

Completes Mount N5, advances through N4 content (post-MVP), passes N3 with documented weak-area improvement.

---

## Persona 5: Yuki — The Returning Learner

### Profile

- **Age:** 41
- **Background:** Studied Japanese years ago, rusty at N4 level
- **Device:** Smartphone, morning routine
- **Study time:** 20 minutes daily

### Goals

- Reactivate forgotten vocabulary and kanji
- Rebuild grammar confidence
- Resume progress without starting over
- Avoid shame about the gap

### Motivations

- New job opportunity involving Japanese partners
- Personal satisfaction of finishing what she started
- Prefers calm, premium experiences over noisy apps

### Frustrations

- Apps force beginner paths despite prior knowledge
- SRS decks are empty or overwhelming after a break
- Streak mechanics create guilt after absence

### Needs from Noboru

| Need | Noboru Response |
|------|-----------------|
| Level placement | Onboarding "Current Level" selection (N4, N3, etc.) |
| Refresher path | Review-heavy start, adaptive weak area focus |
| No guilt | Streaks secondary; learning primary (see [uiux.mdc](../.cursor/rules/uiux.mdc)) |
| Premium feel | Calm dark mode, breathable layouts, meaningful achievements |
| Account continuity | Auth + cloud sync for progress recovery |

### Success Criteria

Completes placement-aligned review backlog, resumes daily lessons, reaches prior proficiency within 3 months.

---

## Cross-Persona Design Implications

### Onboarding

All personas pass through the 7-screen onboarding defined in [prd.md](./prd.md):

1. Welcome
2. Learning goal (maps to persona)
3. Current level
4. Daily study goal
5. Theme preference
6. Meet Yama
7. Begin Ascent

### Navigation

All personas use the 6-tab bottom navigation (see [information-architecture.md](./information-architecture.md)):

Home · Learn · Review · Games · Community · Profile

### Gamification Tone

- Elevation and achievements — yes
- Streak pressure and fear-of-loss — no
- Pay-to-win — never

### Content Prioritization (MVP)

| Persona | MVP Priority Content |
|---------|---------------------|
| Hana | Foothills, hiragana/katakana |
| Kenji | Vocabulary, games, reading challenges |
| Sofia | Practical N5 vocabulary and dialogues |
| Marcus | Full N5 curriculum, kanji, grammar, boss trials |
| Yuki | Review center, placement, N5 refresher |

---

## Using Personas in Development

When designing a feature, identify:

1. Which persona(s) benefit most
2. Which persona(s) might be harmed by poor UX
3. Whether the feature serves **mastery** or only **engagement**

If no persona benefits educationally, reconsider the feature.

---

END OF personas.md
