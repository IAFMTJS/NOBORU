# Noboru Testing Strategy

Version: 1.0

Status: AUTHORITATIVE

This document defines testing philosophy, tooling, coverage expectations, and per-feature test requirements for Noboru.

**Related documents:** [architecture.mdc](../.cursor/rules/architecture.mdc), [MASTER_PROMPT.md](./MASTER_PROMPT.md), [api-specification.md](./api-specification.md), [mvp-roadmap.md](./mvp-roadmap.md)

---

## Testing Philosophy

From [architecture.mdc](../.cursor/rules/architecture.mdc):

Every feature requires:

- Unit tests
- Integration tests
- Documentation
- Error handling
- Type coverage

From [MASTER_PROMPT.md](./MASTER_PROMPT.md) CI/CD requirements:

```
Lint → Type Check → Unit Tests → Integration Tests → Build Verification → Deployment Validation
```

Quality beats speed. Ship stable, not fast.

---

## Testing Pyramid

```
        ┌─────────┐
        │   E2E   │  Few, critical user journeys
        ├─────────┤
        │ Integr. │  Service + repository + API chains
        ├─────────┤
        │  Unit   │  Business logic, utils, validation
        └─────────┘
```

| Layer | Scope | Speed | Quantity |
|-------|-------|-------|----------|
| Unit | Pure functions, services (mocked repos) | Fast | Many |
| Integration | Service → repository → database | Medium | Moderate |
| E2E | Full user flows in browser | Slow | Few |

---

## Tooling

### Unit and Integration: Vitest (Primary)

**Vitest** is the recommended test runner:

- Native TypeScript and ESM support
- Fast watch mode for development
- Compatible with Next.js 15 and React 19
- Jest-compatible API for familiar patterns

Jest remains acceptable for legacy modules but Vitest is the project standard.

### E2E: Playwright

**Playwright** for end-to-end testing:

- Cross-browser support (Chromium primary for CI)
- Mobile viewport emulation (Noboru is mobile-first)
- Auth state management for flow testing
- Managed by E2E Agent (see `agents/subagents/e2e-agent.md`)

### Static Analysis (CI)

Already in `package.json`:

| Command | Tool | Purpose |
|---------|------|---------|
| `npm run lint` | ESLint (next lint) | Code style and patterns |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) | Type safety |
| `npm run build` | Next.js build | Build verification |

### Future Additions

| Tool | Purpose |
|------|---------|
| `@testing-library/react` | Component testing |
| `msw` | API mocking in integration tests |
| `@playwright/test` | E2E test runner |
| Coverage reporting | CI coverage gates |

---

## Test Location Convention

Per [architecture.mdc](../.cursor/rules/architecture.mdc) feature structure:

```
features/{feature-name}/tests/
├── unit/
│   ├── {feature}.service.test.ts
│   └── {feature}.utils.test.ts
├── integration/
│   ├── {feature}.repository.test.ts
│   └── {feature}.api.test.ts
└── README.md
```

Global shared tests:

```
tests/
├── e2e/
│   ├── onboarding.spec.ts
│   ├── daily-study.spec.ts
│   ├── review-session.spec.ts
│   └── auth.spec.ts
├── fixtures/
└── helpers/
```

---

## Per-Feature Test Requirements

### Authentication (`features/authentication/tests/`)

| Test | Type | Priority |
|------|------|----------|
| Login with valid credentials | Integration | P0 |
| Login with invalid credentials | Unit | P0 |
| Registration validation | Unit | P0 |
| Session persistence | Integration | P0 |
| Password reset flow | E2E | P1 |
| Unauthorized route redirect | E2E | P0 |

### Learning (`features/learning/tests/`)

| Test | Type | Priority |
|------|------|----------|
| Lesson step progression | Unit | P0 |
| Lesson completion updates progress | Integration | P0 |
| Region unlock logic | Unit | P0 |
| Locked lesson prerequisite check | Unit | P0 |
| Offline lesson cache | Integration | P1 |

### Review (`features/review/tests/`)

| Test | Type | Priority |
|------|------|----------|
| SRS interval calculation | Unit | P0 |
| Review state transitions | Unit | P0 |
| Queue generation (due items) | Integration | P0 |
| Submit review updates mastery | Integration | P0 |
| Weak area detection | Unit | P1 |

### Vocabulary / Kanji / Grammar

