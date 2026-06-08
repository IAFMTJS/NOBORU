# Noboru API Specification

Version: 1.0

Status: AUTHORITATIVE

This document defines API structure, authentication patterns, response formats, and error handling for Noboru.

**Related documents:** [architecture.mdc](../.cursor/rules/architecture.mdc), [database-schema.md](./database-schema.md), [prd.md](./prd.md)

---

## API Philosophy

From [architecture.mdc](../.cursor/rules/architecture.mdc):

- APIs are grouped by **domain**, not HTTP method
- Every endpoint must: validate input, validate permissions, return typed responses, handle errors, log failures
- UI never accesses the database directly
- Flow: `Component → Service → Repository → Database`

---

## API Structure

### Route Convention

```
/api/{feature}/{action}/route.ts
```

Grouped under `/app/api/` per Next.js App Router conventions.

### Example Layout

```
app/api/
├── auth/
│   ├── session/route.ts
│   └── callback/route.ts
├── learning/
│   ├── lessons/route.ts
│   ├── lessons/[lessonId]/route.ts
│   └── progress/route.ts
├── review/
│   ├── queue/route.ts
│   └── submit/route.ts
├── vocabulary/
│   └── [wordId]/route.ts
├── kanji/
│   └── [kanjiId]/route.ts
├── grammar/
│   └── [grammarId]/route.ts
├── gamification/
│   ├── elevation/route.ts
│   ├── quests/route.ts
│   └── achievements/route.ts
├── profile/
│   └── route.ts
└── admin/
    ├── vocabulary/route.ts
    ├── kanji/route.ts
    └── users/route.ts
```

---

## Authentication

### Primary Provider: Supabase Auth

Authentication is handled by Supabase Auth. Noboru does not implement custom password hashing.

| Capability | Implementation |
|------------|----------------|
| Registration | Supabase `signUp` via `auth.repository.ts` |
| Login | Supabase `signInWithPassword` |
| Session | Supabase SSR cookies via `middleware.ts` |
| Password reset | Supabase `resetPasswordForEmail` |
| Session refresh | `lib/supabase/middleware.ts` on each request |

### Client Access Pattern

```
Browser: lib/supabase/client.ts
Server:  lib/supabase/server.ts
Middleware: lib/supabase/middleware.ts
```

### Environment Variables

From `.env.example`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Server-only secrets (service role key, etc.) must never use `NEXT_PUBLIC_` prefix.

