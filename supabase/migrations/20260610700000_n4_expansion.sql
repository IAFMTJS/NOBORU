-- Phase 22: N4 expansion (Mount N4 curriculum)

insert into public.regions (slug, name, description, order_index, unlock_requirement, status)
select
  'mount-n4',
  'Mount N4',
  'The next summit path. Expand into N4 vocabulary, grammar, and kanji.',
  3,
  'Complete Mount N5 Final Trial',
  'published'
where not exists (
  select 1 from public.regions where slug = 'mount-n4'
);

insert into public.vocabulary (kana, kanji, meaning, part_of_speech, jlpt_level, status)
select v.kana, v.kanji, v.meaning, v.part_of_speech, v.jlpt_level, v.status
from (
  values
    ('しごと', '仕事', 'work, job', 'noun', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('かいしゃ', '会社', 'company', 'noun', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('りゅうがく', '留学', 'study abroad', 'noun', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('りょこう', '旅行', 'travel, trip', 'noun', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('じゅんび', '準備', 'preparation', 'noun', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('けいけん', '経験', 'experience', 'noun', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('やくそく', '約束', 'promise', 'noun', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('しんぱい', '心配', 'worry', 'noun', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('せいかつ', '生活', 'life, living', 'noun', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('しゅうかん', '習慣', 'habit', 'noun', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('はじめる', '始める', 'to begin', 'verb', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('つづける', '続ける', 'to continue', 'verb', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('きめる', '決める', 'to decide', 'verb', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('かす', '貸す', 'to lend', 'verb', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('かりる', '借りる', 'to borrow', 'verb', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('もどる', '戻る', 'to return', 'verb', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('とくに', '特に', 'especially', 'adverb', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('もし', 'もし', 'if', 'conjunction', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('ふべん', '不便', 'inconvenient', 'adjective', 'n4'::public.jlpt_level, 'published'::public.content_status),
    ('だいどころ', '台所', 'kitchen', 'noun', 'n4'::public.jlpt_level, 'published'::public.content_status)
) as v(kana, kanji, meaning, part_of_speech, jlpt_level, status)
where not exists (
  select 1 from public.vocabulary existing where existing.kana = v.kana
);

insert into public.vocabulary_examples (
  vocabulary_id, japanese_text, romaji, english, order_index, status
)
select v.id, e.japanese_text, e.romaji, e.english, 0, 'published'
from public.vocabulary v
inner join (
  values
    ('しごと', '仕事は忙しいです。', 'Shigoto wa isogashii desu.', 'Work is busy.'),
    ('かいしゃ', '会社へ行きます。', 'Kaisha e ikimasu.', 'I go to the company.'),
    ('りゅうがく', '留学の準備をします。', 'Ryuugaku no junbi o shimasu.', 'I prepare for studying abroad.'),
    ('りょこう', '旅行が好きです。', 'Ryokou ga suki desu.', 'I like traveling.'),
    ('じゅんび', '準備ができました。', 'Junbi ga dekimashita.', 'The preparation is ready.'),
    ('けいけん', 'いい経験でした。', 'Ii keiken deshita.', 'It was a good experience.'),
    ('やくそく', '約束を守ります。', 'Yakusoku o mamorimasu.', 'I keep my promise.'),
    ('しんぱい', '心配しないでください。', 'Shinpai shinaide kudasai.', 'Please do not worry.'),
    ('せいかつ', '日本の生活は楽しいです。', 'Nihon no seikatsu wa tanoshii desu.', 'Life in Japan is fun.'),
    ('しゅうかん', '早く起きる習慣があります。', 'Hayaku okiru shuukan ga arimasu.', 'I have a habit of waking up early.'),
    ('はじめる', '勉強を始めます。', 'Benkyou o hajimemasu.', 'I begin studying.'),
    ('つづける', '日本語を続けます。', 'Nihongo o tsuzukemasu.', 'I continue Japanese.'),
    ('きめる', '時間を決めます。', 'Jikan o kimemasu.', 'I decide on a time.'),
    ('かす', '本を貸します。', 'Hon o kashimasu.', 'I lend a book.'),
    ('かりる', '辞書を借ります。', 'Jisho o karimasu.', 'I borrow a dictionary.'),
    ('もどる', '家に戻ります。', 'Ie ni modorimasu.', 'I return home.'),
    ('とくに', '特に日本語が好きです。', 'Tokuni nihongo ga suki desu.', 'I especially like Japanese.'),
    ('もし', 'もし時間があれば、行きます。', 'Moshi jikan ga areba, ikimasu.', 'If I have time, I will go.'),
    ('ふべん', 'この場所は不便です。', 'Kono basho wa fuben desu.', 'This place is inconvenient.'),
    ('だいどころ', '台所で料理します。', 'Daidokoro de ryouri shimasu.', 'I cook in the kitchen.')
) as e(kana, japanese_text, romaji, english) on e.kana = v.kana
where v.jlpt_level = 'n4'
  and not exists (
    select 1 from public.vocabulary_examples existing
    where existing.vocabulary_id = v.id
      and existing.japanese_text = e.japanese_text
  );

insert into public.grammar_points (title, meaning, explanation, jlpt_level, difficulty, status)
select v.title, v.meaning, v.explanation, v.jlpt_level, v.difficulty, v.status
from (
  values
    ('ている (te-iru)', 'Ongoing action or state', 'Attach いる to the て-form to describe actions in progress or resulting states.', 'n4'::public.jlpt_level, 2, 'published'::public.content_status),
    ('てください (te kudasai)', 'Polite request', 'Use the て-form plus ください to ask someone to do something politely.', 'n4'::public.jlpt_level, 2, 'published'::public.content_status),
    ('ない-form', 'Plain negative verb stem', 'The ない-form is used for plain negative statements and as a base for other patterns.', 'n4'::public.jlpt_level, 2, 'published'::public.content_status),
    ('なければならない (must)', 'Express obligation', 'Use なければならない after the ない-form to say something must be done.', 'n4'::public.jlpt_level, 2, 'published'::public.content_status),
    ('ことができる (potential)', 'Express ability', 'Use ことができる after the dictionary form to say someone can do something.', 'n4'::public.jlpt_level, 2, 'published'::public.content_status),
    ('つもり (intention)', 'Express intention or plan', 'Use つもり after the plain form to describe what someone intends to do.', 'n4'::public.jlpt_level, 2, 'published'::public.content_status),
    ('ば conditional', 'If / when condition', 'Replace the final う sound with えば to form a conditional meaning if.', 'n4'::public.jlpt_level, 2, 'published'::public.content_status),
    ('たら conditional', 'When / if after action', 'Use たら after the た-form to mean when or if something happens.', 'n4'::public.jlpt_level, 2, 'published'::public.content_status),
    ('ながら (while)', 'Simultaneous actions', 'Attach ながら to verb stems to describe doing two actions at once.', 'n4'::public.jlpt_level, 2, 'published'::public.content_status),
    ('ように (purpose)', 'So that / in order to', 'Use ように after plain forms to express purpose or desired outcome.', 'n4'::public.jlpt_level, 2, 'published'::public.content_status),
    ('より～ほうが (comparison)', 'Comparative preference', 'Compare two options with より and ほうが to say which is more so.', 'n4'::public.jlpt_level, 2, 'published'::public.content_status),
    ('一番 (superlative)', 'The most / number one', 'Place 一番 before adjectives or nouns to express the superlative.', 'n4'::public.jlpt_level, 2, 'published'::public.content_status)
) as v(title, meaning, explanation, jlpt_level, difficulty, status)
where not exists (
  select 1 from public.grammar_points existing where existing.title = v.title
);

insert into public.grammar_examples (
  grammar_id, japanese_text, romaji, english, order_index, status
)
select g.id, e.japanese_text, e.romaji, e.english, e.order_index, 'published'::public.content_status
from public.grammar_points g
inner join (
  values
    ('ている (te-iru)', '勉強しています。', 'Benkyou shite imasu.', 'I am studying.', 0),
    ('ている (te-iru)', '雨が降っています。', 'Ame ga futte imasu.', 'It is raining.', 1),
    ('てください (te kudasai)', '座ってください。', 'Suwatte kudasai.', 'Please sit down.', 0),
    ('てください (te kudasai)', '待ってください。', 'Matte kudasai.', 'Please wait.', 1),
    ('ない-form', '行かない。', 'Ikanai.', 'I do not go.', 0),
    ('ない-form', '食べない。', 'Tabenai.', 'I do not eat.', 1),
    ('なければならない (must)', '勉強しなければならない。', 'Benkyou shinakereba naranai.', 'I must study.', 0),
    ('なければならない (must)', '早く起きなければならない。', 'Hayaku okinakereba naranai.', 'I must wake up early.', 1),
    ('ことができる (potential)', '日本語が話せます。', 'Nihongo ga hanasemasu.', 'I can speak Japanese.', 0),
    ('ことができる (potential)', '泳ぐことができます。', 'Oyogu koto ga dekimasu.', 'I can swim.', 1),
    ('つもり (intention)', '留学するつもりです。', 'Ryuugaku suru tsumori desu.', 'I intend to study abroad.', 0),
    ('つもり (intention)', '旅行に行くつもりです。', 'Ryokou ni iku tsumori desu.', 'I plan to go on a trip.', 1),
    ('ば conditional', '早ければ、間に合います。', 'Hayakereba, maniaimasu.', 'If we are early, we will make it.', 0),
    ('ば conditional', '安ければ、買います。', 'Yasukereba, kaimasu.', 'If it is cheap, I will buy it.', 1),
    ('たら conditional', '家に帰ったら、電話します。', 'Ie ni kaettara, denwa shimasu.', 'When I get home, I will call.', 0),
    ('たら conditional', '時間があったら、行きます。', 'Jikan ga attara, ikimasu.', 'If I have time, I will go.', 1),
    ('ながら (while)', '音楽を聞きながら勉強します。', 'Ongaku o kikinagara benkyou shimasu.', 'I study while listening to music.', 0),
    ('ながら (while)', '歩きながら話します。', 'Arukinagara hanashimasu.', 'I talk while walking.', 1),
    ('ように (purpose)', '忘れないようにメモします。', 'Wasurenai you ni memo shimasu.', 'I take notes so I do not forget.', 0),
    ('ように (purpose)', '健康になるように運動します。', 'Kenkou ni naru you ni undou shimasu.', 'I exercise to become healthy.', 1),
    ('より～ほうが (comparison)', '電車のほうがバスより速いです。', 'Densha no hou ga basu yori hayai desu.', 'The train is faster than the bus.', 0),
    ('より～ほうが (comparison)', '日本語のほうが英語より難しいです。', 'Nihongo no hou ga eigo yori muzukashii desu.', 'Japanese is harder than English.', 1),
    ('一番 (superlative)', 'これが一番好きです。', 'Kore ga ichiban suki desu.', 'I like this the most.', 0),
    ('一番 (superlative)', '富士山は日本で一番高い山です。', 'Fujisan wa nihon de ichiban takai yama desu.', 'Mt. Fuji is the tallest mountain in Japan.', 1)
) as e(title, japanese_text, romaji, english, order_index) on e.title = g.title
where g.jlpt_level = 'n4'
  and not exists (
    select 1 from public.grammar_examples existing
    where existing.grammar_id = g.id
      and existing.japanese_text = e.japanese_text
  );

insert into public.kanji (character, meaning, jlpt_level, stroke_count, status)
select v.character, v.meaning, v.jlpt_level, v.stroke_count, v.status
from (
  values
    ('仕', 'serve, work', 'n4'::public.jlpt_level, 5, 'published'::public.content_status),
    ('者', 'person', 'n4'::public.jlpt_level, 8, 'published'::public.content_status),
    ('働', 'work', 'n4'::public.jlpt_level, 13, 'published'::public.content_status),
    ('集', 'gather', 'n4'::public.jlpt_level, 12, 'published'::public.content_status),
    ('届', 'deliver', 'n4'::public.jlpt_level, 8, 'published'::public.content_status),
    ('建', 'build', 'n4'::public.jlpt_level, 9, 'published'::public.content_status),
    ('引', 'pull', 'n4'::public.jlpt_level, 5, 'published'::public.content_status),
    ('歩', 'walk', 'n4'::public.jlpt_level, 8, 'published'::public.content_status),
    ('注', 'pour, note', 'n4'::public.jlpt_level, 8, 'published'::public.content_status),
    ('洋', 'Western', 'n4'::public.jlpt_level, 9, 'published'::public.content_status),
    ('熊', 'bear', 'n4'::public.jlpt_level, 14, 'published'::public.content_status),
    ('考', 'think', 'n4'::public.jlpt_level, 6, 'published'::public.content_status),
    ('勉', 'exertion, study', 'n4'::public.jlpt_level, 10, 'published'::public.content_status),
    ('場', 'place', 'n4'::public.jlpt_level, 12, 'published'::public.content_status),
    ('変', 'change', 'n4'::public.jlpt_level, 9, 'published'::public.content_status),
    ('特', 'special', 'n4'::public.jlpt_level, 10, 'published'::public.content_status)
) as v(character, meaning, jlpt_level, stroke_count, status)
where not exists (
  select 1 from public.kanji existing where existing.character = v.character
);

insert into public.kanji_readings (kanji_id, reading, reading_type)
select k.id, r.reading, r.reading_type
from public.kanji k
inner join (
  values
    ('仕', 'シ', 'onyomi'),
    ('仕', 'つか', 'kunyomi'),
    ('者', 'シャ', 'onyomi'),
    ('者', 'もの', 'kunyomi'),
    ('働', 'ドウ', 'onyomi'),
    ('働', 'はたら', 'kunyomi'),
    ('集', 'シュウ', 'onyomi'),
    ('集', 'あつ', 'kunyomi'),
    ('届', 'カイ', 'onyomi'),
    ('届', 'とど', 'kunyomi'),
    ('建', 'ケン', 'onyomi'),
    ('建', 'たて', 'kunyomi'),
    ('引', 'イン', 'onyomi'),
    ('引', 'ひ', 'kunyomi'),
    ('歩', 'ホ', 'onyomi'),
    ('歩', 'ある', 'kunyomi'),
    ('注', 'チュウ', 'onyomi'),
    ('注', 'そそ', 'kunyomi'),
    ('洋', 'ヨウ', 'onyomi'),
    ('熊', 'ユウ', 'onyomi'),
    ('熊', 'くま', 'kunyomi'),
    ('考', 'コウ', 'onyomi'),
    ('考', 'かんが', 'kunyomi'),
    ('勉', 'ベン', 'onyomi'),
    ('場', 'ジョウ', 'onyomi'),
    ('場', 'ば', 'kunyomi'),
    ('変', 'ヘン', 'onyomi'),
    ('変', 'か', 'kunyomi'),
    ('特', 'トク', 'onyomi')
) as r(character, reading, reading_type) on r.character = k.character
where k.jlpt_level = 'n4'
  and not exists (
    select 1 from public.kanji_readings existing
    where existing.kanji_id = k.id
      and existing.reading = r.reading
      and existing.reading_type = r.reading_type
  );

insert into public.kanji_examples (kanji_id, japanese_text, romaji, english, order_index, status)
select k.id, e.japanese_text, e.romaji, e.english, 0, 'published'
from public.kanji k
inner join (
  values
    ('仕', '仕事に行きます。', 'Shigoto ni ikimasu.', 'I go to work.'),
    ('者', '旅行者', 'Ryokousha', 'traveler'),
    ('働', '会社で働きます。', 'Kaisha de hatarakimasu.', 'I work at a company.'),
    ('集', '友達を集めます。', 'Tomodachi o atsumemasu.', 'I gather friends.'),
    ('届', '荷物が届きます。', 'Nimotsu ga todokimasu.', 'The package arrives.'),
    ('建', '家を建てます。', 'Ie o tatemasu.', 'I build a house.'),
    ('引', 'ドアを引きます。', 'Doa o hikimasu.', 'I pull the door.'),
    ('歩', '公園を歩きます。', 'Kouen o arukimasu.', 'I walk in the park.'),
    ('注', '注意してください。', 'Chuui shite kudasai.', 'Please be careful.'),
    ('洋', '洋服', 'Youfuku', 'Western clothes'),
    ('熊', '熊がいます。', 'Kuma ga imasu.', 'There is a bear.'),
    ('考', 'よく考えます。', 'Yoku kangaemasu.', 'I think carefully.'),
    ('勉', '毎日勉強します。', 'Mainichi benkyou shimasu.', 'I study every day.'),
    ('場', 'この場所は静かです。', 'Kono basho wa shizuka desu.', 'This place is quiet.'),
    ('変', '天気が変わります。', 'Tenki ga kawarimasu.', 'The weather changes.'),
    ('特', '特に好きです。', 'Tokuni suki desu.', 'I especially like it.')
) as e(character, japanese_text, romaji, english) on e.character = k.character
where k.jlpt_level = 'n4'
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
  vocab_id uuid;
  grammar_id uuid;
  kanji_id uuid;
  word_kana_list text[];
  word_kana text;
  point_title_list text[];
  point_title text;
  char_list text[];
  char_value text;
  item_index integer;
begin
  select id into region_id from public.regions where slug = 'mount-n4' limit 1;
  if region_id is null then return; end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Work & Daily Life', 'N4 vocabulary for work, travel, and daily routines.', 1, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Work & Daily Life'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Work & Daily Life' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Work & Travel', 'Learn essential N4 vocabulary.', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Work & Travel'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Work & Travel' limit 1;

    if lesson_id is not null then
      word_kana_list := array['しごと', 'かいしゃ', 'りゅうがく', 'りょこう', 'じゅんび'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n4' and kana = word_kana
        limit 1;
        if vocab_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'vocabulary', vocab_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = vocab_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Life & Habits', 'Learn essential N4 vocabulary.', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Life & Habits'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Life & Habits' limit 1;

    if lesson_id is not null then
      word_kana_list := array['けいけん', 'やくそく', 'しんぱい', 'せいかつ', 'しゅうかん'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n4' and kana = word_kana
        limit 1;
        if vocab_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'vocabulary', vocab_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = vocab_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Actions & Choices', 'N4 verbs and expressions for decisions and daily actions.', 2, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Actions & Choices'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Actions & Choices' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Verbs I', 'Learn essential N4 vocabulary.', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Verbs I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Verbs I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['はじめる', 'つづける', 'きめる', 'かす', 'かりる'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n4' and kana = word_kana
        limit 1;
        if vocab_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'vocabulary', vocab_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = vocab_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Verbs II', 'Learn essential N4 vocabulary.', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Verbs II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Verbs II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['もどる', 'とくに', 'もし', 'ふべん', 'だいどころ'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n4' and kana = word_kana
        limit 1;
        if vocab_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'vocabulary', vocab_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = vocab_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'N4 Grammar Core', 'Essential N4 grammar patterns for intermediate expression.', 3, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N4 Grammar Core'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N4 Grammar Core' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'Forms & Requests', 'Learn essential N4 grammar patterns.', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Forms & Requests'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Forms & Requests' limit 1;

    if lesson_id is not null then
      point_title_list := array['ている (te-iru)', 'てください (te kudasai)', 'ない-form', 'なければならない (must)'];
      item_index := 0;
      foreach point_title in array point_title_list loop
        select id into grammar_id from public.grammar_points
        where status = 'published' and jlpt_level = 'n4' and title = point_title
        limit 1;
        if grammar_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'Ability & Conditionals', 'Learn essential N4 grammar patterns.', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Ability & Conditionals'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Ability & Conditionals' limit 1;

    if lesson_id is not null then
      point_title_list := array['ことができる (potential)', 'つもり (intention)', 'ば conditional', 'たら conditional'];
      item_index := 0;
      foreach point_title in array point_title_list loop
        select id into grammar_id from public.grammar_points
        where status = 'published' and jlpt_level = 'n4' and title = point_title
        limit 1;
        if grammar_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'Flow & Comparison', 'Learn essential N4 grammar patterns.', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Flow & Comparison'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Flow & Comparison' limit 1;

    if lesson_id is not null then
      point_title_list := array['ながら (while)', 'ように (purpose)', 'より～ほうが (comparison)', '一番 (superlative)'];
      item_index := 0;
      foreach point_title in array point_title_list loop
        select id into grammar_id from public.grammar_points
        where status = 'published' and jlpt_level = 'n4' and title = point_title
        limit 1;
        if grammar_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'N4 Kanji Trail', 'Core N4 kanji for work, movement, and daily life.', 4, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N4 Kanji Trail'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N4 Kanji Trail' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'kanji', 'N4 Kanji · Part I', 'Learn essential N4 kanji.', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'N4 Kanji · Part I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'N4 Kanji · Part I' limit 1;

    if lesson_id is not null then
      char_list := array['仕', '者', '働', '集', '届', '建', '引', '歩'];
      item_index := 0;
      foreach char_value in array char_list loop
        select id into kanji_id from public.kanji
        where status = 'published' and jlpt_level = 'n4' and character = char_value
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
    select unit_id, 'kanji', 'N4 Kanji · Part II', 'Learn essential N4 kanji.', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'N4 Kanji · Part II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'N4 Kanji · Part II' limit 1;

    if lesson_id is not null then
      char_list := array['注', '洋', '熊', '考', '勉', '場', '変', '特'];
      item_index := 0;
      foreach char_value in array char_list loop
        select id into kanji_id from public.kanji
        where status = 'published' and jlpt_level = 'n4' and character = char_value
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
  select region_id, 'N4 Practice', 'Mixed review across N4 vocabulary, grammar, and kanji.', 5, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N4 Practice'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N4 Practice' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', 'N4 Trail Check', 'Mixed recall across N4 content you have learned.', 3, 22, 10, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'N4 Trail Check'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'N4 Trail Check' limit 1;

    if lesson_id is not null then
      item_index := 0;

      foreach word_kana in array array['しごと', 'りょこう', 'はじめる', 'かりる'] loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n4' and kana = word_kana limit 1;
        if vocab_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'vocabulary', vocab_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = vocab_id
        );
        item_index := item_index + 1;
      end loop;

      foreach point_title in array array['ている (te-iru)', 'ことができる (potential)'] loop
        select id into grammar_id from public.grammar_points
        where status = 'published' and jlpt_level = 'n4' and title = point_title limit 1;
        if grammar_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
        item_index := item_index + 1;
      end loop;

      foreach char_value in array array['仕', '働', '考', '場'] loop
        select id into kanji_id from public.kanji
        where status = 'published' and jlpt_level = 'n4' and character = char_value limit 1;
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
