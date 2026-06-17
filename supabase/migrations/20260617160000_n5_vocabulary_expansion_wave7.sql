-- N5 vocabulary expansion wave 7

insert into public.vocabulary (kana, kanji, meaning, part_of_speech, jlpt_level, status)
select v.kana, v.kanji, v.meaning, v.part_of_speech, v.jlpt_level, v.status
from (
  values
    ('うそ', '嘘', 'lie', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あんぜん', '安全', 'safe', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きけん', '危険', 'dangerous', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('だれの', '誰の', 'whose', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('すし', '寿司', 'sushi', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さしみ', '刺身', 'sashimi', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('てんぷら', '天ぷら', 'tempura', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うどん', 'うどん', 'udon noodles', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('そば', 'そば', 'soba noodles', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('べんとう', '弁当', 'boxed lunch', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みそしる', '味噌汁', 'miso soup', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とうふ', '豆腐', 'tofu', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さとう', '砂糖', 'sugar', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しお', '塩', 'salt', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しょうゆ', '醤油', 'soy sauce', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おかし', 'お菓子', 'sweets, snacks', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('メニュー', null, 'menu', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ちゅうもん', '注文', 'order', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('パソコン', null, 'computer', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('カメラ', null, 'camera', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('チーズ', null, 'cheese', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('バター', null, 'butter', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ビール', null, 'beer', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('タバコ', null, 'tobacco, cigarettes', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('エアコン', null, 'air conditioner', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('エスカレーター', null, 'escalator', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('インターネット', null, 'internet', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('クレジットカード', null, 'credit card', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('コピー', null, 'copy', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ボールペン', null, 'ballpoint pen', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('のり', '糊', 'glue', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('けしゴム', '消しゴム', 'eraser', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じょうぎ', '定規', 'ruler', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ハンカチ', null, 'handkerchief', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('やくそく', '約束', 'promise, appointment', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('よてい', '予定', 'plan, schedule', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じゅんび', '準備', 'preparation', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ようじ', '用事', 'errand, business', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('つごう', '都合', 'convenience, circumstances', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('りゆう', '理由', 'reason', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('けっか', '結果', 'result', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('げんいん', '原因', 'cause', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きそく', '規則', 'rule', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぜいきん', '税金', 'tax', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('りょうきん', '料金', 'fee, charge', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('わりびき', '割引', 'discount', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('げんきん', '現金', 'cash', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おつり', 'お釣り', 'change (money)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しょうひぜい', '消費税', 'consumption tax', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さいしょ', '最初', 'first, beginning', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さいご', '最後', 'last, end', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('つぎ', '次', 'next', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あと', '後', 'after, later', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('べつ', '別', 'separate, another', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はじめ', '初め', 'beginning', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おわり', '終わり', 'end', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さいきん', '最近', 'recently', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まい', '枚', 'counter for flat objects', 'counter', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('にん', '人', 'counter for people', 'counter', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ど', '度', 'counter for occurrences', 'counter', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('だい', '台', 'counter for machines', 'counter', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さつ', '冊', 'counter for books', 'counter', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('こ', '個', 'counter for small objects', 'counter', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふくろ', '袋', 'bag, sack', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('びん', '瓶', 'bottle', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くも', '雲', 'cloud', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('にじ', '虹', 'rainbow', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きり', '霧', 'fog', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('つゆ', '梅雨', 'rainy season', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たいふう', '台風', 'typhoon', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じしん', '地震', 'earthquake', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かがく', '科学', 'science', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ちり', '地理', 'geography', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふうとう', '封筒', 'envelope', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きって', '切手', 'postage stamp', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はがき', '葉書', 'postcard', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しょうたい', '招待', 'invitation', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おしらせ', 'お知らせ', 'notice, announcement', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ニュース', null, 'news', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('でんとう', '電灯', 'electric light', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おしえる', '教える', 'to teach', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ならう', '習う', 'to learn', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おもいだす', '思い出す', 'to remember, recall', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かんがえる', '考える', 'to think', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しんぱいする', '心配する', 'to worry', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たのしむ', '楽しむ', 'to enjoy', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('びっくりする', 'びっくりする', 'to be surprised', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うれしがる', '嬉しがる', 'to be glad', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かなしむ', '悲しむ', 'to grieve', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おこる', '怒る', 'to get angry', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('りんご', '林檎', 'apple', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みかん', '蜜柑', 'mandarin orange', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぶどう', '葡萄', 'grape', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いちご', '苺', 'strawberry', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('すいか', '西瓜', 'watermelon', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とうもろこし', '玉蜀黍', 'corn', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じゃがいも', 'じゃが芋', 'potato', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たまねぎ', '玉葱', 'onion', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('にんじん', '人参', 'carrot', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きゅうり', '胡瓜', 'cucumber', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なす', '茄子', 'eggplant', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きのこ', '茸', 'mushroom', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('えび', '海老', 'shrimp', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かに', '蟹', 'crab', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たこ', '蛸', 'octopus', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いか', '烏賊', 'squid', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぶたにく', '豚肉', 'pork', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぎゅうにく', '牛肉', 'beef', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とりにく', '鶏肉', 'chicken meat', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ソーセージ', null, 'sausage', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('てちょう', '手帳', 'planner, notebook', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いろえんぴつ', '色鉛筆', 'colored pencil', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('けいさんき', '計算機', 'calculator', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ちず', '地図', 'map', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひるま', '昼間', 'daytime', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('よなか', '夜中', 'middle of the night', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しょうがっこう', '小学校', 'elementary school', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ちゅうがっこう', '中学校', 'middle school', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status)
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
    ('うそ', '嘘をつきません。', 'Uso o tsukimasen.', 'I do not tell lies.'),
    ('あんぜん', 'ここは安全です。', 'Koko wa anzen desu.', 'It is safe here.'),
    ('きけん', '危険です。', 'Kiken desu.', 'It is dangerous.'),
    ('だれの', 'これは誰の本ですか。', 'Kore wa dare no hon desu ka.', 'Whose book is this?'),
    ('すし', '寿司を食べます。', 'Sushi o tabemasu.', 'I eat sushi.'),
    ('さしみ', '刺身が好きです。', 'Sashimi ga suki desu.', 'I like sashimi.'),
    ('てんぷら', '天ぷらを注文します。', 'Tenpura o chuumon shimasu.', 'I order tempura.'),
    ('うどん', 'うどんを食べます。', 'Udon o tabemasu.', 'I eat udon.'),
    ('そば', 'そばが好きです。', 'Soba ga suki desu.', 'I like soba.'),
    ('べんとう', '弁当を買います。', 'Bentou o kaimasu.', 'I buy a boxed lunch.'),
    ('みそしる', '味噌汁を飲みます。', 'Misoshiru o nomimasu.', 'I drink miso soup.'),
    ('とうふ', '豆腐を食べます。', 'Toufu o tabemasu.', 'I eat tofu.'),
    ('さとう', '砂糖を入れます。', 'Satou o iremasu.', 'I add sugar.'),
    ('しお', '塩を入れます。', 'Shio o iremasu.', 'I add salt.'),
    ('しょうゆ', '醤油をかけます。', 'Shouyu o kakemasu.', 'I pour soy sauce.'),
    ('おかし', 'お菓子を食べます。', 'Okashi o tabemasu.', 'I eat sweets.'),
    ('メニュー', 'メニューをください。', 'Menyuu o kudasai.', 'Menu, please.'),
    ('ちゅうもん', '注文をお願いします。', 'Chuumon o onegaishimasu.', 'I would like to order.'),
    ('パソコン', 'パソコンを使います。', 'Pasokon o tsukaimasu.', 'I use a computer.'),
    ('カメラ', 'カメラを持っています。', 'Kamera o motte imasu.', 'I have a camera.'),
    ('チーズ', 'チーズが好きです。', 'Chiizu ga suki desu.', 'I like cheese.'),
    ('バター', 'バターを塗ります。', 'Bataa o nurimasu.', 'I spread butter.'),
    ('ビール', 'ビールを飲みます。', 'Biiru o nomimasu.', 'I drink beer.'),
    ('タバコ', 'タバコは吸いません。', 'Tabako wa suimasen.', 'I do not smoke.'),
    ('エアコン', 'エアコンをつけます。', 'Eakon o tsukemasu.', 'I turn on the AC.'),
    ('エスカレーター', 'エスカレーターに乗ります。', 'Esukareetaa ni norimasu.', 'I ride the escalator.'),
    ('インターネット', 'インターネットを使います。', 'Intaanetto o tsukaimasu.', 'I use the internet.'),
    ('クレジットカード', 'クレジットカードで払います。', 'Kurejitto kaado de haraimasu.', 'I pay by credit card.'),
    ('コピー', 'コピーを取ります。', 'Kopii o torimasu.', 'I make a copy.'),
    ('ボールペン', 'ボールペンで書きます。', 'Boorupen de kakimasu.', 'I write with a ballpoint pen.'),
    ('のり', '糊で貼ります。', 'Nori de harimasu.', 'I stick it with glue.'),
    ('けしゴム', '消しゴムで消します。', 'Keshigomu de keshimasu.', 'I erase with an eraser.'),
    ('じょうぎ', '定規を使います。', 'Jougi o tsukaimasu.', 'I use a ruler.'),
    ('ハンカチ', 'ハンカチを使います。', 'Hankachi o tsukaimasu.', 'I use a handkerchief.'),
    ('やくそく', '約束があります。', 'Yakusoku ga arimasu.', 'I have an appointment.'),
    ('よてい', '予定を変えます。', 'Yotei o kaemasu.', 'I change the plan.'),
    ('じゅんび', '準備をします。', 'Junbi o shimasu.', 'I prepare.'),
    ('ようじ', '用事があります。', 'Youji ga arimasu.', 'I have an errand.'),
    ('つごう', '都合がいいです。', 'Tsugou ga ii desu.', 'It is convenient.'),
    ('りゆう', '理由を教えてください。', 'Riyuu o oshiete kudasai.', 'Please tell me the reason.'),
    ('けっか', '結果を待ちます。', 'Kekka o machimasu.', 'I wait for the result.'),
    ('げんいん', '原因は何ですか。', 'Genin wa nan desu ka.', 'What is the cause?'),
    ('きそく', '規則を守ります。', 'Kisoku o mamorimasu.', 'I follow the rules.'),
    ('ぜいきん', '税金を払います。', 'Zeikin o haraimasu.', 'I pay taxes.'),
    ('りょうきん', '料金はいくらですか。', 'Ryoukin wa ikura desu ka.', 'How much is the fee?'),
    ('わりびき', '割引があります。', 'Waribiki ga arimasu.', 'There is a discount.'),
    ('げんきん', '現金で払います。', 'Genkin de haraimasu.', 'I pay in cash.'),
    ('おつり', 'お釣りをください。', 'Otsuri o kudasai.', 'Change, please.'),
    ('しょうひぜい', '消費税がかかります。', 'Shouhizei ga kakarimasu.', 'Consumption tax applies.'),
    ('さいしょ', '最初は難しいです。', 'Saisho wa muzukashii desu.', 'At first it is difficult.'),
    ('さいご', '最後まで頑張ります。', 'Saigo made ganbarimasu.', 'I try until the end.'),
    ('つぎ', '次の駅です。', 'Tsugi no eki desu.', 'It is the next station.'),
    ('あと', '後で電話します。', 'Ato de denwa shimasu.', 'I will call later.'),
    ('べつ', '別の店へ行きます。', 'Betsu no mise e ikimasu.', 'I go to another shop.'),
    ('はじめ', '初めまして。', 'Hajimemashite.', 'Nice to meet you.'),
    ('おわり', '終わりです。', 'Owari desu.', 'It is the end.'),
    ('さいきん', '最近忙しいです。', 'Saikin isogashii desu.', 'I have been busy recently.'),
    ('まい', '紙を三枚使います。', 'Kami o sanmai tsukaimasu.', 'I use three sheets.'),
    ('にん', '三人来ました。', 'Sannin kimashita.', 'Three people came.'),
    ('ど', '一度行きました。', 'Ichido ikimashita.', 'I went once.'),
    ('だい', '車が一台あります。', 'Kuruma ga ichidai arimasu.', 'There is one car.'),
    ('さつ', '本を一冊買います。', 'Hon o issatsu kaimasu.', 'I buy one book.'),
    ('こ', 'りんごを三個買います。', 'Ringo o sanko kaimasu.', 'I buy three apples.'),
    ('ふくろ', '袋に入れます。', 'Fukuro ni iremasu.', 'I put it in a bag.'),
    ('びん', '瓶を二つ買います。', 'Bin o futatsu kaimasu.', 'I buy two bottles.'),
    ('くも', '雲が多いです。', 'Kumo ga ooi desu.', 'There are many clouds.'),
    ('にじ', '虹が見えます。', 'Niji ga miemasu.', 'I can see a rainbow.'),
    ('きり', '霧が出ています。', 'Kiri ga dete imasu.', 'There is fog.'),
    ('つゆ', '梅雨の季節です。', 'Tsuyu no kisetsu desu.', 'It is the rainy season.'),
    ('たいふう', '台風が来ます。', 'Taifuu ga kimasu.', 'A typhoon is coming.'),
    ('じしん', '地震がありました。', 'Jishin ga arimashita.', 'There was an earthquake.'),
    ('かがく', '科学が好きです。', 'Kagaku ga suki desu.', 'I like science.'),
    ('ちり', '地理の授業です。', 'Chiri no jugyou desu.', 'It is geography class.'),
    ('ふうとう', '封筒に入れます。', 'Fuutou ni iremasu.', 'I put it in an envelope.'),
    ('きって', '切手を買います。', 'Kitte o kaimasu.', 'I buy stamps.'),
    ('はがき', '葉書を送ります。', 'Hagaki o okurimasu.', 'I send a postcard.'),
    ('しょうたい', '招待状をもらいました。', 'Shoutaijou o moraimashita.', 'I received an invitation.'),
    ('おしらせ', 'お知らせを読みます。', 'Oshirase o yomimasu.', 'I read the notice.'),
    ('ニュース', 'ニュースを見ます。', 'Nyuusu o mimasu.', 'I watch the news.'),
    ('でんとう', '電灯を消します。', 'Dentou o keshimasu.', 'I turn off the light.'),
    ('おしえる', '日本語を教えます。', 'Nihongo o oshiemasu.', 'I teach Japanese.'),
    ('ならう', 'ピアノを習います。', 'Piano o naraimasu.', 'I learn piano.'),
    ('おもいだす', '思い出しました。', 'Omoidashimashita.', 'I remembered.'),
    ('かんがえる', 'よく考えます。', 'Yoku kangaemasu.', 'I think carefully.'),
    ('しんぱいする', '心配しないでください。', 'Shinpai shinaide kudasai.', 'Please do not worry.'),
    ('たのしむ', '旅行を楽しみます。', 'Ryokou o tanoshimimasu.', 'I enjoy the trip.'),
    ('びっくりする', 'びっくりしました。', 'Bikkuri shimashita.', 'I was surprised.'),
    ('うれしがる', '嬉しがっています。', 'Ureshigatte imasu.', 'They are glad.'),
    ('かなしむ', '悲しんでいます。', 'Kanashinde imasu.', 'They are grieving.'),
    ('おこる', '怒らないでください。', 'Okoranaide kudasai.', 'Please do not get angry.'),
    ('りんご', '林檎を食べます。', 'Ringo o tabemasu.', 'I eat an apple.'),
    ('みかん', '蜜柑が好きです。', 'Mikan ga suki desu.', 'I like mandarins.'),
    ('ぶどう', '葡萄を買います。', 'Budou o kaimasu.', 'I buy grapes.'),
    ('いちご', '苺が甘いです。', 'Ichigo ga amai desu.', 'Strawberries are sweet.'),
    ('すいか', '西瓜を食べます。', 'Suika o tabemasu.', 'I eat watermelon.'),
    ('とうもろこし', '玉蜀黍が好きです。', 'Toumorokoshi ga suki desu.', 'I like corn.'),
    ('じゃがいも', 'じゃが芋を買います。', 'Jagaimo o kaimasu.', 'I buy potatoes.'),
    ('たまねぎ', '玉葱を切ります。', 'Tamanegi o kirimasu.', 'I cut the onion.'),
    ('にんじん', '人参を食べます。', 'Ninjin o tabemasu.', 'I eat carrots.'),
    ('きゅうり', '胡瓜を切ります。', 'Kyuuri o kirimasu.', 'I slice cucumber.'),
    ('なす', '茄子を食べます。', 'Nasu o tabemasu.', 'I eat eggplant.'),
    ('きのこ', '茸を料理します。', 'Kinoko o ryouri shimasu.', 'I cook mushrooms.'),
    ('えび', '海老を食べます。', 'Ebi o tabemasu.', 'I eat shrimp.'),
    ('かに', '蟹が好きです。', 'Kani ga suki desu.', 'I like crab.'),
    ('たこ', '蛸を食べます。', 'Tako o tabemasu.', 'I eat octopus.'),
    ('いか', '烏賊を食べます。', 'Ika o tabemasu.', 'I eat squid.'),
    ('ぶたにく', '豚肉を買います。', 'Butaniku o kaimasu.', 'I buy pork.'),
    ('ぎゅうにく', '牛肉を食べます。', 'Gyuuniku o tabemasu.', 'I eat beef.'),
    ('とりにく', '鶏肉を料理します。', 'Toriniku o ryouri shimasu.', 'I cook chicken.'),
    ('ソーセージ', 'ソーセージを食べます。', 'Sooseji o tabemasu.', 'I eat sausage.'),
    ('てちょう', '手帳を持っています。', 'Techou o motte imasu.', 'I have a planner.'),
    ('いろえんぴつ', '色鉛筆で描きます。', 'Iroenpitsu de kakimasu.', 'I draw with colored pencils.'),
    ('けいさんき', '計算機を使います。', 'Keisanki o tsukaimasu.', 'I use a calculator.'),
    ('ちず', '地図を見ます。', 'Chizu o mimasu.', 'I look at the map.'),
    ('ひるま', '昼間は暖かいです。', 'Hiruma wa atatakai desu.', 'It is warm during the day.'),
    ('よなか', '夜中に起きました。', 'Yonaka ni okimashita.', 'I woke up in the middle of the night.'),
    ('しょうがっこう', '小学校へ行きます。', 'Shougakkou e ikimasu.', 'I go to elementary school.'),
    ('ちゅうがっこう', '中学校の前です。', 'Chuugakkou no mae desu.', 'It is in front of middle school.')
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
  select region_id, 'N5 Vocabulary Wave 7 — Set 1', 'JLPT N5 vocabulary wave 7 toward full N5 word coverage.', 56, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Wave 7 — Set 1'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Wave 7 — Set 1' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Set 1 1', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 1 1'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 1 1' limit 1;

    if lesson_id is not null then
      word_kana_list := array['うそ', 'あんぜん', 'きけん', 'だれの', 'すし'];
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
      word_kana_list := array['さしみ', 'てんぷら', 'うどん', 'そば', 'べんとう'];
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
      word_kana_list := array['みそしる', 'とうふ', 'さとう', 'しお', 'しょうゆ'];
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
      word_kana_list := array['おかし', 'メニュー', 'ちゅうもん', 'パソコン', 'カメラ'];
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
      word_kana_list := array['チーズ', 'バター', 'ビール', 'タバコ', 'エアコン'];
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
      word_kana_list := array['エスカレーター', 'インターネット', 'クレジットカード', 'コピー'];
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
  select region_id, 'N5 Vocabulary Wave 7 — Set 2', 'JLPT N5 vocabulary wave 7 toward full N5 word coverage.', 57, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Wave 7 — Set 2'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Wave 7 — Set 2' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Set 2 1', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 2 1'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 2 1' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ボールペン', 'のり', 'けしゴム', 'じょうぎ', 'ハンカチ'];
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
      word_kana_list := array['やくそく', 'よてい', 'じゅんび', 'ようじ', 'つごう'];
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
      word_kana_list := array['りゆう', 'けっか', 'げんいん', 'きそく', 'ぜいきん'];
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
      word_kana_list := array['りょうきん', 'わりびき', 'げんきん', 'おつり', 'しょうひぜい'];
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
      word_kana_list := array['さいしょ', 'さいご', 'つぎ', 'あと', 'べつ'];
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
      word_kana_list := array['はじめ', 'おわり', 'さいきん', 'まい'];
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
  select region_id, 'N5 Vocabulary Wave 7 — Set 3', 'JLPT N5 vocabulary wave 7 toward full N5 word coverage.', 58, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Wave 7 — Set 3'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Wave 7 — Set 3' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Set 3 1', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 3 1'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 3 1' limit 1;

    if lesson_id is not null then
      word_kana_list := array['にん', 'ど', 'だい', 'さつ', 'こ'];
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
      word_kana_list := array['ふくろ', 'びん', 'くも', 'にじ', 'きり'];
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
      word_kana_list := array['つゆ', 'たいふう', 'じしん', 'かがく', 'ちり'];
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
      word_kana_list := array['ふうとう', 'きって', 'はがき', 'しょうたい', 'おしらせ'];
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
      word_kana_list := array['ニュース', 'でんとう', 'おしえる', 'ならう', 'おもいだす'];
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
      word_kana_list := array['かんがえる', 'しんぱいする', 'たのしむ', 'びっくりする'];
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
  select region_id, 'N5 Vocabulary Wave 7 — Set 4', 'JLPT N5 vocabulary wave 7 toward full N5 word coverage.', 59, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Wave 7 — Set 4'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Wave 7 — Set 4' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Set 4 1', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 4 1'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 4 1' limit 1;

    if lesson_id is not null then
      word_kana_list := array['うれしがる', 'かなしむ', 'おこる', 'りんご', 'みかん'];
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
      word_kana_list := array['ぶどう', 'いちご', 'すいか', 'とうもろこし', 'じゃがいも'];
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
      word_kana_list := array['たまねぎ', 'にんじん', 'きゅうり', 'なす', 'きのこ'];
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
      word_kana_list := array['えび', 'かに', 'たこ', 'いか', 'ぶたにく'];
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
      word_kana_list := array['ぎゅうにく', 'とりにく', 'ソーセージ', 'てちょう', 'いろえんぴつ'];
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
      word_kana_list := array['けいさんき', 'ちず', 'ひるま', 'よなか'];
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
  select region_id, 'N5 Vocabulary Wave 7 — Set 5', 'JLPT N5 vocabulary wave 7 toward full N5 word coverage.', 60, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Wave 7 — Set 5'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Wave 7 — Set 5' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Set 5', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Set 5'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Set 5' limit 1;

    if lesson_id is not null then
      word_kana_list := array['しょうがっこう', 'ちゅうがっこう'];
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
  select region_id, 'N5 Vocabulary Practice: Wave 7 Unit', 'Mixed recall quiz across wave 7 N5 vocabulary.', 61, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Practice: Wave 7 Unit'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Practice: Wave 7 Unit' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', 'N5 Vocabulary Practice: Wave 7', 'Mixed recall quiz across wave 7 N5 vocabulary.', 2, 20, 8, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'N5 Vocabulary Practice: Wave 7'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'N5 Vocabulary Practice: Wave 7' limit 1;

    if lesson_id is not null then
      word_kana_list := array['うそ', 'さしみ', 'みそしる', 'おかし', 'チーズ', 'エスカレーター', 'ボールペン', 'やくそく', 'りゆう', 'りょうきん', 'さいしょ', 'はじめ', 'にん', 'ふくろ', 'つゆ', 'ふうとう', 'ニュース', 'かんがえる', 'うれしがる', 'ぶどう', 'たまねぎ', 'えび', 'ぎゅうにく', 'けいさんき', 'しょうがっこう'];
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
