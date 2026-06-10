# Yama System

Purpose: Bring Yama, Noboru's climbing companion, into study flows with supportive presence, encouragement, and celebration — without pressure or guilt.

## Responsibilities

- Resolve contextual copy and expression mood for home, lessons, reviews, drills, and milestones
- Present Yama consistently across loading states, feedback moments, and celebrations
- Keep personality supportive, calm, and achievement-oriented (never annoying or childish)

## MVP Assets

Phase 19 uses canonical theme mascots only:

- `yama_main_light_v1`
- `yama_main_dark_v1`

Expression moods are semantic (CSS motion + copy) until dedicated expression assets ship.

## Layers

- `constants/yama.constants.ts` — message pools and expression styling
- `services/yama.service.ts` — context → presence view model
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
- Trail map — encouragement on in-progress node

## Known Limitations

- No per-expression image assets yet (future Yama variants)
- No Yama skin collection or unlock UI (post-MVP)
- Animations use CSS keyframes (Framer Motion deferred)
