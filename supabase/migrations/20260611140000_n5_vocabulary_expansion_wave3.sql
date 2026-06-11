-- N5 vocabulary expansion wave 3

insert into public.vocabulary (kana, kanji, meaning, part_of_speech, jlpt_level, status)
select v.kana, v.kanji, v.meaning, v.part_of_speech, v.jlpt_level, v.status
from (
  values
    ('かく', '書く', 'to write', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きく', '聞く', 'to listen, ask', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はなす', '話す', 'to speak', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('よむ', '読む', 'to read', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('べんきょうする', '勉強する', 'to study', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ねる', '寝る', 'to sleep', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おきる', '起きる', 'to wake up', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はたらく', '働く', 'to work', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かう', '買う', 'to buy', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うる', '売る', 'to sell', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('つくる', '作る', 'to make', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あそぶ', '遊ぶ', 'to play', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まつ', '待つ', 'to wait', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あう', '会う', 'to meet', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('でかける', '出かける', 'to go out', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かえる', '帰る', 'to return home', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いれる', '入れる', 'to put in', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('だす', '出す', 'to take out', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あける', '開ける', 'to open', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しめる', '閉める', 'to close', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はいる', '入る', 'to enter', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('でる', '出る', 'to exit, leave', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('つかう', '使う', 'to use', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('わかる', '分かる', 'to understand', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しる', '知る', 'to know', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まいにち', '毎日', 'every day', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まいしゅう', '毎週', 'every week', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まいつき', '毎月', 'every month', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まいとし', '毎年', 'every year', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あさ', '朝', 'morning', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひる', '昼', 'noon, daytime', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('よる', '夜', 'night', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ばん', '晩', 'evening', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('せんしゅう', '先週', 'last week', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('こんしゅう', '今週', 'this week', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('らいしゅう', '来週', 'next week', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('せんげつ', '先月', 'last month', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('こんげつ', '今月', 'this month', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('らいげつ', '来月', 'next month', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ようび', '曜日', 'day of the week', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はる', '春', 'spring', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なつ', '夏', 'summer', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あき', '秋', 'autumn', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふゆ', '冬', 'winter', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('げつようび', '月曜日', 'Monday', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ろく', '六', 'six', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なな', '七', 'seven', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はち', '八', 'eight', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きゅう', '九', 'nine', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じゅう', '十', 'ten', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひゃく', '百', 'hundred', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('せん', '千', 'thousand', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まん', '万', 'ten thousand', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('すうじ', '数字', 'number, numeral', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たくさん', 'たくさん', 'many, a lot', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('すこし', '少し', 'a little', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぜんぶ', '全部', 'all, entire', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はんぶん', '半分', 'half', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('だいぶ', 'だいぶ', 'considerably', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('もっと', 'もっと', 'more', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いちばん', '一番', 'number one, most', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふたつ', '二つ', 'two (things)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みっつ', '三つ', 'three (things)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('よっつ', '四つ', 'four (things)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いつつ', '五つ', 'five (things)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('むっつ', '六つ', 'six (things)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ななつ', '七つ', 'seven (things)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('やっつ', '八つ', 'eight (things)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ここのつ', '九つ', 'nine (things)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とお', '十', 'ten (things)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あなた', 'あなた', 'you', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かれ', '彼', 'he', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かのじょ', '彼女', 'she', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('だれか', '誰か', 'someone', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みんな', 'みんな', 'everyone', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('これ', 'これ', 'this', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('それ', 'それ', 'that', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あれ', 'あれ', 'that over there', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('この', 'この', 'this (modifier)', 'determiner', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('その', 'その', 'that (modifier)', 'determiner', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あの', 'あの', 'that (over there, modifier)', 'determiner', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ここ', 'ここ', 'here', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('そこ', 'そこ', 'there', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あそこ', 'あそこ', 'over there', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('どこか', 'どこか', 'somewhere', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はい', 'はい', 'yes', 'interjection', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いいえ', 'いいえ', 'no', 'interjection', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ありがとう', 'ありがとう', 'thank you', 'interjection', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('すみません', 'すみません', 'excuse me, sorry', 'interjection', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おねがいします', 'お願いします', 'please', 'interjection', 'n5'::public.jlpt_level, 'published'::public.content_status)
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
    ('かく', '手紙を書きます。', 'Tegami o kakimasu.', 'I write a letter.'),
    ('きく', '音楽を聞きます。', 'Ongaku o kikimasu.', 'I listen to music.'),
    ('はなす', '日本語を話します。', 'Nihongo o hanashimasu.', 'I speak Japanese.'),
    ('よむ', '新聞を読みます。', 'Shinbun o yomimasu.', 'I read the newspaper.'),
    ('べんきょうする', '毎日勉強します。', 'Mainichi benkyou shimasu.', 'I study every day.'),
    ('ねる', '十時に寝ます。', 'Juu ji ni nemasu.', 'I sleep at ten o''clock.'),
    ('おきる', '六時に起きます。', 'Roku ji ni okimasu.', 'I wake up at six o''clock.'),
    ('はたらく', '会社で働きます。', 'Kaisha de hatarakimasu.', 'I work at a company.'),
    ('かう', '本を買います。', 'Hon o kaimasu.', 'I buy a book.'),
    ('うる', '店で服を売ります。', 'Mise de fuku o urimasu.', 'The shop sells clothes.'),
    ('つくる', 'ご飯を作ります。', 'Gohan o tsukurimasu.', 'I make a meal.'),
    ('あそぶ', '友達と遊びます。', 'Tomodachi to asobimasu.', 'I play with a friend.'),
    ('まつ', 'ここで待ちます。', 'Koko de machimasu.', 'I wait here.'),
    ('あう', '駅で会いましょう。', 'Eki de aimashou.', 'Let''s meet at the station.'),
    ('でかける', '買い物に出かけます。', 'Kaimono ni dekakemasu.', 'I go out shopping.'),
    ('かえる', '五時に帰ります。', 'Go ji ni kaerimasu.', 'I return home at five.'),
    ('いれる', 'かばんに本を入れます。', 'Kaban ni hon o iremasu.', 'I put a book in the bag.'),
    ('だす', '財布を出します。', 'Saifu o dashimasu.', 'I take out my wallet.'),
    ('あける', '窓を開けます。', 'Mado o akemasu.', 'I open the window.'),
    ('しめる', 'ドアを閉めます。', 'Doa o shimemasu.', 'I close the door.'),
    ('はいる', '部屋に入ります。', 'Heya ni hairimasu.', 'I enter the room.'),
    ('でる', '家を出ます。', 'Ie o demasu.', 'I leave the house.'),
    ('つかう', 'ペンを使います。', 'Pen o tsukaimasu.', 'I use a pen.'),
    ('わかる', '日本語が分かります。', 'Nihongo ga wakarimasu.', 'I understand Japanese.'),
    ('しる', 'その人を知っています。', 'Sono hito o shitte imasu.', 'I know that person.'),
    ('まいにち', '毎日勉強します。', 'Mainichi benkyou shimasu.', 'I study every day.'),
    ('まいしゅう', '毎週日曜日に休みます。', 'Maishuu nichiyoubi ni yasumimasu.', 'I rest every Sunday.'),
    ('まいつき', '毎月本を買います。', 'Maitsuki hon o kaimasu.', 'I buy a book every month.'),
    ('まいとし', '毎年日本へ行きます。', 'Maitoshi Nihon e ikimasu.', 'I go to Japan every year.'),
    ('あさ', '朝ご飯を食べます。', 'Asa gohan o tabemasu.', 'I eat breakfast.'),
    ('ひる', '昼ご飯を食べます。', 'Hiru gohan o tabemasu.', 'I eat lunch.'),
    ('よる', '夜は静かです。', 'Yoru wa shizuka desu.', 'It is quiet at night.'),
    ('ばん', '晩ご飯を作ります。', 'Ban gohan o tsukurimasu.', 'I make dinner.'),
    ('せんしゅう', '先週東京へ行きました。', 'Senshuu Toukyou e ikimashita.', 'I went to Tokyo last week.'),
    ('こんしゅう', '今週は忙しいです。', 'Konshuu wa isogashii desu.', 'I am busy this week.'),
    ('らいしゅう', '来週試験があります。', 'Raishuu shiken ga arimasu.', 'There is an exam next week.'),
    ('せんげつ', '先月日本へ行きました。', 'Sengetsu Nihon e ikimashita.', 'I went to Japan last month.'),
    ('こんげつ', '今月は忙しいです。', 'Kongetsu wa isogashii desu.', 'I am busy this month.'),
    ('らいげつ', '来月旅行します。', 'Raigetsu ryokou shimasu.', 'I will travel next month.'),
    ('ようび', '今日は何曜日ですか。', 'Kyou wa nanyoubi desu ka.', 'What day is today?'),
    ('はる', '春は暖かいです。', 'Haru wa atatakai desu.', 'Spring is warm.'),
    ('なつ', '夏は暑いです。', 'Natsu wa atsui desu.', 'Summer is hot.'),
    ('あき', '秋は涼しいです。', 'Aki wa suzushii desu.', 'Autumn is cool.'),
    ('ふゆ', '冬は寒いです。', 'Fuyu wa samui desu.', 'Winter is cold.'),
    ('げつようび', '月曜日に学校へ行きます。', 'Getsuyoubi ni gakkou e ikimasu.', 'I go to school on Monday.'),
    ('ろく', '六時に起きます。', 'Roku ji ni okimasu.', 'I wake up at six.'),
    ('なな', '七つあります。', 'Nanatsu arimasu.', 'There are seven.'),
    ('はち', '八人います。', 'Hachinin imasu.', 'There are eight people.'),
    ('きゅう', '九時に寝ます。', 'Kyuu ji ni nemasu.', 'I sleep at nine.'),
    ('じゅう', '十ページ読みます。', 'Juu peeji yomimasu.', 'I read ten pages.'),
    ('ひゃく', '百円です。', 'Hyaku en desu.', 'It is one hundred yen.'),
    ('せん', '千円あります。', 'Sen en arimasu.', 'I have one thousand yen.'),
    ('まん', '一万円です。', 'Ichiman en desu.', 'It is ten thousand yen.'),
    ('すうじ', '数字を書きます。', 'Suuji o kakimasu.', 'I write numbers.'),
    ('たくさん', '人がたくさんいます。', 'Hito ga takusan imasu.', 'There are many people.'),
    ('すこし', '少し待ってください。', 'Sukoshi matte kudasai.', 'Please wait a little.'),
    ('ぜんぶ', '全部食べました。', 'Zenbu tabemashita.', 'I ate everything.'),
    ('はんぶん', '半分ください。', 'Hanbun kudasai.', 'Half please.'),
    ('だいぶ', 'だいぶ分かりました。', 'Daibu wakarimashita.', 'I understood considerably.'),
    ('もっと', 'もっと食べます。', 'Motto tabemasu.', 'I will eat more.'),
    ('いちばん', '一番好きです。', 'Ichiban suki desu.', 'I like it the most.'),
    ('ふたつ', '二つください。', 'Futatsu kudasai.', 'Two please.'),
    ('みっつ', '三つあります。', 'Mittsu arimasu.', 'There are three.'),
    ('よっつ', '四つ買います。', 'Yottsu kaimasu.', 'I buy four.'),
    ('いつつ', '五つ持っています。', 'Itsutsu motte imasu.', 'I have five.'),
    ('むっつ', '六つあります。', 'Muttsu arimasu.', 'There are six.'),
    ('ななつ', '七つ食べました。', 'Nanatsu tabemashita.', 'I ate seven.'),
    ('やっつ', '八つ買いました。', 'Yattsu kaimashita.', 'I bought eight.'),
    ('ここのつ', '九つあります。', 'Kokonotsu arimasu.', 'There are nine.'),
    ('とお', '十あります。', 'Too arimasu.', 'There are ten.'),
    ('あなた', 'あなたは学生ですか。', 'Anata wa gakusei desu ka.', 'Are you a student?'),
    ('かれ', '彼は先生です。', 'Kare wa sensei desu.', 'He is a teacher.'),
    ('かのじょ', '彼女は日本人です。', 'Kanojo wa nihonjin desu.', 'She is Japanese.'),
    ('だれか', '誰かいますか。', 'Dareka imasu ka.', 'Is someone there?'),
    ('みんな', 'みんな来ました。', 'Minna kimashita.', 'Everyone came.'),
    ('これ', 'これは何ですか。', 'Kore wa nan desu ka.', 'What is this?'),
    ('それ', 'それは本です。', 'Sore wa hon desu.', 'That is a book.'),
    ('あれ', 'あれは駅です。', 'Are wa eki desu.', 'That over there is the station.'),
    ('この', 'この本は面白いです。', 'Kono hon wa omoshiroi desu.', 'This book is interesting.'),
    ('その', 'その人は誰ですか。', 'Sono hito wa dare desu ka.', 'Who is that person?'),
    ('あの', 'あの店は安いです。', 'Ano mise wa yasui desu.', 'That shop over there is cheap.'),
    ('ここ', 'ここに座ってください。', 'Koko ni suwatte kudasai.', 'Please sit here.'),
    ('そこ', 'そこに本があります。', 'Soko ni hon ga arimasu.', 'There is a book there.'),
    ('あそこ', 'あそこは公園です。', 'Asoko wa kouen desu.', 'Over there is the park.'),
    ('どこか', 'どこかへ行きます。', 'Dokoka e ikimasu.', 'I will go somewhere.'),
    ('はい', 'はい、分かりました。', 'Hai, wakarimashita.', 'Yes, I understand.'),
    ('いいえ', 'いいえ、違います。', 'Iie, chigaimasu.', 'No, that is wrong.'),
    ('ありがとう', 'ありがとうございます。', 'Arigatou gozaimasu.', 'Thank you very much.'),
    ('すみません', 'すみません、遅れました。', 'Sumimasen, okuremashita.', 'Sorry, I am late.'),
    ('おねがいします', '水をお願いします。', 'Mizu o onegaishimasu.', 'Water, please.')
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
  select region_id, 'More Verbs', 'Essential verbs for daily life.', 27, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'More Verbs'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'More Verbs' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Study & Communication', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Study & Communication'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Study & Communication' limit 1;

    if lesson_id is not null then
      word_kana_list := array['かく', 'きく', 'はなす', 'よむ', 'べんきょうする'];
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
    select unit_id, 'vocabulary', 'Daily Routine', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Daily Routine'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Daily Routine' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ねる', 'おきる', 'はたらく', 'かう', 'うる'];
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
    select unit_id, 'vocabulary', 'Actions & Movement', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Actions & Movement'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Actions & Movement' limit 1;

    if lesson_id is not null then
      word_kana_list := array['つくる', 'あそぶ', 'まつ', 'あう', 'でかける'];
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
    select unit_id, 'vocabulary', 'Open, Close & Enter', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Open, Close & Enter'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Open, Close & Enter' limit 1;

    if lesson_id is not null then
      word_kana_list := array['かえる', 'いれる', 'だす', 'あける', 'しめる'];
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
    select unit_id, 'vocabulary', 'Know & Use', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Know & Use'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Know & Use' limit 1;

    if lesson_id is not null then
      word_kana_list := array['はいる', 'でる', 'つかう', 'わかる', 'しる'];
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
  select region_id, 'Time & Calendar', 'Days, weeks, months, and seasons.', 28, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Time & Calendar'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Time & Calendar' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Daily & Weekly', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Daily & Weekly'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Daily & Weekly' limit 1;

    if lesson_id is not null then
      word_kana_list := array['まいにち', 'まいしゅう', 'まいつき', 'まいとし', 'あさ'];
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
    select unit_id, 'vocabulary', 'Parts of the Day', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Parts of the Day'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Parts of the Day' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ひる', 'よる', 'ばん', 'せんしゅう', 'こんしゅう'];
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
    select unit_id, 'vocabulary', 'Weeks & Months', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Weeks & Months'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Weeks & Months' limit 1;

    if lesson_id is not null then
      word_kana_list := array['らいしゅう', 'せんげつ', 'こんげつ', 'らいげつ', 'ようび'];
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
    select unit_id, 'vocabulary', 'Seasons & Monday', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Seasons & Monday'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Seasons & Monday' limit 1;

    if lesson_id is not null then
      word_kana_list := array['はる', 'なつ', 'あき', 'ふゆ', 'げつようび'];
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
  select region_id, 'Counters & Quantities', 'Numbers, counters, and amounts.', 29, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Counters & Quantities'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Counters & Quantities' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Numbers 6-10', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Numbers 6-10'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Numbers 6-10' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ろく', 'なな', 'はち', 'きゅう', 'じゅう'];
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
    select unit_id, 'vocabulary', 'Large Numbers', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Large Numbers'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Large Numbers' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ひゃく', 'せん', 'まん', 'すうじ', 'たくさん'];
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
    select unit_id, 'vocabulary', 'Amounts', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Amounts'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Amounts' limit 1;

    if lesson_id is not null then
      word_kana_list := array['すこし', 'ぜんぶ', 'はんぶん', 'だいぶ', 'もっと'];
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
    select unit_id, 'vocabulary', 'Native Counters I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Native Counters I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Native Counters I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['いちばん', 'ふたつ', 'みっつ', 'よっつ', 'いつつ'];
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
    select unit_id, 'vocabulary', 'Native Counters II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Native Counters II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Native Counters II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['むっつ', 'ななつ', 'やっつ', 'ここのつ', 'とお'];
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
  select region_id, 'N5 Core Mix', 'Pronouns, demonstratives, and essential phrases.', 30, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Core Mix'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Core Mix' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'People & Pronouns', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'People & Pronouns'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'People & Pronouns' limit 1;

    if lesson_id is not null then
      word_kana_list := array['あなた', 'かれ', 'かのじょ', 'だれか', 'みんな'];
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
    select unit_id, 'vocabulary', 'This & That', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'This & That'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'This & That' limit 1;

    if lesson_id is not null then
      word_kana_list := array['これ', 'それ', 'あれ', 'この', 'その'];
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
    select unit_id, 'vocabulary', 'Here & There', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Here & There'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Here & There' limit 1;

    if lesson_id is not null then
      word_kana_list := array['あの', 'ここ', 'そこ', 'あそこ', 'どこか'];
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
    select unit_id, 'vocabulary', 'Essential Phrases', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Essential Phrases'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Essential Phrases' limit 1;

    if lesson_id is not null then
      word_kana_list := array['はい', 'いいえ', 'ありがとう', 'すみません', 'おねがいします'];
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
  select region_id, 'N5 Vocabulary Practice: Wave 3 Unit', 'Mixed recall across wave 3 N5 vocabulary.', 31, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Practice: Wave 3 Unit'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Practice: Wave 3 Unit' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', 'N5 Vocabulary Practice: Wave 3', 'Mixed recall across wave 3 N5 vocabulary.', 2, 20, 8, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'N5 Vocabulary Practice: Wave 3'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'N5 Vocabulary Practice: Wave 3' limit 1;

    if lesson_id is not null then
      word_kana_list := array['かく', 'ねる', 'つくる', 'かえる', 'はいる', 'まいにち', 'ひる', 'らいしゅう', 'はる', 'ろく', 'ひゃく', 'すこし', 'いちばん', 'むっつ', 'あなた', 'これ', 'あの', 'はい'];
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
