-- N5 grammar expansion wave 3


-- N5 grammar expansion wave 3
insert into public.grammar_points (title, meaning, explanation, jlpt_level, difficulty, status)
select g.title, g.meaning, g.explanation, g.jlpt_level, g.difficulty, g.status
from (
  values
    ('ないで (naide)', 'Without doing', 'Connects two actions: the second happens without the first being done.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('てはいけない (te wa ikenai)', 'Must not do', 'Expresses prohibition in polite speech.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('ほしい (hoshii)', 'Want (a thing)', 'Expresses desire for a noun; the wanter is usually the topic with は.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('じゃない (ja nai)', 'Is not (casual)', 'Casual negative form of です; also used in じゃありません.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('のです (no desu)', 'Explanatory (it is that...)', 'Adds emphasis or gives background explanation for a situation.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('ないでください (naide kudasai)', 'Please do not', 'Polite request not to do something.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('てもいい (te mo ii)', 'May do, it''s okay to', 'Gives or asks permission to perform an action.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('だけ (dake)', 'Only, just', 'Limits the scope to one thing or amount.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('しか〜ない (shika...nai)', 'Only (with negative)', 'Means only when paired with a negative verb.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('いちばん (ichiban)', 'The most, number one', 'Superlative marker for comparisons within a group.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('とき (toki)', 'When, at the time of', 'Indicates the time when something happens.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('くらい/ぐらい (kurai/gurai)', 'About, approximately', 'Expresses approximate degree, amount, or extent.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('や (ya)', 'And (among others)', 'Lists examples without being exhaustive, unlike と.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('など (nado)', 'And so on, such as', 'Indicates representative examples from a larger set.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('たことがある (ta koto ga aru)', 'Have done before', 'Expresses past experience of having done something.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('なる (naru)', 'Become', 'Marks change of state; な-adjective + になる, い-adjective + くなる.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('てみる (te miru)', 'Try doing', 'Attempt an action to see what it is like or what happens.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('でしょう (deshou)', 'Probably, I think', 'Expresses conjecture or seeks agreement from the listener.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('ね (ne)', 'Right?, isn''t it?', 'Sentence-ending particle seeking agreement or softening.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('よ (yo)', 'Emphasis particle', 'Adds emphasis or shares new information with the listener.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('かな (kana)', 'I wonder', 'Expresses uncertainty or wondering to oneself.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('どう (dou)', 'How', 'Asks about manner, state, or opinion.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('どれ (dore)', 'Which one (among three or more)', 'Interrogative for choosing from multiple items.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('どの (dono)', 'Which + noun', 'Interrogative determiner placed before a noun.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('いくつ (ikutsu)', 'How many, how old', 'Asks about countable quantity or age.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('いくら (ikura)', 'How much (price)', 'Asks about the price of something.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('なぜ/どうして (naze/doushite)', 'Why', 'Asks for a reason; どうして is more common in conversation.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('いつも (itsumo)', 'Always, usually', 'Indicates habitual or constant action.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('ときどき (tokidoki)', 'Sometimes', 'Indicates occasional frequency.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('どんな (donna)', 'What kind of', 'Asks about the type or nature of something.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('い-adjective + くて (kute)', 'Te-form of i-adjectives', 'Connects i-adjectives to other predicates or lists qualities.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('な-adjective + で (de)', 'Te-form of na-adjectives', 'Connects na-adjectives to other predicates using で.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('一緒に (issho ni)', 'Together', 'Indicates doing something jointly with another person.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('なくてもいい (nakutemo ii)', 'Do not have to', 'Expresses that something is not necessary or not required.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status)
) as g(title, meaning, explanation, jlpt_level, difficulty, status)
where not exists (
  select 1 from public.grammar_points existing where existing.title = g.title
);


insert into public.grammar_examples (grammar_id, japanese_text, romaji, english, order_index, status)
select g.id, e.japanese_text, e.romaji, e.english, e.order_index, 'published'::public.content_status
from public.grammar_points g
inner join (
  values
    ('ないで (naide)', '朝ご飯を食べないで学校へ行きます。', 'Asagohan o tabenaide gakkou e ikimasu.', 'I go to school without eating breakfast.', 0),
    ('ないで (naide)', '靴を脱がないで入らないでください。', 'Kutsu o nuganaide hairanaide kudasai.', 'Please do not enter without taking off your shoes.', 1),
    ('てはいけない (te wa ikenai)', 'ここで写真を撮ってはいけません。', 'Koko de shashin o totte wa ikemasen.', 'You must not take photos here.', 0),
    ('てはいけない (te wa ikenai)', '走ってはいけません。', 'Hashitte wa ikemasen.', 'You must not run.', 1),
    ('ほしい (hoshii)', '新しいかばんがほしいです。', 'Atarashii kaban ga hoshii desu.', 'I want a new bag.', 0),
    ('ほしい (hoshii)', '水がほしいです。', 'Mizu ga hoshii desu.', 'I want water.', 1),
    ('じゃない (ja nai)', '学生じゃないです。', 'Gakusei ja nai desu.', 'I am not a student.', 0),
    ('じゃない (ja nai)', '今日は月曜日じゃありません。', 'Kyou wa getsuyoubi ja arimasen.', 'Today is not Monday.', 1),
    ('のです (no desu)', '頭が痛いんです。', 'Atama ga itai n desu.', 'The thing is, my head hurts.', 0),
    ('のです (no desu)', '日本語を勉強しているんです。', 'Nihongo o benkyou shite iru n desu.', 'I am studying Japanese (you see).', 1),
    ('ないでください (naide kudasai)', 'ここでタバコを吸わないでください。', 'Koko de tabako o suwanaide kudasai.', 'Please do not smoke here.', 0),
    ('ないでください (naide kudasai)', '忘れないでください。', 'Wasurenaide kudasai.', 'Please do not forget.', 1),
    ('てもいい (te mo ii)', '写真を撮ってもいいですか。', 'Shashin o totte mo ii desu ka.', 'May I take a photo?', 0),
    ('てもいい (te mo ii)', 'ここに座ってもいいです。', 'Koko ni suwatte mo ii desu.', 'You may sit here.', 1),
    ('だけ (dake)', '水だけ飲みます。', 'Mizu dake nomimasu.', 'I drink only water.', 0),
    ('だけ (dake)', '一人だけ来ました。', 'Hitori dake kimashita.', 'Only one person came.', 1),
    ('しか〜ない (shika...nai)', '百円しかありません。', 'Hyaku en shika arimasen.', 'I only have one hundred yen.', 0),
    ('しか〜ない (shika...nai)', '日本語しか話せません。', 'Nihongo shika hanasemasen.', 'I can only speak Japanese.', 1),
    ('いちばん (ichiban)', 'りんごがいちばん好きです。', 'Ringo ga ichiban suki desu.', 'I like apples the most.', 0),
    ('いちばん (ichiban)', 'これがいちばん安いです。', 'Kore ga ichiban yasui desu.', 'This is the cheapest.', 1),
    ('とき (toki)', '子供のとき、よく泳ぎました。', 'Kodomo no toki, yoku oyogimashita.', 'When I was a child, I often swam.', 0),
    ('とき (toki)', '暇なとき、本を読みます。', 'Hima na toki, hon o yomimasu.', 'When I am free, I read books.', 1),
    ('くらい/ぐらい (kurai/gurai)', '一時間くらいかかります。', 'Ichijikan kurai kakarimasu.', 'It takes about one hour.', 0),
    ('くらい/ぐらい (kurai/gurai)', '十人ぐらい来ました。', 'Juunin gurai kimashita.', 'About ten people came.', 1),
    ('や (ya)', '本やノートを買います。', 'Hon ya nooto o kaimasu.', 'I buy books and notebooks (among other things).', 0),
    ('や (ya)', 'りんごやバナナがあります。', 'Ringo ya banana ga arimasu.', 'There are apples, bananas, and so on.', 1),
    ('など (nado)', '映画などを見ます。', 'Eiga nado o mimasu.', 'I watch movies and things like that.', 0),
    ('など (nado)', '東京や大阪などに行きました。', 'Toukyou ya Oosaka nado ni ikimashita.', 'I went to Tokyo, Osaka, and so on.', 1),
    ('たことがある (ta koto ga aru)', '日本に行ったことがあります。', 'Nihon ni itta koto ga arimasu.', 'I have been to Japan before.', 0),
    ('たことがある (ta koto ga aru)', '寿司を食べたことがあります。', 'Sushi o tabeta koto ga arimasu.', 'I have eaten sushi before.', 1),
    ('なる (naru)', '先生になりたいです。', 'Sensei ni naritai desu.', 'I want to become a teacher.', 0),
    ('なる (naru)', '寒くなりました。', 'Samuku narimashita.', 'It has become cold.', 1),
    ('てみる (te miru)', 'この料理を食べてみます。', 'Kono ryouri o tabete mimasu.', 'I will try eating this dish.', 0),
    ('てみる (te miru)', '日本語で話してみてください。', 'Nihongo de hanashite mite kudasai.', 'Please try speaking in Japanese.', 1),
    ('でしょう (deshou)', '明日は雨でしょう。', 'Ashita wa ame deshou.', 'It will probably rain tomorrow.', 0),
    ('でしょう (deshou)', 'いい天気でしょう。', 'Ii tenki deshou.', 'Nice weather, isn''t it?', 1),
    ('ね (ne)', 'いい天気ですね。', 'Ii tenki desu ne.', 'Nice weather, isn''t it?', 0),
    ('ね (ne)', '難しいですね。', 'Muzukashii desu ne.', 'It''s difficult, isn''t it?', 1),
    ('よ (yo)', 'これはおいしいですよ。', 'Kore wa oishii desu yo.', 'This is delicious, you know.', 0),
    ('よ (yo)', '駅はあそこですよ。', 'Eki wa asoko desu yo.', 'The station is over there.', 1),
    ('かな (kana)', '明日晴れるかな。', 'Ashita hareru kana.', 'I wonder if it will be clear tomorrow.', 0),
    ('かな (kana)', '大丈夫かな。', 'Daijoubu kana.', 'I wonder if it will be okay.', 1),
    ('どう (dou)', '日本語はどうですか。', 'Nihongo wa dou desu ka.', 'How is your Japanese?', 0),
    ('どう (dou)', 'この料理はどうですか。', 'Kono ryouri wa dou desu ka.', 'How is this dish?', 1),
    ('どれ (dore)', 'どれが好きですか。', 'Dore ga suki desu ka.', 'Which one do you like?', 0),
    ('どれ (dore)', 'どれを買いますか。', 'Dore o kaimasu ka.', 'Which one will you buy?', 1),
    ('どの (dono)', 'どの本がいいですか。', 'Dono hon ga ii desu ka.', 'Which book is good?', 0),
    ('どの (dono)', 'どの駅ですか。', 'Dono eki desu ka.', 'Which station is it?', 1),
    ('いくつ (ikutsu)', 'りんごをいくつ買いますか。', 'Ringo o ikutsu kaimasu ka.', 'How many apples will you buy?', 0),
    ('いくつ (ikutsu)', 'いくつですか。', 'Ikutsu desu ka.', 'How old are you?', 1),
    ('いくら (ikura)', 'これはいくらですか。', 'Kore wa ikura desu ka.', 'How much is this?', 0),
    ('いくら (ikura)', '全部でいくらですか。', 'Zenbu de ikura desu ka.', 'How much is it altogether?', 1),
    ('なぜ/どうして (naze/doushite)', 'どうして来ませんでしたか。', 'Doushite kimasen deshita ka.', 'Why didn''t you come?', 0),
    ('なぜ/どうして (naze/doushite)', 'なぜですか。', 'Naze desu ka.', 'Why is that?', 1),
    ('いつも (itsumo)', 'いつも七時に起きます。', 'Itsumo shichiji ni okimasu.', 'I always wake up at seven.', 0),
    ('いつも (itsumo)', 'いつも電車で行きます。', 'Itsumo densha de ikimasu.', 'I usually go by train.', 1),
    ('ときどき (tokidoki)', 'ときどき映画を見ます。', 'Tokidoki eiga o mimasu.', 'I sometimes watch movies.', 0),
    ('ときどき (tokidoki)', 'ときどき外食します。', 'Tokidoki gaishoku shimasu.', 'I sometimes eat out.', 1),
    ('どんな (donna)', 'どんな音楽が好きですか。', 'Donna ongaku ga suki desu ka.', 'What kind of music do you like?', 0),
    ('どんな (donna)', 'どんな人ですか。', 'Donna hito desu ka.', 'What kind of person are they?', 1),
    ('い-adjective + くて (kute)', 'この部屋は広くて明るいです。', 'Kono heya wa hirokute akarui desu.', 'This room is spacious and bright.', 0),
    ('い-adjective + くて (kute)', '安くておいしいです。', 'Yasukute oishii desu.', 'It is cheap and delicious.', 1),
    ('な-adjective + で (de)', 'この町は静かで便利です。', 'Kono machi wa shizuka de benri desu.', 'This town is quiet and convenient.', 0),
    ('な-adjective + で (de)', '元気で優しい人です。', 'Genki de yasashii hito desu.', 'A healthy and kind person.', 1),
    ('一緒に (issho ni)', '友達と一緒に行きます。', 'Tomodachi to issho ni ikimasu.', 'I go together with a friend.', 0),
    ('一緒に (issho ni)', '家族と一緒に食べます。', 'Kazoku to issho ni tabemasu.', 'I eat together with my family.', 1),
    ('なくてもいい (nakutemo ii)', '今日は来なくてもいいです。', 'Kyou wa konakutemo ii desu.', 'You do not have to come today.', 0),
    ('なくてもいい (nakutemo ii)', '食べなくてもいいです。', 'Tabenakutemo ii desu.', 'You do not have to eat.', 1)
) as e(title, japanese_text, romaji, english, order_index) on e.title = g.title
where g.jlpt_level = 'n5'
  and not exists (
    select 1 from public.grammar_examples existing
    where existing.grammar_id = g.id and existing.japanese_text = e.japanese_text
  );


do $grammar_curriculum_wave3$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  grammar_id uuid;
begin
  select id into region_id from public.regions where slug = 'mount-n5' limit 1;
  if region_id is null then return; end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Grammar Patterns IV — Part 1', 'Completing N5 grammar patterns and particles.', 25, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Grammar Patterns IV — Part 1'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Grammar Patterns IV — Part 1' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'ないで (naide)', 'Without doing', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'ないで (naide)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'ないで (naide)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'ないで (naide)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'てはいけない (te wa ikenai)', 'Must not do', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'てはいけない (te wa ikenai)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'てはいけない (te wa ikenai)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'てはいけない (te wa ikenai)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'ほしい (hoshii)', 'Want (a thing)', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'ほしい (hoshii)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'ほしい (hoshii)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'ほしい (hoshii)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'じゃない (ja nai)', 'Is not (casual)', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'じゃない (ja nai)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'じゃない (ja nai)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'じゃない (ja nai)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
  end if;
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Grammar Patterns IV — Part 2', 'Completing N5 grammar patterns and particles.', 26, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Grammar Patterns IV — Part 2'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Grammar Patterns IV — Part 2' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'のです (no desu)', 'Explanatory (it is that...)', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'のです (no desu)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'のです (no desu)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'のです (no desu)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'ないでください (naide kudasai)', 'Please do not', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'ないでください (naide kudasai)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'ないでください (naide kudasai)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'ないでください (naide kudasai)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'てもいい (te mo ii)', 'May do, it''s okay to', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'てもいい (te mo ii)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'てもいい (te mo ii)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'てもいい (te mo ii)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'だけ (dake)', 'Only, just', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'だけ (dake)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'だけ (dake)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'だけ (dake)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
  end if;
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Grammar Patterns IV — Part 3', 'Completing N5 grammar patterns and particles.', 27, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Grammar Patterns IV — Part 3'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Grammar Patterns IV — Part 3' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'しか〜ない (shika...nai)', 'Only (with negative)', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'しか〜ない (shika...nai)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'しか〜ない (shika...nai)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'しか〜ない (shika...nai)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'いちばん (ichiban)', 'The most, number one', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'いちばん (ichiban)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'いちばん (ichiban)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'いちばん (ichiban)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'とき (toki)', 'When, at the time of', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'とき (toki)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'とき (toki)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'とき (toki)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'くらい/ぐらい (kurai/gurai)', 'About, approximately', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'くらい/ぐらい (kurai/gurai)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'くらい/ぐらい (kurai/gurai)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'くらい/ぐらい (kurai/gurai)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
  end if;
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Grammar Patterns IV — Part 4', 'Completing N5 grammar patterns and particles.', 28, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Grammar Patterns IV — Part 4'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Grammar Patterns IV — Part 4' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'や (ya)', 'And (among others)', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'や (ya)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'や (ya)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'や (ya)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'など (nado)', 'And so on, such as', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'など (nado)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'など (nado)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'など (nado)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'たことがある (ta koto ga aru)', 'Have done before', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'たことがある (ta koto ga aru)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'たことがある (ta koto ga aru)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'たことがある (ta koto ga aru)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'なる (naru)', 'Become', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'なる (naru)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'なる (naru)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'なる (naru)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
  end if;
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Grammar Patterns IV — Part 5', 'Completing N5 grammar patterns and particles.', 29, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Grammar Patterns IV — Part 5'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Grammar Patterns IV — Part 5' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'てみる (te miru)', 'Try doing', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'てみる (te miru)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'てみる (te miru)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'てみる (te miru)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'でしょう (deshou)', 'Probably, I think', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'でしょう (deshou)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'でしょう (deshou)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'でしょう (deshou)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'ね (ne)', 'Right?, isn''t it?', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'ね (ne)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'ね (ne)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'ね (ne)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'よ (yo)', 'Emphasis particle', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'よ (yo)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'よ (yo)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'よ (yo)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
  end if;
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Grammar Patterns IV — Part 6', 'Completing N5 grammar patterns and particles.', 30, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Grammar Patterns IV — Part 6'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Grammar Patterns IV — Part 6' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'かな (kana)', 'I wonder', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'かな (kana)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'かな (kana)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'かな (kana)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'どう (dou)', 'How', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'どう (dou)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'どう (dou)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'どう (dou)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'どれ (dore)', 'Which one (among three or more)', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'どれ (dore)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'どれ (dore)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'どれ (dore)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'どの (dono)', 'Which + noun', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'どの (dono)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'どの (dono)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'どの (dono)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
  end if;
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Grammar Patterns IV — Part 7', 'Completing N5 grammar patterns and particles.', 31, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Grammar Patterns IV — Part 7'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Grammar Patterns IV — Part 7' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'いくつ (ikutsu)', 'How many, how old', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'いくつ (ikutsu)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'いくつ (ikutsu)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'いくつ (ikutsu)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'いくら (ikura)', 'How much (price)', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'いくら (ikura)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'いくら (ikura)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'いくら (ikura)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'なぜ/どうして (naze/doushite)', 'Why', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'なぜ/どうして (naze/doushite)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'なぜ/どうして (naze/doushite)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'なぜ/どうして (naze/doushite)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'いつも (itsumo)', 'Always, usually', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'いつも (itsumo)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'いつも (itsumo)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'いつも (itsumo)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
  end if;
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Grammar Patterns IV — Part 8', 'Completing N5 grammar patterns and particles.', 32, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Grammar Patterns IV — Part 8'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Grammar Patterns IV — Part 8' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'ときどき (tokidoki)', 'Sometimes', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'ときどき (tokidoki)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'ときどき (tokidoki)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'ときどき (tokidoki)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'どんな (donna)', 'What kind of', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'どんな (donna)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'どんな (donna)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'どんな (donna)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'い-adjective + くて (kute)', 'Te-form of i-adjectives', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'い-adjective + くて (kute)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'い-adjective + くて (kute)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'い-adjective + くて (kute)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'な-adjective + で (de)', 'Te-form of na-adjectives', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'な-adjective + で (de)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'な-adjective + で (de)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'な-adjective + で (de)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
  end if;
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Grammar Patterns IV — Part 9', 'Completing N5 grammar patterns and particles.', 33, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Grammar Patterns IV — Part 9'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Grammar Patterns IV — Part 9' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', '一緒に (issho ni)', 'Together', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = '一緒に (issho ni)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = '一緒に (issho ni)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = '一緒に (issho ni)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'なくてもいい (nakutemo ii)', 'Do not have to', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'なくてもいい (nakutemo ii)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'なくてもいい (nakutemo ii)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'なくてもいい (nakutemo ii)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
  end if;
end;
$grammar_curriculum_wave3$;
