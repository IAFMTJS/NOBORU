# Achievements Feature

Purpose: Reward meaningful learning milestones with unlock tracking, rarity tiers, and EP bonuses.

## Responsibilities

- Evaluate achievement triggers from authoritative educational progress
- Track user unlocks in `user_achievements`
- Award EP on unlock via the elevation system
- Track study streaks for streak-based achievements
- Showcase unlocked and locked achievements

## MVP Achievements

| Slug | Trigger | Rarity |
|------|---------|--------|
| `first-step` | Complete onboarding | Common |
| `first-lesson` | Complete 1 lesson | Common |
| `ten-lessons` | Complete 10 lessons | Uncommon |
| `hundred-words` | Learn 100 vocabulary items | Rare |
| `fifty-kanji` | Master 50 kanji | Rare |
| `seven-day-streak` | Study 7 consecutive days | Epic |
| `n5-completed` | Complete all Mount N5 lessons | Legendary |

## EP on Unlock

Uses `reward_value` from the achievement row when set; otherwise defaults by rarity (25–500 EP).

## Layers

- `constants/achievement.constants.ts` — slugs, rarity EP defaults
- `repositories/` — achievement definitions, user unlocks, streaks
- `services/achievement.service.ts` — evaluation engine and unlock flow
- `services/streak.service.ts` — daily study streak tracking
- `components/` — badges, showcase, unlock feedback

## Routes

- `GET /api/achievements` — user showcase (unlocked + locked)
- `/achievements` — full achievement page

## Integration

Educational services call `achievementService.afterStudyActivity(userId)` after:

- Lesson completion (`progress.service`)
- Review submit (`review-server.service`)
- Reading/listening progress saves

Home, profile, and progress dashboards load recent/showcase data via `achievementService`.

## Known Limitations

- Trigger criteria are slug-based constants (not CMS-configurable yet)
- Streak uses UTC dates for MVP
- Achievement art assets deferred to art pipeline
