-- Phase 10: N5 kanji academy (Mount N5)

create table public.kanji_examples (
  id uuid primary key default gen_random_uuid(),
  kanji_id uuid not null references public.kanji (id) on delete cascade,
  japanese_text text not null,
  romaji text,
  english text not null,
  order_index integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index kanji_examples_kanji_id_idx on public.kanji_examples (kanji_id);

create trigger kanji_examples_set_updated_at
  before update on public.kanji_examples
  for each row execute function public.set_updated_at();

alter table public.kanji_examples enable row level security;

create policy "Authenticated users read published kanji examples"
  on public.kanji_examples for select
  using (
    auth.uid() is not null
    and (
      status = 'published'
      or public.is_content_admin()
    )
  );

create policy "Content admins manage kanji examples"
  on public.kanji_examples for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

insert into public.kanji (character, meaning, jlpt_level, stroke_count, status)
select v.character, v.meaning, v.jlpt_level, v.stroke_count, v.status
from (
  values
    ('一', 'one', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('七', 'seven', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('万', 'ten thousand', 'n5'::public.jlpt_level, 3, 'published'::public.content_status),
    ('三', 'three', 'n5'::public.jlpt_level, 3, 'published'::public.content_status),
    ('上', 'above, up', 'n5'::public.jlpt_level, 3, 'published'::public.content_status),
    ('下', 'below, down', 'n5'::public.jlpt_level, 3, 'published'::public.content_status),
    ('中', 'middle, inside', 'n5'::public.jlpt_level, 4, 'published'::public.content_status),
    ('九', 'nine', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('二', 'two', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('五', 'five', 'n5'::public.jlpt_level, 4, 'published'::public.content_status),
    ('人', 'person', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('今', 'now', 'n5'::public.jlpt_level, 4, 'published'::public.content_status),
    ('休', 'rest', 'n5'::public.jlpt_level, 6, 'published'::public.content_status),
    ('何', 'what', 'n5'::public.jlpt_level, 7, 'published'::public.content_status),
    ('先', 'previous, ahead', 'n5'::public.jlpt_level, 6, 'published'::public.content_status),
    ('入', 'enter', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('八', 'eight', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('六', 'six', 'n5'::public.jlpt_level, 4, 'published'::public.content_status),
    ('円', 'yen, circle', 'n5'::public.jlpt_level, 4, 'published'::public.content_status),
    ('出', 'exit, leave', 'n5'::public.jlpt_level, 5, 'published'::public.content_status),
    ('分', 'minute, part', 'n5'::public.jlpt_level, 4, 'published'::public.content_status),
    ('前', 'before, front', 'n5'::public.jlpt_level, 9, 'published'::public.content_status),
    ('北', 'north', 'n5'::public.jlpt_level, 5, 'published'::public.content_status),
    ('十', 'ten', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('千', 'thousand', 'n5'::public.jlpt_level, 3, 'published'::public.content_status),
    ('午', 'noon', 'n5'::public.jlpt_level, 4, 'published'::public.content_status),
    ('半', 'half', 'n5'::public.jlpt_level, 5, 'published'::public.content_status),
    ('南', 'south', 'n5'::public.jlpt_level, 9, 'published'::public.content_status),
    ('友', 'friend', 'n5'::public.jlpt_level, 4, 'published'::public.content_status),
    ('口', 'mouth', 'n5'::public.jlpt_level, 3, 'published'::public.content_status),
    ('古', 'old', 'n5'::public.jlpt_level, 5, 'published'::public.content_status),
    ('右', 'right', 'n5'::public.jlpt_level, 5, 'published'::public.content_status),
    ('名', 'name', 'n5'::public.jlpt_level, 6, 'published'::public.content_status),
    ('四', 'four', 'n5'::public.jlpt_level, 5, 'published'::public.content_status),
    ('国', 'country', 'n5'::public.jlpt_level, 8, 'published'::public.content_status),
    ('土', 'earth, soil', 'n5'::public.jlpt_level, 3, 'published'::public.content_status),
    ('外', 'outside', 'n5'::public.jlpt_level, 5, 'published'::public.content_status),
    ('多', 'many', 'n5'::public.jlpt_level, 6, 'published'::public.content_status),
    ('大', 'big', 'n5'::public.jlpt_level, 3, 'published'::public.content_status),
    ('天', 'heaven, sky', 'n5'::public.jlpt_level, 4, 'published'::public.content_status),
    ('女', 'woman', 'n5'::public.jlpt_level, 3, 'published'::public.content_status),
    ('子', 'child', 'n5'::public.jlpt_level, 3, 'published'::public.content_status),
    ('学', 'study', 'n5'::public.jlpt_level, 8, 'published'::public.content_status),
    ('安', 'cheap, peaceful', 'n5'::public.jlpt_level, 6, 'published'::public.content_status),
    ('小', 'small', 'n5'::public.jlpt_level, 3, 'published'::public.content_status),
    ('少', 'few', 'n5'::public.jlpt_level, 4, 'published'::public.content_status),
    ('山', 'mountain', 'n5'::public.jlpt_level, 3, 'published'::public.content_status),
    ('川', 'river', 'n5'::public.jlpt_level, 3, 'published'::public.content_status),
    ('左', 'left', 'n5'::public.jlpt_level, 5, 'published'::public.content_status),
    ('年', 'year', 'n5'::public.jlpt_level, 6, 'published'::public.content_status),
    ('店', 'shop', 'n5'::public.jlpt_level, 8, 'published'::public.content_status),
    ('後', 'after, behind', 'n5'::public.jlpt_level, 9, 'published'::public.content_status),
    ('手', 'hand', 'n5'::public.jlpt_level, 4, 'published'::public.content_status),
    ('新', 'new', 'n5'::public.jlpt_level, 13, 'published'::public.content_status),
    ('日', 'day, sun', 'n5'::public.jlpt_level, 4, 'published'::public.content_status),
    ('時', 'time, hour', 'n5'::public.jlpt_level, 10, 'published'::public.content_status),
    ('月', 'month, moon', 'n5'::public.jlpt_level, 4, 'published'::public.content_status),
    ('木', 'tree, wood', 'n5'::public.jlpt_level, 4, 'published'::public.content_status),
    ('本', 'book, origin', 'n5'::public.jlpt_level, 5, 'published'::public.content_status),
    ('来', 'come', 'n5'::public.jlpt_level, 7, 'published'::public.content_status),
    ('東', 'east', 'n5'::public.jlpt_level, 8, 'published'::public.content_status),
    ('校', 'school', 'n5'::public.jlpt_level, 10, 'published'::public.content_status),
    ('母', 'mother', 'n5'::public.jlpt_level, 5, 'published'::public.content_status),
    ('民', 'people, citizens', 'n5'::public.jlpt_level, 5, 'published'::public.content_status),
    ('水', 'water', 'n5'::public.jlpt_level, 4, 'published'::public.content_status),
    ('火', 'fire', 'n5'::public.jlpt_level, 4, 'published'::public.content_status),
    ('父', 'father', 'n5'::public.jlpt_level, 4, 'published'::public.content_status),
    ('生', 'life, birth', 'n5'::public.jlpt_level, 5, 'published'::public.content_status),
    ('用', 'use', 'n5'::public.jlpt_level, 5, 'published'::public.content_status),
    ('田', 'rice field', 'n5'::public.jlpt_level, 5, 'published'::public.content_status),
    ('男', 'man', 'n5'::public.jlpt_level, 7, 'published'::public.content_status),
    ('白', 'white', 'n5'::public.jlpt_level, 5, 'published'::public.content_status),
    ('百', 'hundred', 'n5'::public.jlpt_level, 6, 'published'::public.content_status),
    ('目', 'eye', 'n5'::public.jlpt_level, 5, 'published'::public.content_status),
    ('真', 'true', 'n5'::public.jlpt_level, 10, 'published'::public.content_status),
    ('社', 'company, shrine', 'n5'::public.jlpt_level, 7, 'published'::public.content_status),
    ('空', 'sky, empty', 'n5'::public.jlpt_level, 8, 'published'::public.content_status),
    ('立', 'stand', 'n5'::public.jlpt_level, 5, 'published'::public.content_status),
    ('耳', 'ear', 'n5'::public.jlpt_level, 6, 'published'::public.content_status),
    ('聞', 'hear', 'n5'::public.jlpt_level, 14, 'published'::public.content_status),
    ('花', 'flower', 'n5'::public.jlpt_level, 7, 'published'::public.content_status),
    ('行', 'go', 'n5'::public.jlpt_level, 6, 'published'::public.content_status),
    ('西', 'west', 'n5'::public.jlpt_level, 6, 'published'::public.content_status),
    ('見', 'see', 'n5'::public.jlpt_level, 7, 'published'::public.content_status),
    ('言', 'say', 'n5'::public.jlpt_level, 7, 'published'::public.content_status),
    ('語', 'language', 'n5'::public.jlpt_level, 14, 'published'::public.content_status),
    ('読', 'read', 'n5'::public.jlpt_level, 14, 'published'::public.content_status),
    ('車', 'car', 'n5'::public.jlpt_level, 7, 'published'::public.content_status),
    ('金', 'gold, money', 'n5'::public.jlpt_level, 8, 'published'::public.content_status),
    ('長', 'long, leader', 'n5'::public.jlpt_level, 8, 'published'::public.content_status),
    ('間', 'interval, between', 'n5'::public.jlpt_level, 12, 'published'::public.content_status),
    ('雨', 'rain', 'n5'::public.jlpt_level, 8, 'published'::public.content_status),
    ('電', 'electricity', 'n5'::public.jlpt_level, 13, 'published'::public.content_status),
    ('食', 'eat', 'n5'::public.jlpt_level, 9, 'published'::public.content_status),
    ('高', 'high, expensive', 'n5'::public.jlpt_level, 10, 'published'::public.content_status),
    ('魚', 'fish', 'n5'::public.jlpt_level, 11, 'published'::public.content_status),
    ('駅', 'station', 'n5'::public.jlpt_level, 14, 'published'::public.content_status),
    ('力', 'power', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('書', 'write', 'n5'::public.jlpt_level, 10, 'published'::public.content_status),
    ('話', 'talk', 'n5'::public.jlpt_level, 13, 'published'::public.content_status),
    ('会', 'meet', 'n5'::public.jlpt_level, 6, 'published'::public.content_status),
    ('売', 'sell', 'n5'::public.jlpt_level, 7, 'published'::public.content_status),
    ('買', 'buy', 'n5'::public.jlpt_level, 12, 'published'::public.content_status)
) as v(character, meaning, jlpt_level, stroke_count, status)
where not exists (
  select 1 from public.kanji existing where existing.character = v.character
);

insert into public.kanji_readings (kanji_id, reading, reading_type)
select k.id, r.reading, r.reading_type
from public.kanji k
inner join (
  values
    ('一', 'イチ', 'onyomi'),
    ('一', 'ひと', 'kunyomi'),
    ('七', 'シチ', 'onyomi'),
    ('七', 'なな', 'kunyomi'),
    ('万', 'マン', 'onyomi'),
    ('三', 'サン', 'onyomi'),
    ('三', 'みっ', 'kunyomi'),
    ('上', 'ジョウ', 'onyomi'),
    ('上', 'うえ', 'kunyomi'),
    ('下', 'カ', 'onyomi'),
    ('下', 'した', 'kunyomi'),
    ('中', 'チュウ', 'onyomi'),
    ('中', 'なか', 'kunyomi'),
    ('九', 'キュウ', 'onyomi'),
    ('九', 'ここの', 'kunyomi'),
    ('二', 'ニ', 'onyomi'),
    ('二', 'ふた', 'kunyomi'),
    ('五', 'ゴ', 'onyomi'),
    ('五', 'いつ', 'kunyomi'),
    ('人', 'ジン', 'onyomi'),
    ('人', 'ひと', 'kunyomi'),
    ('今', 'コン', 'onyomi'),
    ('今', 'いま', 'kunyomi'),
    ('休', 'キュウ', 'onyomi'),
    ('休', 'やす', 'kunyomi'),
    ('何', 'カ', 'onyomi'),
    ('何', 'なに', 'kunyomi'),
    ('先', 'セン', 'onyomi'),
    ('先', 'さき', 'kunyomi'),
    ('入', 'ニュウ', 'onyomi'),
    ('入', 'はい', 'kunyomi'),
    ('八', 'ハチ', 'onyomi'),
    ('八', 'やっ', 'kunyomi'),
    ('六', 'ロク', 'onyomi'),
    ('六', 'むっ', 'kunyomi'),
    ('円', 'エン', 'onyomi'),
    ('出', 'シュツ', 'onyomi'),
    ('出', 'で', 'kunyomi'),
    ('分', 'ブン', 'onyomi'),
    ('分', 'わ', 'kunyomi'),
    ('前', 'ゼン', 'onyomi'),
    ('前', 'まえ', 'kunyomi'),
    ('北', 'ホク', 'onyomi'),
    ('北', 'きた', 'kunyomi'),
    ('十', 'ジュウ', 'onyomi'),
    ('十', 'とお', 'kunyomi'),
    ('千', 'セン', 'onyomi'),
    ('千', 'ち', 'kunyomi'),
    ('午', 'ゴ', 'onyomi'),
    ('半', 'ハン', 'onyomi'),
    ('半', 'なか', 'kunyomi'),
    ('南', 'ナン', 'onyomi'),
    ('南', 'みなみ', 'kunyomi'),
    ('友', 'ユウ', 'onyomi'),
    ('友', 'とも', 'kunyomi'),
    ('口', 'コウ', 'onyomi'),
    ('口', 'くち', 'kunyomi'),
    ('古', 'コ', 'onyomi'),
    ('古', 'ふる', 'kunyomi'),
    ('右', 'ウ', 'onyomi'),
    ('右', 'みぎ', 'kunyomi'),
    ('名', 'メイ', 'onyomi'),
    ('名', 'な', 'kunyomi'),
    ('四', 'シ', 'onyomi'),
    ('四', 'よん', 'kunyomi'),
    ('国', 'コク', 'onyomi'),
    ('国', 'くに', 'kunyomi'),
    ('土', 'ド', 'onyomi'),
    ('土', 'つち', 'kunyomi'),
    ('外', 'ガイ', 'onyomi'),
    ('外', 'そと', 'kunyomi'),
    ('多', 'タ', 'onyomi'),
    ('多', 'おお', 'kunyomi'),
    ('大', 'ダイ', 'onyomi'),
    ('大', 'おお', 'kunyomi'),
    ('天', 'テン', 'onyomi'),
    ('天', 'あま', 'kunyomi'),
    ('女', 'ジョ', 'onyomi'),
    ('女', 'おんな', 'kunyomi'),
    ('子', 'シ', 'onyomi'),
    ('子', 'こ', 'kunyomi'),
    ('学', 'ガク', 'onyomi'),
    ('学', 'まな', 'kunyomi'),
    ('安', 'アン', 'onyomi'),
    ('安', 'やす', 'kunyomi'),
    ('小', 'ショウ', 'onyomi'),
    ('小', 'ちい', 'kunyomi'),
    ('少', 'ショウ', 'onyomi'),
    ('少', 'すく', 'kunyomi'),
    ('山', 'サン', 'onyomi'),
    ('山', 'やま', 'kunyomi'),
    ('川', 'セン', 'onyomi'),
    ('川', 'かわ', 'kunyomi'),
    ('左', 'サ', 'onyomi'),
    ('左', 'ひだり', 'kunyomi'),
    ('年', 'ネン', 'onyomi'),
    ('年', 'とし', 'kunyomi'),
    ('店', 'テン', 'onyomi'),
    ('店', 'みせ', 'kunyomi'),
    ('後', 'ゴ', 'onyomi'),
    ('後', 'あと', 'kunyomi'),
    ('手', 'シュ', 'onyomi'),
    ('手', 'て', 'kunyomi'),
    ('新', 'シン', 'onyomi'),
    ('新', 'あたら', 'kunyomi'),
    ('日', 'ニチ', 'onyomi'),
    ('日', 'ひ', 'kunyomi'),
    ('時', 'ジ', 'onyomi'),
    ('時', 'とき', 'kunyomi'),
    ('月', 'ゲツ', 'onyomi'),
    ('月', 'つき', 'kunyomi'),
    ('木', 'モク', 'onyomi'),
    ('木', 'き', 'kunyomi'),
    ('本', 'ホン', 'onyomi'),
    ('本', 'もと', 'kunyomi'),
    ('来', 'ライ', 'onyomi'),
    ('来', 'く', 'kunyomi'),
    ('東', 'トウ', 'onyomi'),
    ('東', 'ひがし', 'kunyomi'),
    ('校', 'コウ', 'onyomi'),
    ('母', 'ボ', 'onyomi'),
    ('母', 'はは', 'kunyomi'),
    ('民', 'ミン', 'onyomi'),
    ('民', 'たみ', 'kunyomi'),
    ('水', 'スイ', 'onyomi'),
    ('水', 'みず', 'kunyomi'),
    ('火', 'カ', 'onyomi'),
    ('火', 'ひ', 'kunyomi'),
    ('父', 'フ', 'onyomi'),
    ('父', 'ちち', 'kunyomi'),
    ('生', 'セイ', 'onyomi'),
    ('生', 'い', 'kunyomi'),
    ('用', 'ヨウ', 'onyomi'),
    ('用', 'もち', 'kunyomi'),
    ('田', 'デン', 'onyomi'),
    ('田', 'た', 'kunyomi'),
    ('男', 'ダン', 'onyomi'),
    ('男', 'おとこ', 'kunyomi'),
    ('白', 'ハク', 'onyomi'),
    ('白', 'しろ', 'kunyomi'),
    ('百', 'ヒャク', 'onyomi'),
    ('百', 'もも', 'kunyomi'),
    ('目', 'モク', 'onyomi'),
    ('目', 'め', 'kunyomi'),
    ('真', 'シン', 'onyomi'),
    ('真', 'ま', 'kunyomi'),
    ('社', 'シャ', 'onyomi'),
    ('社', 'やしろ', 'kunyomi'),
    ('空', 'クウ', 'onyomi'),
    ('空', 'そら', 'kunyomi'),
    ('立', 'リツ', 'onyomi'),
    ('立', 'た', 'kunyomi'),
    ('耳', 'ジ', 'onyomi'),
    ('耳', 'みみ', 'kunyomi'),
    ('聞', 'ブン', 'onyomi'),
    ('聞', 'き', 'kunyomi'),
    ('花', 'カ', 'onyomi'),
    ('花', 'はな', 'kunyomi'),
    ('行', 'コウ', 'onyomi'),
    ('行', 'い', 'kunyomi'),
    ('西', 'セイ', 'onyomi'),
    ('西', 'にし', 'kunyomi'),
    ('見', 'ケン', 'onyomi'),
    ('見', 'み', 'kunyomi'),
    ('言', 'ゲン', 'onyomi'),
    ('言', 'い', 'kunyomi'),
    ('語', 'ゴ', 'onyomi'),
    ('語', 'かた', 'kunyomi'),
    ('読', 'ドク', 'onyomi'),
    ('読', 'よ', 'kunyomi'),
    ('車', 'シャ', 'onyomi'),
    ('車', 'くるま', 'kunyomi'),
    ('金', 'キン', 'onyomi'),
    ('金', 'かね', 'kunyomi'),
    ('長', 'チョウ', 'onyomi'),
    ('長', 'なが', 'kunyomi'),
    ('間', 'カン', 'onyomi'),
    ('間', 'あいだ', 'kunyomi'),
    ('雨', 'ウ', 'onyomi'),
    ('雨', 'あめ', 'kunyomi'),
    ('電', 'デン', 'onyomi'),
    ('食', 'ショク', 'onyomi'),
    ('食', 'た', 'kunyomi'),
    ('高', 'コウ', 'onyomi'),
    ('高', 'たか', 'kunyomi'),
    ('魚', 'ギョ', 'onyomi'),
    ('魚', 'さかな', 'kunyomi'),
    ('駅', 'エキ', 'onyomi'),
    ('力', 'リョク', 'onyomi'),
    ('力', 'ちから', 'kunyomi'),
    ('書', 'ショ', 'onyomi'),
    ('書', 'か', 'kunyomi'),
    ('話', 'ワ', 'onyomi'),
    ('話', 'はな', 'kunyomi'),
    ('会', 'カイ', 'onyomi'),
    ('会', 'あ', 'kunyomi'),
    ('売', 'バイ', 'onyomi'),
    ('売', 'う', 'kunyomi'),
    ('買', 'バイ', 'onyomi'),
    ('買', 'か', 'kunyomi')
) as r(character, reading, reading_type) on r.character = k.character
where k.jlpt_level = 'n5'
  and not exists (
    select 1 from public.kanji_readings existing
    where existing.kanji_id = k.id
      and existing.reading = r.reading
      and existing.reading_type = r.reading_type
  );

insert into public.kanji_examples (
  kanji_id, japanese_text, romaji, english, order_index, status
)
select k.id, e.japanese_text, e.romaji, e.english, e.order_index, 'published'::public.content_status
from public.kanji k
inner join (
  values
    ('一', '一つ', 'hitotsu', 'one (thing)', 0),
    ('七', '七', '', 'seven', 0),
    ('万', '万', '', 'ten thousand', 0),
    ('三', '三', '', 'three', 0),
    ('上', '上', '', 'above, up', 0),
    ('下', '下', '', 'below, down', 0),
    ('中', '中', '', 'middle, inside', 0),
    ('九', '九', '', 'nine', 0),
    ('二', '二', '', 'two', 0),
    ('五', '五', '', 'five', 0),
    ('人', '人', 'hito', 'person', 0),
    ('今', '今', '', 'now', 0),
    ('休', '休', '', 'rest', 0),
    ('何', '何', '', 'what', 0),
    ('先', '先', '', 'previous, ahead', 0),
    ('入', '入', '', 'enter', 0),
    ('八', '八', '', 'eight', 0),
    ('六', '六', '', 'six', 0),
    ('円', '円', '', 'yen, circle', 0),
    ('出', '出', '', 'exit, leave', 0),
    ('分', '分', '', 'minute, part', 0),
    ('前', '前', '', 'before, front', 0),
    ('北', '北', '', 'north', 0),
    ('十', '十', '', 'ten', 0),
    ('千', '千', '', 'thousand', 0),
    ('午', '午', '', 'noon', 0),
    ('半', '半', '', 'half', 0),
    ('南', '南', '', 'south', 0),
    ('友', '友', '', 'friend', 0),
    ('口', '口', '', 'mouth', 0),
    ('古', '古', '', 'old', 0),
    ('右', '右', '', 'right', 0),
    ('名', '名', '', 'name', 0),
    ('四', '四', '', 'four', 0),
    ('国', '国', '', 'country', 0),
    ('土', '土', '', 'earth, soil', 0),
    ('外', '外', '', 'outside', 0),
    ('多', '多', '', 'many', 0),
    ('大', '大', '', 'big', 0),
    ('天', '天', '', 'heaven, sky', 0),
    ('女', '女', '', 'woman', 0),
    ('子', '子', '', 'child', 0),
    ('学', '学生', 'gakusei', 'student', 0),
    ('安', '安', '', 'cheap, peaceful', 0),
    ('小', '小', '', 'small', 0),
    ('少', '少', '', 'few', 0),
    ('山', '山', '', 'mountain', 0),
    ('川', '川', '', 'river', 0),
    ('左', '左', '', 'left', 0),
    ('年', '年', '', 'year', 0),
    ('店', '店', '', 'shop', 0),
    ('後', '後', '', 'after, behind', 0),
    ('手', '手', '', 'hand', 0),
    ('新', '新', '', 'new', 0),
    ('日', '日本', 'Nihon', 'Japan', 0),
    ('時', '時', '', 'time, hour', 0),
    ('月', '月', '', 'month, moon', 0),
    ('木', '木', '', 'tree, wood', 0),
    ('本', '本', '', 'book, origin', 0),
    ('来', '来', '', 'come', 0),
    ('東', '東', '', 'east', 0),
    ('校', '学校', 'gakkou', 'school', 0),
    ('母', '母', '', 'mother', 0),
    ('民', '民', '', 'people, citizens', 0),
    ('水', '水', '', 'water', 0),
    ('火', '火', '', 'fire', 0),
    ('父', '父', '', 'father', 0),
    ('生', '生', '', 'life, birth', 0),
    ('用', '用', '', 'use', 0),
    ('田', '田', '', 'rice field', 0),
    ('男', '男', '', 'man', 0),
    ('白', '白', '', 'white', 0),
    ('百', '百', '', 'hundred', 0),
    ('目', '目', '', 'eye', 0),
    ('真', '真', '', 'true', 0),
    ('社', '社', '', 'company, shrine', 0),
    ('空', '空', '', 'sky, empty', 0),
    ('立', '立', '', 'stand', 0),
    ('耳', '耳', '', 'ear', 0),
    ('聞', '聞', '', 'hear', 0),
    ('花', '花', '', 'flower', 0),
    ('行', '行', '', 'go', 0),
    ('西', '西', '', 'west', 0),
    ('見', '見', '', 'see', 0),
    ('言', '言', '', 'say', 0),
    ('語', '語', '', 'language', 0),
    ('読', '読', '', 'read', 0),
    ('車', '車', '', 'car', 0),
    ('金', '金', '', 'gold, money', 0),
    ('長', '長', '', 'long, leader', 0),
    ('間', '間', '', 'interval, between', 0),
    ('雨', '雨', '', 'rain', 0),
    ('電', '電', '', 'electricity', 0),
    ('食', '食べる', 'taberu', 'to eat', 0),
    ('高', '高', '', 'high, expensive', 0),
    ('魚', '魚', '', 'fish', 0),
    ('駅', '駅', '', 'station', 0),
    ('力', '力', '', 'power', 0),
    ('書', '書', '', 'write', 0),
    ('話', '話', '', 'talk', 0),
    ('会', '会', '', 'meet', 0),
    ('売', '売', '', 'sell', 0),
    ('買', '買', '', 'buy', 0)
) as e(character, japanese_text, romaji, english, order_index) on e.character = k.character
where k.jlpt_level = 'n5'
  and not exists (
    select 1 from public.kanji_examples existing
    where existing.kanji_id = k.id
      and existing.japanese_text = e.japanese_text
  );

do $seed$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  kanji_id uuid;
  char_list text[];
  char_value text;
  item_index integer;
begin
  select id into region_id from public.regions where slug = 'mount-n5' limit 1;
  if region_id is null then return; end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Kanji Part I', 'Numbers, time, and core daily kanji.', 10, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Kanji Part I'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Kanji Part I' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'kanji', 'Kanji Part I · Lesson 1', 'Learn essential N5 kanji.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Kanji Part I · Lesson 1'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Kanji Part I · Lesson 1' limit 1;

    if lesson_id is not null then
      char_list := array['一', '七', '万', '三', '上', '下', '中', '九', '二', '五'];
      item_index := 0;
      foreach char_value in array char_list loop
        select id into kanji_id from public.kanji
        where status = 'published' and jlpt_level = 'n5' and character = char_value
        limit 1;
        if kanji_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'kanji', kanji_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'kanji' and content_id = kanji_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'kanji', 'Kanji Part I · Lesson 2', 'Learn essential N5 kanji.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Kanji Part I · Lesson 2'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Kanji Part I · Lesson 2' limit 1;

    if lesson_id is not null then
      char_list := array['人', '今', '休', '何', '先', '入', '八', '六', '円', '出'];
      item_index := 0;
      foreach char_value in array char_list loop
        select id into kanji_id from public.kanji
        where status = 'published' and jlpt_level = 'n5' and character = char_value
        limit 1;
        if kanji_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'kanji', kanji_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'kanji' and content_id = kanji_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'kanji', 'Kanji Part I · Lesson 3', 'Learn essential N5 kanji.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Kanji Part I · Lesson 3'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Kanji Part I · Lesson 3' limit 1;

    if lesson_id is not null then
      char_list := array['分', '前', '北', '十', '千', '午', '半', '南', '友', '口'];
      item_index := 0;
      foreach char_value in array char_list loop
        select id into kanji_id from public.kanji
        where status = 'published' and jlpt_level = 'n5' and character = char_value
        limit 1;
        if kanji_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'kanji', kanji_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'kanji' and content_id = kanji_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Kanji Part II', 'People, places, and nature kanji.', 11, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Kanji Part II'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Kanji Part II' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'kanji', 'Kanji Part II · Lesson 1', 'Learn essential N5 kanji.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Kanji Part II · Lesson 1'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Kanji Part II · Lesson 1' limit 1;

    if lesson_id is not null then
      char_list := array['古', '右', '名', '四', '国', '土', '外', '多', '大', '天'];
      item_index := 0;
      foreach char_value in array char_list loop
        select id into kanji_id from public.kanji
        where status = 'published' and jlpt_level = 'n5' and character = char_value
        limit 1;
        if kanji_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'kanji', kanji_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'kanji' and content_id = kanji_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'kanji', 'Kanji Part II · Lesson 2', 'Learn essential N5 kanji.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Kanji Part II · Lesson 2'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Kanji Part II · Lesson 2' limit 1;

    if lesson_id is not null then
      char_list := array['女', '子', '学', '安', '小', '少', '山', '川', '左', '年'];
      item_index := 0;
      foreach char_value in array char_list loop
        select id into kanji_id from public.kanji
        where status = 'published' and jlpt_level = 'n5' and character = char_value
        limit 1;
        if kanji_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'kanji', kanji_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'kanji' and content_id = kanji_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'kanji', 'Kanji Part II · Lesson 3', 'Learn essential N5 kanji.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Kanji Part II · Lesson 3'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Kanji Part II · Lesson 3' limit 1;

    if lesson_id is not null then
      char_list := array['店', '後', '手', '新', '日', '時', '月', '木', '本', '来'];
      item_index := 0;
      foreach char_value in array char_list loop
        select id into kanji_id from public.kanji
        where status = 'published' and jlpt_level = 'n5' and character = char_value
        limit 1;
        if kanji_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'kanji', kanji_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'kanji' and content_id = kanji_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Kanji Part III', 'Actions, directions, and school kanji.', 12, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Kanji Part III'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Kanji Part III' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'kanji', 'Kanji Part III · Lesson 1', 'Learn essential N5 kanji.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Kanji Part III · Lesson 1'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Kanji Part III · Lesson 1' limit 1;

    if lesson_id is not null then
      char_list := array['東', '校', '母', '民', '水', '火', '父', '生', '用', '田'];
      item_index := 0;
      foreach char_value in array char_list loop
        select id into kanji_id from public.kanji
        where status = 'published' and jlpt_level = 'n5' and character = char_value
        limit 1;
        if kanji_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'kanji', kanji_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'kanji' and content_id = kanji_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'kanji', 'Kanji Part III · Lesson 2', 'Learn essential N5 kanji.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Kanji Part III · Lesson 2'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Kanji Part III · Lesson 2' limit 1;

    if lesson_id is not null then
      char_list := array['男', '白', '百', '目', '真', '社', '空', '立', '耳', '聞'];
      item_index := 0;
      foreach char_value in array char_list loop
        select id into kanji_id from public.kanji
        where status = 'published' and jlpt_level = 'n5' and character = char_value
        limit 1;
        if kanji_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'kanji', kanji_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'kanji' and content_id = kanji_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'kanji', 'Kanji Part III · Lesson 3', 'Learn essential N5 kanji.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Kanji Part III · Lesson 3'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Kanji Part III · Lesson 3' limit 1;

    if lesson_id is not null then
      char_list := array['花', '行', '西', '見', '言', '語', '読', '車', '金', '長'];
      item_index := 0;
      foreach char_value in array char_list loop
        select id into kanji_id from public.kanji
        where status = 'published' and jlpt_level = 'n5' and character = char_value
        limit 1;
        if kanji_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'kanji', kanji_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'kanji' and content_id = kanji_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Kanji Part IV', 'Advanced N5 kanji and daily life.', 13, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Kanji Part IV'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Kanji Part IV' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'kanji', 'Kanji Part IV · Lesson 1', 'Learn essential N5 kanji.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Kanji Part IV · Lesson 1'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Kanji Part IV · Lesson 1' limit 1;

    if lesson_id is not null then
      char_list := array['間', '雨', '電', '食', '高', '魚', '駅', '力', '書', '話'];
      item_index := 0;
      foreach char_value in array char_list loop
        select id into kanji_id from public.kanji
        where status = 'published' and jlpt_level = 'n5' and character = char_value
        limit 1;
        if kanji_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'kanji', kanji_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'kanji' and content_id = kanji_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'kanji', 'Kanji Part IV · Lesson 2', 'Learn essential N5 kanji.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Kanji Part IV · Lesson 2'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Kanji Part IV · Lesson 2' limit 1;

    if lesson_id is not null then
      char_list := array['会', '売', '買'];
      item_index := 0;
      foreach char_value in array char_list loop
        select id into kanji_id from public.kanji
        where status = 'published' and jlpt_level = 'n5' and character = char_value
        limit 1;
        if kanji_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'kanji', kanji_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'kanji' and content_id = kanji_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Kanji Practice', 'Mixed review across N5 kanji.', 14, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Kanji Practice'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Kanji Practice' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', 'N5 Kanji Check', 'Mixed recall across the N5 kanji you have learned.', 2, 20, 8, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'N5 Kanji Check'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'N5 Kanji Check' limit 1;

    if lesson_id is not null then
      char_list := array['一', '人', '分', '古', '女', '店', '東', '男', '花', '間', '駅', '買'];
      item_index := 0;
      foreach char_value in array char_list loop
        select id into kanji_id from public.kanji
        where status = 'published' and jlpt_level = 'n5' and character = char_value
        limit 1;
        if kanji_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'kanji', kanji_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'kanji' and content_id = kanji_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;
end $seed$;
