-- Batch review rating RPC: one round trip for offline sync / multi-rating submits.

create or replace function public.submit_review_ratings_batch(
  p_user_id uuid,
  p_items jsonb
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_element jsonb;
  v_result json;
  v_results jsonb := '[]'::jsonb;
  v_review_item_id uuid;
  v_rating text;
  v_client_event_id uuid;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception 'Review batch must be a JSON array.';
  end if;

  if jsonb_array_length(p_items) = 0 then
    raise exception 'Review batch must contain at least one item.';
  end if;

  for v_element in
    select value
    from jsonb_array_elements(p_items) as t(value)
  loop
    v_review_item_id := (v_element ->> 'review_item_id')::uuid;
    v_rating := v_element ->> 'rating';
    v_client_event_id := nullif(v_element ->> 'client_event_id', '')::uuid;

    if v_review_item_id is null or v_rating is null then
      raise exception 'Each review batch item requires review_item_id and rating.';
    end if;

    v_result := public.submit_review_rating(
      p_user_id,
      v_review_item_id,
      v_rating,
      v_client_event_id
    );

    v_results := v_results || jsonb_build_array(v_result::jsonb);
  end loop;

  return jsonb_build_object('results', v_results);
end;
$$;

grant execute on function public.submit_review_ratings_batch(uuid, jsonb) to authenticated;
