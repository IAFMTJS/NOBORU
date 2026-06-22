-- N5 journey landmarks + JWorld trial display names (post founder sign-off on 11-n5-complete-spec).

-- ─── Trial learner-facing copy ───────────────────────────────────────────────

update public.trial_templates
set
  title = 'Script Keeper',
  boss_name = 'Script Keeper',
  description = 'Prove your hiragana foundation at the Script Sanctum.'
where slug = 'foothills-guardian';

update public.trial_templates
set
  title = 'Kana Warden',
  boss_name = 'Kana Warden',
  description = 'Recall katakana under pressure before the hamlet opens.'
where slug = 'forest-spirit';

update public.trial_templates
set
  title = 'Trail Warden',
  boss_name = 'Trail Warden',
  description = 'Mixed vocabulary and grammar recall on the first slope.'
where slug = 'mount-n5-proving-ground';

update public.trial_templates
set
  title = 'N5 Sentinel',
  boss_name = 'N5 Sentinel',
  description = 'Face the sentinel guarding the ascent.'
where slug = 'n5-sentinel';

update public.trial_templates
set
  title = 'Guardian of First Light',
  boss_name = 'Guardian of First Light',
  description = 'Show what the first light taught you at the Gate of Ascent.'
where slug = 'n5-final-trial';

-- ─── Journey landmarks for world n5 ──────────────────────────────────────────

insert into public.journey_landmarks (
  region_id,
  slug,
  label,
  subtitle,
  kind,
  trigger_after_lesson_count,
  path_position,
  order_index,
  status
)
select
  r.id,
  seed.slug,
  seed.label,
  seed.subtitle,
  seed.kind,
  seed.trigger_after_lesson_count,
  seed.path_position,
  seed.order_index,
  'published'::public.content_status
from public.regions r
cross join (
  values
    ('ember-threshold', 'Ember Threshold', '灯の境 · Hi no Sakai', 'shrine', 1, 0.02, 0),
    ('script-sanctum', 'Script Sanctum', '文字の社 · Moji no Yashiro', 'shrine', 12, 0.12, 1),
    ('kana-bridge', 'Kana Bridge', 'かな橋 · Kana-bashi', 'bridge', 28, 0.26, 2),
    ('lantern-hamlet', 'Lantern Hamlet', '灯里 · Tōri', 'village', 38, 0.38, 3),
    ('market-bend', 'Market Bend', '曲がり市 · Magari-ichi', 'village', 52, 0.50, 4),
    ('forest-torii', 'Forest Torii', '森の鳥居 · Mori no Torii', 'torii', 68, 0.62, 5),
    ('kanji-grove', 'Kanji Grove', '漢字の林 · Kanji no Hayashi', 'overlook', 78, 0.72, 6),
    ('first-slope-shrine', 'First Slope Shrine', '初坂の祠 · Hatsu-saka no Hokora', 'shrine', 92, 0.84, 7)
) as seed (
  slug,
  label,
  subtitle,
  kind,
  trigger_after_lesson_count,
  path_position,
  order_index
)
where r.slug = 'n5'
  and not exists (
    select 1
    from public.journey_landmarks existing
    where existing.region_id = r.id
      and existing.slug = seed.slug
  );
