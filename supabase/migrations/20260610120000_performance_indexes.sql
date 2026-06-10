-- Performance indexes for hot query paths

create index if not exists review_items_user_content_type_idx
  on public.review_items (user_id, content_type);

create index if not exists lesson_items_content_type_lesson_id_idx
  on public.lesson_items (content_type, lesson_id);

create index if not exists listening_challenge_items_challenge_id_idx
  on public.listening_challenge_items (challenge_id);
