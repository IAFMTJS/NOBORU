-- Phase 5: scale — archival, JWT-aware admin checks, incremental review stats

-- ---------------------------------------------------------------------------
-- 5.1 Event archival
-- ---------------------------------------------------------------------------

create table if not exists public.review_history_archive (
  like public.review_history including defaults including constraints
);

alter table public.review_history_archive
  add column if not exists archived_at timestamptz not null default now();

create table if not exists public.elevation_events_archive (
  like public.elevation_events including defaults including constraints
);

alter table public.elevation_events_archive
  add column if not exists archived_at timestamptz not null default now();

create table if not exists public.analytics_events_archive (
  like public.analytics_events including defaults including constraints
);

alter table public.analytics_events_archive
  add column if not exists archived_at timestamptz not null default now();

create or replace function public.archive_stale_learning_events(
  p_retention_days integer default 365,
  p_batch_size integer default 5000
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cutoff timestamptz := now() - make_interval(days => greatest(p_retention_days, 30));
  v_review_moved integer := 0;
  v_elevation_moved integer := 0;
  v_analytics_moved integer := 0;
begin
  if not public.is_content_admin() then
    raise exception 'Content admin access required.';
  end if;

  with moved as (
    delete from public.review_history rh
    where rh.id in (
      select id
      from public.review_history
      where created_at < v_cutoff
      order by created_at asc
      limit greatest(p_batch_size, 1)
    )
    returning rh.*
  )
  insert into public.review_history_archive
  select moved.*, now()
  from moved;

  get diagnostics v_review_moved = row_count;

  with moved as (
    delete from public.elevation_events ee
    where ee.id in (
      select id
      from public.elevation_events
      where created_at < v_cutoff
      order by created_at asc
      limit greatest(p_batch_size, 1)
    )
    returning ee.*
  )
  insert into public.elevation_events_archive
  select moved.*, now()
  from moved;

  get diagnostics v_elevation_moved = row_count;

  with moved as (
    delete from public.analytics_events ae
    where ae.id in (
      select id
      from public.analytics_events
      where occurred_at < v_cutoff
      order by occurred_at asc
      limit greatest(p_batch_size, 1)
    )
    returning ae.*
  )
  insert into public.analytics_events_archive
  select moved.*, now()
  from moved;

  get diagnostics v_analytics_moved = row_count;

  return json_build_object(
    'cutoff',
    v_cutoff,
    'review_history_archived',
    v_review_moved,
    'elevation_events_archived',
    v_elevation_moved,
    'analytics_events_archived',
    v_analytics_moved
  );
end;
$$;

grant execute on function public.archive_stale_learning_events(integer, integer) to authenticated;

-- ---------------------------------------------------------------------------
-- 5.2 JWT-aware content admin check (fallback to profiles.role)
-- ---------------------------------------------------------------------------

create or replace function public.is_content_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'is_content_admin')::boolean,
    false
  )
  or exists (
    select 1
    from public.profiles
    where user_id = auth.uid()
      and role in (
        'content_manager',
        'curriculum_manager',
        'administrator',
        'super_administrator'
      )
  );
$$;

create or replace function public.resolve_content_admin_claim(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where user_id = p_user_id
      and role in (
        'content_manager',
        'curriculum_manager',
        'administrator',
        'super_administrator'
      )
  );
$$;

