# Yama System

Purpose: Bring Yama, Noboru's climbing companion, into study flows with supportive presence, encouragement, and celebration — without pressure or guilt.

Authoritative expansion spec: [docs/mascot-expansion-system.md](../../../docs/mascot-expansion-system.md)

## Responsibilities

- Resolve contextual copy and expression mood for home, lessons, reviews, drills, milestones, training grounds, and system states
- Present Yama consistently across loading states, feedback moments, and celebrations
- Keep personality supportive, calm, and achievement-oriented (never annoying or childish)
- Maintain the asset catalog and dialogue pools that drive future mascot art production

## Expansion Architecture

The mascot expansion system separates three layers:

1. **Types** (`types/yama.types.ts`) — expression taxonomy, dialogue pool ids, presence contexts, and asset pack metadata
2. **Catalog** (`constants/yama-asset-catalog.ts`) — authoritative manifest of shipped (`approved`) and planned assets using `yama_{pack}_{variant}_{theme}_v{n}`
3. **Resolution** (`services/yama.service.ts`) — maps `YamaPresenceContext` → `YamaPresenceViewModel` (expression + copy)

Expression packs from the expansion spec:

| Pack | Expression | Min variants | Primary use |
|------|------------|--------------|-------------|
| happy | `happy` | 10 | Correct answers, daily goals |
| celebrating | `celebrating` | 15 | Checkpoints, region clears |
| encouraging | `encouraging` | 10 | Return visits, reminders |
| thinking | `thinking` | 15 | Hints, explanations |
| teaching | `teaching` | 15 | Lesson intros, tutorials |
| surprised | `surprised` | 10 | Rare achievements, easter eggs |
| concerned | `concerned` | 10 | Inactivity (never shaming) |
| determined | `determined` | 15 | Exams, boss trials |
| sleeping | `sleeping` | 10 | Offline, idle |
| confused | `confused` | 10 | Errors, unexpected input |
| sad | `sad` | 10 | Streak loss (supportive only) |
| adventure | `adventure` | 30 | Journey map, exploration |
| training_grounds | `training` | 40 | Kana Dojo, Vocabulary Hall, Grammar Shrine, Listening Pavilion |
| seasonal | `seasonal` | 20 | Seasonal events |
| reward | `reward` | 20 | Chests, XP, badges |

Until dedicated pack art ships, `lib/assets/registry.ts` maps expressions to approved assets. Phase 1 expansion art (20 assets) now ships dedicated poses for teaching, surprised, concerned, determined, sleeping, sad, adventure, training, seasonal, and reward packs.

## Shipped Assets

Core expression moods plus Phase 1 expansion (see `YAMA_SHIPPED_ASSETS`):

- `yama_main_{light,dark}_v1`
- `yama_happy_{light}_v1`, `yama_happy_dark_v2`
- `yama_celebrating_{light}_v1`, `yama_celebrating_dark_v2`
- `yama_encouraging_{light}_v1`, `yama_encouraging_dark_v2`
- `yama_thinking_{light}_v1`, `yama_thinking_dark_v2`
- `yama_loading_{light}_v1`, `yama_loading_dark_v2`
- `yama_victorious_{light,dark}_v1`
- `yama_confused_{light,dark}_v1`
- Phase 1: `yama_teaching_pointing_board`, `yama_surprised_wide_eyes`, `yama_concerned_supportive_concern`, `yama_determined_ready_stance`, `yama_sleeping_resting`, `yama_sad_supportive_disappointed`, `yama_adventure_hiking`, `yama_training_demo_stance`, `yama_seasonal_cherry_blossom`, `yama_reward_presenting_badge` (each `{dark,light}_v1`)

Install pipeline: `npm run assets:mascot-expansion`

## Layers

- `types/yama.types.ts` — expression taxonomy, contexts, asset types
- `constants/yama.constants.ts` — message pools, dialogue pools, expression styling
- `constants/yama-asset-catalog.ts` — planned asset manifest (200+ target)
- `services/yama.service.ts` — context → presence view model
- `services/yama.service.test.ts` — context→expression mapping tests
- `components/yama-avatar.tsx` — themed mascot with expression styling
- `components/yama-presence.tsx` — avatar + message bubble
- `components/yama-reaction.tsx` — compact inline reactions
- `components/yama-celebration.tsx` — milestone celebration panel
- `components/yama-encouragement.tsx` — drill feedback with Yama

## Integrations

- Home expedition hero — contextual expedition message
- App loading routes — `YamaLoading` with rotating trail messages
- Lesson drills — encouragement on correct/incorrect recall
- Lesson complete — celebration; level-up uses celebrating mood
- Review session — encouragement after ratings; empty queue message
- Achievements & quests — Yama reactions on unlock/complete
- Trail map — adventure mood on in-progress node
- Training grounds — location-specific dialogue pools (future UI wiring)

## Known Limitations

- ~460 additional catalog variants remain planned (happy/celebrating/adventure/training sub-poses)
- No Yama skin collection or unlock UI (post-MVP)
- Animations use CSS keyframes (Framer Motion deferred)
- Seasonal expression selection requires event calendar integration (not wired)