| Test | Type | Priority |
|------|------|----------|
| Content fetch by ID | Integration | P0 |
| JLPT level filtering | Unit | P1 |
| Mastery state calculation | Unit | P0 |

### Gamification

| Test | Type | Priority |
|------|------|----------|
| EP calculation per activity | Unit | P0 |
| Level threshold logic | Unit | P0 |
| Quest completion detection | Unit | P0 |
| Achievement unlock criteria | Unit | P0 |
| Gamification reads education data only | Unit | P0 |

### Settings / Profile

| Test | Type | Priority |
|------|------|----------|
| Theme preference persistence | Unit | P0 |
| Settings update via service | Integration | P1 |
| Profile data fetch | Integration | P1 |

---

## E2E Critical Flows

From [user-flows.md](./user-flows.md):

| Flow | Spec File | Priority |
|------|-----------|----------|
| Register → Onboarding → Home | `auth.spec.ts` | P0 |
| Login → Home | `auth.spec.ts` | P0 |
| Home → Lesson → Completion | `daily-study.spec.ts` | P0 |
| Review session complete | `review-session.spec.ts` | P0 |
| Settings theme toggle | `settings.spec.ts` | P1 |

E2E tests run at mobile viewport (375×812 default).

---

## Coverage Expectations

| Area | Minimum Coverage | Target |
|------|------------------|--------|
| Services (business logic) | 80% | 90% |
| Repositories | 70% | 80% |
| Utils / validation schemas | 90% | 95% |
| Components | 50% | 70% |
| API routes | 80% | 90% |
| Overall project | 70% | 80% |

### Coverage Exclusions

- Generated types
- Pure re-exports
- Next.js page shells with no logic
- Asset registry constants

### Critical Path 100% Rule

These paths require **100%** test coverage:

- SRS interval logic
- EP calculation
- Auth session validation
- Educational progress write operations
- RLS authorization checks

---

## Test Data Strategy

### Fixtures

- Seed vocabulary, kanji, grammar for test database
- Factory functions for user profiles and progress states
- Deterministic UUIDs in test environment

### Database

- Integration tests use isolated Supabase test project or local Supabase
- Each test suite cleans up its data
- Never run destructive tests against production

### Mocking Rules

| Layer | Mock? |
|-------|-------|
| Repository in service unit tests | Yes |
| Service in component tests | Yes |
| Supabase in repository integration tests | No — use test DB |
| External APIs | Yes (MSW) |

---

## Offline Testing

| Test | Approach |
|------|----------|
| Lesson available offline | Mock IndexedDB / service worker |
| Review queue offline | Local state persistence test |
| Sync on reconnect | Integration with mock network |

---

## Accessibility Testing

| Check | Tool |
|-------|------|
| Automated a11y audit | Playwright + axe-core |
| Keyboard navigation | E2E specs |
| Screen reader labels | Component tests |
| Reduced motion | E2E preference test |

---

## CI Pipeline Integration

From [deployment.md](./deployment.md):

```yaml
# Conceptual CI stages
1. Install dependencies
2. Lint (eslint)
3. Type check (tsc)
4. Unit tests (vitest)
5. Integration tests (vitest + test DB)
6. Build (next build)
7. E2E tests (playwright) — on staging/preview
8. Deploy
```

### PR Requirements

- All unit and integration tests pass
- No type errors
- No lint errors
- Build succeeds

### Pre-Release Requirements

- E2E critical flows pass
- Coverage thresholds met
- No P0 test gaps

---

## Test Naming Convention

```
describe('{Feature}Service')
  describe('{methodName}')
    it('should {expected behavior} when {condition}')
```

Example:

```typescript
describe('ReviewService')
  describe('submitReview')
    it('should advance SRS state to Good when rating is good')
    it('should not award EP when rating is again')
```

---

## Agent Responsibilities

| Agent | Testing Scope |
|-------|---------------|
| Unit Test Agent | Unit test suites in `features/*/tests/` |
| Integration Test Agent | Service + repository integration |
| E2E Agent | Playwright suites in `tests/e2e/` |
| QA Agent | Overall test strategy coordination |

---

## What Not to Test

- Third-party library internals (Supabase SDK, Framer Motion)
- Trivial getters with no logic
- Static documentation files
- Snapshot-only tests with no behavioral assertion

---

END OF testing-strategy.md