grant execute on function public.resolve_content_admin_claim(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 5.5 Incremental review stats counters
-- ---------------------------------------------------------------------------

create table if not exists public.user_review_stats (
  user_id uuid primary key references auth.users (id) on delete cascade,
  total_count integer not null default 0 check (total_count >= 0),
  learning_count integer not null default 0 check (learning_count >= 0),
  mastered_count integer not null default 0 check (mastered_count >= 0),
  due_count integer not null default 0 check (due_count >= 0),
  weak_hiragana integer not null default 0 check (weak_hiragana >= 0),
  weak_katakana integer not null default 0 check (weak_katakana >= 0),
  weak_vocabulary integer not null default 0 check (weak_vocabulary >= 0),
  weak_kanji integer not null default 0 check (weak_kanji >= 0),
  weak_grammar integer not null default 0 check (weak_grammar >= 0),
  updated_at timestamptz not null default now()
);

alter table public.user_review_stats enable row level security;

create policy "Users read own review stats counters"
  on public.user_review_stats for select
  using (auth.uid() = user_id);

create or replace function public.review_item_is_learning(p_state public.review_state)
returns boolean
language sql
stable
as $$
  select p_state in ('new', 'learning');
$$;

create or replace function public.review_item_is_mastered(p_state public.review_state)
returns boolean
language sql
stable
as $$
  select p_state in ('mastered', 'legendary');
$$;

create or replace function public.review_item_is_due(
  p_next_review_at timestamptz,
  p_state public.review_state
)
returns boolean
language sql
stable
as $$
  select p_next_review_at <= now()
    and not public.review_item_is_mastered(p_state);
$$;

create or replace function public.review_item_is_weak(
  p_state public.review_state,
  p_mastery_score integer,
  p_content_type text
)
returns boolean
language sql
stable
as $$
  select p_content_type in ('hiragana', 'katakana', 'vocabulary', 'kanji', 'grammar')
    and (
      public.review_item_is_learning(p_state)
      or p_mastery_score < 60
    );
$$;

create or replace function public.ensure_user_review_stats_row(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_review_stats (user_id)
  values (p_user_id)
  on conflict (user_id) do nothing;
end;
$$;

create or replace function public.apply_review_item_stats_snapshot(
  p_user_id uuid,
  p_total_delta integer,
  p_learning_delta integer,
  p_mastered_delta integer,
  p_due_delta integer,
  p_weak_hiragana_delta integer,
  p_weak_katakana_delta integer,
  p_weak_vocabulary_delta integer,
  p_weak_kanji_delta integer,
  p_weak_grammar_delta integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.ensure_user_review_stats_row(p_user_id);

  update public.user_review_stats
  set
    total_count = greatest(0, total_count + p_total_delta),
    learning_count = greatest(0, learning_count + p_learning_delta),
    mastered_count = greatest(0, mastered_count + p_mastered_delta),
    due_count = greatest(0, due_count + p_due_delta),
    weak_hiragana = greatest(0, weak_hiragana + p_weak_hiragana_delta),
    weak_katakana = greatest(0, weak_katakana + p_weak_katakana_delta),
    weak_vocabulary = greatest(0, weak_vocabulary + p_weak_vocabulary_delta),
    weak_kanji = greatest(0, weak_kanji + p_weak_kanji_delta),
    weak_grammar = greatest(0, weak_grammar + p_weak_grammar_delta),
    updated_at = now()
  where user_id = p_user_id;
end;
$$;

create or replace function public.review_item_stats_deltas(
  p_state public.review_state,
  p_mastery_score integer,
  p_content_type text,
  p_next_review_at timestamptz,
  p_multiplier integer default 1
)
returns table (
  total_delta integer,
  learning_delta integer,
  mastered_delta integer,
  due_delta integer,
  weak_hiragana_delta integer,
  weak_katakana_delta integer,
  weak_vocabulary_delta integer,
  weak_kanji_delta integer,
  weak_grammar_delta integer
)
language sql
stable
as $$
  select
    1 * p_multiplier,
    case when public.review_item_is_learning(p_state) then 1 else 0 end * p_multiplier,
    case when public.review_item_is_mastered(p_state) then 1 else 0 end * p_multiplier,
    case when public.review_item_is_due(p_next_review_at, p_state) then 1 else 0 end * p_multiplier,
    case
      when p_content_type = 'hiragana'
        and public.review_item_is_weak(p_state, p_mastery_score, p_content_type)
      then 1 else 0
    end * p_multiplier,
    case
      when p_content_type = 'katakana'
        and public.review_item_is_weak(p_state, p_mastery_score, p_content_type)
      then 1 else 0
    end * p_multiplier,
    case
      when p_content_type = 'vocabulary'
        and public.review_item_is_weak(p_state, p_mastery_score, p_content_type)
      then 1 else 0
    end * p_multiplier,
    case
      when p_content_type = 'kanji'
        and public.review_item_is_weak(p_state, p_mastery_score, p_content_type)
      then 1 else 0
    end * p_multiplier,
    case
      when p_content_type = 'grammar'
        and public.review_item_is_weak(p_state, p_mastery_score, p_content_type)
      then 1 else 0
    end * p_multiplier;
$$;

create or replace function public.maintain_user_review_stats()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_deltas record;
  v_new_deltas record;
begin
  if tg_op = 'INSERT' then
    select *
    into v_new_deltas
    from public.review_item_stats_deltas(
      new.state,
      new.mastery_score,
      new.content_type,
      new.next_review_at,
      1
    );

    perform public.apply_review_item_stats_snapshot(
      new.user_id,
      v_new_deltas.total_delta,
      v_new_deltas.learning_delta,
      v_new_deltas.mastered_delta,
      v_new_deltas.due_delta,
      v_new_deltas.weak_hiragana_delta,
      v_new_deltas.weak_katakana_delta,
      v_new_deltas.weak_vocabulary_delta,
      v_new_deltas.weak_kanji_delta,
      v_new_deltas.weak_grammar_delta
    );

    return new;
  elsif tg_op = 'DELETE' then
    select *
    into v_old_deltas
    from public.review_item_stats_deltas(
      old.state,
      old.mastery_score,
      old.content_type,
      old.next_review_at,
      -1
    );

    perform public.apply_review_item_stats_snapshot(
      old.user_id,
      v_old_deltas.total_delta,
      v_old_deltas.learning_delta,
      v_old_deltas.mastered_delta,
      v_old_deltas.due_delta,
      v_old_deltas.weak_hiragana_delta,
      v_old_deltas.weak_katakana_delta,
      v_old_deltas.weak_vocabulary_delta,
      v_old_deltas.weak_kanji_delta,
      v_old_deltas.weak_grammar_delta
    );

    return old;
  elsif tg_op = 'UPDATE' then
    select *
    into v_old_deltas
    from public.review_item_stats_deltas(
      old.state,
      old.mastery_score,
      old.content_type,
      old.next_review_at,
      -1
    );

    select *
    into v_new_deltas
    from public.review_item_stats_deltas(
      new.state,
      new.mastery_score,
      new.content_type,
      new.next_review_at,
      1
    );

    perform public.apply_review_item_stats_snapshot(
      new.user_id,
      v_old_deltas.total_delta + v_new_deltas.total_delta,
      v_old_deltas.learning_delta + v_new_deltas.learning_delta,
      v_old_deltas.mastered_delta + v_new_deltas.mastered_delta,
      v_old_deltas.due_delta + v_new_deltas.due_delta,
      v_old_deltas.weak_hiragana_delta + v_new_deltas.weak_hiragana_delta,
      v_old_deltas.weak_katakana_delta + v_new_deltas.weak_katakana_delta,
      v_old_deltas.weak_vocabulary_delta + v_new_deltas.weak_vocabulary_delta,
      v_old_deltas.weak_kanji_delta + v_new_deltas.weak_kanji_delta,
      v_old_deltas.weak_grammar_delta + v_new_deltas.weak_grammar_delta
    );

    return new;
  end if;

  return null;
end;
$$;

drop trigger if exists review_items_maintain_user_review_stats on public.review_items;

create trigger review_items_maintain_user_review_stats
  after insert or update or delete on public.review_items
  for each row execute function public.maintain_user_review_stats();

insert into public.user_review_stats (
  user_id,
  total_count,
  learning_count,
  mastered_count,
  due_count,
  weak_hiragana,
  weak_katakana,
  weak_vocabulary,
  weak_kanji,
  weak_grammar,
  updated_at
)
select
  user_id,
  count(*)::int,
  count(*) filter (where state in ('new', 'learning'))::int,
  count(*) filter (where state in ('mastered', 'legendary'))::int,
  count(*) filter (
    where next_review_at <= now()
      and state not in ('mastered', 'legendary')
  )::int,
  count(*) filter (
    where content_type = 'hiragana'
      and (state in ('new', 'learning') or mastery_score < 60)
  )::int,
  count(*) filter (
    where content_type = 'katakana'
      and (state in ('new', 'learning') or mastery_score < 60)
  )::int,
  count(*) filter (
    where content_type = 'vocabulary'
      and (state in ('new', 'learning') or mastery_score < 60)
  )::int,
  count(*) filter (
    where content_type = 'kanji'
      and (state in ('new', 'learning') or mastery_score < 60)
  )::int,
  count(*) filter (
    where content_type = 'grammar'
      and (state in ('new', 'learning') or mastery_score < 60)
  )::int,
  now()
from public.review_items
group by user_id
on conflict (user_id) do update
set
  total_count = excluded.total_count,
  learning_count = excluded.learning_count,
  mastered_count = excluded.mastered_count,
  due_count = excluded.due_count,
  weak_hiragana = excluded.weak_hiragana,
  weak_katakana = excluded.weak_katakana,
  weak_vocabulary = excluded.weak_vocabulary,
  weak_kanji = excluded.weak_kanji,
  weak_grammar = excluded.weak_grammar,
  updated_at = excluded.updated_at;

create or replace function public.get_review_stats(p_user_id uuid)
returns json
language sql
stable
security invoker
set search_path = public
as $$
  with counters as (
    select *
    from public.user_review_stats
    where user_id = p_user_id
  ),
  fallback as (
    select
      count(*)::int as total_count,
      count(*) filter (where state in ('new', 'learning'))::int as learning_count,
      count(*) filter (where state in ('mastered', 'legendary'))::int as mastered_count,
      count(*) filter (
        where next_review_at <= now()
          and state not in ('mastered', 'legendary')
      )::int as due_count,
      count(*) filter (
        where content_type = 'hiragana'
          and (state in ('new', 'learning') or mastery_score < 60)
      )::int as weak_hiragana,
      count(*) filter (
        where content_type = 'katakana'
          and (state in ('new', 'learning') or mastery_score < 60)
      )::int as weak_katakana,
      count(*) filter (
        where content_type = 'vocabulary'
          and (state in ('new', 'learning') or mastery_score < 60)
      )::int as weak_vocabulary,
      count(*) filter (
        where content_type = 'kanji'
          and (state in ('new', 'learning') or mastery_score < 60)
      )::int as weak_kanji,
      count(*) filter (
        where content_type = 'grammar'
          and (state in ('new', 'learning') or mastery_score < 60)
      )::int as weak_grammar
    from public.review_items
    where user_id = p_user_id
  ),
  summary as (
    select
      coalesce(counters.total_count, fallback.total_count, 0) as total_count,
      coalesce(counters.learning_count, fallback.learning_count, 0) as learning_count,
      coalesce(counters.mastered_count, fallback.mastered_count, 0) as mastered_count,
      coalesce(counters.due_count, fallback.due_count, 0) as due_count,
      coalesce(counters.weak_hiragana, fallback.weak_hiragana, 0) as weak_hiragana,
      coalesce(counters.weak_katakana, fallback.weak_katakana, 0) as weak_katakana,
      coalesce(counters.weak_vocabulary, fallback.weak_vocabulary, 0) as weak_vocabulary,
      coalesce(counters.weak_kanji, fallback.weak_kanji, 0) as weak_kanji,
      coalesce(counters.weak_grammar, fallback.weak_grammar, 0) as weak_grammar
    from fallback
    full join counters on true
  )
  select json_build_object(
    'total_count',
    summary.total_count,
    'learning_count',
    summary.learning_count,
    'mastered_count',
    summary.mastered_count,
    'due_count',
    summary.due_count,
    'weak_areas',
    (
      select coalesce(
        json_agg(
          json_build_object('content_type', weak.content_type, 'count', weak.count)
          order by weak.count desc
        ),
        '[]'::json
      )
      from (
        select 'hiragana'::text as content_type, summary.weak_hiragana as count
        union all
        select 'katakana', summary.weak_katakana
        union all
        select 'vocabulary', summary.weak_vocabulary
        union all
        select 'kanji', summary.weak_kanji
        union all
        select 'grammar', summary.weak_grammar
      ) weak
      where weak.count > 0
    )
  )
  from summary;
$$;