### Auth API Endpoints (Future REST Wrappers)

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/auth/session` | Return current session + profile summary |
| POST | `/api/auth/callback` | OAuth callback handler (future) |
| DELETE | `/api/auth/session` | Server-side sign out |

MVP auth flows primarily use Supabase client SDK through the repository layer. REST wrappers added when server-side orchestration is required.

### Authorization Rules

- All `/api/*` routes (except public health) require valid session
- `/api/admin/*` routes require role verification against `profiles.role`
- User-owned resources validated against `user_id` with RLS as final guard
- Educational progress endpoints scoped to authenticated user only

---

## Request Standards

### Headers

```
Content-Type: application/json
Authorization: Bearer <supabase-access-token>  # when not using cookies
```

Cookie-based sessions are preferred for browser clients (Supabase SSR).

### Input Validation

Every route must validate input before service calls:

- Use Zod schemas colocated in `features/{feature}/types/` or `lib/validation/`
- Reject invalid input with `400 Bad Request`
- Never pass unvalidated input to repositories

### Example Request

```typescript
// POST /api/review/submit
{
  "reviewItemId": "uuid",
  "rating": "good",       // "again" | "good" | "strong"
  "responseTimeMs": 2400
}
```

---

## Response Standards

### Typed Success Response

```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    timestamp: string;
  };
}
```

### Example Success

```json
{
  "success": true,
  "data": {
    "dueCount": 24,
    "items": []
  },
  "meta": {
    "timestamp": "2026-06-08T12:00:00.000Z"
  }
}
```

### Typed Error Response

```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
    recovery?: string;
  };
  meta: {
    timestamp: string;
    requestId?: string;
  };
}
```

### Example Error

```json
{
  "success": false,
  "error": {
    "code": "REVIEW_ITEM_NOT_FOUND",
    "message": "The review item could not be found.",
    "recovery": "Return to the review center and refresh your queue."
  },
  "meta": {
    "timestamp": "2026-06-08T12:00:00.000Z",
    "requestId": "req_abc123"
  }
}
```

### HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success (GET, PATCH) |
| 201 | Created (POST) |
| 204 | No content (DELETE) |
| 400 | Validation failure |
| 401 | Unauthenticated |
| 403 | Forbidden (role/ownership) |
| 404 | Resource not found |
| 409 | Conflict (duplicate, stale state) |
| 422 | Business rule violation |
| 429 | Rate limited |
| 500 | Internal server error |

User-facing error messages must be calm and actionable — never expose stack traces.

---

## Domain API Catalog (MVP)

### Learning

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/learning/regions` | List regions with user progress |
| GET | `/api/learning/lessons/[lessonId]` | Lesson content assembly |
| POST | `/api/learning/progress` | Record lesson step completion |
| PATCH | `/api/learning/progress/[lessonId]` | Mark lesson complete |

### Review

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/review/queue` | Due review items |
| POST | `/api/review/submit` | Submit review rating |
| GET | `/api/review/stats` | Mastery and weak area summary |

### Gamification

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/gamification/elevation` | Current EP and level |
| GET | `/api/gamification/quests` | Active daily quests |
| POST | `/api/gamification/quests/[questId]/claim` | Claim quest reward |
| GET | `/api/gamification/achievements` | User achievements |

### Profile

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/profile` | Profile + settings summary |
| PATCH | `/api/profile` | Update display name, avatar, bio |
| PATCH | `/api/profile/settings` | Update preferences |

### Admin (Role-Gated)

| Method | Route | Description |
|--------|-------|-------------|
| GET/POST/PATCH/DELETE | `/api/admin/vocabulary` | Vocabulary CRUD |
| GET/POST/PATCH/DELETE | `/api/admin/kanji` | Kanji CRUD |
| GET/POST/PATCH/DELETE | `/api/admin/grammar` | Grammar CRUD |
| GET/POST/PATCH/DELETE | `/api/admin/lessons` | Lesson CRUD |
| GET | `/api/admin/users` | User search |
| PATCH | `/api/admin/users/[userId]` | Role/moderation actions |

---

## Service Layer Contract

API routes are thin. Business logic lives in services.

```typescript
// app/api/review/submit/route.ts
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();

  const body = await request.json();
  const parsed = reviewSubmitSchema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error);

  const result = await reviewService.submitReview({
    userId: session.user.id,
    ...parsed.data,
  });

  return NextResponse.json({ success: true, data: result });
}
```

```
reviewService.submitReview()
  → review.repository.updateReviewState()
  → Supabase / PostgreSQL
```

---

## Offline and Sync API (Future)

Offline-first clients queue mutations locally. Sync endpoint:

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/sync/batch` | Apply queued offline mutations with conflict resolution |

Conflict resolution priority: **educational progress wins** over gamification state.

---

## Rate Limiting

- Auth endpoints: strict limits (prevent brute force)
- Review submit: moderate limits (prevent automation abuse)
- Admin endpoints: role-based + audit logging

---

## Logging and Observability

Every API failure must log:

- `requestId`
- `userId` (if authenticated)
- `route`
- `error.code`
- Timestamp (UTC)

Never log passwords, tokens, or PII beyond user ID.

Future: PostHog event tracking for lesson completion, review completion, retention.

---

## Type Safety

- TypeScript strict mode required
- `any` forbidden without explicit justification
- Shared types in `types/` or `features/{feature}/types/`
- API response types exported for client consumption

---

## Testing Requirements

Each API route requires:

- Unit tests for validation schemas
- Integration tests for service + repository chain
- Authorization tests for protected routes

See [testing-strategy.md](./testing-strategy.md).

---

END OF api-specification.md
