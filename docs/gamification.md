# Noboru Gamification

Version: 1.0

Status: AUTHORITATIVE

This document defines elevation, quests, achievements, leagues, and economy rules for Noboru. Gamification supports learning — learning never supports gamification.

**Related documents:** [game-design.md](./game-design.md), [MASTER_PROMPT.md](./MASTER_PROMPT.md), [prd.md](./prd.md), [database-schema.md](./database-schema.md), [uiux.mdc](../.cursor/rules/uiux.mdc)

---

## Core Rule

From [architecture.mdc](../.cursor/rules/architecture.mdc) and [database-schema.md](./database-schema.md):

> Educational progress is authoritative. Gamification **reads** educational progress. Educational systems must **never** depend on gamification data.

If a gamification feature does not reinforce mastery, it does not ship.

---

## Gamification Philosophy

From [MASTER_PROMPT.md](./MASTER_PROMPT.md):

- Gamification supports learning
- Learning does not support gamification
- Educational outcomes always win
- Motivation through achievement — not guilt
- No fear-of-loss mechanics, no streak addiction, no pay-to-win

From [uiux.mdc](../.cursor/rules/uiux.mdc) Streak Rule:

> Streaks are secondary. Learning is primary. Never pressure users because of streaks.

---

## Elevation System

### Concept

Traditional "XP" is renamed **Elevation Points (EP)** to reinforce the climb metaphor.

### Earning EP

| Activity | EP Range (MVP) | Notes |
|----------|----------------|-------|
| Complete lesson step | 5–15 | Scaled by difficulty |
| Complete full lesson | 25–50 | Bonus on first completion |
| Review item (Good/Strong) | 2–5 | No EP for "Again" |
| Complete review session | 10–30 | Session bonus |
| Daily quest completion | 50–100 | See quests |
| Achievement unlock | 25–500 | Scaled by rarity |
| Game completion | 10–40 | Must demonstrate learning |

EP is never purchasable. EP is never lost as punishment.

### Level System

- Levels: **1–100**
- EP thresholds increase per level
- Level-up rewards: titles, badges, cosmetics, Yama variants (future)
- Future: unlimited prestige beyond level 100

### Elevation Feedback

Every progression event reinforces ascent:

- "Elevation Gained +42 EP"
- "Trail Advanced"
- "Summit Reached"
- "Milestone Earned"

Displayed on Home, Profile, and completion screens.

---

## Daily Quests

### Purpose

Guide daily study habits toward educational activities — not arbitrary engagement.

### MVP Quest Examples

From [prd.md](./prd.md):

| Quest | Target | Reward |
|-------|--------|--------|
| Learn 10 Words | 10 new vocabulary items | EP + Gold |
| Complete 2 Lessons | 2 full lesson completions | EP + Gold |
| Review 20 Items | 20 SRS reviews | EP + Gold |
| Earn 100 EP | Accumulate 100 elevation | EP bonus |

### Quest Rules

- 3 daily quests assigned at local midnight (UTC stored, local displayed)
- Quests always map to educational activities
- Completion is automatic on activity — no manual claim required for MVP core quests
- Optional claim animation for reward moment
- Missing a day: quests reset without penalty messaging

### Weekly Quests (Post-MVP)

- Complete regions
- Master vocabulary sets
- Master kanji sets
- Finish challenges
- Participate in events

---

## Achievement System

### Categories

From [MASTER_PROMPT.md](./MASTER_PROMPT.md):

Learning · Vocabulary · Kanji · Grammar · Reading · Listening · Writing · Speaking · Streaks · Challenges · Events · Exploration

### Rarities

`Common → Uncommon → Rare → Epic → Legendary → Mythic`

### MVP Achievements

From [prd.md](./prd.md):

| Achievement | Trigger |
|-------------|---------|
| First Step | Complete onboarding |
| First Lesson | Complete first lesson |
| 10 Lessons | Complete 10 lessons |
| 100 Words | Learn 100 vocabulary items |
| 50 Kanji | Master 50 kanji |
| 7 Day Streak | Study 7 consecutive days |
| N5 Completed | Complete Mount N5 region |

### Climb-Themed Examples

From [MASTER_PROMPT.md](./MASTER_PROMPT.md):

First Step · Trail Walker · Camp Builder · Mountain Scout · Peak Seeker · Summit Challenger · Master Climber · Legend of Noboru

### Achievement Rules

- Achievements unlock automatically when criteria met
- Educational achievements cannot be purchased or skipped
- Streak achievements exist but are **not** promoted over learning achievements
- Achievement art follows [asset-pipeline.md](./asset-pipeline.md)

---

## League System (Post-MVP)

### Status

