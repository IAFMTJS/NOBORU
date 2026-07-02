-- Knowledge block content metadata for algorithmic lesson decomposition

alter table public.grammar_points
  add column if not exists concept_kind text
    check (concept_kind in ('particle', 'conjugation', 'pattern', 'sentence_order'));

alter table public.grammar_points
  add column if not exists teaching_steps jsonb;

alter table public.vocabulary
  add column if not exists image_asset_id text;

-- N5 polite verb conjugation teaching chain (飲む → 飲み → 飲みます)
update public.grammar_points
set
  concept_kind = 'conjugation',
  teaching_steps = '[
    {"label": "Dictionary form", "japanese": "飲む"},
    {"label": "Stem", "japanese": "飲み"},
    {"label": "Polite form", "japanese": "飲みます"}
  ]'::jsonb,
  explanation = '飲む → 飲み → 飲みます'
where title ilike '%ます%' or title ilike '%polite%';

update public.grammar_points
set concept_kind = 'particle'
where title in ('は', 'が', 'を', 'に', 'で', 'の', 'と', 'も', 'へ')
   or title like 'を (%'
   or title like 'は (%'
   or title like 'が (%'
   or title like 'に (%';

update public.grammar_points
set concept_kind = 'pattern'
where concept_kind is null;

-- Ensure N5 verbs have part of speech for conjugation deferral
update public.vocabulary
set part_of_speech = 'verb'
where jlpt_level = 'n5'
  and (kana like '%む' or kana like '%く' or kana like '%ぐ' or kana like '%す' or kana like '%つ' or kana like '%る' or kana like '%う')
  and (part_of_speech is null or part_of_speech = '');
