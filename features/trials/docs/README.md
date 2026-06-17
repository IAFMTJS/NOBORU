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

- Boss trial (`n5-sentinel`) uses bible step kinds: `applied_vocabulary`, `grammar_context`, `reading_comprehension`, `listening_comprehension`, `story_comprehension`, `writing_application` (see `20260617230000_n5_boss_examination_bible_steps.sql`)
- Step `content_type` / `content_id` link to vocabulary, grammar, stories, listening, and application CMS rows where available
- Final trial and regional challenges still use legacy step kinds until expanded
