-- N5 vocabulary expansion wave 2

insert into public.vocabulary (kana, kanji, meaning, part_of_speech, jlpt_level, status)
select v.kana, v.kanji, v.meaning, v.part_of_speech, v.jlpt_level, v.status
from (
  values
    ('やすい', '安い', 'cheap', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たのしい', '楽しい', 'fun', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('つまらない', 'つまらない', 'boring', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('むずかしい', '難しい', 'difficult', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('やさしい', '優しい', 'kind, gentle', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きれい', '綺麗', 'pretty, clean', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きたない', '汚い', 'dirty', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いそがしい', '忙しい', 'busy', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('げんき', '元気', 'healthy, energetic', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('だいじょうぶ', '大丈夫', 'OK, all right', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('すき', '好き', 'to like', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きらい', '嫌い', 'to dislike', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('だいすき', '大好き', 'to love', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('こわい', '怖い', 'scary', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おもしろい', '面白い', 'interesting', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はやい', '早い', 'fast, early', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おそい', '遅い', 'slow, late', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ちかい', '近い', 'near, close', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とおい', '遠い', 'far', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おいしい', '美味しい', 'delicious', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かわいい', '可愛い', 'cute', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かっこいい', 'かっこいい', 'cool, stylish', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たいへん', '大変', 'tough, very', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('べんり', '便利', 'convenient', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひま', '暇', 'free time', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なに', '何', 'what', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('だれ', '誰', 'who', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('どこ', 'どこ', 'where', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いつ', 'いつ', 'when', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('どう', 'どう', 'how', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なぜ', 'なぜ', 'why', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('どうして', 'どうして', 'why', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なんで', 'なんで', 'why (casual)', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('どれ', 'どれ', 'which one', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('どの', 'どの', 'which', 'determiner', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いくら', 'いくら', 'how much', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いくつ', 'いくつ', 'how many', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('どのくらい', 'どのくらい', 'how much, how long', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('どちら', 'どちら', 'which (polite), where', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('どんな', 'どんな', 'what kind of', 'determiner', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なんじ', '何時', 'what time', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なんにん', '何人', 'how many people', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なんさい', '何歳', 'how old', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なんようび', '何曜日', 'what day of the week', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なにか', '何か', 'something, anything', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ほん', '本', 'book', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('えんぴつ', '鉛筆', 'pencil', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ペン', null, 'pen', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ノート', null, 'notebook', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かみ', '紙', 'paper', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かさ', '傘', 'umbrella', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かばん', '鞄', 'bag', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かぎ', '鍵', 'key', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さいふ', '財布', 'wallet', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とけい', '時計', 'clock, watch', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くつ', '靴', 'shoes', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふく', '服', 'clothes', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぼうし', '帽子', 'hat', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('メガネ', null, 'glasses', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('タオル', null, 'towel', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('でんわ', '電話', 'telephone', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('てがみ', '手紙', 'letter', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しゃしん', '写真', 'photo', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かね', 'お金', 'money', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はさみ', 'はさみ', 'scissors', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('テーブル', null, 'table', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いす', '椅子', 'chair', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ドア', null, 'door', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まど', '窓', 'window', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ベッド', null, 'bed', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('としょかん', '図書館', 'library', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('びょういん', '病院', 'hospital', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぎんこう', '銀行', 'bank', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ゆうびんきょく', '郵便局', 'post office', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('こうえん', '公園', 'park', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('レストラン', null, 'restaurant', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('スーパー', null, 'supermarket', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('コンビニ', null, 'convenience store', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ホテル', null, 'hotel', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('トイレ', null, 'toilet, restroom', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うち', 'うち', 'home, house', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('へや', '部屋', 'room', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おてあらい', 'お手洗い', 'restroom', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('にわ', '庭', 'garden', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('エレベーター', null, 'elevator', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まち', '町', 'town', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('し', '市', 'city', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('けいさつ', '警察', 'police', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うりば', '売り場', 'sales floor, section', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かいだん', '階段', 'stairs', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status)
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
    ('やすい', 'この店は安いです。', 'Kono mise wa yasui desu.', 'This shop is cheap.'),
    ('たのしい', '今日は楽しいです。', 'Kyou wa tanoshii desu.', 'Today is fun.'),
    ('つまらない', 'この映画はつまらないです。', 'Kono eiga wa tsumaranai desu.', 'This movie is boring.'),
    ('むずかしい', '日本語は難しいです。', 'Nihongo wa muzukashii desu.', 'Japanese is difficult.'),
    ('やさしい', '先生は優しいです。', 'Sensei wa yasashii desu.', 'The teacher is kind.'),
    ('きれい', '部屋は綺麗です。', 'Heya wa kirei desu.', 'The room is clean.'),
    ('きたない', '手が汚いです。', 'Te ga kitanai desu.', 'My hands are dirty.'),
    ('いそがしい', '今日は忙しいです。', 'Kyou wa isogashii desu.', 'I am busy today.'),
    ('げんき', '元気ですか。', 'Genki desu ka.', 'How are you?'),
    ('だいじょうぶ', '大丈夫です。', 'Daijoubu desu.', 'I am fine.'),
    ('すき', '音楽が好きです。', 'Ongaku ga suki desu.', 'I like music.'),
    ('きらい', '魚が嫌いです。', 'Sakana ga kirai desu.', 'I dislike fish.'),
    ('だいすき', '日本が大好きです。', 'Nihon ga daisuki desu.', 'I love Japan.'),
    ('こわい', 'この話は怖いです。', 'Kono hanashi wa kowai desu.', 'This story is scary.'),
    ('おもしろい', 'この本は面白いです。', 'Kono hon wa omoshiroi desu.', 'This book is interesting.'),
    ('はやい', '電車は早いです。', 'Densha wa hayai desu.', 'The train is fast.'),
    ('おそい', 'バスは遅いです。', 'Basu wa osoi desu.', 'The bus is slow.'),
    ('ちかい', '駅は近いです。', 'Eki wa chikai desu.', 'The station is near.'),
    ('とおい', '学校は遠いです。', 'Gakkou wa tooi desu.', 'The school is far.'),
    ('おいしい', 'この料理は美味しいです。', 'Kono ryouri wa oishii desu.', 'This dish is delicious.'),
    ('かわいい', 'この猫は可愛いです。', 'Kono neko wa kawaii desu.', 'This cat is cute.'),
    ('かっこいい', 'その車はかっこいいです。', 'Sono kuruma wa kakkoii desu.', 'That car is cool.'),
    ('たいへん', '今日は大変でした。', 'Kyou wa taihen deshita.', 'Today was tough.'),
    ('べんり', 'この駅は便利です。', 'Kono eki wa benri desu.', 'This station is convenient.'),
    ('ひま', '今日は暇です。', 'Kyou wa hima desu.', 'I am free today.'),
    ('なに', 'これは何ですか。', 'Kore wa nan desu ka.', 'What is this?'),
    ('だれ', 'あの人は誰ですか。', 'Ano hito wa dare desu ka.', 'Who is that person?'),
    ('どこ', 'トイレはどこですか。', 'Toire wa doko desu ka.', 'Where is the restroom?'),
    ('いつ', 'いつ行きますか。', 'Itsu ikimasu ka.', 'When will you go?'),
    ('どう', '日本語はどうですか。', 'Nihongo wa dou desu ka.', 'How is your Japanese?'),
    ('なぜ', 'なぜ来ませんか。', 'Naze kimasen ka.', 'Why won''t you come?'),
    ('どうして', 'どうして遅いですか。', 'Doushite osoi desu ka.', 'Why are you late?'),
    ('なんで', 'なんで行きますか。', 'Nande ikimasu ka.', 'Why are you going?'),
    ('どれ', 'どれがいいですか。', 'Dore ga ii desu ka.', 'Which one is good?'),
    ('どの', 'どの本ですか。', 'Dono hon desu ka.', 'Which book is it?'),
    ('いくら', 'これはいくらですか。', 'Kore wa ikura desu ka.', 'How much is this?'),
    ('いくつ', 'りんごはいくつありますか。', 'Ringo wa ikutsu arimasu ka.', 'How many apples are there?'),
    ('どのくらい', 'どのくらいかかりますか。', 'Dono kurai kakarimasu ka.', 'How long does it take?'),
    ('どちら', 'どちらがいいですか。', 'Dochira ga ii desu ka.', 'Which would you prefer?'),
    ('どんな', 'どんな音楽が好きですか。', 'Donna ongaku ga suki desu ka.', 'What kind of music do you like?'),
    ('なんじ', '今何時ですか。', 'Ima nanji desu ka.', 'What time is it now?'),
    ('なんにん', '家族は何人ですか。', 'Kazoku wa nannin desu ka.', 'How many people are in your family?'),
    ('なんさい', 'おいくつですか。', 'Oikutsu desu ka.', 'How old are you?'),
    ('なんようび', '今日は何曜日ですか。', 'Kyou wa nanyoubi desu ka.', 'What day is it today?'),
    ('なにか', '何か食べますか。', 'Nanika tabemasu ka.', 'Will you eat something?'),
    ('ほん', '本を読みます。', 'Hon o yomimasu.', 'I read a book.'),
    ('えんぴつ', '鉛筆で書きます。', 'Enpitsu de kakimasu.', 'I write with a pencil.'),
    ('ペン', 'ペンを貸してください。', 'Pen o kashite kudasai.', 'Please lend me a pen.'),
    ('ノート', 'ノートに書きます。', 'Nooto ni kakimasu.', 'I write in a notebook.'),
    ('かみ', '紙が必要です。', 'Kami ga hitsuyou desu.', 'I need paper.'),
    ('かさ', '傘を持っています。', 'Kasa o motte imasu.', 'I have an umbrella.'),
    ('かばん', 'かばんの中に本があります。', 'Kaban no naka ni hon ga arimasu.', 'There is a book in the bag.'),
    ('かぎ', '鍵を忘れました。', 'Kagi o wasuremashita.', 'I forgot the key.'),
    ('さいふ', '財布を落としました。', 'Saifu o otoshimashita.', 'I dropped my wallet.'),
    ('とけい', '時計を見ます。', 'Tokei o mimasu.', 'I look at the clock.'),
    ('くつ', '新しい靴を買います。', 'Atarashii kutsu o kaimasu.', 'I buy new shoes.'),
    ('ふく', '服を着ます。', 'Fuku o kimasu.', 'I put on clothes.'),
    ('ぼうし', '帽子をかぶります。', 'Boushi o kaburimasu.', 'I wear a hat.'),
    ('メガネ', 'メガネをかけます。', 'Megane o kakemasu.', 'I wear glasses.'),
    ('タオル', 'タオルで手を拭きます。', 'Taoru de te o fukimasu.', 'I wipe my hands with a towel.'),
    ('でんわ', '電話をかけます。', 'Denwa o kakemasu.', 'I make a phone call.'),
    ('てがみ', '手紙を書きます。', 'Tegami o kakimasu.', 'I write a letter.'),
    ('しゃしん', '写真を撮ります。', 'Shashin o torimasu.', 'I take a photo.'),
    ('かね', 'お金がありません。', 'Okane ga arimasen.', 'I have no money.'),
    ('はさみ', 'はさみで切ります。', 'Hasami de kirimasu.', 'I cut with scissors.'),
    ('テーブル', 'テーブルの上に本があります。', 'Teeburu no ue ni hon ga arimasu.', 'There is a book on the table.'),
    ('いす', '椅子に座ります。', 'Isu ni suwarimasu.', 'I sit on a chair.'),
    ('ドア', 'ドアを開けます。', 'Doa o akemasu.', 'I open the door.'),
    ('まど', '窓を閉めます。', 'Mado o shimemasu.', 'I close the window.'),
    ('ベッド', 'ベッドで寝ます。', 'Beddo de nemasu.', 'I sleep in bed.'),
    ('としょかん', '図書館で勉強します。', 'Toshokan de benkyou shimasu.', 'I study at the library.'),
    ('びょういん', '病院へ行きます。', 'Byouin e ikimasu.', 'I go to the hospital.'),
    ('ぎんこう', '銀行でお金を下ろします。', 'Ginkou de okane o oroshimasu.', 'I withdraw money at the bank.'),
    ('ゆうびんきょく', '郵便局で手紙を出します。', 'Yuubinkyoku de tegami o dashimasu.', 'I mail a letter at the post office.'),
    ('こうえん', '公園で遊びます。', 'Kouen de asobimasu.', 'I play in the park.'),
    ('レストラン', 'レストランで食べます。', 'Resutoran de tabemasu.', 'I eat at a restaurant.'),
    ('スーパー', 'スーパーで買い物します。', 'Suupaa de kaimono shimasu.', 'I shop at the supermarket.'),
    ('コンビニ', 'コンビニは便利です。', 'Konbini wa benri desu.', 'The convenience store is handy.'),
    ('ホテル', 'ホテルに泊まります。', 'Hoteru ni tomarimasu.', 'I stay at a hotel.'),
    ('トイレ', 'トイレはあそこです。', 'Toire wa asoko desu.', 'The restroom is over there.'),
    ('うち', 'うちに帰ります。', 'Uchi ni kaerimasu.', 'I return home.'),
    ('へや', '部屋を掃除します。', 'Heya o souji shimasu.', 'I clean the room.'),
    ('おてあらい', 'お手洗いはどこですか。', 'Otearai wa doko desu ka.', 'Where is the restroom?'),
    ('にわ', '庭に花があります。', 'Niwa ni hana ga arimasu.', 'There are flowers in the garden.'),
    ('エレベーター', 'エレベーターで上がります。', 'Erebeetaa de agarimasu.', 'I go up by elevator.'),
    ('まち', 'この町は静かです。', 'Kono machi wa shizuka desu.', 'This town is quiet.'),
    ('し', '市の中心へ行きます。', 'Shi no chuushin e ikimasu.', 'I go to the city center.'),
    ('けいさつ', '警察を呼びます。', 'Keisatsu o yobimasu.', 'I call the police.'),
    ('うりば', '本の売り場はどこですか。', 'Hon no uriba wa doko desu ka.', 'Where is the book section?'),
    ('かいだん', '階段を上ります。', 'Kaidan o noborimasu.', 'I go up the stairs.')
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
  select region_id, 'Adjectives', 'Common adjectives for everyday description.', 22, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Adjectives'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Adjectives' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Feelings & Qualities I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Feelings & Qualities I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Feelings & Qualities I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['やすい', 'たのしい', 'つまらない', 'むずかしい', 'やさしい'];
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
    select unit_id, 'vocabulary', 'Feelings & Qualities II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Feelings & Qualities II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Feelings & Qualities II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['きれい', 'きたない', 'いそがしい', 'げんき', 'だいじょうぶ'];
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
    select unit_id, 'vocabulary', 'Likes & Interests', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Likes & Interests'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Likes & Interests' limit 1;

    if lesson_id is not null then
      word_kana_list := array['すき', 'きらい', 'だいすき', 'こわい', 'おもしろい'];
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
    select unit_id, 'vocabulary', 'Speed & Taste', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Speed & Taste'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Speed & Taste' limit 1;

    if lesson_id is not null then
      word_kana_list := array['はやい', 'おそい', 'ちかい', 'とおい', 'おいしい'];
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
    select unit_id, 'vocabulary', 'Appearance & Ease', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Appearance & Ease'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Appearance & Ease' limit 1;

    if lesson_id is not null then
      word_kana_list := array['かわいい', 'かっこいい', 'たいへん', 'べんり', 'ひま'];
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
  select region_id, 'Question Words', 'Essential question words for N5 conversation.', 23, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Question Words'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Question Words' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Basic Questions', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Basic Questions'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Basic Questions' limit 1;

    if lesson_id is not null then
      word_kana_list := array['なに', 'だれ', 'どこ', 'いつ', 'どう'];
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
    select unit_id, 'vocabulary', 'Why & Which', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Why & Which'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Why & Which' limit 1;

    if lesson_id is not null then
      word_kana_list := array['なぜ', 'どうして', 'なんで', 'どれ', 'どの'];
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
    select unit_id, 'vocabulary', 'How Much & How Many', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'How Much & How Many'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'How Much & How Many' limit 1;

    if lesson_id is not null then
      word_kana_list := array['いくら', 'いくつ', 'どのくらい', 'どちら', 'どんな'];
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
    select unit_id, 'vocabulary', 'Time & People Questions', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Time & People Questions'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Time & People Questions' limit 1;

    if lesson_id is not null then
      word_kana_list := array['なんじ', 'なんにん', 'なんさい', 'なんようび', 'なにか'];
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
  select region_id, 'Daily Objects', 'Things you use at home, school, and work.', 24, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Daily Objects'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Daily Objects' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Study & Writing', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Study & Writing'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Study & Writing' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ほん', 'えんぴつ', 'ペン', 'ノート', 'かみ'];
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
    select unit_id, 'vocabulary', 'Personal Items', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Personal Items'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Personal Items' limit 1;

    if lesson_id is not null then
      word_kana_list := array['かさ', 'かばん', 'かぎ', 'さいふ', 'とけい'];
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
    select unit_id, 'vocabulary', 'Clothing & Accessories', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Clothing & Accessories'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Clothing & Accessories' limit 1;

    if lesson_id is not null then
      word_kana_list := array['くつ', 'ふく', 'ぼうし', 'メガネ', 'タオル'];
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
    select unit_id, 'vocabulary', 'Communication', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Communication'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Communication' limit 1;

    if lesson_id is not null then
      word_kana_list := array['でんわ', 'てがみ', 'しゃしん', 'かね', 'はさみ'];
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
    select unit_id, 'vocabulary', 'Furniture & Rooms', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Furniture & Rooms'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Furniture & Rooms' limit 1;

    if lesson_id is not null then
      word_kana_list := array['テーブル', 'いす', 'ドア', 'まど', 'ベッド'];
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
  select region_id, 'More Places', 'Additional locations around town.', 25, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'More Places'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'More Places' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Public Services', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Public Services'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Public Services' limit 1;

    if lesson_id is not null then
      word_kana_list := array['としょかん', 'びょういん', 'ぎんこう', 'ゆうびんきょく', 'こうえん'];
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
    select unit_id, 'vocabulary', 'Shops & Dining', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Shops & Dining'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Shops & Dining' limit 1;

    if lesson_id is not null then
      word_kana_list := array['レストラン', 'スーパー', 'コンビニ', 'ホテル', 'トイレ'];
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
    select unit_id, 'vocabulary', 'Home & Rooms', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Home & Rooms'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Home & Rooms' limit 1;

    if lesson_id is not null then
      word_kana_list := array['うち', 'へや', 'おてあらい', 'にわ', 'エレベーター'];
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
    select unit_id, 'vocabulary', 'Town & City', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Town & City'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Town & City' limit 1;

    if lesson_id is not null then
      word_kana_list := array['まち', 'し', 'けいさつ', 'うりば', 'かいだん'];
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
  select region_id, 'N5 Vocabulary Practice: Wave 2 Unit', 'Mixed recall across wave 2 N5 vocabulary.', 26, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Practice: Wave 2 Unit'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Practice: Wave 2 Unit' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', 'N5 Vocabulary Practice: Wave 2', 'Mixed recall across wave 2 N5 vocabulary.', 2, 20, 8, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'N5 Vocabulary Practice: Wave 2'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'N5 Vocabulary Practice: Wave 2' limit 1;

    if lesson_id is not null then
      word_kana_list := array['やすい', 'きれい', 'すき', 'はやい', 'かわいい', 'なに', 'なぜ', 'いくら', 'なんじ', 'ほん', 'かさ', 'くつ', 'でんわ', 'テーブル', 'としょかん', 'レストラン', 'うち', 'まち'];
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
