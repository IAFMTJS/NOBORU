-- Learning Architecture Bible: N5 Sentinel boss examination step kinds.

update public.trial_templates
set
  description = 'Branch boss exam covering applied vocabulary, grammar in context, reading, listening, story comprehension, and writing.',
  updated_at = now()
where slug = 'n5-sentinel';

with trial as (
  select id from public.trial_templates where slug = 'n5-sentinel' limit 1
),
should_seed as (
  select t.id
  from trial t
  where not exists (
    select 1
    from public.trial_steps ts
    where ts.trial_template_id = t.id
      and ts.step_kind = 'applied_vocabulary'
  )
),
deleted as (
  delete from public.trial_steps ts
  using should_seed s
  where ts.trial_template_id = s.id
  returning ts.id
)
insert into public.trial_steps (
  trial_template_id,
  order_index,
  step_kind,
  prompt,
  display_text,
  accepted_answers,
  options,
  correct_index,
  match_pairs,
  content_type,
  content_id
)
select
  s.id,
  seed.order_index,
  seed.step_kind::public.trial_step_kind,
  seed.prompt,
  seed.display_text,
  seed.accepted_answers::jsonb,
  seed.options::jsonb,
  seed.correct_index,
  seed.match_pairs::jsonb,
  seed.content_type,
  case seed.content_type
    when 'vocabulary' then (
      select v.id from public.vocabulary v where v.kana = seed.content_key limit 1
    )
    when 'grammar' then (
      select g.id from public.grammar_points g where g.title = seed.content_key limit 1
    )
    when 'story' then (
      select st.id from public.stories st where st.slug = seed.content_key limit 1
    )
    when 'listening' then (
      select le.id from public.listening_exercises le where le.slug = seed.content_key limit 1
    )
    when 'application' then (
      select ae.id from public.application_exercises ae where ae.title = seed.content_key limit 1
    )
    else null
  end
from should_seed s,
(values
  (1, 'applied_vocabulary', 'Applied vocabulary: choose the correct meaning.', '食べる', null, '["to eat", "to drink", "to read", "to write"]', 0, null, 'vocabulary', 'たべる'),
  (2, 'applied_vocabulary', 'Applied vocabulary: type the meaning in English.', '友達', '["friend"]', null, null, null, 'vocabulary', 'ともだち'),
  (3, 'grammar_context', 'Grammar in context: choose the correct particle.', 'りんご___食べます。', null, '["を", "に", "で", "が"]', 0, null, 'grammar', 'を (o)'),
  (4, 'grammar_context', 'Grammar in context: choose the correct meaning.', '「行きましょう」の意味は？', null, '["Let''s go", "I went", "I will not go", "Please go"]', 0, null, 'grammar', 'ましょう (mashou)'),
  (5, 'reading_comprehension', 'Reading: what does Tanaka do every morning?', '田中さんは毎朝六時に起きます。', null, '["Wakes up at six", "Goes to bed at six", "Eats at six", "Studies at six"]', 0, null, 'story', 'train-commute'),
  (6, 'listening_comprehension', 'Listening: what does the customer order?', 'すみません。ラーメンを 一つ ください。', null, '["Ramen", "Rice", "Coffee", "Bread"]', 0, null, 'listening', 'ordering-food'),
  (7, 'story_comprehension', 'Story: what is the weather today?', '今日は雨です。ゆきさんは家にいます。', null, '["Rainy", "Sunny", "Snowy", "Windy"]', 0, null, 'story', 'rainy-day'),
  (8, 'writing_application', 'Writing: type the romaji for this hiragana.', 'さ', '["sa"]', null, null, null, 'application', 'Hiragana sa romaji'),
  (9, 'matching', 'Boss review: match each word to its meaning.', 'Match the pairs', null, null, null, '[{"id": "m1", "prompt": "行く", "answer": "to go"}, {"id": "m2", "prompt": "来る", "answer": "to come"}, {"id": "m3", "prompt": "見る", "answer": "to see"}]', null, null),
  (10, 'applied_vocabulary', 'Applied vocabulary: choose the correct meaning.', '駅', null, '["House", "Station", "Shop", "School"]', 1, null, 'vocabulary', 'えき'),
  (11, 'applied_vocabulary', 'Applied vocabulary: type the meaning in English.', '時間', '["time"]', null, null, null, 'vocabulary', 'じかん'),
  (12, 'grammar_context', 'Grammar in context: choose the correct negative.', '今日は忙しく___です。', null, '["ない", "ません", "ないです", "なく"]', 0, null, 'grammar', 'あまり〜ない (amari...nai)')
) as seed(
  order_index,
  step_kind,
  prompt,
  display_text,
  accepted_answers,
  options,
  correct_index,
  match_pairs,
  content_type,
  content_key
);
