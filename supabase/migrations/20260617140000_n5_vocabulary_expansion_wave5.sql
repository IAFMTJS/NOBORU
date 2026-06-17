-- N5 vocabulary expansion wave 5

insert into public.vocabulary (kana, kanji, meaning, part_of_speech, jlpt_level, status)
select v.kana, v.kanji, v.meaning, v.part_of_speech, v.jlpt_level, v.status
from (
  values
    ('としょかん', '図書館', 'library', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('びじゅつかん', '美術館', 'art museum', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はくぶつかん', '博物館', 'museum', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('こうえん', '公園', 'park', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うみ', '海', 'sea, beach', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('プール', null, 'swimming pool', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('えいがかん', '映画館', 'movie theater', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('スーパー', null, 'supermarket', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('コンビニ', null, 'convenience store', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('デパート', null, 'department store', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たてもの', '建物', 'building', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ビル', null, 'building (multi-story)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('アパート', null, 'apartment', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('マンション', null, 'condominium', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ホテル', null, 'hotel', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぎんこう', '銀行', 'bank', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ゆうびんきょく', '郵便局', 'post office', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('けいじばん', '掲示板', 'bulletin board', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('トイレ', null, 'toilet, restroom', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('だいどころ', '台所', 'kitchen', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いぬ', '犬', 'dog', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ねこ', '猫', 'cat', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とり', '鳥', 'bird', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うし', '牛', 'cow', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うま', '馬', 'horse', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぶた', '豚', 'pig', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひつじ', '羊', 'sheep', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さる', '猿', 'monkey', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はち', '蜂', 'bee', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ちょう', '蝶', 'butterfly', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はな', '花', 'flower', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くさ', '草', 'grass', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('は', '葉', 'leaf', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たね', '種', 'seed', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ばら', '薔薇', 'rose', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かみなり', '雷', 'thunder', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じめん', '地面', 'ground', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いし', '石', 'stone, rock', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('すな', '砂', 'sand', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ほし', '星', 'star', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おおきい', '大きい', 'big', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ちいさい', '小さい', 'small', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ながい', '長い', 'long', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みじかい', '短い', 'short', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふとい', '太い', 'thick, fat', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ほそい', '細い', 'thin, slender', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あたらしい', '新しい', 'new', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふるい', '古い', 'old', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きれい', '綺麗', 'pretty, clean', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きたない', '汚い', 'dirty', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たのしい', '楽しい', 'fun, enjoyable', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かなしい', '悲しい', 'sad', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うれしい', '嬉しい', 'happy, glad', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('こわい', '怖い', 'scary, afraid', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おもしろい', '面白い', 'interesting, funny', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('むずかしい', '難しい', 'difficult', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('やさしい', '易しい', 'easy', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はやい', '速い', 'fast, early', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おそい', '遅い', 'slow, late', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はやく', '早く', 'quickly, early', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('つよい', '強い', 'strong', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('よわい', '弱い', 'weak', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たいせつ', '大切', 'important, precious', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しんぱい', '心配', 'worry', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あんしん', '安心', 'relief, peace of mind', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おかね', 'お金', 'money', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('つり', '釣り', 'change (money)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('レシート', null, 'receipt', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ねだん', '値段', 'price', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('りょうしゅうしょ', '領収書', 'receipt (formal)', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('でんき', '電気', 'electricity, light', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ラジオ', null, 'radio', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('テレビ', null, 'television', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しんぶん', '新聞', 'newspaper', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ざっし', '雑誌', 'magazine', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じんこう', '人口', 'population', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('せかい', '世界', 'world', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くに', '国', 'country', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('がいこく', '外国', 'foreign country', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('にほんじん', '日本人', 'Japanese person', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いま', '今', 'now', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さっき', 'さっき', 'a little while ago', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('すぐ', 'すぐ', 'immediately, soon', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ちょっと', 'ちょっと', 'a little, briefly', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ゆっくり', 'ゆっくり', 'slowly, leisurely', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('もらう', '貰う', 'to receive', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あげる', '上げる', 'to give', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くれる', 'くれる', 'to give (to me)', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('つける', '付ける', 'to turn on, attach', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('けす', '消す', 'to turn off, erase', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('せんたく', '洗濯', 'laundry', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('そうじ', '掃除', 'cleaning', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('りょうり', '料理', 'cooking, cuisine', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ごみ', 'ゴミ', 'trash, garbage', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かぎ', '鍵', 'key', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いしゃ', '医者', 'doctor', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かいしゃいん', '会社員', 'office worker', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('こうむいん', '公務員', 'government employee', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('エンジニア', null, 'engineer', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しゃしんか', '写真家', 'photographer', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うたうたい', '歌手', 'singer', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さっか', '作家', 'writer, author', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('シェフ', null, 'chef', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('てんいん', '店員', 'shop clerk', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うんてんしゅ', '運転手', 'driver', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('がくせい', '学生', 'student', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('だいがくせい', '大学生', 'university student', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ちゅうがくせい', '中学生', 'middle school student', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('こうこうせい', '高校生', 'high school student', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きょうし', '教師', 'teacher', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('つとめる', '勤める', 'to work for', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('やめる', '辞める', 'to quit', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なれる', '慣れる', 'to get used to', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きめる', '決める', 'to decide', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うける', '受ける', 'to take (exam), receive', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みぎ', '右', 'right', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひだり', '左', 'left', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まっすぐ', '真っ直ぐ', 'straight ahead', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うえ', '上', 'above, up', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('した', '下', 'below, down', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まえ', '前', 'front, before', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うしろ', '後ろ', 'behind, back', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なか', '中', 'inside, middle', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('そと', '外', 'outside', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('となり', '隣', 'next to, neighbor', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ちかく', '近く', 'nearby', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とおく', '遠く', 'far, distant', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あいだ', '間', 'between, interval', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('よこ', '横', 'side, horizontal', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('むこう', '向こう', 'over there, opposite side', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ときどき', '時々', 'sometimes', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('よく', 'よく', 'often, well', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あまり', 'あまり', 'not very (with negative)', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぜんぜん', '全然', 'not at all (with negative)', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いつも', 'いつも', 'always', 'adverb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('でも', 'でも', 'but, however', 'conjunction', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('そして', 'そして', 'and then', 'conjunction', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('だから', 'だから', 'therefore, so', 'conjunction', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('それから', 'それから', 'and then, after that', 'conjunction', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('けれども', 'けれども', 'but, although', 'conjunction', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しゅみ', '趣味', 'hobby', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('せいかつ', '生活', 'life, living', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('れきし', '歴史', 'history', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ぶんか', '文化', 'culture', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('けいけん', '経験', 'experience', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みつける', '見つける', 'to find', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なくす', '無くす', 'to lose', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とどける', '届ける', 'to deliver', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はこぶ', '運ぶ', 'to carry, transport', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('なおす', '直す', 'to fix, repair', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じゆう', '自由', 'freedom, free time', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひつよう', '必要', 'necessary', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('だいじ', '大事', 'important', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('べんり', '便利', 'convenient', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふべん', '不便', 'inconvenient', 'na-adjective', 'n5'::public.jlpt_level, 'published'::public.content_status)
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
    ('としょかん', '図書館で勉強します。', 'Toshokan de benkyou shimasu.', 'I study at the library.'),
    ('びじゅつかん', '美術館へ行きます。', 'Bijutsukan e ikimasu.', 'I go to the art museum.'),
    ('はくぶつかん', '博物館は面白いです。', 'Hakubutsukan wa omoshiroi desu.', 'The museum is interesting.'),
    ('こうえん', '公園で走ります。', 'Kouen de hashirimasu.', 'I run in the park.'),
    ('うみ', '夏に海へ行きます。', 'Natsu ni umi e ikimasu.', 'I go to the sea in summer.'),
    ('プール', 'プールで泳ぎます。', 'Puuru de oyogimasu.', 'I swim in the pool.'),
    ('えいがかん', '映画館で映画を見ます。', 'Eigakan de eiga o mimasu.', 'I watch a movie at the theater.'),
    ('スーパー', 'スーパーで買い物します。', 'Suupaa de kaimono shimasu.', 'I shop at the supermarket.'),
    ('コンビニ', 'コンビニでパンを買います。', 'Konbini de pan o kaimasu.', 'I buy bread at the convenience store.'),
    ('デパート', 'デパートへ行きます。', 'Depaato e ikimasu.', 'I go to the department store.'),
    ('たてもの', '大きい建物です。', 'Ookii tatemono desu.', 'It is a big building.'),
    ('ビル', '高いビルがあります。', 'Takai biru ga arimasu.', 'There is a tall building.'),
    ('アパート', 'アパートに住んでいます。', 'Apaato ni sunde imasu.', 'I live in an apartment.'),
    ('マンション', 'マンションは新しいです。', 'Manshon wa atarashii desu.', 'The condo is new.'),
    ('ホテル', 'ホテルに泊まります。', 'Hoteru ni tomarimasu.', 'I stay at a hotel.'),
    ('ぎんこう', '銀行でお金を下ろします。', 'Ginkou de okane o oroshimasu.', 'I withdraw money at the bank.'),
    ('ゆうびんきょく', '郵便局で手紙を出します。', 'Yuubinkyoku de tegami o dashimasu.', 'I mail a letter at the post office.'),
    ('けいじばん', '掲示板を見ます。', 'Keijiban o mimasu.', 'I look at the bulletin board.'),
    ('トイレ', 'トイレはどこですか。', 'Toire wa doko desu ka.', 'Where is the restroom?'),
    ('だいどころ', '台所で料理します。', 'Daidokoro de ryouri shimasu.', 'I cook in the kitchen.'),
    ('いぬ', '犬が好きです。', 'Inu ga suki desu.', 'I like dogs.'),
    ('ねこ', '猫を飼っています。', 'Neko o katte imasu.', 'I have a cat.'),
    ('とり', '鳥が歌っています。', 'Tori ga utatte imasu.', 'A bird is singing.'),
    ('うし', '牛がいます。', 'Ushi ga imasu.', 'There is a cow.'),
    ('うま', '馬に乗ります。', 'Uma ni norimasu.', 'I ride a horse.'),
    ('ぶた', '豚の肉を食べます。', 'Buta no niku o tabemasu.', 'I eat pork.'),
    ('ひつじ', '羊が多いです。', 'Hitsuji ga ooi desu.', 'There are many sheep.'),
    ('さる', '猿を見ました。', 'Saru o mimashita.', 'I saw a monkey.'),
    ('はち', '蜂が飛んでいます。', 'Hachi ga tonde imasu.', 'A bee is flying.'),
    ('ちょう', '蝶がきれいです。', 'Chou ga kirei desu.', 'The butterfly is pretty.'),
    ('はな', '花が咲いています。', 'Hana ga saite imasu.', 'Flowers are blooming.'),
    ('くさ', '草が青いです。', 'Kusa ga aoi desu.', 'The grass is green.'),
    ('は', '葉が落ちます。', 'Ha ga ochimasu.', 'Leaves fall.'),
    ('たね', '種をまきます。', 'Tane o makimasu.', 'I plant seeds.'),
    ('ばら', '薔薇が好きです。', 'Bara ga suki desu.', 'I like roses.'),
    ('かみなり', '雷が鳴っています。', 'Kaminari ga natte imasu.', 'Thunder is rumbling.'),
    ('じめん', '地面に座ります。', 'Jimen ni suwarimasu.', 'I sit on the ground.'),
    ('いし', '大きい石があります。', 'Ookii ishi ga arimasu.', 'There is a big rock.'),
    ('すな', '砂の上を歩きます。', 'Suna no ue o arukimasu.', 'I walk on the sand.'),
    ('ほし', '星が見えます。', 'Hoshi ga miemasu.', 'I can see stars.'),
    ('おおきい', '大きい家です。', 'Ookii ie desu.', 'It is a big house.'),
    ('ちいさい', '小さい犬です。', 'Chiisai inu desu.', 'It is a small dog.'),
    ('ながい', '長い道です。', 'Nagai michi desu.', 'It is a long road.'),
    ('みじかい', '短いスカートです。', 'Mijikai sukaato desu.', 'It is a short skirt.'),
    ('ふとい', '太い木です。', 'Futoi ki desu.', 'It is a thick tree.'),
    ('ほそい', '細い道です。', 'Hosoi michi desu.', 'It is a narrow road.'),
    ('あたらしい', '新しい車です。', 'Atarashii kuruma desu.', 'It is a new car.'),
    ('ふるい', '古い本です。', 'Furui hon desu.', 'It is an old book.'),
    ('きれい', '綺麗な花です。', 'Kirei na hana desu.', 'It is a pretty flower.'),
    ('きたない', '部屋が汚いです。', 'Heya ga kitanai desu.', 'The room is dirty.'),
    ('たのしい', '楽しい一日でした。', 'Tanoshii ichinichi deshita.', 'It was a fun day.'),
    ('かなしい', '悲しい映画です。', 'Kanashii eiga desu.', 'It is a sad movie.'),
    ('うれしい', '嬉しいです。', 'Ureshii desu.', 'I am happy.'),
    ('こわい', '怖い話です。', 'Kowai hanashi desu.', 'It is a scary story.'),
    ('おもしろい', '面白い本です。', 'Omoshiroi hon desu.', 'It is an interesting book.'),
    ('むずかしい', '日本語は難しいです。', 'Nihongo wa muzukashii desu.', 'Japanese is difficult.'),
    ('やさしい', 'この問題は易しいです。', 'Kono mondai wa yasashii desu.', 'This problem is easy.'),
    ('はやい', '電車は速いです。', 'Densha wa hayai desu.', 'The train is fast.'),
    ('おそい', 'バスは遅いです。', 'Basu wa osoi desu.', 'The bus is slow.'),
    ('はやく', '早く来てください。', 'Hayaku kite kudasai.', 'Please come quickly.'),
    ('つよい', '風が強いです。', 'Kaze ga tsuyoi desu.', 'The wind is strong.'),
    ('よわい', '体が弱いです。', 'Karada ga yowai desu.', 'My body is weak.'),
    ('たいせつ', '家族は大切です。', 'Kazoku wa taisetsu desu.', 'Family is important.'),
    ('しんぱい', '心配しないでください。', 'Shinpai shinaide kudasai.', 'Please do not worry.'),
    ('あんしん', '安心しました。', 'Anshin shimashita.', 'I felt relieved.'),
    ('おかね', 'お金がありません。', 'Okane ga arimasen.', 'I have no money.'),
    ('つり', '釣りをください。', 'Tsuri o kudasai.', 'Change, please.'),
    ('レシート', 'レシートをください。', 'Reshiito o kudasai.', 'A receipt, please.'),
    ('ねだん', '値段を教えてください。', 'Nedan o oshiete kudasai.', 'Please tell me the price.'),
    ('りょうしゅうしょ', '領収書をください。', 'Ryoushuusho o kudasai.', 'A formal receipt, please.'),
    ('でんき', '電気をつけます。', 'Denki o tsukemasu.', 'I turn on the light.'),
    ('ラジオ', 'ラジオを聞きます。', 'Rajio o kikimasu.', 'I listen to the radio.'),
    ('テレビ', 'テレビを見ます。', 'Terebi o mimasu.', 'I watch television.'),
    ('しんぶん', '新聞を読みます。', 'Shinbun o yomimasu.', 'I read the newspaper.'),
    ('ざっし', '雑誌を買います。', 'Zasshi o kaimasu.', 'I buy a magazine.'),
    ('じんこう', '人口が多いです。', 'Jinkou ga ooi desu.', 'The population is large.'),
    ('せかい', '世界は広いです。', 'Sekai wa hiroi desu.', 'The world is wide.'),
    ('くに', 'どの国から来ましたか。', 'Dono kuni kara kimashita ka.', 'Which country are you from?'),
    ('がいこく', '外国へ行きたいです。', 'Gaikoku e ikitai desu.', 'I want to go abroad.'),
    ('にほんじん', '日本人の友達がいます。', 'Nihonjin no tomodachi ga imasu.', 'I have a Japanese friend.'),
    ('いま', '今何時ですか。', 'Ima nanji desu ka.', 'What time is it now?'),
    ('さっき', 'さっき食べました。', 'Sakki tabemashita.', 'I ate a little while ago.'),
    ('すぐ', 'すぐ行きます。', 'Sugu ikimasu.', 'I will go soon.'),
    ('ちょっと', 'ちょっと待ってください。', 'Chotto matte kudasai.', 'Please wait a moment.'),
    ('ゆっくり', 'ゆっくり話してください。', 'Yukkuri hanashite kudasai.', 'Please speak slowly.'),
    ('もらう', 'プレゼントをもらいます。', 'Purezento o moraimasu.', 'I receive a present.'),
    ('あげる', '花をあげます。', 'Hana o agemasu.', 'I give flowers.'),
    ('くれる', '友達が本をくれました。', 'Tomodachi ga hon o kuremashita.', 'My friend gave me a book.'),
    ('つける', '電気を付けます。', 'Denki o tsukemasu.', 'I turn on the light.'),
    ('けす', 'テレビを消します。', 'Terebi o keshimasu.', 'I turn off the TV.'),
    ('せんたく', '洗濯をします。', 'Sentaku o shimasu.', 'I do laundry.'),
    ('そうじ', '掃除をします。', 'Souji o shimasu.', 'I clean.'),
    ('りょうり', '料理が好きです。', 'Ryouri ga suki desu.', 'I like cooking.'),
    ('ごみ', 'ゴミを出します。', 'Gomi o dashimasu.', 'I take out the trash.'),
    ('かぎ', '鍵を忘れました。', 'Kagi o wasuremashita.', 'I forgot the key.'),
    ('いしゃ', '医者に行きます。', 'Isha ni ikimasu.', 'I go to the doctor.'),
    ('かいしゃいん', '父は会社員です。', 'Chichi wa kaishain desu.', 'My father is an office worker.'),
    ('こうむいん', '公務員になりたいです。', 'Koumuin ni naritai desu.', 'I want to become a government employee.'),
    ('エンジニア', 'エンジニアをしています。', 'Enjinia o shite imasu.', 'I work as an engineer.'),
    ('しゃしんか', '写真家に会いました。', 'Shashinka ni aimashita.', 'I met a photographer.'),
    ('うたうたい', '歌手が好きです。', 'Kashu ga suki desu.', 'I like singers.'),
    ('さっか', '作家になりたいです。', 'Sakka ni naritai desu.', 'I want to become a writer.'),
    ('シェフ', 'シェフの料理はおいしいです。', 'Shefu no ryouri wa oishii desu.', 'The chef''s food is delicious.'),
    ('てんいん', '店員を呼びます。', 'Tenin o yobimasu.', 'I call the shop clerk.'),
    ('うんてんしゅ', '運転手さん、駅までお願いします。', 'Untenshu-san, eki made onegaishimasu.', 'Driver, to the station please.'),
    ('がくせい', '私は学生です。', 'Watashi wa gakusei desu.', 'I am a student.'),
    ('だいがくせい', '兄は大学生です。', 'Ani wa daigakusei desu.', 'My older brother is a university student.'),
    ('ちゅうがくせい', '妹は中学生です。', 'Imouto wa chuugakusei desu.', 'My younger sister is a middle school student.'),
    ('こうこうせい', '弟は高校生です。', 'Otouto wa koukousei desu.', 'My younger brother is a high school student.'),
    ('きょうし', '教師になりたいです。', 'Kyoushi ni naritai desu.', 'I want to become a teacher.'),
    ('つとめる', '会社に勤めています。', 'Kaisha ni tsutomete imasu.', 'I work for a company.'),
    ('やめる', '仕事を辞めます。', 'Shigoto o yamemasu.', 'I quit my job.'),
    ('なれる', '日本の生活に慣れました。', 'Nihon no seikatsu ni naremashita.', 'I got used to life in Japan.'),
    ('きめる', '時間を決めます。', 'Jikan o kimemasu.', 'I decide the time.'),
    ('うける', '試験を受けます。', 'Shiken o ukemasu.', 'I take an exam.'),
    ('みぎ', '右に曲がります。', 'Migi ni magarimasu.', 'Turn right.'),
    ('ひだり', '左へ行きます。', 'Hidari e ikimasu.', 'Go to the left.'),
    ('まっすぐ', 'まっすぐ行ってください。', 'Massugu itte kudasai.', 'Please go straight.'),
    ('うえ', '上に本があります。', 'Ue ni hon ga arimasu.', 'There is a book above.'),
    ('した', '下に猫がいます。', 'Shita ni neko ga imasu.', 'There is a cat below.'),
    ('まえ', '駅の前にいます。', 'Eki no mae ni imasu.', 'I am in front of the station.'),
    ('うしろ', '後ろを見てください。', 'Ushiro o mite kudasai.', 'Please look behind.'),
    ('なか', '箱の中にあります。', 'Hako no naka ni arimasu.', 'It is inside the box.'),
    ('そと', '外で遊びます。', 'Soto de asobimasu.', 'I play outside.'),
    ('となり', '隣の人は親切です。', 'Tonari no hito wa shinsetsu desu.', 'The neighbor is kind.'),
    ('ちかく', '駅の近くに住んでいます。', 'Eki no chikaku ni sunde imasu.', 'I live near the station.'),
    ('とおく', '遠くに山が見えます。', 'Tooku ni yama ga miemasu.', 'I can see mountains in the distance.'),
    ('あいだ', '駅と学校の間です。', 'Eki to gakkou no aida desu.', 'It is between the station and school.'),
    ('よこ', '横に座ってください。', 'Yoko ni suwatte kudasai.', 'Please sit beside me.'),
    ('むこう', '向こうに店があります。', 'Mukou ni mise ga arimasu.', 'There is a shop over there.'),
    ('ときどき', '時々映画を見ます。', 'Tokidoki eiga o mimasu.', 'I sometimes watch movies.'),
    ('よく', 'よく公園へ行きます。', 'Yoku kouen e ikimasu.', 'I often go to the park.'),
    ('あまり', 'あまり食べません。', 'Amari tabemasen.', 'I do not eat much.'),
    ('ぜんぜん', '全然分かりません。', 'Zenzen wakarimasen.', 'I do not understand at all.'),
    ('いつも', 'いつも六時に起きます。', 'Itsumo rokuji ni okimasu.', 'I always wake up at six.'),
    ('でも', '忙しいです。でも行きます。', 'Isogashii desu. Demo ikimasu.', 'I am busy. But I will go.'),
    ('そして', '起きて、そして朝ご飯を食べます。', 'Okitte, soshite asagohan o tabemasu.', 'I wake up and then eat breakfast.'),
    ('だから', '雨です。だから行きません。', 'Ame desu. Dakara ikimasen.', 'It is rainy. So I will not go.'),
    ('それから', '買い物をして、それから帰ります。', 'Kaimono o shite, sorekara kaerimasu.', 'I shop and then go home.'),
    ('けれども', '高いです。けれども買います。', 'Takai desu. Keredomo kaimasu.', 'It is expensive. But I will buy it.'),
    ('しゅみ', '趣味は何ですか。', 'Shumi wa nan desu ka.', 'What is your hobby?'),
    ('せいかつ', '日本の生活は楽しいです。', 'Nihon no seikatsu wa tanoshii desu.', 'Life in Japan is fun.'),
    ('れきし', '歴史を勉強します。', 'Rekishi o benkyou shimasu.', 'I study history.'),
    ('ぶんか', '日本文化が好きです。', 'Nihon bunka ga suki desu.', 'I like Japanese culture.'),
    ('けいけん', 'いい経験でした。', 'Ii keiken deshita.', 'It was a good experience.'),
    ('みつける', '仕事を見つけました。', 'Shigoto o mitsukemashita.', 'I found a job.'),
    ('なくす', '鍵を無くしました。', 'Kagi o nakushimashita.', 'I lost my key.'),
    ('とどける', '荷物を届けます。', 'Nimotsu o todokemasu.', 'I deliver a package.'),
    ('はこぶ', '重い荷物を運びます。', 'Omoi nimotsu o hakobimasu.', 'I carry heavy luggage.'),
    ('なおす', '時計を直します。', 'Tokei o naoshimasu.', 'I fix the watch.'),
    ('じゆう', '今日は自由です。', 'Kyou wa jiyuu desu.', 'I am free today.'),
    ('ひつよう', 'パスポートが必要です。', 'Pasupooto ga hitsuyou desu.', 'A passport is necessary.'),
    ('だいじ', '大事な人です。', 'Daiji na hito desu.', 'They are an important person.'),
    ('べんり', 'このアプリは便利です。', 'Kono apuri wa benri desu.', 'This app is convenient.'),
    ('ふべん', 'ここは不便です。', 'Koko wa fuben desu.', 'This place is inconvenient.')
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
  select region_id, 'Places & Buildings', 'Public places and buildings around town.', 42, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Places & Buildings'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Places & Buildings' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Public Places I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Public Places I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Public Places I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['としょかん', 'びじゅつかん', 'はくぶつかん', 'こうえん', 'うみ'];
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
    select unit_id, 'vocabulary', 'Public Places II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Public Places II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Public Places II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['プール', 'えいがかん', 'スーパー', 'コンビニ', 'デパート'];
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
    select unit_id, 'vocabulary', 'Buildings I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Buildings I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Buildings I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['たてもの', 'ビル', 'アパート', 'マンション', 'ホテル'];
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
    select unit_id, 'vocabulary', 'Services & Facilities', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Services & Facilities'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Services & Facilities' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ぎんこう', 'ゆうびんきょく', 'けいじばん', 'トイレ', 'だいどころ'];
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
  select region_id, 'Nature & Animals', 'Animals, plants, and natural world.', 43, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Nature & Animals'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Nature & Animals' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Animals I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Animals I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Animals I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['いぬ', 'ねこ', 'とり', 'うし', 'うま'];
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
    select unit_id, 'vocabulary', 'Animals II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Animals II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Animals II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ぶた', 'ひつじ', 'さる', 'はち', 'ちょう'];
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
    select unit_id, 'vocabulary', 'Plants & Flowers', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Plants & Flowers'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Plants & Flowers' limit 1;

    if lesson_id is not null then
      word_kana_list := array['はな', 'くさ', 'は', 'たね', 'ばら'];
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
    select unit_id, 'vocabulary', 'Weather Events', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Weather Events'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Weather Events' limit 1;

    if lesson_id is not null then
      word_kana_list := array['かみなり', 'じめん', 'いし', 'すな', 'ほし'];
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
  select region_id, 'Adjectives & Descriptions', 'Common adjectives and descriptive words.', 44, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Adjectives & Descriptions'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Adjectives & Descriptions' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Size & Shape', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Size & Shape'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Size & Shape' limit 1;

    if lesson_id is not null then
      word_kana_list := array['おおきい', 'ちいさい', 'ながい', 'みじかい', 'ふとい'];
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
    select unit_id, 'vocabulary', 'Quality I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Quality I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Quality I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ほそい', 'あたらしい', 'ふるい', 'きれい', 'きたない'];
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
    select unit_id, 'vocabulary', 'Quality II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Quality II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Quality II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['たのしい', 'かなしい', 'うれしい', 'こわい', 'おもしろい'];
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
    select unit_id, 'vocabulary', 'Difficulty & Speed', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Difficulty & Speed'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Difficulty & Speed' limit 1;

    if lesson_id is not null then
      word_kana_list := array['むずかしい', 'やさしい', 'はやい', 'おそい', 'はやく'];
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
    select unit_id, 'vocabulary', 'Feelings & States', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Feelings & States'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Feelings & States' limit 1;

    if lesson_id is not null then
      word_kana_list := array['つよい', 'よわい', 'たいせつ', 'しんぱい', 'あんしん'];
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
  select region_id, 'Daily Life & Society', 'Money, shopping, and social vocabulary.', 45, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Daily Life & Society'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Daily Life & Society' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Money & Shopping', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Money & Shopping'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Money & Shopping' limit 1;

    if lesson_id is not null then
      word_kana_list := array['おかね', 'つり', 'レシート', 'ねだん', 'りょうしゅうしょ'];
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
      word_kana_list := array['でんき', 'ラジオ', 'テレビ', 'しんぶん', 'ざっし'];
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
    select unit_id, 'vocabulary', 'People & Society', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'People & Society'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'People & Society' limit 1;

    if lesson_id is not null then
      word_kana_list := array['じんこう', 'せかい', 'くに', 'がいこく', 'にほんじん'];
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
    select unit_id, 'vocabulary', 'Time Expressions', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Time Expressions'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Time Expressions' limit 1;

    if lesson_id is not null then
      word_kana_list := array['いま', 'さっき', 'すぐ', 'ちょっと', 'ゆっくり'];
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
    select unit_id, 'vocabulary', 'Common Verbs II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Common Verbs II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Common Verbs II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['もらう', 'あげる', 'くれる', 'つける', 'けす'];
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
    select unit_id, 'vocabulary', 'Household', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Household'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Household' limit 1;

    if lesson_id is not null then
      word_kana_list := array['せんたく', 'そうじ', 'りょうり', 'ごみ', 'かぎ'];
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
  select region_id, 'Jobs & Occupations', 'Work, professions, and workplace roles.', 46, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Jobs & Occupations'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Jobs & Occupations' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Professions I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Professions I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Professions I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['いしゃ', 'かいしゃいん', 'こうむいん', 'エンジニア', 'しゃしんか'];
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
    select unit_id, 'vocabulary', 'Professions II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Professions II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Professions II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['うたうたい', 'さっか', 'シェフ', 'てんいん', 'うんてんしゅ'];
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
    select unit_id, 'vocabulary', 'School Roles', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'School Roles'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'School Roles' limit 1;

    if lesson_id is not null then
      word_kana_list := array['がくせい', 'だいがくせい', 'ちゅうがくせい', 'こうこうせい', 'きょうし'];
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
    select unit_id, 'vocabulary', 'Work Verbs', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Work Verbs'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Work Verbs' limit 1;

    if lesson_id is not null then
      word_kana_list := array['つとめる', 'やめる', 'なれる', 'きめる', 'うける'];
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
  select region_id, 'Directions & Position', 'Spatial words and directional vocabulary.', 47, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Directions & Position'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Directions & Position' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Directions I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Directions I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Directions I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['みぎ', 'ひだり', 'まっすぐ', 'うえ', 'した'];
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
    select unit_id, 'vocabulary', 'Directions II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Directions II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Directions II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['まえ', 'うしろ', 'なか', 'そと', 'となり'];
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
    select unit_id, 'vocabulary', 'Distance & Position', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Distance & Position'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Distance & Position' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ちかく', 'とおく', 'あいだ', 'よこ', 'むこう'];
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
  select region_id, 'Essential N5 Mix II', 'Additional high-frequency N5 words and phrases.', 48, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Essential N5 Mix II'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Essential N5 Mix II' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Frequency & Degree', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Frequency & Degree'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Frequency & Degree' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ときどき', 'よく', 'あまり', 'ぜんぜん', 'いつも'];
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
    select unit_id, 'vocabulary', 'Connecting Words', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Connecting Words'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Connecting Words' limit 1;

    if lesson_id is not null then
      word_kana_list := array['でも', 'そして', 'だから', 'それから', 'けれども'];
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
    select unit_id, 'vocabulary', 'Useful Nouns', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Useful Nouns'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Useful Nouns' limit 1;

    if lesson_id is not null then
      word_kana_list := array['しゅみ', 'せいかつ', 'れきし', 'ぶんか', 'けいけん'];
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
    select unit_id, 'vocabulary', 'More Useful Verbs', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'More Useful Verbs'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'More Useful Verbs' limit 1;

    if lesson_id is not null then
      word_kana_list := array['みつける', 'なくす', 'とどける', 'はこぶ', 'なおす'];
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
    select unit_id, 'vocabulary', 'Final Essentials', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Final Essentials'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Final Essentials' limit 1;

    if lesson_id is not null then
      word_kana_list := array['じゆう', 'ひつよう', 'だいじ', 'べんり', 'ふべん'];
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
  select region_id, 'N5 Vocabulary Practice: Wave 5 Unit', 'Mixed recall quiz across wave 5 N5 vocabulary.', 49, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Practice: Wave 5 Unit'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Practice: Wave 5 Unit' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', 'N5 Vocabulary Practice: Wave 5', 'Mixed recall quiz across wave 5 N5 vocabulary.', 2, 20, 8, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'N5 Vocabulary Practice: Wave 5'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'N5 Vocabulary Practice: Wave 5' limit 1;

    if lesson_id is not null then
      word_kana_list := array['としょかん', 'プール', 'たてもの', 'ぎんこう', 'いぬ', 'ぶた', 'はな', 'かみなり', 'おおきい', 'ほそい', 'たのしい', 'むずかしい', 'つよい', 'おかね', 'でんき', 'じんこう', 'いま', 'もらう', 'せんたく', 'いしゃ', 'うたうたい', 'がくせい', 'つとめる', 'みぎ', 'まえ', 'ちかく', 'ときどき', 'でも', 'しゅみ', 'みつける', 'じゆう'];
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
