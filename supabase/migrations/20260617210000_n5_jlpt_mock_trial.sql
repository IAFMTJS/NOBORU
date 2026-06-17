-- N5 full JLPT mock trial


-- N5 full JLPT mock trial (capstone exam)
insert into public.trial_templates (
  slug, region_slug, kind, title, description, boss_name,
  pass_score, time_limit_seconds, ep_reward, min_region_progress_percent,
  prerequisite_trial_slug, sort_order, status
)
select
  'n5-jlpt-mock',
  'mount-n5',
  'final_trial'::public.trial_kind,
  'N5 JLPT Mock Exam',
  'Full-length N5 mock covering vocabulary, grammar, kanji, listening-style, and reading comprehension.',
  'Summit Examiner',
  70,
  900,
  500,
  95,
  'n5-final-trial',
  6,
  'published'
where not exists (
  select 1 from public.trial_templates where slug = 'n5-jlpt-mock'
);


with trial as (
  select id from public.trial_templates where slug = 'n5-jlpt-mock' limit 1
)
insert into public.trial_steps (
  trial_template_id, order_index, step_kind, prompt, display_text,
  accepted_answers, options, correct_index, match_pairs
)
select
  trial.id,
  s.order_index,
  s.step_kind::public.trial_step_kind,
  s.prompt,
  s.display_text,
  s.accepted_answers::jsonb,
  s.options::jsonb,
  s.correct_index,
  s.match_pairs::jsonb
from trial,
(values
  (1, 'choice_recall', 'Vocabulary: choose the correct meaning.', '食べる', null, '["to eat", "to drink", "to read", "to write"]', 0, null),
  (2, 'choice_recall', 'Vocabulary: choose the correct meaning.', '飲む', null, '["to drink", "to eat", "to sleep", "to walk"]', 0, null),
  (3, 'choice_recall', 'Vocabulary: choose the correct meaning.', '大きい', null, '["big", "small", "new", "old"]', 0, null),
  (4, 'choice_recall', 'Vocabulary: choose the correct meaning.', '新しい', null, '["new", "old", "big", "small"]', 0, null),
  (5, 'choice_recall', 'Vocabulary: choose the correct meaning.', '病院', null, '["hospital", "school", "station", "shop"]', 0, null),
  (6, 'choice_recall', 'Grammar: choose the correct particle.', '学校___行きます。', null, '["に", "を", "が", "の"]', 0, null),
  (7, 'choice_recall', 'Grammar: choose the correct particle.', 'りんご___食べます。', null, '["を", "に", "で", "が"]', 0, null),
  (8, 'choice_recall', 'Grammar: choose the correct form.', '昨日、映画を___。', null, '["見ました", "見ます", "見る", "見て"]', 0, null),
  (9, 'choice_recall', 'Grammar: choose the correct negative.', '今日は忙しく___です。', null, '["ない", "ません", "ないです", "なく"]', 0, null),
  (10, 'choice_recall', 'Grammar: choose the correct answer.', '「行きましょう」の意味は？', null, '["Let''s go", "I went", "I will not go", "Please go"]', 0, null),
  (11, 'typed_recall', 'Kanji: type the meaning in English.', '人', '["person", "people"]', null, null, null),
  (12, 'typed_recall', 'Kanji: type the meaning in English.', '水', '["water"]', null, null, null),
  (13, 'choice_recall', 'Kanji: choose the correct reading.', '日', null, '["hi/nichi", "tsuki", "hoshi", "kaze"]', 0, null),
  (14, 'choice_recall', 'Kanji: choose the correct meaning.', '山', null, '["mountain", "river", "tree", "fire"]', 0, null),
  (15, 'choice_recall', 'Listening: what does the speaker order?', 'コーヒーを 一つ ください。', null, '["Coffee", "Tea", "Water", "Juice"]', 0, null),
  (16, 'choice_recall', 'Listening: what time is mentioned?', '三時に 会いましょう。', null, '["Three o''clock", "Two o''clock", "Four o''clock", "Five o''clock"]', 0, null),
  (17, 'choice_recall', 'Listening: what is the weather?', '今日は 雪 です。', null, '["Snowy", "Rainy", "Sunny", "Windy"]', 0, null),
  (18, 'choice_recall', 'Listening: where are they meeting?', '駅の 南口で 待ちます。', null, '["South exit of the station", "North exit", "At home", "At school"]', 0, null),
  (19, 'choice_recall', 'Reading: what does Tanaka do every morning?', '田中さんは毎朝六時に起きます。', null, '["Wakes up at six", "Goes to bed at six", "Eats at six", "Studies at six"]', 0, null),
  (20, 'choice_recall', 'Reading: how does Sato feel?', '佐藤さんはとても嬉しいです。', null, '["Very happy", "Very sad", "Very angry", "Very tired"]', 0, null),
  (21, 'matching', 'Final review: match each word to its meaning.', 'Match the pairs', null, null, null, '[{"id": "m1", "prompt": "本", "answer": "book"}, {"id": "m2", "prompt": "車", "answer": "car"}, {"id": "m3", "prompt": "電話", "answer": "phone"}, {"id": "m4", "prompt": "天気", "answer": "weather"}]'),
  (22, 'matching', 'Final review: match particles to their function.', 'Match the pairs', null, null, null, '[{"id": "p1", "prompt": "は", "answer": "topic marker"}, {"id": "p2", "prompt": "を", "answer": "object marker"}, {"id": "p3", "prompt": "に", "answer": "time/destination"}]'),
  (23, 'typed_recall', 'Type the romaji for this hiragana.', 'み', '["mi"]', null, null, null),
  (24, 'typed_recall', 'Type the romaji for this katakana.', 'ミ', '["mi"]', null, null, null),
  (25, 'choice_recall', 'Choose the correct meaning.', 'ありがとうございます', null, '["Thank you very much", "Good morning", "Goodbye", "Excuse me"]', 0, null)
) as s(order_index, step_kind, prompt, display_text, accepted_answers, options, correct_index, match_pairs)
where not exists (
  select 1 from public.trial_steps existing
  where existing.trial_template_id = trial.id
);
