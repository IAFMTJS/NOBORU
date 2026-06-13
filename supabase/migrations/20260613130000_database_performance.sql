-- Phase 2: database performance — indexes, stats RPC, atomic review submit, learned counts

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index if not exists review_items_user_state_idx
  on public.review_items (user_id, state);

create index if not exists review_items_user_due_active_idx
  on public.review_items (user_id, next_review_at)
  where state not in ('mastered', 'legendary');

create index if not exists kanji_readings_kanji_id_idx
  on public.kanji_readings (kanji_id);

create index if not exists grammar_examples_grammar_id_idx
  on public.grammar_examples (grammar_id);

create index if not exists vocabulary_examples_vocabulary_id_idx
  on public.vocabulary_examples (vocabulary_id);

-- ---------------------------------------------------------------------------
-- Single-scan review stats
-- ---------------------------------------------------------------------------

create or replace function public.get_review_stats(p_user_id uuid)
returns json
language sql
stable
security invoker
set search_path = public
as $$
  with items as (
    select state, mastery_score, content_type
    from public.review_items
    where user_id = p_user_id
  ),
  summary as (
    select
      count(*)::int as total_count,
      count(*) filter (where state in ('new', 'learning'))::int as learning_count,
      count(*) filter (where state in ('mastered', 'legendary'))::int as mastered_count
    from items
  ),
  weak_areas as (
    select content_type, count(*)::int as cnt
    from items
    where (
      state in ('new', 'learning')
      or mastery_score < 60
    )
      and content_type in (
        'hiragana',
        'katakana',
        'vocabulary',
        'kanji',
        'grammar'
      )
    group by content_type
  )
  select json_build_object(
    'total_count',
    summary.total_count,
    'learning_count',
    summary.learning_count,
    'mastered_count',
    summary.mastered_count,
    'weak_areas',
    coalesce(
      (
        select json_agg(
          json_build_object(
            'content_type',
            weak_areas.content_type,
            'count',
            weak_areas.cnt
          )
          order by weak_areas.cnt desc
        )
        from weak_areas
      ),
      '[]'::json
    )
  )
  from summary;
$$;

-- ---------------------------------------------------------------------------
-- Learned content count (review queue + completed lesson items)
-- ---------------------------------------------------------------------------

create or replace function public.get_learned_content_count(
  p_user_id uuid,
  p_content_type text
)
returns integer
language sql
stable
security invoker
set search_path = public
as $$
  select count(*)::int
  from (
    select content_id
    from public.review_items
    where user_id = p_user_id
      and content_type = p_content_type
    union
    select li.content_id
    from public.lesson_items li
    inner join public.user_progress up
      on up.lesson_id = li.lesson_id
    where up.user_id = p_user_id
      and up.status = 'completed'
      and li.content_type = p_content_type
  ) learned;
$$;

grant execute on function public.get_learned_content_count(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Atomic review rating + history insert (mirrors features/review/services/srs.service.ts)
-- ---------------------------------------------------------------------------

create or replace function public.submit_review_rating(
  p_user_id uuid,
  p_review_item_id uuid,
  p_rating text,
  p_client_event_id uuid default null
)
returns json
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_existing_history record;
  v_item public.review_items%rowtype;
  v_updated public.review_items%rowtype;
  v_history_id uuid;
  v_previous_state public.review_state;
  v_new_state public.review_state;
  v_next_review_at timestamptz;
  v_interval_days integer;
  v_mastery_score integer;
  v_streak_count integer;
  v_interval_offset integer;
  v_interval_index integer;
  v_day_intervals integer[] := array[1, 3, 7, 14, 30, 90, 180, 365];
begin
  if p_rating not in ('again', 'good', 'strong') then
    raise exception 'Invalid review rating.';
  end if;

  if p_client_event_id is not null then
    select id, review_item_id
    into v_existing_history
    from public.review_history
    where user_id = p_user_id
      and client_event_id = p_client_event_id;

    if found then
      select *
      into v_item
      from public.review_items
      where id = v_existing_history.review_item_id
        and user_id = p_user_id;

      if not found then
        raise exception 'Review item not found.';
      end if;

      return json_build_object(
        'already_applied',
        true,
        'history_id',
        v_existing_history.id,
        'item',
        to_jsonb(v_item)
      );
    end if;
  end if;

  select *
  into v_item
  from public.review_items
  where id = p_review_item_id
    and user_id = p_user_id
  for update;

  if not found then
    raise exception 'Review item not found.';
  end if;

  v_previous_state := v_item.state;

  if p_rating = 'again' then
    v_new_state := 'learning';
    v_next_review_at := now() + interval '10 minutes';
    v_interval_days := 0;
    v_mastery_score := greatest(0, v_item.mastery_score - 15);
    v_streak_count := 0;
  else
    v_streak_count := v_item.streak_count + 1;
    v_interval_offset := case when p_rating = 'strong' then 1 else 0 end;
    v_interval_index := least(
      v_streak_count - 1 + v_interval_offset,
      array_length(v_day_intervals, 1) - 1
    );
    v_interval_days := v_day_intervals[v_interval_index + 1];
    v_next_review_at := now() + make_interval(days => v_interval_days);
    v_mastery_score := least(
      100,
      v_item.mastery_score + case when p_rating = 'strong' then 12 else 8 end
    );

    v_new_state := 'good';
    if v_streak_count <= 1 and v_item.state = 'new' then
      v_new_state := 'learning';
    elsif v_streak_count >= 3 or p_rating = 'strong' then
      v_new_state := 'strong';
    end if;

    if v_mastery_score >= 90 and v_streak_count >= 5 then
      v_new_state := 'mastered';
    end if;
    if v_mastery_score >= 95 and v_streak_count >= 8 then
      v_new_state := 'legendary';
    end if;
  end if;

  update public.review_items
  set
    state = v_new_state,
    next_review_at = v_next_review_at,
    review_count = v_item.review_count + 1,
    mastery_score = v_mastery_score,
    interval_days = v_interval_days,
    streak_count = v_streak_count,
    updated_at = now()
  where id = p_review_item_id
    and user_id = p_user_id
  returning *
  into v_updated;

  insert into public.review_history (
    user_id,
    review_item_id,
    rating,
    previous_state,
    new_state,
    mastery_score,
    interval_days,
    client_event_id
  )
  values (
    p_user_id,
    p_review_item_id,
    p_rating,
    v_previous_state,
    v_new_state,
    v_mastery_score,
    v_interval_days,
    p_client_event_id
  )
  returning id
  into v_history_id;

  return json_build_object(
    'already_applied',
    false,
    'history_id',
    v_history_id,
    'item',
    to_jsonb(v_updated)
  );
end;
$$;

grant execute on function public.submit_review_rating(uuid, uuid, text, uuid) to authenticated;
