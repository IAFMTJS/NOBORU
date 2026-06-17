-- N5 vocabulary expansion wave 4

insert into public.vocabulary (kana, kanji, meaning, part_of_speech, jlpt_level, status)
select v.kana, v.kanji, v.meaning, v.part_of_speech, v.jlpt_level, v.status
from (
  values
    ('あさごはん', '朝ご飯', 'breakfast', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひるごはん', '昼ご飯', 'lunch', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ばんごはん', '晩ご飯', 'dinner', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おかず', 'おかず', 'side dish', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さかな', '魚', 'fish', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('にく', '肉', 'meat', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('やさい', '野菜', 'vegetable', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くだもの', '果物', 'fruit', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たまご', '卵', 'egg', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('パン', null, 'bread', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おちゃ', 'お茶', 'tea', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('コーヒー', null, 'coffee', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぎゅうにゅう', '牛乳', 'milk', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ジュース', null, 'juice', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みず', '水', 'water', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おいしい', '美味しい', 'delicious', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まずい', '不味い', 'bad-tasting', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あまい', '甘い', 'sweet', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('からい', '辛い', 'spicy, hot', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しおからい', '塩辛い', 'salty', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふく', '服', 'clothes', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('シャツ', null, 'shirt', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ズボン', null, 'pants', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くつ', '靴', 'shoes', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぼうし', '帽子', 'hat', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('めがね', '眼鏡', 'glasses', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かばん', '鞄', 'bag', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とけい', '時計', 'watch, clock', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さいふ', '財布', 'wallet', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きせつ', '季節', 'season', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あか', '赤', 'red', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あお', '青', 'blue', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しろ', '白', 'white', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くろ', '黒', 'black', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きいろ', '黄色', 'yellow', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みどり', '緑', 'green', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ちゃいろ', '茶色', 'brown', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ピンク', null, 'pink', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('オレンジ', null, 'orange', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いろ', '色', 'color', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きょうしつ', '教室', 'classroom', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じゅぎょう', '授業', 'class, lesson', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しけん', '試験', 'exam', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しゅくだい', '宿題', 'homework', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('えんぴつ', '鉛筆', 'pencil', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ノート', null, 'notebook', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じしょ', '辞書', 'dictionary', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('え', '絵', 'picture, drawing', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おんがく', '音楽', 'music', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うんどう', '運動', 'exercise, sports', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かいぎ', '会議', 'meeting', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しごと', '仕事', 'work, job', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('でんわ', '電話', 'telephone', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('メール', null, 'email', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きょうか', '教科', 'school subject', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おぼえる', '覚える', 'to memorize', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('わすれる', '忘れる', 'to forget', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('れんしゅうする', '練習する', 'to practice', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しつもんする', '質問する', 'to ask a question', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('こたえる', '答える', 'to answer', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('びょうき', '病気', 'illness', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ねつ', '熱', 'fever', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くすり', '薬', 'medicine', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('びょういん', '病院', 'hospital', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('げんき', '元気', 'healthy, energetic', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いたい', '痛い', 'painful', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('だいじょうぶ', '大丈夫', 'okay, all right', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('やすむ', '休む', 'to rest', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ねむい', '眠い', 'sleepy', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はやく', '早く', 'early, quickly', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('えいが', '映画', 'movie', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('スポーツ', null, 'sports', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('りょこう', '旅行', 'travel, trip', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しゃしん', '写真', 'photo', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ゲーム', null, 'game', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うた', '歌', 'song', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ダンス', null, 'dance', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('てがみ', '手紙', 'letter', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('プレゼント', null, 'present, gift', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('パーティー', null, 'party', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status)
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
    ('あさごはん', '朝ご飯を食べます。', 'Asagohan o tabemasu.', 'I eat breakfast.'),
    ('ひるごはん', '昼ご飯は十二時です。', 'Hirugohan wa juuniji desu.', 'Lunch is at twelve.'),
    ('ばんごはん', '晩ご飯を作ります。', 'Bangohan o tsukurimasu.', 'I make dinner.'),
    ('おかず', 'おかずがおいしいです。', 'Okazu ga oishii desu.', 'The side dish is delicious.'),
    ('さかな', '魚を食べます。', 'Sakana o tabemasu.', 'I eat fish.'),
    ('にく', '肉が好きです。', 'Niku ga suki desu.', 'I like meat.'),
    ('やさい', '野菜を食べます。', 'Yasai o tabemasu.', 'I eat vegetables.'),
    ('くだもの', '果物を買います。', 'Kudamono o kaimasu.', 'I buy fruit.'),
    ('たまご', '卵を食べます。', 'Tamago o tabemasu.', 'I eat eggs.'),
    ('パン', 'パンを買います。', 'Pan o kaimasu.', 'I buy bread.'),
    ('おちゃ', 'お茶を飲みます。', 'Ocha o nomimasu.', 'I drink tea.'),
    ('コーヒー', 'コーヒーが好きです。', 'Koohii ga suki desu.', 'I like coffee.'),
    ('ぎゅうにゅう', '牛乳を飲みます。', 'Gyuunyuu o nomimasu.', 'I drink milk.'),
    ('ジュース', 'ジュースをください。', 'Juusu o kudasai.', 'Juice, please.'),
    ('みず', '水を飲みます。', 'Mizu o nomimasu.', 'I drink water.'),
    ('おいしい', 'この料理は美味しいです。', 'Kono ryouri wa oishii desu.', 'This dish is delicious.'),
    ('まずい', 'この料理は不味いです。', 'Kono ryouri wa mazui desu.', 'This dish tastes bad.'),
    ('あまい', 'このケーキは甘いです。', 'Kono keeki wa amai desu.', 'This cake is sweet.'),
    ('からい', 'この料理は辛いです。', 'Kono ryouri wa karai desu.', 'This dish is spicy.'),
    ('しおからい', 'スープは塩辛いです。', 'Suupu wa shiokarai desu.', 'The soup is salty.'),
    ('ふく', '新しい服を買います。', 'Atarashii fuku o kaimasu.', 'I buy new clothes.'),
    ('シャツ', '白いシャツを着ます。', 'Shiroi shatsu o kimasu.', 'I wear a white shirt.'),
    ('ズボン', 'ズボンをはきます。', 'Zubon o hakimasu.', 'I put on pants.'),
    ('くつ', '靴を履きます。', 'Kutsu o hakimasu.', 'I put on shoes.'),
    ('ぼうし', '帽子をかぶります。', 'Boushi o kaburimasu.', 'I wear a hat.'),
    ('めがね', '眼鏡をかけます。', 'Megane o kakemasu.', 'I wear glasses.'),
    ('かばん', '鞄に本を入れます。', 'Kaban ni hon o iremasu.', 'I put a book in the bag.'),
    ('とけい', '時計を見ます。', 'Tokei o mimasu.', 'I look at the watch.'),
    ('さいふ', '財布を忘れました。', 'Saifu o wasuremashita.', 'I forgot my wallet.'),
    ('きせつ', '今の季節は春です。', 'Ima no kisetsu wa haru desu.', 'The current season is spring.'),
    ('あか', '赤い花です。', 'Akai hana desu.', 'It is a red flower.'),
    ('あお', '空は青いです。', 'Sora wa aoi desu.', 'The sky is blue.'),
    ('しろ', '白い紙です。', 'Shiroi kami desu.', 'It is white paper.'),
    ('くろ', '黒い猫です。', 'Kuroi neko desu.', 'It is a black cat.'),
    ('きいろ', '黄色いバナナです。', 'Kiiroi banana desu.', 'It is a yellow banana.'),
    ('みどり', '緑の木です。', 'Midori no ki desu.', 'It is a green tree.'),
    ('ちゃいろ', '茶色の机です。', 'Chairo no tsukue desu.', 'It is a brown desk.'),
    ('ピンク', 'ピンクの花です。', 'Pinku no hana desu.', 'It is a pink flower.'),
    ('オレンジ', 'オレンジ色です。', 'Orenji iro desu.', 'It is orange.'),
    ('いろ', '好きな色は何ですか。', 'Sukina iro wa nan desu ka.', 'What is your favorite color?'),
    ('きょうしつ', '教室へ行きます。', 'Kyoushitsu e ikimasu.', 'I go to the classroom.'),
    ('じゅぎょう', '授業は九時からです。', 'Jugyou wa kuji kara desu.', 'Class starts at nine.'),
    ('しけん', '来週試験があります。', 'Raishuu shiken ga arimasu.', 'There is an exam next week.'),
    ('しゅくだい', '宿題をします。', 'Shukudai o shimasu.', 'I do homework.'),
    ('えんぴつ', '鉛筆で書きます。', 'Enpitsu de kakimasu.', 'I write with a pencil.'),
    ('ノート', 'ノートに書きます。', 'Nooto ni kakimasu.', 'I write in the notebook.'),
    ('じしょ', '辞書を使います。', 'Jisho o tsukaimasu.', 'I use a dictionary.'),
    ('え', '絵を描きます。', 'E o kakimasu.', 'I draw a picture.'),
    ('おんがく', '音楽を聞きます。', 'Ongaku o kikimasu.', 'I listen to music.'),
    ('うんどう', '運動が好きです。', 'Undou ga suki desu.', 'I like exercise.'),
    ('かいぎ', '会議は三時です。', 'Kaigi wa sanji desu.', 'The meeting is at three.'),
    ('しごと', '仕事が忙しいです。', 'Shigoto ga isogashii desu.', 'Work is busy.'),
    ('でんわ', '電話をかけます。', 'Denwa o kakemasu.', 'I make a phone call.'),
    ('メール', 'メールを送ります。', 'Meeru o okurimasu.', 'I send an email.'),
    ('きょうか', '好きな教科は何ですか。', 'Sukina kyouka wa nan desu ka.', 'What is your favorite subject?'),
    ('おぼえる', '漢字を覚えます。', 'Kanji o oboemasu.', 'I memorize kanji.'),
    ('わすれる', '名前を忘れました。', 'Namae o wasuremashita.', 'I forgot the name.'),
    ('れんしゅうする', '毎日練習します。', 'Mainichi renshuu shimasu.', 'I practice every day.'),
    ('しつもんする', '先生に質問します。', 'Sensei ni shitsumon shimasu.', 'I ask the teacher a question.'),
    ('こたえる', '質問に答えます。', 'Shitsumon ni kotaemasu.', 'I answer the question.'),
    ('びょうき', '病気です。', 'Byouki desu.', 'I am sick.'),
    ('ねつ', '熱があります。', 'Netsu ga arimasu.', 'I have a fever.'),
    ('くすり', '薬を飲みます。', 'Kusuri o nomimasu.', 'I take medicine.'),
    ('びょういん', '病院へ行きます。', 'Byouin e ikimasu.', 'I go to the hospital.'),
    ('げんき', '元気ですか。', 'Genki desu ka.', 'How are you?'),
    ('いたい', '足が痛いです。', 'Ashi ga itai desu.', 'My leg hurts.'),
    ('だいじょうぶ', '大丈夫ですか。', 'Daijoubu desu ka.', 'Are you okay?'),
    ('やすむ', '日曜日に休みます。', 'Nichiyoubi ni yasumimasu.', 'I rest on Sunday.'),
    ('ねむい', '眠いです。', 'Nemui desu.', 'I am sleepy.'),
    ('はやく', '早く起きます。', 'Hayaku okimasu.', 'I wake up early.'),
    ('えいが', '映画を見ます。', 'Eiga o mimasu.', 'I watch a movie.'),
    ('スポーツ', 'スポーツが好きです。', 'Supootsu ga suki desu.', 'I like sports.'),
    ('りょこう', '旅行に行きます。', 'Ryokou ni ikimasu.', 'I go on a trip.'),
    ('しゃしん', '写真を撮ります。', 'Shashin o torimasu.', 'I take a photo.'),
    ('ゲーム', 'ゲームをします。', 'Geemu o shimasu.', 'I play a game.'),
    ('うた', '歌を歌います。', 'Uta o utaimasu.', 'I sing a song.'),
    ('ダンス', 'ダンスが好きです。', 'Dansu ga suki desu.', 'I like dancing.'),
    ('てがみ', '手紙を書きます。', 'Tegami o kakimasu.', 'I write a letter.'),
    ('プレゼント', 'プレゼントをあげます。', 'Purezento o agemasu.', 'I give a present.'),
    ('パーティー', 'パーティーに行きます。', 'Paatii ni ikimasu.', 'I go to a party.')
) as e(kana, japanese_text, romaji, english) on e.kana = v.kana
where v.jlpt_level = 'n5'
  and not exists (
    select 1 from public.vocabulary_examples existing
    where existing.vocabulary_id = v.id
      and existing.japanese_text = e.japanese_text
  );

do $seed$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  vocab_id uuid;
  word_kana_list text[];
  word_kana text;
  item_index integer;
begin
  select id into region_id from public.regions where slug = 'mount-n5' limit 1;
  if region_id is null then return; end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Food & Dining', 'Meals, drinks, and restaurant vocabulary.', 32, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Food & Dining'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Food & Dining' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Meals I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Meals I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Meals I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['あさごはん', 'ひるごはん', 'ばんごはん', 'おかず', 'さかな'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
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
    select unit_id, 'vocabulary', 'Meals II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Meals II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Meals II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['にく', 'やさい', 'くだもの', 'たまご', 'パン'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
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
    select unit_id, 'vocabulary', 'Drinks', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Drinks'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Drinks' limit 1;

    if lesson_id is not null then
      word_kana_list := array['おちゃ', 'コーヒー', 'ぎゅうにゅう', 'ジュース', 'みず'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
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
    select unit_id, 'vocabulary', 'Taste & Flavor', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Taste & Flavor'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Taste & Flavor' limit 1;

    if lesson_id is not null then
      word_kana_list := array['おいしい', 'まずい', 'あまい', 'からい', 'しおからい'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
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
  select region_id, 'Clothing & Colors', 'What to wear and color vocabulary.', 33, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Clothing & Colors'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Clothing & Colors' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Clothing I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Clothing I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Clothing I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ふく', 'シャツ', 'ズボン', 'くつ', 'ぼうし'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
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
    select unit_id, 'vocabulary', 'Clothing II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Clothing II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Clothing II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['めがね', 'かばん', 'とけい', 'さいふ', 'きせつ'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
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
    select unit_id, 'vocabulary', 'Colors I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Colors I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Colors I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['あか', 'あお', 'しろ', 'くろ', 'きいろ'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
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
    select unit_id, 'vocabulary', 'Colors II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Colors II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Colors II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['みどり', 'ちゃいろ', 'ピンク', 'オレンジ', 'いろ'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
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
  select region_id, 'School & Work', 'Classroom, office, and study vocabulary.', 34, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'School & Work'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'School & Work' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'School I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'School I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'School I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['きょうしつ', 'じゅぎょう', 'しけん', 'しゅくだい', 'えんぴつ'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
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
    select unit_id, 'vocabulary', 'School II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'School II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'School II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ノート', 'じしょ', 'え', 'おんがく', 'うんどう'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
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
    select unit_id, 'vocabulary', 'Work & Office', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Work & Office'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Work & Office' limit 1;

    if lesson_id is not null then
      word_kana_list := array['かいぎ', 'しごと', 'でんわ', 'メール', 'きょうか'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
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
    select unit_id, 'vocabulary', 'Study Verbs', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Study Verbs'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Study Verbs' limit 1;

    if lesson_id is not null then
      word_kana_list := array['おぼえる', 'わすれる', 'れんしゅうする', 'しつもんする', 'こたえる'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
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
  select region_id, 'Health & Hobbies', 'Wellbeing, leisure, and social vocabulary.', 35, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Health & Hobbies'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Health & Hobbies' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Health I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Health I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Health I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['びょうき', 'ねつ', 'くすり', 'びょういん', 'げんき'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
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
    select unit_id, 'vocabulary', 'Health II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Health II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Health II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['いたい', 'だいじょうぶ', 'やすむ', 'ねむい', 'はやく'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
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
    select unit_id, 'vocabulary', 'Hobbies I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Hobbies I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Hobbies I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['えいが', 'スポーツ', 'りょこう', 'しゃしん', 'ゲーム'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
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
    select unit_id, 'vocabulary', 'Hobbies II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Hobbies II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Hobbies II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['うた', 'ダンス', 'てがみ', 'プレゼント', 'パーティー'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
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
  select region_id, 'N5 Vocabulary Practice: Wave 4 Unit', 'Mixed recall quiz across wave 4 N5 vocabulary.', 36, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Practice: Wave 4 Unit'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Practice: Wave 4 Unit' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', 'N5 Vocabulary Practice: Wave 4', 'Mixed recall quiz across wave 4 N5 vocabulary.', 2, 20, 8, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'N5 Vocabulary Practice: Wave 4'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'N5 Vocabulary Practice: Wave 4' limit 1;

    if lesson_id is not null then
      word_kana_list := array['あさごはん', 'にく', 'おちゃ', 'おいしい', 'ふく', 'めがね', 'あか', 'みどり', 'きょうしつ', 'ノート', 'かいぎ', 'おぼえる', 'びょうき', 'いたい', 'えいが', 'うた'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
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
end $seed$;
