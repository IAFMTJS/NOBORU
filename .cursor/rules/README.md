# Noboru Cursor Rules

Authoritative rules for AI-assisted development in Cursor.

## Always Active

| Rule | Scope |
|------|-------|
| [architecture.mdc](./architecture.mdc) | All code — layered architecture, features, repositories |

## Context-Activated (by glob)

| Rule | Activates On |
|------|--------------|
| [uiux.mdc](./uiux.mdc) | `**/*.tsx`, components, app, feature components |
| [frontend.mdc](./frontend.mdc) | TSX, components, app routes |
| [backend.mdc](./backend.mdc) | services, API routes |
| [database.mdc](./database.mdc) | supabase, repositories |
| [gamification.mdc](./gamification.mdc) | achievements, leagues, games, shop |
| [security.mdc](./security.mdc) | middleware, auth |
| [testing.mdc](./testing.mdc) | tests, `*.test.ts(x)` |
| [deployment.mdc](./deployment.mdc) | scripts, next.config, vercel |
| [accessibility.mdc](./accessibility.mdc) | TSX, components |
| [animations.mdc](./animations.mdc) | TSX, components |
| [content.mdc](./content.mdc) | learning, vocabulary, kanji, grammar, review |
| [japanese-learning.mdc](./japanese-learning.mdc) | feature components and types |
| [assets.mdc](./assets.mdc) | assets/, public/ |

## On-Demand

| Rule | Notes |
|------|-------|
| [performance.mdc](./performance.mdc) | Load time, Lighthouse targets |

## Required Sections (per MASTER_PROMPT)

Every rule contains: Purpose, Requirements, Coding Standards, Success Criteria, Failure Criteria, Examples, Anti-Patterns.
