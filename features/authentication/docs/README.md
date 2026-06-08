# Authentication Feature

## Purpose

Handles user sign-in, registration, session management, and password recovery.

## Responsibilities

- Login, registration, logout, and password reset UI
- Auth business rules via `auth.service.ts`
- Supabase Auth access via `auth.repository.ts` (client) and `auth-server.repository.ts` (server)
- Profile and settings rows created automatically via database trigger on signup

## Dependencies

- `@/lib/supabase/client` (client repository layer)
- `@/lib/supabase/server` (server repository layer)
- Supabase Auth
- Tables: `profiles`, `user_settings` (see `supabase/migrations/`)

## Usage

Pages import components from `features/authentication/components/`.
Components use hooks; hooks call services; services call repositories.

Protected app routes redirect unauthenticated users to `/login` via middleware.

## Known Limitations

- Guest mode not yet implemented
- Study settings (daily goal, notifications) are read-only until Phase 3+
