"""Generate N5 vocabulary expansion wave 5 migration (~150 words)."""

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
build_wave_sql = _expansion.build_wave_sql
collect_words = _expansion.collect_words
count_lessons = _expansion.count_lessons
MIGRATIONS = ROOT / "supabase" / "migrations"

WAVE = {
    "filename": "20260617140000_n5_vocabulary_expansion_wave5.sql",
    "title": "N5 vocabulary expansion wave 5",
    "start_order_index": 42,
    "practice_title": "N5 Vocabulary Practice: Wave 5",
    "practice_description": "Mixed recall quiz across wave 5 N5 vocabulary.",
    "units": [
        {
            "name": "Places & Buildings",
            "description": "Public places and buildings around town.",
            "lessons": [
                {
                    "title": "Public Places I",
                    "words": [
                        ("としょかん", "図書館", "library", "noun", "図書館で勉強します。", "Toshokan de benkyou shimasu.", "I study at the library."),
                        ("びじゅつかん", "美術館", "art museum", "noun", "美術館へ行きます。", "Bijutsukan e ikimasu.", "I go to the art museum."),
                        ("はくぶつかん", "博物館", "museum", "noun", "博物館は面白いです。", "Hakubutsukan wa omoshiroi desu.", "The museum is interesting."),
                        ("こうえん", "公園", "park", "noun", "公園で走ります。", "Kouen de hashirimasu.", "I run in the park."),
                        ("うみ", "海", "sea, beach", "noun", "夏に海へ行きます。", "Natsu ni umi e ikimasu.", "I go to the sea in summer."),
                    ],
                },
                {
                    "title": "Public Places II",
                    "words": [
                        ("プール", "", "swimming pool", "noun", "プールで泳ぎます。", "Puuru de oyogimasu.", "I swim in the pool."),
                        ("えいがかん", "映画館", "movie theater", "noun", "映画館で映画を見ます。", "Eigakan de eiga o mimasu.", "I watch a movie at the theater."),
                        ("スーパー", "", "supermarket", "noun", "スーパーで買い物します。", "Suupaa de kaimono shimasu.", "I shop at the supermarket."),
                        ("コンビニ", "", "convenience store", "noun", "コンビニでパンを買います。", "Konbini de pan o kaimasu.", "I buy bread at the convenience store."),
                        ("デパート", "", "department store", "noun", "デパートへ行きます。", "Depaato e ikimasu.", "I go to the department store."),
                    ],
                },
                {
                    "title": "Buildings I",
                    "words": [
                        ("たてもの", "建物", "building", "noun", "大きい建物です。", "Ookii tatemono desu.", "It is a big building."),
                        ("ビル", "", "building (multi-story)", "noun", "高いビルがあります。", "Takai biru ga arimasu.", "There is a tall building."),
                        ("アパート", "", "apartment", "noun", "アパートに住んでいます。", "Apaato ni sunde imasu.", "I live in an apartment."),
                        ("マンション", "", "condominium", "noun", "マンションは新しいです。", "Manshon wa atarashii desu.", "The condo is new."),
                        ("ホテル", "", "hotel", "noun", "ホテルに泊まります。", "Hoteru ni tomarimasu.", "I stay at a hotel."),
                    ],
                },
                {
                    "title": "Services & Facilities",
                    "words": [
                        ("ぎんこう", "銀行", "bank", "noun", "銀行でお金を下ろします。", "Ginkou de okane o oroshimasu.", "I withdraw money at the bank."),
                        ("ゆうびんきょく", "郵便局", "post office", "noun", "郵便局で手紙を出します。", "Yuubinkyoku de tegami o dashimasu.", "I mail a letter at the post office."),
                        ("けいじばん", "掲示板", "bulletin board", "noun", "掲示板を見ます。", "Keijiban o mimasu.", "I look at the bulletin board."),
                        ("トイレ", "", "toilet, restroom", "noun", "トイレはどこですか。", "Toire wa doko desu ka.", "Where is the restroom?"),
                        ("だいどころ", "台所", "kitchen", "noun", "台所で料理します。", "Daidokoro de ryouri shimasu.", "I cook in the kitchen."),
                    ],
                },
            ],
        },
        {
            "name": "Nature & Animals",
            "description": "Animals, plants, and natural world.",
            "lessons": [
                {
                    "title": "Animals I",
                    "words": [
                        ("いぬ", "犬", "dog", "noun", "犬が好きです。", "Inu ga suki desu.", "I like dogs."),
                        ("ねこ", "猫", "cat", "noun", "猫を飼っています。", "Neko o katte imasu.", "I have a cat."),
                        ("とり", "鳥", "bird", "noun", "鳥が歌っています。", "Tori ga utatte imasu.", "A bird is singing."),
                        ("うし", "牛", "cow", "noun", "牛がいます。", "Ushi ga imasu.", "There is a cow."),
                        ("うま", "馬", "horse", "noun", "馬に乗ります。", "Uma ni norimasu.", "I ride a horse."),
                    ],
                },
                {
                    "title": "Animals II",
                    "words": [
                        ("ぶた", "豚", "pig", "noun", "豚の肉を食べます。", "Buta no niku o tabemasu.", "I eat pork."),
                        ("ひつじ", "羊", "sheep", "noun", "羊が多いです。", "Hitsuji ga ooi desu.", "There are many sheep."),
                        ("さる", "猿", "monkey", "noun", "猿を見ました。", "Saru o mimashita.", "I saw a monkey."),
                        ("はち", "蜂", "bee", "noun", "蜂が飛んでいます。", "Hachi ga tonde imasu.", "A bee is flying."),
                        ("ちょう", "蝶", "butterfly", "noun", "蝶がきれいです。", "Chou ga kirei desu.", "The butterfly is pretty."),
                    ],
                },
                {
                    "title": "Plants & Flowers",
                    "words": [
                        ("はな", "花", "flower", "noun", "花が咲いています。", "Hana ga saite imasu.", "Flowers are blooming."),
                        ("くさ", "草", "grass", "noun", "草が青いです。", "Kusa ga aoi desu.", "The grass is green."),
                        ("は", "葉", "leaf", "noun", "葉が落ちます。", "Ha ga ochimasu.", "Leaves fall."),
                        ("たね", "種", "seed", "noun", "種をまきます。", "Tane o makimasu.", "I plant seeds."),
                        ("ばら", "薔薇", "rose", "noun", "薔薇が好きです。", "Bara ga suki desu.", "I like roses."),
                    ],
                },
                {
                    "title": "Weather Events",
                    "words": [
                        ("かみなり", "雷", "thunder", "noun", "雷が鳴っています。", "Kaminari ga natte imasu.", "Thunder is rumbling."),
                        ("じめん", "地面", "ground", "noun", "地面に座ります。", "Jimen ni suwarimasu.", "I sit on the ground."),
                        ("いし", "石", "stone, rock", "noun", "大きい石があります。", "Ookii ishi ga arimasu.", "There is a big rock."),
                        ("すな", "砂", "sand", "noun", "砂の上を歩きます。", "Suna no ue o arukimasu.", "I walk on the sand."),
                        ("ほし", "星", "star", "noun", "星が見えます。", "Hoshi ga miemasu.", "I can see stars."),
                    ],
                },
            ],
        },
        {
            "name": "Adjectives & Descriptions",
            "description": "Common adjectives and descriptive words.",
            "lessons": [
                {
                    "title": "Size & Shape",
                    "words": [
                        ("おおきい", "大きい", "big", "adjective", "大きい家です。", "Ookii ie desu.", "It is a big house."),
                        ("ちいさい", "小さい", "small", "adjective", "小さい犬です。", "Chiisai inu desu.", "It is a small dog."),
                        ("ながい", "長い", "long", "adjective", "長い道です。", "Nagai michi desu.", "It is a long road."),
                        ("みじかい", "短い", "short", "adjective", "短いスカートです。", "Mijikai sukaato desu.", "It is a short skirt."),
                        ("ふとい", "太い", "thick, fat", "adjective", "太い木です。", "Futoi ki desu.", "It is a thick tree."),
                    ],
                },
                {
                    "title": "Quality I",
                    "words": [
                        ("ほそい", "細い", "thin, slender", "adjective", "細い道です。", "Hosoi michi desu.", "It is a narrow road."),
                        ("あたらしい", "新しい", "new", "adjective", "新しい車です。", "Atarashii kuruma desu.", "It is a new car."),
                        ("ふるい", "古い", "old", "adjective", "古い本です。", "Furui hon desu.", "It is an old book."),
                        ("きれい", "綺麗", "pretty, clean", "na-adjective", "綺麗な花です。", "Kirei na hana desu.", "It is a pretty flower."),
                        ("きたない", "汚い", "dirty", "adjective", "部屋が汚いです。", "Heya ga kitanai desu.", "The room is dirty."),
                    ],
                },
                {
                    "title": "Quality II",
                    "words": [
                        ("たのしい", "楽しい", "fun, enjoyable", "adjective", "楽しい一日でした。", "Tanoshii ichinichi deshita.", "It was a fun day."),
                        ("かなしい", "悲しい", "sad", "adjective", "悲しい映画です。", "Kanashii eiga desu.", "It is a sad movie."),
                        ("うれしい", "嬉しい", "happy, glad", "adjective", "嬉しいです。", "Ureshii desu.", "I am happy."),
                        ("こわい", "怖い", "scary, afraid", "adjective", "怖い話です。", "Kowai hanashi desu.", "It is a scary story."),
                        ("おもしろい", "面白い", "interesting, funny", "adjective", "面白い本です。", "Omoshiroi hon desu.", "It is an interesting book."),
                    ],
                },
                {
                    "title": "Difficulty & Speed",
                    "words": [
                        ("むずかしい", "難しい", "difficult", "adjective", "日本語は難しいです。", "Nihongo wa muzukashii desu.", "Japanese is difficult."),
                        ("やさしい", "易しい", "easy", "adjective", "この問題は易しいです。", "Kono mondai wa yasashii desu.", "This problem is easy."),
                        ("はやい", "速い", "fast, early", "adjective", "電車は速いです。", "Densha wa hayai desu.", "The train is fast."),
                        ("おそい", "遅い", "slow, late", "adjective", "バスは遅いです。", "Basu wa osoi desu.", "The bus is slow."),
                        ("はやく", "早く", "quickly, early", "adverb", "早く来てください。", "Hayaku kite kudasai.", "Please come quickly."),
                    ],
                },
                {
                    "title": "Feelings & States",
                    "words": [
                        ("つよい", "強い", "strong", "adjective", "風が強いです。", "Kaze ga tsuyoi desu.", "The wind is strong."),
                        ("よわい", "弱い", "weak", "adjective", "体が弱いです。", "Karada ga yowai desu.", "My body is weak."),
                        ("たいせつ", "大切", "important, precious", "na-adjective", "家族は大切です。", "Kazoku wa taisetsu desu.", "Family is important."),
                        ("しんぱい", "心配", "worry", "na-adjective", "心配しないでください。", "Shinpai shinaide kudasai.", "Please do not worry."),
                        ("あんしん", "安心", "relief, peace of mind", "na-adjective", "安心しました。", "Anshin shimashita.", "I felt relieved."),
                    ],
                },
            ],
        },
        {
            "name": "Daily Life & Society",
            "description": "Money, shopping, and social vocabulary.",
            "lessons": [
                {
                    "title": "Money & Shopping",
                    "words": [
                        ("おかね", "お金", "money", "noun", "お金がありません。", "Okane ga arimasen.", "I have no money."),
                        ("つり", "釣り", "change (money)", "noun", "釣りをください。", "Tsuri o kudasai.", "Change, please."),
                        ("レシート", "", "receipt", "noun", "レシートをください。", "Reshiito o kudasai.", "A receipt, please."),
                        ("ねだん", "値段", "price", "noun", "値段を教えてください。", "Nedan o oshiete kudasai.", "Please tell me the price."),
                        ("りょうしゅうしょ", "領収書", "receipt (formal)", "noun", "領収書をください。", "Ryoushuusho o kudasai.", "A formal receipt, please."),
                    ],
                },
                {
                    "title": "Communication",
                    "words": [
                        ("でんき", "電気", "electricity, light", "noun", "電気をつけます。", "Denki o tsukemasu.", "I turn on the light."),
                        ("ラジオ", "", "radio", "noun", "ラジオを聞きます。", "Rajio o kikimasu.", "I listen to the radio."),
                        ("テレビ", "", "television", "noun", "テレビを見ます。", "Terebi o mimasu.", "I watch television."),
                        ("しんぶん", "新聞", "newspaper", "noun", "新聞を読みます。", "Shinbun o yomimasu.", "I read the newspaper."),
                        ("ざっし", "雑誌", "magazine", "noun", "雑誌を買います。", "Zasshi o kaimasu.", "I buy a magazine."),
                    ],
                },
                {
                    "title": "People & Society",
                    "words": [
                        ("じんこう", "人口", "population", "noun", "人口が多いです。", "Jinkou ga ooi desu.", "The population is large."),
                        ("せかい", "世界", "world", "noun", "世界は広いです。", "Sekai wa hiroi desu.", "The world is wide."),
                        ("くに", "国", "country", "noun", "どの国から来ましたか。", "Dono kuni kara kimashita ka.", "Which country are you from?"),
                        ("がいこく", "外国", "foreign country", "noun", "外国へ行きたいです。", "Gaikoku e ikitai desu.", "I want to go abroad."),
                        ("にほんじん", "日本人", "Japanese person", "noun", "日本人の友達がいます。", "Nihonjin no tomodachi ga imasu.", "I have a Japanese friend."),
                    ],
                },
                {
                    "title": "Time Expressions",
                    "words": [
                        ("いま", "今", "now", "noun", "今何時ですか。", "Ima nanji desu ka.", "What time is it now?"),
                        ("さっき", "さっき", "a little while ago", "adverb", "さっき食べました。", "Sakki tabemashita.", "I ate a little while ago."),
                        ("すぐ", "すぐ", "immediately, soon", "adverb", "すぐ行きます。", "Sugu ikimasu.", "I will go soon."),
                        ("ちょっと", "ちょっと", "a little, briefly", "adverb", "ちょっと待ってください。", "Chotto matte kudasai.", "Please wait a moment."),
                        ("ゆっくり", "ゆっくり", "slowly, leisurely", "adverb", "ゆっくり話してください。", "Yukkuri hanashite kudasai.", "Please speak slowly."),
                    ],
                },
                {
                    "title": "Common Verbs II",
                    "words": [
                        ("もらう", "貰う", "to receive", "verb", "プレゼントをもらいます。", "Purezento o moraimasu.", "I receive a present."),
                        ("あげる", "上げる", "to give", "verb", "花をあげます。", "Hana o agemasu.", "I give flowers."),
                        ("くれる", "くれる", "to give (to me)", "verb", "友達が本をくれました。", "Tomodachi ga hon o kuremashita.", "My friend gave me a book."),
                        ("つける", "付ける", "to turn on, attach", "verb", "電気を付けます。", "Denki o tsukemasu.", "I turn on the light."),
                        ("けす", "消す", "to turn off, erase", "verb", "テレビを消します。", "Terebi o keshimasu.", "I turn off the TV."),
                    ],
                },
                {
                    "title": "Household",
                    "words": [
                        ("せんたく", "洗濯", "laundry", "noun", "洗濯をします。", "Sentaku o shimasu.", "I do laundry."),
                        ("そうじ", "掃除", "cleaning", "noun", "掃除をします。", "Souji o shimasu.", "I clean."),
                        ("りょうり", "料理", "cooking, cuisine", "noun", "料理が好きです。", "Ryouri ga suki desu.", "I like cooking."),
                        ("ごみ", "ゴミ", "trash, garbage", "noun", "ゴミを出します。", "Gomi o dashimasu.", "I take out the trash."),
                        ("かぎ", "鍵", "key", "noun", "鍵を忘れました。", "Kagi o wasuremashita.", "I forgot the key."),
                    ],
                },
            ],
        },
        {
            "name": "Jobs & Occupations",
            "description": "Work, professions, and workplace roles.",
            "lessons": [
                {
                    "title": "Professions I",
                    "words": [
                        ("いしゃ", "医者", "doctor", "noun", "医者に行きます。", "Isha ni ikimasu.", "I go to the doctor."),
                        ("かいしゃいん", "会社員", "office worker", "noun", "父は会社員です。", "Chichi wa kaishain desu.", "My father is an office worker."),
                        ("こうむいん", "公務員", "government employee", "noun", "公務員になりたいです。", "Koumuin ni naritai desu.", "I want to become a government employee."),
                        ("エンジニア", "", "engineer", "noun", "エンジニアをしています。", "Enjinia o shite imasu.", "I work as an engineer."),
                        ("しゃしんか", "写真家", "photographer", "noun", "写真家に会いました。", "Shashinka ni aimashita.", "I met a photographer."),
                    ],
                },
                {
                    "title": "Professions II",
                    "words": [
                        ("うたうたい", "歌手", "singer", "noun", "歌手が好きです。", "Kashu ga suki desu.", "I like singers."),
                        ("さっか", "作家", "writer, author", "noun", "作家になりたいです。", "Sakka ni naritai desu.", "I want to become a writer."),
                        ("シェフ", "", "chef", "noun", "シェフの料理はおいしいです。", "Shefu no ryouri wa oishii desu.", "The chef's food is delicious."),
                        ("てんいん", "店員", "shop clerk", "noun", "店員を呼びます。", "Tenin o yobimasu.", "I call the shop clerk."),
                        ("うんてんしゅ", "運転手", "driver", "noun", "運転手さん、駅までお願いします。", "Untenshu-san, eki made onegaishimasu.", "Driver, to the station please."),
                    ],
                },
                {
                    "title": "School Roles",
                    "words": [
                        ("がくせい", "学生", "student", "noun", "私は学生です。", "Watashi wa gakusei desu.", "I am a student."),
                        ("だいがくせい", "大学生", "university student", "noun", "兄は大学生です。", "Ani wa daigakusei desu.", "My older brother is a university student."),
                        ("ちゅうがくせい", "中学生", "middle school student", "noun", "妹は中学生です。", "Imouto wa chuugakusei desu.", "My younger sister is a middle school student."),
                        ("こうこうせい", "高校生", "high school student", "noun", "弟は高校生です。", "Otouto wa koukousei desu.", "My younger brother is a high school student."),
                        ("きょうし", "教師", "teacher", "noun", "教師になりたいです。", "Kyoushi ni naritai desu.", "I want to become a teacher."),
                    ],
                },
                {
                    "title": "Work Verbs",
                    "words": [
                        ("つとめる", "勤める", "to work for", "verb", "会社に勤めています。", "Kaisha ni tsutomete imasu.", "I work for a company."),
                        ("やめる", "辞める", "to quit", "verb", "仕事を辞めます。", "Shigoto o yamemasu.", "I quit my job."),
                        ("なれる", "慣れる", "to get used to", "verb", "日本の生活に慣れました。", "Nihon no seikatsu ni naremashita.", "I got used to life in Japan."),
                        ("きめる", "決める", "to decide", "verb", "時間を決めます。", "Jikan o kimemasu.", "I decide the time."),
                        ("うける", "受ける", "to take (exam), receive", "verb", "試験を受けます。", "Shiken o ukemasu.", "I take an exam."),
                    ],
                },
            ],
        },
        {
            "name": "Directions & Position",
            "description": "Spatial words and directional vocabulary.",
            "lessons": [
                {
                    "title": "Directions I",
                    "words": [
                        ("みぎ", "右", "right", "noun", "右に曲がります。", "Migi ni magarimasu.", "Turn right."),
                        ("ひだり", "左", "left", "noun", "左へ行きます。", "Hidari e ikimasu.", "Go to the left."),
                        ("まっすぐ", "真っ直ぐ", "straight ahead", "adverb", "まっすぐ行ってください。", "Massugu itte kudasai.", "Please go straight."),
                        ("うえ", "上", "above, up", "noun", "上に本があります。", "Ue ni hon ga arimasu.", "There is a book above."),
                        ("した", "下", "below, down", "noun", "下に猫がいます。", "Shita ni neko ga imasu.", "There is a cat below."),
                    ],
                },
                {
                    "title": "Directions II",
                    "words": [
                        ("まえ", "前", "front, before", "noun", "駅の前にいます。", "Eki no mae ni imasu.", "I am in front of the station."),
                        ("うしろ", "後ろ", "behind, back", "noun", "後ろを見てください。", "Ushiro o mite kudasai.", "Please look behind."),
                        ("なか", "中", "inside, middle", "noun", "箱の中にあります。", "Hako no naka ni arimasu.", "It is inside the box."),
                        ("そと", "外", "outside", "noun", "外で遊びます。", "Soto de asobimasu.", "I play outside."),
                        ("となり", "隣", "next to, neighbor", "noun", "隣の人は親切です。", "Tonari no hito wa shinsetsu desu.", "The neighbor is kind."),
                    ],
                },
                {
                    "title": "Distance & Position",
                    "words": [
                        ("ちかく", "近く", "nearby", "noun", "駅の近くに住んでいます。", "Eki no chikaku ni sunde imasu.", "I live near the station."),
                        ("とおく", "遠く", "far, distant", "noun", "遠くに山が見えます。", "Tooku ni yama ga miemasu.", "I can see mountains in the distance."),
                        ("あいだ", "間", "between, interval", "noun", "駅と学校の間です。", "Eki to gakkou no aida desu.", "It is between the station and school."),
                        ("よこ", "横", "side, horizontal", "noun", "横に座ってください。", "Yoko ni suwatte kudasai.", "Please sit beside me."),
                        ("むこう", "向こう", "over there, opposite side", "noun", "向こうに店があります。", "Mukou ni mise ga arimasu.", "There is a shop over there."),
                    ],
                },
            ],
        },
        {
            "name": "Essential N5 Mix II",
            "description": "Additional high-frequency N5 words and phrases.",
            "lessons": [
                {
                    "title": "Frequency & Degree",
                    "words": [
                        ("ときどき", "時々", "sometimes", "adverb", "時々映画を見ます。", "Tokidoki eiga o mimasu.", "I sometimes watch movies."),
                        ("よく", "よく", "often, well", "adverb", "よく公園へ行きます。", "Yoku kouen e ikimasu.", "I often go to the park."),
                        ("あまり", "あまり", "not very (with negative)", "adverb", "あまり食べません。", "Amari tabemasen.", "I do not eat much."),
                        ("ぜんぜん", "全然", "not at all (with negative)", "adverb", "全然分かりません。", "Zenzen wakarimasen.", "I do not understand at all."),
                        ("いつも", "いつも", "always", "adverb", "いつも六時に起きます。", "Itsumo rokuji ni okimasu.", "I always wake up at six."),
                    ],
                },
                {
                    "title": "Connecting Words",
                    "words": [
                        ("でも", "でも", "but, however", "conjunction", "忙しいです。でも行きます。", "Isogashii desu. Demo ikimasu.", "I am busy. But I will go."),
                        ("そして", "そして", "and then", "conjunction", "起きて、そして朝ご飯を食べます。", "Okitte, soshite asagohan o tabemasu.", "I wake up and then eat breakfast."),
                        ("だから", "だから", "therefore, so", "conjunction", "雨です。だから行きません。", "Ame desu. Dakara ikimasen.", "It is rainy. So I will not go."),
                        ("それから", "それから", "and then, after that", "conjunction", "買い物をして、それから帰ります。", "Kaimono o shite, sorekara kaerimasu.", "I shop and then go home."),
                        ("けれども", "けれども", "but, although", "conjunction", "高いです。けれども買います。", "Takai desu. Keredomo kaimasu.", "It is expensive. But I will buy it."),
                    ],
                },
                {
                    "title": "Useful Nouns",
                    "words": [
                        ("しゅみ", "趣味", "hobby", "noun", "趣味は何ですか。", "Shumi wa nan desu ka.", "What is your hobby?"),
                        ("せいかつ", "生活", "life, living", "noun", "日本の生活は楽しいです。", "Nihon no seikatsu wa tanoshii desu.", "Life in Japan is fun."),
                        ("れきし", "歴史", "history", "noun", "歴史を勉強します。", "Rekishi o benkyou shimasu.", "I study history."),
                        ("ぶんか", "文化", "culture", "noun", "日本文化が好きです。", "Nihon bunka ga suki desu.", "I like Japanese culture."),
                        ("けいけん", "経験", "experience", "noun", "いい経験でした。", "Ii keiken deshita.", "It was a good experience."),
                    ],
                },
                {
                    "title": "More Useful Verbs",
                    "words": [
                        ("みつける", "見つける", "to find", "verb", "仕事を見つけました。", "Shigoto o mitsukemashita.", "I found a job."),
                        ("なくす", "無くす", "to lose", "verb", "鍵を無くしました。", "Kagi o nakushimashita.", "I lost my key."),
                        ("とどける", "届ける", "to deliver", "verb", "荷物を届けます。", "Nimotsu o todokemasu.", "I deliver a package."),
                        ("はこぶ", "運ぶ", "to carry, transport", "verb", "重い荷物を運びます。", "Omoi nimotsu o hakobimasu.", "I carry heavy luggage."),
                        ("なおす", "直す", "to fix, repair", "verb", "時計を直します。", "Tokei o naoshimasu.", "I fix the watch."),
                    ],
                },
                {
                    "title": "Final Essentials",
                    "words": [
                        ("じゆう", "自由", "freedom, free time", "na-adjective", "今日は自由です。", "Kyou wa jiyuu desu.", "I am free today."),
                        ("ひつよう", "必要", "necessary", "na-adjective", "パスポートが必要です。", "Pasupooto ga hitsuyou desu.", "A passport is necessary."),
                        ("だいじ", "大事", "important", "na-adjective", "大事な人です。", "Daiji na hito desu.", "They are an important person."),
                        ("べんり", "便利", "convenient", "na-adjective", "このアプリは便利です。", "Kono apuri wa benri desu.", "This app is convenient."),
                        ("ふべん", "不便", "inconvenient", "na-adjective", "ここは不便です。", "Koko wa fuben desu.", "This place is inconvenient."),
                    ],
                },
            ],
        },
    ],
}


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
