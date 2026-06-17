"""Generate N5 vocabulary expansion wave 4 migration."""

from __future__ import annotations

import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location(
    "vocab_expansion",
    ROOT / "scripts" / "build-n5-vocabulary-expansion.py",
)
_expansion = importlib.util.module_from_spec(_spec)
assert _spec.loader is not None
_spec.loader.exec_module(_expansion)

build_curriculum_block = _expansion.build_curriculum_block
build_example_seed_block = _expansion.build_example_seed_block
build_vocab_values = _expansion.build_vocab_values
collect_words = _expansion.collect_words
count_lessons = _expansion.count_lessons
MIGRATIONS = ROOT / "supabase" / "migrations"

WAVE = {
    "filename": "20260617110000_n5_vocabulary_expansion_wave4.sql",
    "title": "N5 vocabulary expansion wave 4",
    "start_order_index": 32,
    "practice_title": "N5 Vocabulary Practice: Wave 4",
    "practice_description": "Mixed recall quiz across wave 4 N5 vocabulary.",
    "units": [
        {
            "name": "Food & Dining",
            "description": "Meals, drinks, and restaurant vocabulary.",
            "lessons": [
                {
                    "title": "Meals I",
                    "words": [
                        ("あさごはん", "朝ご飯", "breakfast", "noun", "朝ご飯を食べます。", "Asagohan o tabemasu.", "I eat breakfast."),
                        ("ひるごはん", "昼ご飯", "lunch", "noun", "昼ご飯は十二時です。", "Hirugohan wa juuniji desu.", "Lunch is at twelve."),
                        ("ばんごはん", "晩ご飯", "dinner", "noun", "晩ご飯を作ります。", "Bangohan o tsukurimasu.", "I make dinner."),
                        ("おかず", "おかず", "side dish", "noun", "おかずがおいしいです。", "Okazu ga oishii desu.", "The side dish is delicious."),
                        ("さかな", "魚", "fish", "noun", "魚を食べます。", "Sakana o tabemasu.", "I eat fish."),
                    ],
                },
                {
                    "title": "Meals II",
                    "words": [
                        ("にく", "肉", "meat", "noun", "肉が好きです。", "Niku ga suki desu.", "I like meat."),
                        ("やさい", "野菜", "vegetable", "noun", "野菜を食べます。", "Yasai o tabemasu.", "I eat vegetables."),
                        ("くだもの", "果物", "fruit", "noun", "果物を買います。", "Kudamono o kaimasu.", "I buy fruit."),
                        ("たまご", "卵", "egg", "noun", "卵を食べます。", "Tamago o tabemasu.", "I eat eggs."),
                        ("パン", "", "bread", "noun", "パンを買います。", "Pan o kaimasu.", "I buy bread."),
                    ],
                },
                {
                    "title": "Drinks",
                    "words": [
                        ("おちゃ", "お茶", "tea", "noun", "お茶を飲みます。", "Ocha o nomimasu.", "I drink tea."),
                        ("コーヒー", "", "coffee", "noun", "コーヒーが好きです。", "Koohii ga suki desu.", "I like coffee."),
                        ("ぎゅうにゅう", "牛乳", "milk", "noun", "牛乳を飲みます。", "Gyuunyuu o nomimasu.", "I drink milk."),
                        ("ジュース", "", "juice", "noun", "ジュースをください。", "Juusu o kudasai.", "Juice, please."),
                        ("みず", "水", "water", "noun", "水を飲みます。", "Mizu o nomimasu.", "I drink water."),
                    ],
                },
                {
                    "title": "Taste & Flavor",
                    "words": [
                        ("おいしい", "美味しい", "delicious", "adjective", "この料理は美味しいです。", "Kono ryouri wa oishii desu.", "This dish is delicious."),
                        ("まずい", "不味い", "bad-tasting", "adjective", "この料理は不味いです。", "Kono ryouri wa mazui desu.", "This dish tastes bad."),
                        ("あまい", "甘い", "sweet", "adjective", "このケーキは甘いです。", "Kono keeki wa amai desu.", "This cake is sweet."),
                        ("からい", "辛い", "spicy, hot", "adjective", "この料理は辛いです。", "Kono ryouri wa karai desu.", "This dish is spicy."),
                        ("しおからい", "塩辛い", "salty", "adjective", "スープは塩辛いです。", "Suupu wa shiokarai desu.", "The soup is salty."),
                    ],
                },
            ],
        },
        {
            "name": "Clothing & Colors",
            "description": "What to wear and color vocabulary.",
            "lessons": [
                {
                    "title": "Clothing I",
                    "words": [
                        ("ふく", "服", "clothes", "noun", "新しい服を買います。", "Atarashii fuku o kaimasu.", "I buy new clothes."),
                        ("シャツ", "", "shirt", "noun", "白いシャツを着ます。", "Shiroi shatsu o kimasu.", "I wear a white shirt."),
                        ("ズボン", "", "pants", "noun", "ズボンをはきます。", "Zubon o hakimasu.", "I put on pants."),
                        ("くつ", "靴", "shoes", "noun", "靴を履きます。", "Kutsu o hakimasu.", "I put on shoes."),
                        ("ぼうし", "帽子", "hat", "noun", "帽子をかぶります。", "Boushi o kaburimasu.", "I wear a hat."),
                    ],
                },
                {
                    "title": "Clothing II",
                    "words": [
                        ("めがね", "眼鏡", "glasses", "noun", "眼鏡をかけます。", "Megane o kakemasu.", "I wear glasses."),
                        ("かばん", "鞄", "bag", "noun", "鞄に本を入れます。", "Kaban ni hon o iremasu.", "I put a book in the bag."),
                        ("とけい", "時計", "watch, clock", "noun", "時計を見ます。", "Tokei o mimasu.", "I look at the watch."),
                        ("さいふ", "財布", "wallet", "noun", "財布を忘れました。", "Saifu o wasuremashita.", "I forgot my wallet."),
                        ("きせつ", "季節", "season", "noun", "今の季節は春です。", "Ima no kisetsu wa haru desu.", "The current season is spring."),
                    ],
                },
                {
                    "title": "Colors I",
                    "words": [
                        ("あか", "赤", "red", "noun", "赤い花です。", "Akai hana desu.", "It is a red flower."),
                        ("あお", "青", "blue", "noun", "空は青いです。", "Sora wa aoi desu.", "The sky is blue."),
                        ("しろ", "白", "white", "noun", "白い紙です。", "Shiroi kami desu.", "It is white paper."),
                        ("くろ", "黒", "black", "noun", "黒い猫です。", "Kuroi neko desu.", "It is a black cat."),
                        ("きいろ", "黄色", "yellow", "noun", "黄色いバナナです。", "Kiiroi banana desu.", "It is a yellow banana."),
                    ],
                },
                {
                    "title": "Colors II",
                    "words": [
                        ("みどり", "緑", "green", "noun", "緑の木です。", "Midori no ki desu.", "It is a green tree."),
                        ("ちゃいろ", "茶色", "brown", "noun", "茶色の机です。", "Chairo no tsukue desu.", "It is a brown desk."),
                        ("ピンク", "", "pink", "noun", "ピンクの花です。", "Pinku no hana desu.", "It is a pink flower."),
                        ("オレンジ", "", "orange", "noun", "オレンジ色です。", "Orenji iro desu.", "It is orange."),
                        ("いろ", "色", "color", "noun", "好きな色は何ですか。", "Sukina iro wa nan desu ka.", "What is your favorite color?"),
                    ],
                },
            ],
        },
        {
            "name": "School & Work",
            "description": "Classroom, office, and study vocabulary.",
            "lessons": [
                {
                    "title": "School I",
                    "words": [
                        ("きょうしつ", "教室", "classroom", "noun", "教室へ行きます。", "Kyoushitsu e ikimasu.", "I go to the classroom."),
                        ("じゅぎょう", "授業", "class, lesson", "noun", "授業は九時からです。", "Jugyou wa kuji kara desu.", "Class starts at nine."),
                        ("しけん", "試験", "exam", "noun", "来週試験があります。", "Raishuu shiken ga arimasu.", "There is an exam next week."),
                        ("しゅくだい", "宿題", "homework", "noun", "宿題をします。", "Shukudai o shimasu.", "I do homework."),
                        ("えんぴつ", "鉛筆", "pencil", "noun", "鉛筆で書きます。", "Enpitsu de kakimasu.", "I write with a pencil."),
                    ],
                },
                {
                    "title": "School II",
                    "words": [
                        ("ノート", "", "notebook", "noun", "ノートに書きます。", "Nooto ni kakimasu.", "I write in the notebook."),
                        ("じしょ", "辞書", "dictionary", "noun", "辞書を使います。", "Jisho o tsukaimasu.", "I use a dictionary."),
                        ("え", "絵", "picture, drawing", "noun", "絵を描きます。", "E o kakimasu.", "I draw a picture."),
                        ("おんがく", "音楽", "music", "noun", "音楽を聞きます。", "Ongaku o kikimasu.", "I listen to music."),
                        ("うんどう", "運動", "exercise, sports", "noun", "運動が好きです。", "Undou ga suki desu.", "I like exercise."),
                    ],
                },
                {
                    "title": "Work & Office",
                    "words": [
                        ("かいぎ", "会議", "meeting", "noun", "会議は三時です。", "Kaigi wa sanji desu.", "The meeting is at three."),
                        ("しごと", "仕事", "work, job", "noun", "仕事が忙しいです。", "Shigoto ga isogashii desu.", "Work is busy."),
                        ("でんわ", "電話", "telephone", "noun", "電話をかけます。", "Denwa o kakemasu.", "I make a phone call."),
                        ("メール", "", "email", "noun", "メールを送ります。", "Meeru o okurimasu.", "I send an email."),
                        ("きょうか", "教科", "school subject", "noun", "好きな教科は何ですか。", "Sukina kyouka wa nan desu ka.", "What is your favorite subject?"),
                    ],
                },
                {
                    "title": "Study Verbs",
                    "words": [
                        ("おぼえる", "覚える", "to memorize", "verb", "漢字を覚えます。", "Kanji o oboemasu.", "I memorize kanji."),
                        ("わすれる", "忘れる", "to forget", "verb", "名前を忘れました。", "Namae o wasuremashita.", "I forgot the name."),
                        ("れんしゅうする", "練習する", "to practice", "verb", "毎日練習します。", "Mainichi renshuu shimasu.", "I practice every day."),
                        ("しつもんする", "質問する", "to ask a question", "verb", "先生に質問します。", "Sensei ni shitsumon shimasu.", "I ask the teacher a question."),
                        ("こたえる", "答える", "to answer", "verb", "質問に答えます。", "Shitsumon ni kotaemasu.", "I answer the question."),
                    ],
                },
            ],
        },
        {
            "name": "Health & Hobbies",
            "description": "Wellbeing, leisure, and social vocabulary.",
            "lessons": [
                {
                    "title": "Health I",
                    "words": [
                        ("びょうき", "病気", "illness", "noun", "病気です。", "Byouki desu.", "I am sick."),
                        ("ねつ", "熱", "fever", "noun", "熱があります。", "Netsu ga arimasu.", "I have a fever."),
                        ("くすり", "薬", "medicine", "noun", "薬を飲みます。", "Kusuri o nomimasu.", "I take medicine."),
                        ("びょういん", "病院", "hospital", "noun", "病院へ行きます。", "Byouin e ikimasu.", "I go to the hospital."),
                        ("げんき", "元気", "healthy, energetic", "na-adjective", "元気ですか。", "Genki desu ka.", "How are you?"),
                    ],
                },
                {
                    "title": "Health II",
                    "words": [
                        ("いたい", "痛い", "painful", "adjective", "足が痛いです。", "Ashi ga itai desu.", "My leg hurts."),
                        ("だいじょうぶ", "大丈夫", "okay, all right", "na-adjective", "大丈夫ですか。", "Daijoubu desu ka.", "Are you okay?"),
                        ("やすむ", "休む", "to rest", "verb", "日曜日に休みます。", "Nichiyoubi ni yasumimasu.", "I rest on Sunday."),
                        ("ねむい", "眠い", "sleepy", "adjective", "眠いです。", "Nemui desu.", "I am sleepy."),
                        ("はやく", "早く", "early, quickly", "adverb", "早く起きます。", "Hayaku okimasu.", "I wake up early."),
                    ],
                },
                {
                    "title": "Hobbies I",
                    "words": [
                        ("えいが", "映画", "movie", "noun", "映画を見ます。", "Eiga o mimasu.", "I watch a movie."),
                        ("スポーツ", "", "sports", "noun", "スポーツが好きです。", "Supootsu ga suki desu.", "I like sports."),
                        ("りょこう", "旅行", "travel, trip", "noun", "旅行に行きます。", "Ryokou ni ikimasu.", "I go on a trip."),
                        ("しゃしん", "写真", "photo", "noun", "写真を撮ります。", "Shashin o torimasu.", "I take a photo."),
                        ("ゲーム", "", "game", "noun", "ゲームをします。", "Geemu o shimasu.", "I play a game."),
                    ],
                },
                {
                    "title": "Hobbies II",
                    "words": [
                        ("うた", "歌", "song", "noun", "歌を歌います。", "Uta o utaimasu.", "I sing a song."),
                        ("ダンス", "", "dance", "noun", "ダンスが好きです。", "Dansu ga suki desu.", "I like dancing."),
                        ("てがみ", "手紙", "letter", "noun", "手紙を書きます。", "Tegami o kakimasu.", "I write a letter."),
                        ("プレゼント", "", "present, gift", "noun", "プレゼントをあげます。", "Purezento o agemasu.", "I give a present."),
                        ("パーティー", "", "party", "noun", "パーティーに行きます。", "Paatii ni ikimasu.", "I go to a party."),
                    ],
                },
            ],
        },
    ],
}


def build_wave_sql(wave: dict) -> str:
    units = wave["units"]
    header = f"""-- {wave["title"]}

insert into public.vocabulary (kana, kanji, meaning, part_of_speech, jlpt_level, status)
select v.kana, v.kanji, v.meaning, v.part_of_speech, v.jlpt_level, v.status
from (
  values
"""
    footer = """
) as v(kana, kanji, meaning, part_of_speech, jlpt_level, status)
where not exists (
  select 1 from public.vocabulary existing where existing.kana = v.kana
);
"""
    curriculum_header = """
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
"""
    curriculum_footer = """
end $seed$;
"""
    return (
        header
        + build_vocab_values(units)
        + footer
        + build_example_seed_block(units)
        + curriculum_header
        + build_curriculum_block(wave)
        + curriculum_footer
    )


def main() -> None:
    out = MIGRATIONS / WAVE["filename"]
    sql = build_wave_sql(WAVE)
    out.write_text(sql, encoding="utf-8")
    words = collect_words(WAVE["units"])
    lessons = count_lessons(WAVE["units"])
    print(
        f"Wrote {out.name}: {len(words)} unique words, "
        f"{lessons} vocabulary lessons + 1 practice quiz"
    )


if __name__ == "__main__":
    main()
