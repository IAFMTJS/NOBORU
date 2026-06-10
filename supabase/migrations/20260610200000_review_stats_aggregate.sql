-- Aggregated review stats for dashboard and session (avoids full row scan in app layer)

create or replace function public.get_review_stats(p_user_id uuid)
returns json
language sql
stable
security invoker
set search_path = public
as $$
  select json_build_object(
    'total_count',
    (select count(*)::int from public.review_items where user_id = p_user_id),
    'learning_count',
    (
      select count(*)::int
      from public.review_items
      where user_id = p_user_id
        and state in ('new', 'learning')
    ),
    'mastered_count',
    (
      select count(*)::int
      from public.review_items
      where user_id = p_user_id
        and state in ('mastered', 'legendary')
    ),
    'weak_areas',
    coalesce(
      (
        select json_agg(
          json_build_object(
            'content_type', grouped.content_type,
            'count', grouped.cnt
          )
          order by grouped.cnt desc
        )
        from (
          select content_type, count(*)::int as cnt
          from public.review_items
          where user_id = p_user_id
            and (
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
        ) grouped
      ),
      '[]'::json
    )
  );
$$;

grant execute on function public.get_review_stats(uuid) to authenticated;