Leagues are defined but deferred until social infrastructure exists. See [prd.md](./prd.md) post-MVP modules.

### League Tiers

From [MASTER_PROMPT.md](./MASTER_PROMPT.md):

1. Bronze Trail
2. Silver Trail
3. Gold Trail
4. Platinum Trail
5. Diamond Summit
6. Master Summit
7. Legend Summit

### League Rules (When Active)

- Promotion based on **weekly EP earned through educational activities**
- Demotion is gentle — no fear messaging
- Leagues are opt-in for competitive users
- Friends and regional leaderboards available
- Seasonal leaderboards reset with event cycles

### Forbidden

- Pay-to-promote
- EP purchase for league ranking
- Demotion notifications designed to create anxiety

---

## Economy

### Currencies

From [MASTER_PROMPT.md](./MASTER_PROMPT.md):

| Currency | Purpose | Earned By | Spent On |
|----------|---------|-----------|----------|
| **Elevation Points (EP)** | Level progression | Learning activities | Nothing (not spendable) |
| **Gold** | Standard cosmetic currency | Quests, achievements, games | Shop cosmetics (future) |
| **Gems** | Premium cosmetic currency | Rare achievements, events | Premium cosmetics (future) |
| **Event Tokens** | Seasonal shop | Seasonal events | Event-exclusive items |

### Economy Rules

1. **No pay-to-win** — currencies cannot buy mastery, skip lessons, or boost SRS
2. **No energy systems** — unlimited learning sessions
3. **No gacha / loot boxes**
4. **No artificial waiting** — no timers blocking study
5. Cosmetics only: themes, icons, badges, frames, Yama skins, profile decorations

### Shop System (Post-MVP)

Premium store sells convenience and customization — never educational advantage.

---

## Game Integration

Games are part of gamification but must teach. See [game-design.md](./game-design.md).

### MVP Games

| Game | Skill | EP Reward |
|------|-------|-----------|
| Kanji Hunter | Recognition, reading | Yes |
| Vocabulary Rush | Recall, speed | Yes |
| Memory Dungeon | Long-term retention | Yes |
| Word Match | Association | Yes |
| Reading Challenge | Comprehension | Yes |

### Game Unlock Rules

Games unlock through:

- Region progress
- Mastery milestones
- Achievement completion
- Educational milestones

**Never** through purchases.

### Game Reward Rule

> Rewards accelerate motivation. Rewards do NOT replace learning. Learning progression remains educationally earned.

---

## Boss Trials

Bosses are **educational assessments** — not combat encounters.

Each region ends with a trial testing:

- Vocabulary
- Kanji
- Grammar
- Review knowledge
- Reading (where applicable)

Regional bosses: Foothills Guardian → Forest Spirit → N5 Sentinel → ... → Summit Legend

Passing a boss trial unlocks the next region. Failing offers review recommendations — not punishment.

---

## Collection Systems (Future)

- Kanji Collection
- Vocabulary Collection
- Achievement Collection
- Title Collection
- Theme Collection
- Badge Collection
- Yama Collection

Collections are visual progress galleries — not trading or gacha mechanics.

---

## Seasonal Events (Post-MVP)

- Cherry Blossom Festival
- Summer Festival
- Moon Festival
- Winter Expedition
- New Year Climb
- Special Event Regions

Events offer limited cosmetics and bonus EP — never exclusive educational content locked behind events.

---

## Data Model

Gamification tables (see [database-schema.md](./database-schema.md)):

- `user_elevation` — EP, level
- `achievements` — achievement definitions
- `user_achievements` — unlocked achievements
- `quests` / `user_quests` — daily/weekly quest state
- `leagues` / `league_seasons` — post-MVP

All gamification services read from educational progress tables (`user_progress`, `reviews`, `user_mastery`) — never the reverse.

---

## Notification Integration

Gamification notifications (from [prd.md](./prd.md)):

- Quest completion
- Achievement unlock
- Level up

Notifications must be respectful and actionable — never guilt-driven.

---

## Anti-Patterns (Forbidden)

| Pattern | Why Forbidden |
|---------|---------------|
| Streak loss warnings | Creates anxiety, not mastery |
| EP decay | Punishes absence |
| Energy/stamina | Artificial waiting |
| Loot boxes | Manipulative reward |
| Paid SRS boost | Pay-to-win |
| Leaderboard shaming | Negative social pressure |

---

## MVP Gamification Scope

**In MVP:**

- Elevation (EP) and levels
- Daily quests (4 templates)
- Core achievements (7+)
- Game EP rewards
- Home dashboard gamification widgets

**Post-MVP:**

- Leagues and leaderboards
- Weekly quests
- Seasonal events
- Shop and cosmetics economy
- Collection galleries

---

END OF gamification.md
