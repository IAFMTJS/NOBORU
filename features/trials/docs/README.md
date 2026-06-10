# Trials Feature

Purpose: Educational assessments that validate recall and comprehension through timed, multi-step challenge flows.

## Responsibilities

- Regional challenges for foothills, forest trail, and Mount N5
- Boss trial (`N5 Sentinel`) and final N5 capstone trial
- Performance tracking with attempts, best scores, and grades
- Completion rewards via elevation EP on first pass
- Review recommendations on failure (no punishment mechanics)

## Trial Grades

| Grade | Score threshold (on pass) | EP multiplier |
|-------|---------------------------|---------------|
| Pass | ≥ pass score | 1.0× |
| Excellent | ≥ 80% | 1.15× |
| Perfect | ≥ 90% | 1.3× |
| Mastery | ≥ 95% | 1.5× |
| Legendary | 100% | 2.0× |

## Layers

- `constants/trial.constants.ts` — labels, grade math, review recommendations
- `repositories/` — trial templates, steps, user progress and attempts
- `services/trial.service.ts` — availability, sessions, completion, performance
- `components/trial-player.tsx` — timed multi-step player using Phase 17 drills
- `components/trial-hub.tsx` — trial listing and entry points

## Routes

- `/trials` — trial hub with performance summary
- `/trials/[slug]` — trial player
- `GET /api/trials` — list trials + performance
- `GET /api/trials/[slug]` — trial session
- `POST /api/trials/[slug]/complete` — submit trial results

## Unlock Rules

- Minimum region progress percent per template
- Prerequisite trial must be passed (boss/final chain on Mount N5)
- Passed trials remain retryable without duplicate EP

## Integration

- Region pages show `RegionTrialsPanel`
- Games screen links to trials hub
- Trial player reuses typed, choice, and matching drills from Phase 17
- Yama celebration on trial complete / fail feedback

## Known Limitations

- Trial step content is seeded statically in migration (not CMS-driven yet)
- Region unlock after final trial is tracked via trial progress only
- Listening/reading comprehension steps deferred to post-MVP trial expansion
