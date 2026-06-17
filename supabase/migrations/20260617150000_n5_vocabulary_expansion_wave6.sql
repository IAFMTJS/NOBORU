-- N5 vocabulary expansion wave 6

insert into public.vocabulary (kana, kanji, meaning, part_of_speech, jlpt_level, status)
select v.kana, v.kanji, v.meaning, v.part_of_speech, v.jlpt_level, v.status
from (
  values
    ('かようび', '火曜日', 'Tuesday', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('すいようび', '水曜日', 'Wednesday', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('もくようび', '木曜日', 'Thursday', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きんようび', '金曜日', 'Friday', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('どようび', '土曜日', 'Saturday', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('にちようび', '日曜日', 'Sunday', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いちがつ', '一月', 'January', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('にがつ', '二月', 'February', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さんがつ', '三月', 'March', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しがつ', '四月', 'April', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ごがつ', '五月', 'May', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ろくがつ', '六月', 'June', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しちがつ', '七月', 'July', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はちがつ', '八月', 'August', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くがつ', '九月', 'September', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じゅうがつ', '十月', 'October', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じゅういちがつ', '十一月', 'November', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じゅうにがつ', '十二月', 'December', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なまえ', '名前', 'name', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じゅうしょ', '住所', 'address', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('でんわばんごう', '電話番号', 'phone number', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とし', '年', 'year, age', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さい', '歳', 'years old', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たんじょうび', '誕生日', 'birthday', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('けっこん', '結婚', 'marriage', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おとな', '大人', 'adult', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('わかもの', '若者', 'young person', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かべ', '壁', 'wall', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ゆか', '床', 'floor', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('やね', '屋根', 'roof', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かい', '階', 'floor (level)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おくじょう', '屋上', 'rooftop', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('げんかん', '玄関', 'entrance', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふろば', '風呂場', 'bathroom', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('せんめんじょ', '洗面所', 'washroom', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しょうめい', '照明', 'lighting', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くうこう', '空港', 'airport', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しゅっぱつ', '出発', 'departure', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とうちゃく', '到着', 'arrival', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('のりかえ', '乗り換え', 'transfer', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ざせき', '座席', 'seat', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きっぷうりば', '切符売り場', 'ticket counter', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ホーム', null, 'platform', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かいさつ', '改札', 'ticket gate', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('りょこうかばん', '旅行かばん', 'suitcase', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('パスポート', null, 'passport', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かた', '肩', 'shoulder', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くび', '首', 'neck', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('むね', '胸', 'chest', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おなか', 'お腹', 'stomach', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('せなか', '背中', 'back (body)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひざ', '膝', 'knee', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('けが', '怪我', 'injury', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ちゅうしゃ', '注射', 'injection', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('けんこう', '健康', 'health', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いみ', '意味', 'meaning', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ことば', '言葉', 'word, language', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かいわ', '会話', 'conversation', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぶん', '文', 'sentence', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぶんしょう', '文章', 'text, passage', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひらがな', 'ひらがな', 'hiragana', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('カタカナ', 'カタカナ', 'katakana', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はつおん', '発音', 'pronunciation', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふくしゅう', '復習', 'review', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('よしゅう', '予習', 'preparation (study)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しつもん', '質問', 'question', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('こたえ', '答え', 'answer', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('もんだい', '問題', 'problem, question', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ごうかく', '合格', 'passing (exam)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふごうかく', '不合格', 'failing (exam)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('てん', '点', 'point, score', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ばんごう', '番号', 'number', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はじめる', '始める', 'to begin', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おわる', '終わる', 'to end', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('つづける', '続ける', 'to continue', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とめる', '止める', 'to stop', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なる', 'なる', 'to become', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しぬ', '死ぬ', 'to die', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いきる', '生きる', 'to live', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うまれる', '生まれる', 'to be born', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きる', '着る', 'to wear (upper body)', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぬぐ', '脱ぐ', 'to take off (clothes)', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かぶる', '被る', 'to wear (on head)', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はく', '履く', 'to wear (lower body, shoes)', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みがく', '磨く', 'to polish, brush', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かたづける', '片付ける', 'to tidy up', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ならべる', '並べる', 'to line up, arrange', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あつまる', '集まる', 'to gather', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('むかえる', '迎える', 'to welcome, pick up', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おくる', '送る', 'to send', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひく', '引く', 'to pull', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おす', '押す', 'to push', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おとす', '落とす', 'to drop', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひろう', '拾う', 'to pick up', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('わたす', '渡す', 'to hand over', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かす', '貸す', 'to lend', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かりる', '借りる', 'to borrow', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かえす', '返す', 'to return (item)', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('つかれる', '疲れる', 'to get tired', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('こわれる', '壊れる', 'to break', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぬれる', '濡れる', 'to get wet', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しずか', '静か', 'quiet', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('にぎやか', '賑やか', 'lively, bustling', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ゆうめい', '有名', 'famous', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じょうず', '上手', 'skillful', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('へた', '下手', 'unskillful', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おなじ', '同じ', 'same', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ちがう', '違う', 'different, wrong', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('へん', '変', 'strange', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('めずらしい', '珍しい', 'rare', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ただしい', '正しい', 'correct', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まちがった', '間違った', 'wrong (answer)', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふくざつ', '複雑', 'complicated', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かんたん', '簡単', 'simple, easy', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とくべつ', '特別', 'special', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふつう', '普通', 'normal, ordinary', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いろいろ', '色々', 'various', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ほんとう', '本当', 'truth, really', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status)
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
    ('かようび', '火曜日は忙しいです。', '火曜日 wa isogashii desu.', 'Tuesday is busy.'),
    ('すいようび', '水曜日は忙しいです。', '水曜日 wa isogashii desu.', 'Wednesday is busy.'),
    ('もくようび', '木曜日は忙しいです。', '木曜日 wa isogashii desu.', 'Thursday is busy.'),
    ('きんようび', '金曜日は忙しいです。', '金曜日 wa isogashii desu.', 'Friday is busy.'),
    ('どようび', '土曜日は忙しいです。', '土曜日 wa isogashii desu.', 'Saturday is busy.'),
    ('にちようび', '日曜日は忙しいです。', '日曜日 wa isogashii desu.', 'Sunday is busy.'),
    ('いちがつ', '一月に旅行します。', '一月 ni ryokou shimasu.', 'I travel in January.'),
    ('にがつ', '二月に旅行します。', '二月 ni ryokou shimasu.', 'I travel in February.'),
    ('さんがつ', '三月に旅行します。', '三月 ni ryokou shimasu.', 'I travel in March.'),
    ('しがつ', '四月に旅行します。', '四月 ni ryokou shimasu.', 'I travel in April.'),
    ('ごがつ', '五月に旅行します。', '五月 ni ryokou shimasu.', 'I travel in May.'),
    ('ろくがつ', '六月に旅行します。', '六月 ni ryokou shimasu.', 'I travel in June.'),
    ('しちがつ', '七月に旅行します。', '七月 ni ryokou shimasu.', 'I travel in July.'),
    ('はちがつ', '八月に旅行します。', '八月 ni ryokou shimasu.', 'I travel in August.'),
    ('くがつ', '九月に旅行します。', '九月 ni ryokou shimasu.', 'I travel in September.'),
    ('じゅうがつ', '十月に旅行します。', '十月 ni ryokou shimasu.', 'I travel in October.'),
    ('じゅういちがつ', '十一月に旅行します。', '十一月 ni ryokou shimasu.', 'I travel in November.'),
    ('じゅうにがつ', '十二月に旅行します。', '十二月 ni ryokou shimasu.', 'I travel in December.'),
    ('なまえ', '名前は何ですか。', 'Namae wa nan desu ka.', 'What is your name?'),
    ('じゅうしょ', '住所を教えてください。', 'Juusho o oshiete kudasai.', 'Please tell me your address.'),
    ('でんわばんごう', '電話番号を教えてください。', 'Denwa bangou o oshiete kudasai.', 'Please tell me your phone number.'),
    ('とし', '今年は二十歳です。', 'Kotoshi wa hatachi desu.', 'I am twenty this year.'),
    ('さい', '私は二十歳です。', 'Watashi wa hatachi desu.', 'I am twenty years old.'),
    ('たんじょうび', '誕生日はいつですか。', 'Tanjoubi wa itsu desu ka.', 'When is your birthday?'),
    ('けっこん', '結婚しました。', 'Kekkon shimashita.', 'I got married.'),
    ('おとな', '大人は五百円です。', 'Otona wa gohyaku en desu.', 'Adults are five hundred yen.'),
    ('わかもの', '若者が多いです。', 'Wakamono ga ooi desu.', 'There are many young people.'),
    ('かべ', '壁は白いです。', 'Kabe wa shiroi desu.', 'The wall is white.'),
    ('ゆか', '床を掃除します。', 'Yuka o souji shimasu.', 'I clean the floor.'),
    ('やね', '屋根が高いです。', 'Yane ga takai desu.', 'The roof is high.'),
    ('かい', '三階にあります。', 'Sankai ni arimasu.', 'It is on the third floor.'),
    ('おくじょう', '屋上へ行きます。', 'Okujou e ikimasu.', 'I go to the rooftop.'),
    ('げんかん', '玄関で靴を脱ぎます。', 'Genkan de kutsu o nugimasu.', 'I take off shoes at the entrance.'),
    ('ふろば', '風呂場を掃除します。', 'Furoba o souji shimasu.', 'I clean the bathroom.'),
    ('せんめんじょ', '洗面所で歯を磨きます。', 'Senmenjo de ha o migakimasu.', 'I brush my teeth in the washroom.'),
    ('しょうめい', '照明をつけます。', 'Shoumei o tsukemasu.', 'I turn on the lighting.'),
    ('くうこう', '空港へ行きます。', 'Kuukou e ikimasu.', 'I go to the airport.'),
    ('しゅっぱつ', '出発は九時です。', 'Shuppatsu wa kuji desu.', 'Departure is at nine.'),
    ('とうちゃく', '到着は午後です。', 'Touchaku wa gogo desu.', 'Arrival is in the afternoon.'),
    ('のりかえ', '駅で乗り換えます。', 'Eki de norikaemasu.', 'I transfer at the station.'),
    ('ざせき', '座席を予約します。', 'Zaseki o yoyaku shimasu.', 'I reserve a seat.'),
    ('きっぷうりば', '切符売り場はどこですか。', 'Kippu uriba wa doko desu ka.', 'Where is the ticket counter?'),
    ('ホーム', 'ホームで待ちます。', 'Hoomu de machimasu.', 'I wait on the platform.'),
    ('かいさつ', '改札を通ります。', 'Kaisatsu o toorimasu.', 'I pass through the ticket gate.'),
    ('りょこうかばん', '旅行かばんを持ちます。', 'Ryokou kaban o mochimasu.', 'I carry a suitcase.'),
    ('パスポート', 'パスポートを見せます。', 'Pasupooto o misemasu.', 'I show my passport.'),
    ('かた', '肩が痛いです。', 'Kata ga itai desu.', 'My shoulder hurts.'),
    ('くび', '首が回りません。', 'Kubi ga mawarimasen.', 'My neck won''t turn.'),
    ('むね', '胸が痛いです。', 'Mune ga itai desu.', 'My chest hurts.'),
    ('おなか', 'お腹が空きました。', 'Onaka ga sukimashita.', 'I am hungry.'),
    ('せなか', '背中が痛いです。', 'Senaka ga itai desu.', 'My back hurts.'),
    ('ひざ', '膝を曲げます。', 'Hiza o magemasu.', 'I bend my knee.'),
    ('けが', '怪我をしました。', 'Kega o shimashita.', 'I was injured.'),
    ('ちゅうしゃ', '注射は痛いです。', 'Chuusha wa itai desu.', 'The injection hurts.'),
    ('けんこう', '健康が大事です。', 'Kenkou ga daiji desu.', 'Health is important.'),
    ('いみ', '意味が分かりません。', 'Imi ga wakarimasen.', 'I do not understand the meaning.'),
    ('ことば', '新しい言葉を覚えます。', 'Atarashii kotoba o oboemasu.', 'I memorize new words.'),
    ('かいわ', '会話を練習します。', 'Kaiwa o renshuu shimasu.', 'I practice conversation.'),
    ('ぶん', '文を作ります。', 'Bun o tsukurimasu.', 'I make a sentence.'),
    ('ぶんしょう', '文章を読みます。', 'Bunshou o yomimasu.', 'I read a passage.'),
    ('ひらがな', 'ひらがなを書きます。', 'Hiragana o kakimasu.', 'I write hiragana.'),
    ('カタカナ', 'カタカナを練習します。', 'Katakana o renshuu shimasu.', 'I practice katakana.'),
    ('はつおん', '発音が難しいです。', 'Hatsuon ga muzukashii desu.', 'Pronunciation is difficult.'),
    ('ふくしゅう', '復習をします。', 'Fukushuu o shimasu.', 'I do review.'),
    ('よしゅう', '予習をします。', 'Yoshuu o shimasu.', 'I prepare for class.'),
    ('しつもん', '質問があります。', 'Shitsumon ga arimasu.', 'I have a question.'),
    ('こたえ', '答えを書きます。', 'Kotae o kakimasu.', 'I write the answer.'),
    ('もんだい', '問題を解きます。', 'Mondai o tokimasu.', 'I solve the problem.'),
    ('ごうかく', '合格しました。', 'Goukaku shimashita.', 'I passed.'),
    ('ふごうかく', '不合格でした。', 'Fugoukaku deshita.', 'I failed.'),
    ('てん', '百点を取りました。', 'Hyakuten o torimashita.', 'I got a hundred points.'),
    ('ばんごう', '番号を教えてください。', 'Bangou o oshiete kudasai.', 'Please tell me the number.'),
    ('はじめる', '勉強を始めます。', 'Benkyou o hajimemasu.', 'I begin studying.'),
    ('おわる', '授業が終わります。', 'Jugyou ga owarimasu.', 'Class ends.'),
    ('つづける', '練習を続けます。', 'Renshuu o tsuzukemasu.', 'I continue practicing.'),
    ('とめる', '車を止めます。', 'Kuruma o tomemasu.', 'I stop the car.'),
    ('なる', '先生になります。', 'Sensei ni narimasu.', 'I become a teacher.'),
    ('しぬ', '魚が死にました。', 'Sakana ga shinimashita.', 'The fish died.'),
    ('いきる', '日本で生きます。', 'Nihon de ikimasu.', 'I live in Japan.'),
    ('うまれる', '日本で生まれました。', 'Nihon de umaremashita.', 'I was born in Japan.'),
    ('きる', 'シャツを着ます。', 'Shatsu o kimasu.', 'I wear a shirt.'),
    ('ぬぐ', '靴を脱ぎます。', 'Kutsu o nugimasu.', 'I take off my shoes.'),
    ('かぶる', '帽子を被ります。', 'Boushi o kaburimasu.', 'I wear a hat.'),
    ('はく', 'ズボンを履きます。', 'Zubon o hakimasu.', 'I put on pants.'),
    ('みがく', '歯を磨きます。', 'Ha o migakimasu.', 'I brush my teeth.'),
    ('かたづける', '部屋を片付けます。', 'Heya o katazukemasu.', 'I tidy the room.'),
    ('ならべる', '本を並べます。', 'Hon o narabemasu.', 'I line up the books.'),
    ('あつまる', '友達が集まります。', 'Tomodachi ga atsumarimasu.', 'Friends gather.'),
    ('むかえる', '駅で迎えます。', 'Eki de mukaemasu.', 'I pick someone up at the station.'),
    ('おくる', '手紙を送ります。', 'Tegami o okurimasu.', 'I send a letter.'),
    ('ひく', 'ドアを引きます。', 'Doa o hikimasu.', 'I pull the door.'),
    ('おす', 'ボタンを押します。', 'Botan o oshimasu.', 'I push the button.'),
    ('おとす', '財布を落としました。', 'Saifu o otoshimashita.', 'I dropped my wallet.'),
    ('ひろう', '落ちた物を拾います。', 'Ochita mono o hiromasu.', 'I pick up the dropped item.'),
    ('わたす', '本を渡します。', 'Hon o watashimasu.', 'I hand over the book.'),
    ('かす', '本を貸します。', 'Hon o kashimasu.', 'I lend a book.'),
    ('かりる', '本を借ります。', 'Hon o karimasu.', 'I borrow a book.'),
    ('かえす', '本を返します。', 'Hon o kaeshimasu.', 'I return the book.'),
    ('つかれる', '疲れました。', 'Tsukaremashita.', 'I got tired.'),
    ('こわれる', '時計が壊れました。', 'Tokei ga kowaremashita.', 'The watch broke.'),
    ('ぬれる', '雨で濡れました。', 'Ame de nuremashita.', 'I got wet in the rain.'),
    ('しずか', '図書館は静かです。', 'Toshokan wa shizuka desu.', 'The library is quiet.'),
    ('にぎやか', '町は賑やかです。', 'Machi wa nigiyaka desu.', 'The town is lively.'),
    ('ゆうめい', '有名な店です。', 'Yuumei na mise desu.', 'It is a famous shop.'),
    ('じょうず', '料理が上手です。', 'Ryouri ga jouzu desu.', 'Good at cooking.'),
    ('へた', '歌が下手です。', 'Uta ga heta desu.', 'Bad at singing.'),
    ('おなじ', '同じ本です。', 'Onaji hon desu.', 'It is the same book.'),
    ('ちがう', '答えが違います。', 'Kotae ga chigaimasu.', 'The answer is wrong.'),
    ('へん', '変な音です。', 'Hen na oto desu.', 'It is a strange sound.'),
    ('めずらしい', '珍しい果物です。', 'Mezurashii kudamono desu.', 'It is a rare fruit.'),
    ('ただしい', '正しい答えです。', 'Tadashii kotae desu.', 'It is the correct answer.'),
    ('まちがった', '間違った答えです。', 'Machigatta kotae desu.', 'It is a wrong answer.'),
    ('ふくざつ', '問題は複雑です。', 'Mondai wa fukuzatsu desu.', 'The problem is complicated.'),
    ('かんたん', 'この問題は簡単です。', 'Kono mondai wa kantan desu.', 'This problem is simple.'),
    ('とくべつ', '特別な日です。', 'Tokubetsu na hi desu.', 'It is a special day.'),
    ('ふつう', '普通の日です。', 'Futsuu no hi desu.', 'It is an ordinary day.'),
    ('いろいろ', '色々な本があります。', 'Iroiro na hon ga arimasu.', 'There are various books.'),
    ('ほんとう', '本当ですか。', 'Hontou desu ka.', 'Is it true?')
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
  select region_id, 'N5 Vocabulary Wave 6 — Set 1', 'JLPT N5 vocabulary wave 6 toward full N5 word coverage.', 50, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Wave 6 — Set 1'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Wave 6 — Set 1' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Set 1 1', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 1 1'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 1 1' limit 1;

    if lesson_id is not null then
      word_kana_list := array['かようび', 'すいようび', 'もくようび', 'きんようび', 'どようび'];
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
      word_kana_list := array['にちようび', 'いちがつ', 'にがつ', 'さんがつ', 'しがつ'];
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
      word_kana_list := array['ごがつ', 'ろくがつ', 'しちがつ', 'はちがつ', 'くがつ'];
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
      word_kana_list := array['じゅうがつ', 'じゅういちがつ', 'じゅうにがつ', 'なまえ', 'じゅうしょ'];
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
      word_kana_list := array['でんわばんごう', 'とし', 'さい', 'たんじょうび', 'けっこん'];
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
      word_kana_list := array['おとな', 'わかもの', 'かべ', 'ゆか'];
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
  select region_id, 'N5 Vocabulary Wave 6 — Set 2', 'JLPT N5 vocabulary wave 6 toward full N5 word coverage.', 51, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Wave 6 — Set 2'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Wave 6 — Set 2' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Set 2 1', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 2 1'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 2 1' limit 1;

    if lesson_id is not null then
      word_kana_list := array['やね', 'かい', 'おくじょう', 'げんかん', 'ふろば'];
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
      word_kana_list := array['せんめんじょ', 'しょうめい', 'くうこう', 'しゅっぱつ', 'とうちゃく'];
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
      word_kana_list := array['のりかえ', 'ざせき', 'きっぷうりば', 'ホーム', 'かいさつ'];
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
      word_kana_list := array['りょこうかばん', 'パスポート', 'かた', 'くび', 'むね'];
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
      word_kana_list := array['おなか', 'せなか', 'ひざ', 'けが', 'ちゅうしゃ'];
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
      word_kana_list := array['けんこう', 'いみ', 'ことば', 'かいわ'];
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
  select region_id, 'N5 Vocabulary Wave 6 — Set 3', 'JLPT N5 vocabulary wave 6 toward full N5 word coverage.', 52, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Wave 6 — Set 3'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Wave 6 — Set 3' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Set 3 1', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 3 1'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 3 1' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ぶん', 'ぶんしょう', 'ひらがな', 'カタカナ', 'はつおん'];
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
      word_kana_list := array['ふくしゅう', 'よしゅう', 'しつもん', 'こたえ', 'もんだい'];
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
      word_kana_list := array['ごうかく', 'ふごうかく', 'てん', 'ばんごう', 'はじめる'];
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
      word_kana_list := array['おわる', 'つづける', 'とめる', 'なる', 'しぬ'];
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
      word_kana_list := array['いきる', 'うまれる', 'きる', 'ぬぐ', 'かぶる'];
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
      word_kana_list := array['はく', 'みがく', 'かたづける', 'ならべる'];
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
  select region_id, 'N5 Vocabulary Wave 6 — Set 4', 'JLPT N5 vocabulary wave 6 toward full N5 word coverage.', 53, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Wave 6 — Set 4'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Wave 6 — Set 4' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Set 4 1', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 4 1'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 4 1' limit 1;

    if lesson_id is not null then
      word_kana_list := array['あつまる', 'むかえる', 'おくる', 'ひく', 'おす'];
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
      word_kana_list := array['おとす', 'ひろう', 'わたす', 'かす', 'かりる'];
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
      word_kana_list := array['かえす', 'つかれる', 'こわれる', 'ぬれる', 'しずか'];
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
      word_kana_list := array['にぎやか', 'ゆうめい', 'じょうず', 'へた', 'おなじ'];
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
      word_kana_list := array['ちがう', 'へん', 'めずらしい', 'ただしい', 'まちがった'];
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
      word_kana_list := array['ふくざつ', 'かんたん', 'とくべつ', 'ふつう'];
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
  select region_id, 'N5 Vocabulary Wave 6 — Set 5', 'JLPT N5 vocabulary wave 6 toward full N5 word coverage.', 54, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Wave 6 — Set 5'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Wave 6 — Set 5' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Set 5', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 5'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 5' limit 1;

    if lesson_id is not null then
      word_kana_list := array['いろいろ', 'ほんとう'];
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
  select region_id, 'N5 Vocabulary Practice: Wave 6 Unit', 'Mixed recall quiz across wave 6 N5 vocabulary.', 55, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Practice: Wave 6 Unit'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Practice: Wave 6 Unit' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', 'N5 Vocabulary Practice: Wave 6', 'Mixed recall quiz across wave 6 N5 vocabulary.', 2, 20, 8, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'N5 Vocabulary Practice: Wave 6'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'N5 Vocabulary Practice: Wave 6' limit 1;

    if lesson_id is not null then
      word_kana_list := array['かようび', 'にちようび', 'ごがつ', 'じゅうがつ', 'でんわばんごう', 'おとな', 'やね', 'せんめんじょ', 'のりかえ', 'りょこうかばん', 'おなか', 'けんこう', 'ぶん', 'ふくしゅう', 'ごうかく', 'おわる', 'いきる', 'はく', 'あつまる', 'おとす', 'かえす', 'にぎやか', 'ちがう', 'ふくざつ', 'いろいろ'];
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
