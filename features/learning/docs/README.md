# Learning Feature

## Purpose

Owns learning path, lessons, and home dashboard learning data.

## Responsibilities

- Home dashboard view model via `dashboard.service.ts`
- Learning path and lesson UI (Phase 2+)
- Placeholder content in `constants/` until CMS/database is connected

## Dependencies

- Future: vocabulary, kanji, grammar repositories (read-only)

## Usage

Home page uses `lib/orchestration/home.orchestrator.ts` to fetch dashboard data.

## Known Limitations

Phase 0 uses `placeholder-dashboard.ts`. No hardcoded content in pages or components.
