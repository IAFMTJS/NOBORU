-- Review submit idempotency and deferred gamification tracking

alter table public.review_history
  add column if not exists client_event_id uuid,
  add column if not exists gamification_applied_at timestamptz,
  add column if not exists gamification_result jsonb;

create unique index if not exists review_history_user_client_event_idx
  on public.review_history (user_id, client_event_id)
  where client_event_id is not null;
