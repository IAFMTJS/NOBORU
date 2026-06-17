-- N5 vocabulary expansion wave 8

insert into public.vocabulary (kana, kanji, meaning, part_of_speech, jlpt_level, status)
select v.kana, v.kanji, v.meaning, v.part_of_speech, v.jlpt_level, v.status
from (
  values
    ('こうこう', '高校', 'high school', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('だいがく', '大学', 'university', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('そつぎょう', '卒業', 'graduation', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('にゅうがく', '入学', 'enrollment', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しごとば', '仕事場', 'workplace', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かいぎしつ', '会議室', 'meeting room', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うけつけ', '受付', 'reception', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まどぐち', '窓口', 'counter window', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しょくどう', '食堂', 'cafeteria', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たいいくかん', '体育館', 'gymnasium', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('どうぶつえん', '動物園', 'zoo', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('すいぞくかん', '水族館', 'aquarium', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おてら', 'お寺', 'temple', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じんじゃ', '神社', 'shrine', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('やく', '焼く', 'to bake, grill', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('にる', '煮る', 'to boil, simmer', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('およぐ', '泳ぐ', 'to swim', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おどる', '踊る', 'to dance', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うたう', '歌う', 'to sing', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('わらう', '笑う', 'to laugh', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なく', '泣く', 'to cry', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('こまる', '困る', 'to be troubled', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('よろこぶ', '喜ぶ', 'to rejoice', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かつ', '勝つ', 'to win', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まける', '負ける', 'to lose', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うごく', '動く', 'to move', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まわる', '回る', 'to turn, rotate', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('わたる', '渡る', 'to cross', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たてる', '建てる', 'to build', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('こわす', '壊す', 'to break (something)', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なおる', '直る', 'to be fixed', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はずす', '外す', 'to remove', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('つたえる', '伝える', 'to convey', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('せつめいする', '説明する', 'to explain', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しょうかいする', '紹介する', 'to introduce', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('れんらくする', '連絡する', 'to contact', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かんじる', '感じる', 'to feel', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しらせる', '知らせる', 'to notify', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はじまる', '始まる', 'to begin (intransitive)', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あく', '開く', 'to open', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('つく', '付く', 'to be attached, turn on', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きえる', '消える', 'to disappear, go out', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひかる', '光る', 'to shine', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おと', '音', 'sound', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('こえ', '声', 'voice', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あじ', '味', 'taste, flavor', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('におい', '匂い', 'smell, odor', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しなもの', '品物', 'goods, article', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しょうひん', '商品', 'product, merchandise', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ざいりょう', '材料', 'ingredients, materials', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('けしき', '景色', 'scenery', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まつり', '祭り', 'festival', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きゅうじつ', '休日', 'holiday, day off', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しゅくじつ', '祝日', 'national holiday', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なつやすみ', '夏休み', 'summer vacation', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふゆやすみ', '冬休み', 'winter vacation', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('れんきゅう', '連休', 'consecutive holidays', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('でんとうぶんか', '伝統文化', 'traditional culture', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しゅうかん', '習慣', 'habit, custom', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かんけい', '関係', 'relationship, connection', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しゃかい', '社会', 'society', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('へいわ', '平和', 'peace', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('せかいじゅう', '世界中', 'all over the world', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('にほんご', '日本語', 'Japanese language', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('えいご', '英語', 'English language', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('がいこくご', '外国語', 'foreign language', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はなし', '話', 'talk, story', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はなしあい', '話し合い', 'discussion', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('そうだん', '相談', 'consultation', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('れい', '例', 'example', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ほうほう', '方法', 'method, way', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じょうきょう', '状況', 'situation', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じっさい', '実際', 'actually, in fact', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いっしょうけんめい', '一生懸命', 'with all one''s effort', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぜったい', '絶対', 'absolutely', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きっと', 'きっと', 'surely', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たぶん', '多分', 'probably', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('もちろん', '勿論', 'of course', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぜひ', '是非', 'by all means', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いっぱい', '一杯', 'full, a lot', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('すっかり', 'すっかり', 'completely', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('だんだん', '段々', 'gradually', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('どんどん', 'どんどん', 'rapidly, more and more', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぴったり', 'ぴったり', 'exactly, perfectly', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しっかり', 'しっかり', 'firmly, properly', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ちゃんと', 'ちゃんと', 'properly', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('すぐに', '直ぐに', 'immediately', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ゆっくりと', 'ゆっくりと', 'slowly', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はっきり', 'はっきり', 'clearly', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じゅうぶん', '十分', 'enough', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('だめ', '駄目', 'no good, not allowed', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('にがて', '苦手', 'weak at, not good at', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とくい', '得意', 'good at, strong point', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('にんき', '人気', 'popular', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しんせつ', '親切', 'kind', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('りょうしん', '両親', 'parents', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しつれい', '失礼', 'excuse me, rude', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おじゃま', 'お邪魔', 'intrusion', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さくぶん', '作文', 'essay, composition', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひょうげん', '表現', 'expression', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('れいぶん', '例文', 'example sentence', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たんご', '単語', 'vocabulary word', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぶんぽう', '文法', 'grammar', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まぜる', '混ぜる', 'to mix', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('こねる', '捏ねる', 'to knead', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('すく', '掬う', 'to scoop', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('すくう', '救う', 'to rescue', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さがす', '探す', 'to search for', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みつかる', '見つかる', 'to be found', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とどく', '届く', 'to reach, arrive', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふえる', '増える', 'to increase', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('へる', '減る', 'to decrease', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かわる', '変わる', 'to change', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とりかえる', '取り替える', 'to replace', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('そだてる', '育てる', 'to raise, grow', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('そだつ', '育つ', 'to grow up', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status)
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
    ('こうこう', '高校を卒業しました。', 'Koukou o sotsugyou shimashita.', 'I graduated high school.'),
    ('だいがく', '大学へ通います。', 'Daigaku e kayotte imasu.', 'I attend university.'),
    ('そつぎょう', '卒業おめでとう。', 'Sotsugyou omedetou.', 'Congratulations on graduation.'),
    ('にゅうがく', '入学しました。', 'Nyuugaku shimashita.', 'I enrolled.'),
    ('しごとば', '仕事場へ行きます。', 'Shigotoba e ikimasu.', 'I go to the workplace.'),
    ('かいぎしつ', '会議室で待ちます。', 'Kaigishitsu de machimasu.', 'I wait in the meeting room.'),
    ('うけつけ', '受付で聞きます。', 'Uketsuke de kikimasu.', 'I ask at reception.'),
    ('まどぐち', '窓口へ行きます。', 'Madoguchi e ikimasu.', 'I go to the counter.'),
    ('しょくどう', '食堂で食べます。', 'Shokudou de tabemasu.', 'I eat in the cafeteria.'),
    ('たいいくかん', '体育館で運動します。', 'Taiikukan de undou shimasu.', 'I exercise in the gym.'),
    ('どうぶつえん', '動物園へ行きます。', 'Doubutsuen e ikimasu.', 'I go to the zoo.'),
    ('すいぞくかん', '水族館を見学します。', 'Suizokukan o kengaku shimasu.', 'I visit the aquarium.'),
    ('おてら', 'お寺を見ます。', 'Otera o mimasu.', 'I see a temple.'),
    ('じんじゃ', '神社へ行きます。', 'Jinja e ikimasu.', 'I go to a shrine.'),
    ('やく', '魚を焼きます。', 'Sakana o yakimasu.', 'I grill fish.'),
    ('にる', '野菜を煮ます。', 'Yasai o nimasu.', 'I boil vegetables.'),
    ('およぐ', '海で泳ぎます。', 'Umi de oyogimasu.', 'I swim in the sea.'),
    ('おどる', 'ダンスを踊ります。', 'Dansu o odorimasu.', 'I dance.'),
    ('うたう', '歌を歌います。', 'Uta o utaimasu.', 'I sing a song.'),
    ('わらう', '笑います。', 'Waraimasu.', 'I laugh.'),
    ('なく', '泣きました。', 'Nakimashita.', 'I cried.'),
    ('こまる', '困っています。', 'Komatte imasu.', 'I am troubled.'),
    ('よろこぶ', '喜んでいます。', 'Yorokonde imasu.', 'I am delighted.'),
    ('かつ', '試合に勝ちます。', 'Shiai ni kachimasu.', 'I win the match.'),
    ('まける', '試合に負けました。', 'Shiai ni makemashita.', 'I lost the match.'),
    ('うごく', '車が動きます。', 'Kuruma ga ugokimasu.', 'The car moves.'),
    ('まわる', '地球は回ります。', 'Chikyuu wa mawarimasu.', 'The Earth rotates.'),
    ('わたる', '道を渡ります。', 'Michi o watarimasu.', 'I cross the road.'),
    ('たてる', '家を建てます。', 'Ie o tatemasu.', 'I build a house.'),
    ('こわす', 'おもちゃを壊しました。', 'Omocha o kowashimashita.', 'I broke the toy.'),
    ('なおる', '時計が直りました。', 'Tokei ga naorimashita.', 'The watch was fixed.'),
    ('はずす', '帽子を外します。', 'Boushi o hazushimasu.', 'I remove my hat.'),
    ('つたえる', 'メッセージを伝えます。', 'Messeji o tsutaemasu.', 'I convey the message.'),
    ('せつめいする', '説明します。', 'Setsumei shimasu.', 'I explain.'),
    ('しょうかいする', '友達を紹介します。', 'Tomodachi o shoukai shimasu.', 'I introduce a friend.'),
    ('れんらくする', '連絡します。', 'Renraku shimasu.', 'I will contact you.'),
    ('かんじる', '寒さを感じます。', 'Samusa o kanjimasu.', 'I feel the cold.'),
    ('しらせる', '知らせます。', 'Shiraseru.', 'I will notify you.'),
    ('はじまる', '会議が始まります。', 'Kaigi ga hajimarimasu.', 'The meeting begins.'),
    ('あく', 'ドアが開きます。', 'Doa ga akimasu.', 'The door opens.'),
    ('つく', '電気が付きます。', 'Denki ga tsukimasu.', 'The light turns on.'),
    ('きえる', '電気が消えます。', 'Denki ga kierimasu.', 'The light goes out.'),
    ('ひかる', '星が光ります。', 'Hoshi ga hikarimasu.', 'Stars shine.'),
    ('おと', '音が聞こえます。', 'Oto ga kikoemasu.', 'I hear a sound.'),
    ('こえ', '声が大きいです。', 'Koe ga ookii desu.', 'The voice is loud.'),
    ('あじ', '味がいいです。', 'Aji ga ii desu.', 'It tastes good.'),
    ('におい', 'いい匂いです。', 'Ii nioi desu.', 'It smells good.'),
    ('しなもの', '品物を見ます。', 'Shinamono o mimasu.', 'I look at the goods.'),
    ('しょうひん', '商品を買います。', 'Shouhin o kaimasu.', 'I buy the product.'),
    ('ざいりょう', '材料を買います。', 'Zairyou o kaimasu.', 'I buy ingredients.'),
    ('けしき', '景色がきれいです。', 'Keshiki ga kirei desu.', 'The scenery is beautiful.'),
    ('まつり', '祭りに行きます。', 'Matsuri ni ikimasu.', 'I go to the festival.'),
    ('きゅうじつ', '休日は休みます。', 'Kyuujitsu wa yasumimasu.', 'I rest on holidays.'),
    ('しゅくじつ', '祝日です。', 'Shukujitsu desu.', 'It is a national holiday.'),
    ('なつやすみ', '夏休みに旅行します。', 'Natsuyasumi ni ryokou shimasu.', 'I travel during summer break.'),
    ('ふゆやすみ', '冬休みは長いです。', 'Fuyuyasumi wa nagai desu.', 'Winter break is long.'),
    ('れんきゅう', '連休を楽しみます。', 'Renkyuu o tanoshimi masu.', 'I enjoy the long weekend.'),
    ('でんとうぶんか', '伝統文化を学びます。', 'Dentou bunka o manabimasu.', 'I learn traditional culture.'),
    ('しゅうかん', 'いい習慣です。', 'Ii shuukan desu.', 'It is a good habit.'),
    ('かんけい', '関係があります。', 'Kankei ga arimasu.', 'There is a connection.'),
    ('しゃかい', '社会を勉強します。', 'Shakai o benkyou shimasu.', 'I study society.'),
    ('へいわ', '平和が大切です。', 'Heiwa ga taisetsu desu.', 'Peace is important.'),
    ('せかいじゅう', '世界中を旅行します。', 'Sekaijuu o ryokou shimasu.', 'I travel around the world.'),
    ('にほんご', '日本語を勉強します。', 'Nihongo o benkyou shimasu.', 'I study Japanese.'),
    ('えいご', '英語が話せます。', 'Eigo ga hanasemasu.', 'I can speak English.'),
    ('がいこくご', '外国語を習います。', 'Gaikokugo o naraimasu.', 'I learn a foreign language.'),
    ('はなし', '話を聞きます。', 'Hanashi o kikimasu.', 'I listen to the story.'),
    ('はなしあい', '話し合いをします。', 'Hanashiai o shimasu.', 'We have a discussion.'),
    ('そうだん', '相談があります。', 'Soudan ga arimasu.', 'I have a consultation.'),
    ('れい', '例を見せてください。', 'Rei o misete kudasai.', 'Please show an example.'),
    ('ほうほう', '方法を教えてください。', 'Houhou o oshiete kudasai.', 'Please teach me the method.'),
    ('じょうきょう', '状況を説明します。', 'Joukyou o setsumei shimasu.', 'I explain the situation.'),
    ('じっさい', '実際は違います。', 'Jissai wa chigaimasu.', 'Actually it is different.'),
    ('いっしょうけんめい', '一生懸命勉強します。', 'Isshoukenmei benkyou shimasu.', 'I study hard.'),
    ('ぜったい', '絶対行きます。', 'Zettai ikimasu.', 'I will absolutely go.'),
    ('きっと', 'きっと大丈夫です。', 'Kitto daijoubu desu.', 'Surely it will be fine.'),
    ('たぶん', '多分雨です。', 'Tabun ame desu.', 'It will probably rain.'),
    ('もちろん', '勿論行きます。', 'Mochiron ikimasu.', 'Of course I will go.'),
    ('ぜひ', '是非来てください。', 'Zehi kite kudasai.', 'Please come by all means.'),
    ('いっぱい', '人が一杯います。', 'Hito ga ippai imasu.', 'It is full of people.'),
    ('すっかり', 'すっかり忘れました。', 'Sukkari wasuremashita.', 'I completely forgot.'),
    ('だんだん', '段々分かります。', 'Dandan wakarimasu.', 'I gradually understand.'),
    ('どんどん', 'どんどん上手になります。', 'Dondon jouzu ni narimasu.', 'I get better rapidly.'),
    ('ぴったり', 'ぴったり合います。', 'Pittari aimasu.', 'It fits perfectly.'),
    ('しっかり', 'しっかり勉強します。', 'Shikkari benkyou shimasu.', 'I study properly.'),
    ('ちゃんと', 'ちゃんと食べます。', 'Chanto tabemasu.', 'I eat properly.'),
    ('すぐに', '直ぐに行きます。', 'Sugu ni ikimasu.', 'I go immediately.'),
    ('ゆっくりと', 'ゆっくりと歩きます。', 'Yukkuri to arukimasu.', 'I walk slowly.'),
    ('はっきり', 'はっきり言います。', 'Hakkiri iimasu.', 'I say it clearly.'),
    ('じゅうぶん', '十分です。', 'Juubun desu.', 'It is enough.'),
    ('だめ', '駄目です。', 'Dame desu.', 'It is not allowed.'),
    ('にがて', '数学が苦手です。', 'Suugaku ga nigate desu.', 'I am weak at math.'),
    ('とくい', '料理が得意です。', 'Ryouri ga tokui desu.', 'I am good at cooking.'),
    ('にんき', '人気があります。', 'Ninki ga arimasu.', 'It is popular.'),
    ('しんせつ', '親切な人です。', 'Shinsetsu na hito desu.', 'A kind person.'),
    ('りょうしん', '両親に会います。', 'Ryoushin ni aimasu.', 'I meet my parents.'),
    ('しつれい', '失礼しました。', 'Shitsurei shimashita.', 'Excuse me.'),
    ('おじゃま', 'お邪魔します。', 'Ojama shimasu.', 'Sorry to intrude.'),
    ('さくぶん', '作文を書きます。', 'Sakubun o kakimasu.', 'I write an essay.'),
    ('ひょうげん', '表現を練習します。', 'Hyougen o renshuu shimasu.', 'I practice expressions.'),
    ('れいぶん', '例文を読みます。', 'Reibun o yomimasu.', 'I read example sentences.'),
    ('たんご', '単語を覚えます。', 'Tango o oboemasu.', 'I memorize vocabulary.'),
    ('ぶんぽう', '文法を勉強します。', 'Bunpou o benkyou shimasu.', 'I study grammar.'),
    ('まぜる', '材料を混ぜます。', 'Zairyou o mazemasu.', 'I mix the ingredients.'),
    ('こねる', 'パンを捏ねます。', 'Pan o konemasu.', 'I knead bread dough.'),
    ('すく', 'スープを掬います。', 'Suupu o sukumasu.', 'I scoop soup.'),
    ('すくう', '人を救います。', 'Hito o sukuimasu.', 'I rescue a person.'),
    ('さがす', '仕事を探します。', 'Shigoto o sagashimasu.', 'I search for a job.'),
    ('みつかる', '仕事が見つかりました。', 'Shigoto ga mitsukarimashita.', 'I found a job.'),
    ('とどく', '手紙が届きます。', 'Tegami ga todokimasu.', 'The letter arrives.'),
    ('ふえる', '友達が増えます。', 'Tomodachi ga fuemasu.', 'Friends increase.'),
    ('へる', '体重が減ります。', 'Taijuu ga herimasu.', 'My weight decreases.'),
    ('かわる', '季節が変わります。', 'Kisetsu ga kawarimasu.', 'The season changes.'),
    ('とりかえる', '電球を取り替えます。', 'Denkyuu o torikaemasu.', 'I replace the light bulb.'),
    ('そだてる', '花を育てます。', 'Hana o sodatemasu.', 'I grow flowers.'),
    ('そだつ', '子供が育ちます。', 'Kodomo ga sodachimasu.', 'Children grow up.')
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
  select region_id, 'N5 Vocabulary Wave 8 — Set 1', 'JLPT N5 vocabulary wave 8 toward full N5 word coverage.', 60, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Wave 8 — Set 1'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Wave 8 — Set 1' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Set 1 1', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 1 1'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 1 1' limit 1;

    if lesson_id is not null then
      word_kana_list := array['こうこう', 'だいがく', 'そつぎょう', 'にゅうがく', 'しごとば'];
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
    select unit_id, 'vocabulary', 'Set 1 2', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 1 2'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 1 2' limit 1;

    if lesson_id is not null then
      word_kana_list := array['かいぎしつ', 'うけつけ', 'まどぐち', 'しょくどう', 'たいいくかん'];
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
    select unit_id, 'vocabulary', 'Set 1 3', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 1 3'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 1 3' limit 1;

    if lesson_id is not null then
      word_kana_list := array['どうぶつえん', 'すいぞくかん', 'おてら', 'じんじゃ', 'やく'];
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
    select unit_id, 'vocabulary', 'Set 1 4', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 1 4'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 1 4' limit 1;

    if lesson_id is not null then
      word_kana_list := array['にる', 'およぐ', 'おどる', 'うたう', 'わらう'];
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
    select unit_id, 'vocabulary', 'Set 1 5', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 1 5'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 1 5' limit 1;

    if lesson_id is not null then
      word_kana_list := array['なく', 'こまる', 'よろこぶ', 'かつ', 'まける'];
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
    select unit_id, 'vocabulary', 'Set 1 6', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 1 6'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 1 6' limit 1;

    if lesson_id is not null then
      word_kana_list := array['うごく', 'まわる', 'わたる', 'たてる'];
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
  select region_id, 'N5 Vocabulary Wave 8 — Set 2', 'JLPT N5 vocabulary wave 8 toward full N5 word coverage.', 61, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Wave 8 — Set 2'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Wave 8 — Set 2' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Set 2 1', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 2 1'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 2 1' limit 1;

    if lesson_id is not null then
      word_kana_list := array['こわす', 'なおる', 'はずす', 'つたえる', 'せつめいする'];
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
    select unit_id, 'vocabulary', 'Set 2 2', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 2 2'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 2 2' limit 1;

    if lesson_id is not null then
      word_kana_list := array['しょうかいする', 'れんらくする', 'かんじる', 'しらせる', 'はじまる'];
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
    select unit_id, 'vocabulary', 'Set 2 3', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 2 3'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 2 3' limit 1;

    if lesson_id is not null then
      word_kana_list := array['あく', 'つく', 'きえる', 'ひかる', 'おと'];
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
    select unit_id, 'vocabulary', 'Set 2 4', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 2 4'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 2 4' limit 1;

    if lesson_id is not null then
      word_kana_list := array['こえ', 'あじ', 'におい', 'しなもの', 'しょうひん'];
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
    select unit_id, 'vocabulary', 'Set 2 5', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 2 5'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 2 5' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ざいりょう', 'けしき', 'まつり', 'きゅうじつ', 'しゅくじつ'];
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
    select unit_id, 'vocabulary', 'Set 2 6', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 2 6'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 2 6' limit 1;

    if lesson_id is not null then
      word_kana_list := array['なつやすみ', 'ふゆやすみ', 'れんきゅう', 'でんとうぶんか'];
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
  select region_id, 'N5 Vocabulary Wave 8 — Set 3', 'JLPT N5 vocabulary wave 8 toward full N5 word coverage.', 62, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Wave 8 — Set 3'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Wave 8 — Set 3' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Set 3 1', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 3 1'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 3 1' limit 1;

    if lesson_id is not null then
      word_kana_list := array['しゅうかん', 'かんけい', 'しゃかい', 'へいわ', 'せかいじゅう'];
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
    select unit_id, 'vocabulary', 'Set 3 2', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 3 2'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 3 2' limit 1;

    if lesson_id is not null then
      word_kana_list := array['にほんご', 'えいご', 'がいこくご', 'はなし', 'はなしあい'];
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
    select unit_id, 'vocabulary', 'Set 3 3', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 3 3'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 3 3' limit 1;

    if lesson_id is not null then
      word_kana_list := array['そうだん', 'れい', 'ほうほう', 'じょうきょう', 'じっさい'];
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
    select unit_id, 'vocabulary', 'Set 3 4', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 3 4'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 3 4' limit 1;

    if lesson_id is not null then
      word_kana_list := array['いっしょうけんめい', 'ぜったい', 'きっと', 'たぶん', 'もちろん'];
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
    select unit_id, 'vocabulary', 'Set 3 5', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 3 5'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 3 5' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ぜひ', 'いっぱい', 'すっかり', 'だんだん', 'どんどん'];
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
    select unit_id, 'vocabulary', 'Set 3 6', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 3 6'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 3 6' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ぴったり', 'しっかり', 'ちゃんと', 'すぐに'];
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
  select region_id, 'N5 Vocabulary Wave 8 — Set 4', 'JLPT N5 vocabulary wave 8 toward full N5 word coverage.', 63, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Wave 8 — Set 4'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Wave 8 — Set 4' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Set 4 1', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 4 1'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 4 1' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ゆっくりと', 'はっきり', 'じゅうぶん', 'だめ', 'にがて'];
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
    select unit_id, 'vocabulary', 'Set 4 2', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 4 2'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 4 2' limit 1;

    if lesson_id is not null then
      word_kana_list := array['とくい', 'にんき', 'しんせつ', 'りょうしん', 'しつれい'];
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
    select unit_id, 'vocabulary', 'Set 4 3', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 4 3'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 4 3' limit 1;

    if lesson_id is not null then
      word_kana_list := array['おじゃま', 'さくぶん', 'ひょうげん', 'れいぶん', 'たんご'];
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
    select unit_id, 'vocabulary', 'Set 4 4', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 4 4'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 4 4' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ぶんぽう', 'まぜる', 'こねる', 'すく', 'すくう'];
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
    select unit_id, 'vocabulary', 'Set 4 5', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 4 5'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 4 5' limit 1;

    if lesson_id is not null then
      word_kana_list := array['さがす', 'みつかる', 'とどく', 'ふえる', 'へる'];
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
    select unit_id, 'vocabulary', 'Set 4 6', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 4 6'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 4 6' limit 1;

    if lesson_id is not null then
      word_kana_list := array['かわる', 'とりかえる', 'そだてる', 'そだつ'];
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
  select region_id, 'N5 Vocabulary Practice: Wave 8 Unit', 'Mixed recall quiz across wave 8 N5 vocabulary.', 64, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Practice: Wave 8 Unit'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Practice: Wave 8 Unit' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', 'N5 Vocabulary Practice: Wave 8', 'Mixed recall quiz across wave 8 N5 vocabulary.', 2, 20, 8, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'N5 Vocabulary Practice: Wave 8'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'N5 Vocabulary Practice: Wave 8' limit 1;

    if lesson_id is not null then
      word_kana_list := array['こうこう', 'かいぎしつ', 'どうぶつえん', 'にる', 'なく', 'うごく', 'こわす', 'しょうかいする', 'あく', 'こえ', 'ざいりょう', 'なつやすみ', 'しゅうかん', 'にほんご', 'そうだん', 'いっしょうけんめい', 'ぜひ', 'ぴったり', 'ゆっくりと', 'とくい', 'おじゃま', 'ぶんぽう', 'さがす', 'かわる'];
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
