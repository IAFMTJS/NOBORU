"""Generate N5 vocabulary expansion migrations (waves 1-3)."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MIGRATIONS = ROOT / "supabase" / "migrations"

# (kana, kanji, meaning, part_of_speech, jp_example, romaji, en_example)
Word = tuple[str, str, str, str, str, str, str]

WAVES: list[dict] = [
    {
        "filename": "20260611120000_n5_vocabulary_expansion_wave1.sql",
        "title": "N5 vocabulary expansion wave 1",
        "start_order_index": 17,
        "practice_title": "N5 Vocabulary Practice: Wave 1",
        "practice_description": "Mixed recall across wave 1 N5 vocabulary.",
        "units": [
            {
                "name": "Family & Body",
                "description": "Family members and parts of the body.",
                "lessons": [
                    {
                        "title": "Family Members I",
                        "words": [
                            ("かぞく", "家族", "family", "noun", "家族は五人です。", "Kazoku wa gonin desu.", "There are five people in my family."),
                            ("おとうさん", "お父さん", "father", "noun", "お父さんは会社へ行きます。", "Otousan wa kaisha e ikimasu.", "My father goes to work."),
                            ("おかあさん", "お母さん", "mother", "noun", "お母さんは料理が上手です。", "Okaasan wa ryouri ga jouzu desu.", "My mother is good at cooking."),
                            ("おにいさん", "お兄さん", "older brother", "noun", "お兄さんは大学生です。", "Oniisan wa daigakusei desu.", "My older brother is a university student."),
                            ("おねえさん", "お姉さん", "older sister", "noun", "お姉さんは東京に住んでいます。", "Oneesan wa Toukyou ni sunde imasu.", "My older sister lives in Tokyo."),
                        ],
                    },
                    {
                        "title": "Family Members II",
                        "words": [
                            ("おとうと", "弟", "younger brother", "noun", "弟は高校生です。", "Otouto wa koukousei desu.", "My younger brother is a high school student."),
                            ("いもうと", "妹", "younger sister", "noun", "妹と公園へ行きます。", "Imouto to kouen e ikimasu.", "I go to the park with my younger sister."),
                            ("こども", "子供", "child", "noun", "子供が三人います。", "Kodomo ga sannin imasu.", "I have three children."),
                            ("おじいさん", "おじいさん", "grandfather", "noun", "おじいさんは元気です。", "Ojiisan wa genki desu.", "My grandfather is healthy."),
                            ("おばあさん", "おばあさん", "grandmother", "noun", "おばあさんの家へ行きます。", "Obaasan no ie e ikimasu.", "I go to my grandmother's house."),
                        ],
                    },
                    {
                        "title": "Body Parts I",
                        "words": [
                            ("からだ", "体", "body", "noun", "体を大切にします。", "Karada o taisetsu ni shimasu.", "I take care of my body."),
                            ("あたま", "頭", "head", "noun", "頭が痛いです。", "Atama ga itai desu.", "My head hurts."),
                            ("め", "目", "eye", "noun", "目が大きいです。", "Me ga ookii desu.", "The eyes are big."),
                            ("みみ", "耳", "ear", "noun", "音楽を耳で聞きます。", "Ongaku o mimi de kikimasu.", "I listen to music with my ears."),
                            ("はな", "鼻", "nose", "noun", "鼻が高いです。", "Hana ga takai desu.", "The nose is high."),
                        ],
                    },
                    {
                        "title": "Body Parts II",
                        "words": [
                            ("くち", "口", "mouth", "noun", "口を開けてください。", "Kuchi o akete kudasai.", "Please open your mouth."),
                            ("て", "手", "hand", "noun", "手を洗います。", "Te o araimasu.", "I wash my hands."),
                            ("あし", "足", "foot, leg", "noun", "足が疲れました。", "Ashi ga tsukaremashita.", "My legs are tired."),
                            ("かお", "顔", "face", "noun", "顔を洗います。", "Kao o araimasu.", "I wash my face."),
                            ("ゆび", "指", "finger", "noun", "指が五本あります。", "Yubi ga gohon arimasu.", "I have five fingers."),
                        ],
                    },
                ],
            },
            {
                "name": "Transport",
                "description": "Vehicles and getting around town.",
                "lessons": [
                    {
                        "title": "Vehicles I",
                        "words": [
                            ("でんしゃ", "電車", "train", "noun", "電車で学校へ行きます。", "Densha de gakkou e ikimasu.", "I go to school by train."),
                            ("バス", "", "bus", "noun", "バスに乗ります。", "Basu ni norimasu.", "I ride the bus."),
                            ("たくしー", "タクシー", "taxi", "noun", "タクシーを呼びます。", "Takushii o yobimasu.", "I call a taxi."),
                            ("じてんしゃ", "自転車", "bicycle", "noun", "自転車で公園へ行きます。", "Jitensha de kouen e ikimasu.", "I go to the park by bicycle."),
                            ("ちかてつ", "地下鉄", "subway", "noun", "地下鉄は速いです。", "Chikatetsu wa hayai desu.", "The subway is fast."),
                        ],
                    },
                    {
                        "title": "Vehicles II",
                        "words": [
                            ("ひこうき", "飛行機", "airplane", "noun", "飛行機で日本へ行きます。", "Hikouki de Nihon e ikimasu.", "I go to Japan by airplane."),
                            ("くるま", "車", "car", "noun", "車を運転します。", "Kuruma o unten shimasu.", "I drive a car."),
                            ("ふね", "船", "ship, boat", "noun", "船で島へ行きます。", "Fune de shima e ikimasu.", "I go to the island by ship."),
                            ("きっぷ", "切符", "ticket", "noun", "切符を買います。", "Kippu o kaimasu.", "I buy a ticket."),
                            ("のりば", "乗り場", "bus stop, platform", "noun", "乗り場はあそこです。", "Noriba wa asoko desu.", "The stop is over there."),
                        ],
                    },
                    {
                        "title": "Movement",
                        "words": [
                            ("のる", "乗る", "to ride, get on", "verb", "電車に乗ります。", "Densha ni norimasu.", "I get on the train."),
                            ("おりる", "降りる", "to get off", "verb", "次の駅で降ります。", "Tsugi no eki de orimasu.", "I get off at the next station."),
                            ("あるく", "歩く", "to walk", "verb", "駅まで歩きます。", "Eki made arukimasu.", "I walk to the station."),
                            ("はしる", "走る", "to run", "verb", "公園で走ります。", "Kouen de hashirimasu.", "I run in the park."),
                            ("とまる", "止まる", "to stop", "verb", "ここで止まります。", "Koko de tomarimasu.", "It stops here."),
                        ],
                    },
                    {
                        "title": "Streets & Driving",
                        "words": [
                            ("まがる", "曲がる", "to turn", "verb", "右に曲がります。", "Migi ni magarimasu.", "Turn right."),
                            ("みち", "道", "road, street", "noun", "この道をまっすぐ行きます。", "Kono michi o massugu ikimasu.", "Go straight on this road."),
                            ("かど", "角", "corner", "noun", "角を左に曲がります。", "Kado o hidari ni magarimasu.", "Turn left at the corner."),
                            ("しんごう", "信号", "traffic light", "noun", "信号を渡ります。", "Shingou o watarimasu.", "I cross at the traffic light."),
                            ("うんてん", "運転", "driving", "noun", "運転は難しいです。", "Unten wa muzukashii desu.", "Driving is difficult."),
                        ],
                    },
                ],
            },
            {
                "name": "Weather & Nature",
                "description": "Weather, seasons, and the natural world.",
                "lessons": [
                    {
                        "title": "Weather I",
                        "words": [
                            ("てんき", "天気", "weather", "noun", "今日の天気はいいです。", "Kyou no tenki wa ii desu.", "Today's weather is good."),
                            ("あめ", "雨", "rain", "noun", "雨が降っています。", "Ame ga futte imasu.", "It is raining."),
                            ("ゆき", "雪", "snow", "noun", "雪が白いです。", "Yuki ga shiroi desu.", "The snow is white."),
                            ("かぜ", "風", "wind", "noun", "風が強いです。", "Kaze ga tsuyoi desu.", "The wind is strong."),
                            ("くもり", "曇り", "cloudy", "noun", "今日は曇りです。", "Kyou wa kumori desu.", "It is cloudy today."),
                        ],
                    },
                    {
                        "title": "Weather II",
                        "words": [
                            ("はれ", "晴れ", "clear weather", "noun", "明日は晴れです。", "Ashita wa hare desu.", "Tomorrow will be clear."),
                            ("あつい", "暑い", "hot (weather)", "adjective", "今日は暑いです。", "Kyou wa atsui desu.", "It is hot today."),
                            ("さむい", "寒い", "cold (weather)", "adjective", "冬は寒いです。", "Fuyu wa samui desu.", "Winter is cold."),
                            ("あたたかい", "暖かい", "warm", "adjective", "春は暖かいです。", "Haru wa atatakai desu.", "Spring is warm."),
                            ("すずしい", "涼しい", "cool", "adjective", "秋は涼しいです。", "Aki wa suzushii desu.", "Autumn is cool."),
                        ],
                    },
                    {
                        "title": "Land & Water",
                        "words": [
                            ("やま", "山", "mountain", "noun", "山に登ります。", "Yama ni noborimasu.", "I climb the mountain."),
                            ("かわ", "川", "river", "noun", "川のそばを歩きます。", "Kawa no soba o arukimasu.", "I walk along the river."),
                            ("うみ", "海", "sea, ocean", "noun", "海で泳ぎます。", "Umi de oyogimasu.", "I swim in the sea."),
                            ("もり", "森", "forest", "noun", "森は静かです。", "Mori wa shizuka desu.", "The forest is quiet."),
                            ("き", "木", "tree", "noun", "大きい木があります。", "Ookii ki ga arimasu.", "There is a big tree."),
                        ],
                    },
                    {
                        "title": "Sky & Earth",
                        "words": [
                            ("そら", "空", "sky", "noun", "空が青いです。", "Sora ga aoi desu.", "The sky is blue."),
                            ("つき", "月", "moon", "noun", "月がきれいです。", "Tsuki ga kirei desu.", "The moon is beautiful."),
                            ("ほし", "星", "star", "noun", "星がたくさんあります。", "Hoshi ga takusan arimasu.", "There are many stars."),
                            ("いわ", "岩", "rock", "noun", "岩の上に座ります。", "Iwa no ue ni suwarimasu.", "I sit on the rock."),
                            ("くさ", "草", "grass", "noun", "草が生えています。", "Kusa ga haete imasu.", "Grass is growing."),
                        ],
                    },
                ],
            },
            {
                "name": "Colors & Shapes",
                "description": "Basic colors and shape descriptions.",
                "lessons": [
                    {
                        "title": "Colors I",
                        "words": [
                            ("あか", "赤", "red", "noun", "赤が好きです。", "Aka ga suki desu.", "I like red."),
                            ("あお", "青", "blue", "noun", "空は青いです。", "Sora wa aoi desu.", "The sky is blue."),
                            ("きいろ", "黄色", "yellow", "noun", "黄色の花です。", "Kiiro no hana desu.", "It is a yellow flower."),
                            ("しろ", "白", "white", "noun", "雪は白いです。", "Yuki wa shiroi desu.", "Snow is white."),
                            ("くろ", "黒", "black", "noun", "黒い猫がいます。", "Kuroi neko ga imasu.", "There is a black cat."),
                        ],
                    },
                    {
                        "title": "Colors II",
                        "words": [
                            ("みどり", "緑", "green", "noun", "緑の木があります。", "Midori no ki ga arimasu.", "There is a green tree."),
                            ("ちゃいろ", "茶色", "brown", "noun", "茶色のかばんです。", "Chairo no kaban desu.", "It is a brown bag."),
                            ("ピンク", "", "pink", "noun", "ピンクの花です。", "Pinku no hana desu.", "It is a pink flower."),
                            ("オレンジ", "", "orange", "noun", "オレンジを食べます。", "Orenji o tabemasu.", "I eat an orange."),
                            ("むらさき", "紫", "purple", "noun", "紫の服を着ます。", "Murasaki no fuku o kimasu.", "I wear purple clothes."),
                        ],
                    },
                    {
                        "title": "Shapes & Size I",
                        "words": [
                            ("まるい", "丸い", "round", "adjective", "丸いテーブルです。", "Marui teeburu desu.", "It is a round table."),
                            ("しかく", "四角", "square", "noun", "四角い箱です。", "Shikakui hako desu.", "It is a square box."),
                            ("ながい", "長い", "long", "adjective", "長い道です。", "Nagai michi desu.", "It is a long road."),
                            ("みじかい", "短い", "short", "adjective", "短い鉛筆です。", "Mijikai enpitsu desu.", "It is a short pencil."),
                            ("ひろい", "広い", "wide, spacious", "adjective", "部屋は広いです。", "Heya wa hiroi desu.", "The room is spacious."),
                        ],
                    },
                    {
                        "title": "Shapes & Size II",
                        "words": [
                            ("せまい", "狭い", "narrow, cramped", "adjective", "道は狭いです。", "Michi wa semai desu.", "The road is narrow."),
                            ("たかい", "高い", "tall, high, expensive", "adjective", "この山は高いです。", "Kono yama wa takai desu.", "This mountain is tall."),
                            ("ひくい", "低い", "low", "adjective", "テーブルは低いです。", "Teeburu wa hikui desu.", "The table is low."),
                            ("ふとい", "太い", "thick", "adjective", "太い木があります。", "Futoi ki ga arimasu.", "There is a thick tree."),
                            ("ほそい", "細い", "thin", "adjective", "細い道を歩きます。", "Hosoi michi o arukimasu.", "I walk on a narrow path."),
                        ],
                    },
                ],
            },
        ],
    },
    {
        "filename": "20260611130000_n5_vocabulary_expansion_wave2.sql",
        "title": "N5 vocabulary expansion wave 2",
        "start_order_index": 22,
        "practice_title": "N5 Vocabulary Practice: Wave 2",
        "practice_description": "Mixed recall across wave 2 N5 vocabulary.",
        "units": [
            {
                "name": "Adjectives",
                "description": "Common adjectives for everyday description.",
                "lessons": [
                    {
                        "title": "Feelings & Qualities I",
                        "words": [
                            ("やすい", "安い", "cheap", "adjective", "この店は安いです。", "Kono mise wa yasui desu.", "This shop is cheap."),
                            ("たのしい", "楽しい", "fun", "adjective", "今日は楽しいです。", "Kyou wa tanoshii desu.", "Today is fun."),
                            ("つまらない", "つまらない", "boring", "adjective", "この映画はつまらないです。", "Kono eiga wa tsumaranai desu.", "This movie is boring."),
                            ("むずかしい", "難しい", "difficult", "adjective", "日本語は難しいです。", "Nihongo wa muzukashii desu.", "Japanese is difficult."),
                            ("やさしい", "優しい", "kind, gentle", "adjective", "先生は優しいです。", "Sensei wa yasashii desu.", "The teacher is kind."),
                        ],
                    },
                    {
                        "title": "Feelings & Qualities II",
                        "words": [
                            ("きれい", "綺麗", "pretty, clean", "adjective", "部屋は綺麗です。", "Heya wa kirei desu.", "The room is clean."),
                            ("きたない", "汚い", "dirty", "adjective", "手が汚いです。", "Te ga kitanai desu.", "My hands are dirty."),
                            ("いそがしい", "忙しい", "busy", "adjective", "今日は忙しいです。", "Kyou wa isogashii desu.", "I am busy today."),
                            ("げんき", "元気", "healthy, energetic", "noun", "元気ですか。", "Genki desu ka.", "How are you?"),
                            ("だいじょうぶ", "大丈夫", "OK, all right", "adjective", "大丈夫です。", "Daijoubu desu.", "I am fine."),
                        ],
                    },
                    {
                        "title": "Likes & Interests",
                        "words": [
                            ("すき", "好き", "to like", "na-adjective", "音楽が好きです。", "Ongaku ga suki desu.", "I like music."),
                            ("きらい", "嫌い", "to dislike", "na-adjective", "魚が嫌いです。", "Sakana ga kirai desu.", "I dislike fish."),
                            ("だいすき", "大好き", "to love", "na-adjective", "日本が大好きです。", "Nihon ga daisuki desu.", "I love Japan."),
                            ("こわい", "怖い", "scary", "adjective", "この話は怖いです。", "Kono hanashi wa kowai desu.", "This story is scary."),
                            ("おもしろい", "面白い", "interesting", "adjective", "この本は面白いです。", "Kono hon wa omoshiroi desu.", "This book is interesting."),
                        ],
                    },
                    {
                        "title": "Speed & Taste",
                        "words": [
                            ("はやい", "早い", "fast, early", "adjective", "電車は早いです。", "Densha wa hayai desu.", "The train is fast."),
                            ("おそい", "遅い", "slow, late", "adjective", "バスは遅いです。", "Basu wa osoi desu.", "The bus is slow."),
                            ("ちかい", "近い", "near, close", "adjective", "駅は近いです。", "Eki wa chikai desu.", "The station is near."),
                            ("とおい", "遠い", "far", "adjective", "学校は遠いです。", "Gakkou wa tooi desu.", "The school is far."),
                            ("おいしい", "美味しい", "delicious", "adjective", "この料理は美味しいです。", "Kono ryouri wa oishii desu.", "This dish is delicious."),
                        ],
                    },
                    {
                        "title": "Appearance & Ease",
                        "words": [
                            ("かわいい", "可愛い", "cute", "adjective", "この猫は可愛いです。", "Kono neko wa kawaii desu.", "This cat is cute."),
                            ("かっこいい", "かっこいい", "cool, stylish", "adjective", "その車はかっこいいです。", "Sono kuruma wa kakkoii desu.", "That car is cool."),
                            ("たいへん", "大変", "tough, very", "na-adjective", "今日は大変でした。", "Kyou wa taihen deshita.", "Today was tough."),
                            ("べんり", "便利", "convenient", "na-adjective", "この駅は便利です。", "Kono eki wa benri desu.", "This station is convenient."),
                            ("ひま", "暇", "free time", "noun", "今日は暇です。", "Kyou wa hima desu.", "I am free today."),
                        ],
                    },
                ],
            },
            {
                "name": "Question Words",
                "description": "Essential question words for N5 conversation.",
                "lessons": [
                    {
                        "title": "Basic Questions",
                        "words": [
                            ("なに", "何", "what", "pronoun", "これは何ですか。", "Kore wa nan desu ka.", "What is this?"),
                            ("だれ", "誰", "who", "pronoun", "あの人は誰ですか。", "Ano hito wa dare desu ka.", "Who is that person?"),
                            ("どこ", "どこ", "where", "pronoun", "トイレはどこですか。", "Toire wa doko desu ka.", "Where is the restroom?"),
                            ("いつ", "いつ", "when", "pronoun", "いつ行きますか。", "Itsu ikimasu ka.", "When will you go?"),
                            ("どう", "どう", "how", "adverb", "日本語はどうですか。", "Nihongo wa dou desu ka.", "How is your Japanese?"),
                        ],
                    },
                    {
                        "title": "Why & Which",
                        "words": [
                            ("なぜ", "なぜ", "why", "adverb", "なぜ来ませんか。", "Naze kimasen ka.", "Why won't you come?"),
                            ("どうして", "どうして", "why", "adverb", "どうして遅いですか。", "Doushite osoi desu ka.", "Why are you late?"),
                            ("なんで", "なんで", "why (casual)", "adverb", "なんで行きますか。", "Nande ikimasu ka.", "Why are you going?"),
                            ("どれ", "どれ", "which one", "pronoun", "どれがいいですか。", "Dore ga ii desu ka.", "Which one is good?"),
                            ("どの", "どの", "which", "determiner", "どの本ですか。", "Dono hon desu ka.", "Which book is it?"),
                        ],
                    },
                    {
                        "title": "How Much & How Many",
                        "words": [
                            ("いくら", "いくら", "how much", "pronoun", "これはいくらですか。", "Kore wa ikura desu ka.", "How much is this?"),
                            ("いくつ", "いくつ", "how many", "pronoun", "りんごはいくつありますか。", "Ringo wa ikutsu arimasu ka.", "How many apples are there?"),
                            ("どのくらい", "どのくらい", "how much, how long", "adverb", "どのくらいかかりますか。", "Dono kurai kakarimasu ka.", "How long does it take?"),
                            ("どちら", "どちら", "which (polite), where", "pronoun", "どちらがいいですか。", "Dochira ga ii desu ka.", "Which would you prefer?"),
                            ("どんな", "どんな", "what kind of", "determiner", "どんな音楽が好きですか。", "Donna ongaku ga suki desu ka.", "What kind of music do you like?"),
                        ],
                    },
                    {
                        "title": "Time & People Questions",
                        "words": [
                            ("なんじ", "何時", "what time", "pronoun", "今何時ですか。", "Ima nanji desu ka.", "What time is it now?"),
                            ("なんにん", "何人", "how many people", "pronoun", "家族は何人ですか。", "Kazoku wa nannin desu ka.", "How many people are in your family?"),
                            ("なんさい", "何歳", "how old", "pronoun", "おいくつですか。", "Oikutsu desu ka.", "How old are you?"),
                            ("なんようび", "何曜日", "what day of the week", "pronoun", "今日は何曜日ですか。", "Kyou wa nanyoubi desu ka.", "What day is it today?"),
                            ("なにか", "何か", "something, anything", "pronoun", "何か食べますか。", "Nanika tabemasu ka.", "Will you eat something?"),
                        ],
                    },
                ],
            },
            {
                "name": "Daily Objects",
                "description": "Things you use at home, school, and work.",
                "lessons": [
                    {
                        "title": "Study & Writing",
                        "words": [
                            ("ほん", "本", "book", "noun", "本を読みます。", "Hon o yomimasu.", "I read a book."),
                            ("えんぴつ", "鉛筆", "pencil", "noun", "鉛筆で書きます。", "Enpitsu de kakimasu.", "I write with a pencil."),
                            ("ペン", "", "pen", "noun", "ペンを貸してください。", "Pen o kashite kudasai.", "Please lend me a pen."),
                            ("ノート", "", "notebook", "noun", "ノートに書きます。", "Nooto ni kakimasu.", "I write in a notebook."),
                            ("かみ", "紙", "paper", "noun", "紙が必要です。", "Kami ga hitsuyou desu.", "I need paper."),
                        ],
                    },
                    {
                        "title": "Personal Items",
                        "words": [
                            ("かさ", "傘", "umbrella", "noun", "傘を持っています。", "Kasa o motte imasu.", "I have an umbrella."),
                            ("かばん", "鞄", "bag", "noun", "かばんの中に本があります。", "Kaban no naka ni hon ga arimasu.", "There is a book in the bag."),
                            ("かぎ", "鍵", "key", "noun", "鍵を忘れました。", "Kagi o wasuremashita.", "I forgot the key."),
                            ("さいふ", "財布", "wallet", "noun", "財布を落としました。", "Saifu o otoshimashita.", "I dropped my wallet."),
                            ("とけい", "時計", "clock, watch", "noun", "時計を見ます。", "Tokei o mimasu.", "I look at the clock."),
                        ],
                    },
                    {
                        "title": "Clothing & Accessories",
                        "words": [
                            ("くつ", "靴", "shoes", "noun", "新しい靴を買います。", "Atarashii kutsu o kaimasu.", "I buy new shoes."),
                            ("ふく", "服", "clothes", "noun", "服を着ます。", "Fuku o kimasu.", "I put on clothes."),
                            ("ぼうし", "帽子", "hat", "noun", "帽子をかぶります。", "Boushi o kaburimasu.", "I wear a hat."),
                            ("メガネ", "", "glasses", "noun", "メガネをかけます。", "Megane o kakemasu.", "I wear glasses."),
                            ("タオル", "", "towel", "noun", "タオルで手を拭きます。", "Taoru de te o fukimasu.", "I wipe my hands with a towel."),
                        ],
                    },
                    {
                        "title": "Communication",
                        "words": [
                            ("でんわ", "電話", "telephone", "noun", "電話をかけます。", "Denwa o kakemasu.", "I make a phone call."),
                            ("てがみ", "手紙", "letter", "noun", "手紙を書きます。", "Tegami o kakimasu.", "I write a letter."),
                            ("しゃしん", "写真", "photo", "noun", "写真を撮ります。", "Shashin o torimasu.", "I take a photo."),
                            ("かね", "お金", "money", "noun", "お金がありません。", "Okane ga arimasen.", "I have no money."),
                            ("はさみ", "はさみ", "scissors", "noun", "はさみで切ります。", "Hasami de kirimasu.", "I cut with scissors."),
                        ],
                    },
                    {
                        "title": "Furniture & Rooms",
                        "words": [
                            ("テーブル", "", "table", "noun", "テーブルの上に本があります。", "Teeburu no ue ni hon ga arimasu.", "There is a book on the table."),
                            ("いす", "椅子", "chair", "noun", "椅子に座ります。", "Isu ni suwarimasu.", "I sit on a chair."),
                            ("ドア", "", "door", "noun", "ドアを開けます。", "Doa o akemasu.", "I open the door."),
                            ("まど", "窓", "window", "noun", "窓を閉めます。", "Mado o shimemasu.", "I close the window."),
                            ("ベッド", "", "bed", "noun", "ベッドで寝ます。", "Beddo de nemasu.", "I sleep in bed."),
                        ],
                    },
                ],
            },
            {
                "name": "More Places",
                "description": "Additional locations around town.",
                "lessons": [
                    {
                        "title": "Public Services",
                        "words": [
                            ("としょかん", "図書館", "library", "noun", "図書館で勉強します。", "Toshokan de benkyou shimasu.", "I study at the library."),
                            ("びょういん", "病院", "hospital", "noun", "病院へ行きます。", "Byouin e ikimasu.", "I go to the hospital."),
                            ("ぎんこう", "銀行", "bank", "noun", "銀行でお金を下ろします。", "Ginkou de okane o oroshimasu.", "I withdraw money at the bank."),
                            ("ゆうびんきょく", "郵便局", "post office", "noun", "郵便局で手紙を出します。", "Yuubinkyoku de tegami o dashimasu.", "I mail a letter at the post office."),
                            ("こうえん", "公園", "park", "noun", "公園で遊びます。", "Kouen de asobimasu.", "I play in the park."),
                        ],
                    },
                    {
                        "title": "Shops & Dining",
                        "words": [
                            ("レストラン", "", "restaurant", "noun", "レストランで食べます。", "Resutoran de tabemasu.", "I eat at a restaurant."),
                            ("スーパー", "", "supermarket", "noun", "スーパーで買い物します。", "Suupaa de kaimono shimasu.", "I shop at the supermarket."),
                            ("コンビニ", "", "convenience store", "noun", "コンビニは便利です。", "Konbini wa benri desu.", "The convenience store is handy."),
                            ("ホテル", "", "hotel", "noun", "ホテルに泊まります。", "Hoteru ni tomarimasu.", "I stay at a hotel."),
                            ("トイレ", "", "toilet, restroom", "noun", "トイレはあそこです。", "Toire wa asoko desu.", "The restroom is over there."),
                        ],
                    },
                    {
                        "title": "Home & Rooms",
                        "words": [
                            ("うち", "うち", "home, house", "noun", "うちに帰ります。", "Uchi ni kaerimasu.", "I return home."),
                            ("へや", "部屋", "room", "noun", "部屋を掃除します。", "Heya o souji shimasu.", "I clean the room."),
                            ("おてあらい", "お手洗い", "restroom", "noun", "お手洗いはどこですか。", "Otearai wa doko desu ka.", "Where is the restroom?"),
                            ("にわ", "庭", "garden", "noun", "庭に花があります。", "Niwa ni hana ga arimasu.", "There are flowers in the garden."),
                            ("エレベーター", "", "elevator", "noun", "エレベーターで上がります。", "Erebeetaa de agarimasu.", "I go up by elevator."),
                        ],
                    },
                    {
                        "title": "Town & City",
                        "words": [
                            ("まち", "町", "town", "noun", "この町は静かです。", "Kono machi wa shizuka desu.", "This town is quiet."),
                            ("し", "市", "city", "noun", "市の中心へ行きます。", "Shi no chuushin e ikimasu.", "I go to the city center."),
                            ("けいさつ", "警察", "police", "noun", "警察を呼びます。", "Keisatsu o yobimasu.", "I call the police."),
                            ("うりば", "売り場", "sales floor, section", "noun", "本の売り場はどこですか。", "Hon no uriba wa doko desu ka.", "Where is the book section?"),
                            ("かいだん", "階段", "stairs", "noun", "階段を上ります。", "Kaidan o noborimasu.", "I go up the stairs."),
                        ],
                    },
                ],
            },
        ],
    },
    {
        "filename": "20260611140000_n5_vocabulary_expansion_wave3.sql",
        "title": "N5 vocabulary expansion wave 3",
        "start_order_index": 27,
        "practice_title": "N5 Vocabulary Practice: Wave 3",
        "practice_description": "Mixed recall across wave 3 N5 vocabulary.",
        "units": [
            {
                "name": "More Verbs",
                "description": "Essential verbs for daily life.",
                "lessons": [
                    {
                        "title": "Study & Communication",
                        "words": [
                            ("かく", "書く", "to write", "verb", "手紙を書きます。", "Tegami o kakimasu.", "I write a letter."),
                            ("きく", "聞く", "to listen, ask", "verb", "音楽を聞きます。", "Ongaku o kikimasu.", "I listen to music."),
                            ("はなす", "話す", "to speak", "verb", "日本語を話します。", "Nihongo o hanashimasu.", "I speak Japanese."),
                            ("よむ", "読む", "to read", "verb", "新聞を読みます。", "Shinbun o yomimasu.", "I read the newspaper."),
                            ("べんきょうする", "勉強する", "to study", "verb", "毎日勉強します。", "Mainichi benkyou shimasu.", "I study every day."),
                        ],
                    },
                    {
                        "title": "Daily Routine",
                        "words": [
                            ("ねる", "寝る", "to sleep", "verb", "十時に寝ます。", "Juu ji ni nemasu.", "I sleep at ten o'clock."),
                            ("おきる", "起きる", "to wake up", "verb", "六時に起きます。", "Roku ji ni okimasu.", "I wake up at six o'clock."),
                            ("はたらく", "働く", "to work", "verb", "会社で働きます。", "Kaisha de hatarakimasu.", "I work at a company."),
                            ("かう", "買う", "to buy", "verb", "本を買います。", "Hon o kaimasu.", "I buy a book."),
                            ("うる", "売る", "to sell", "verb", "店で服を売ります。", "Mise de fuku o urimasu.", "The shop sells clothes."),
                        ],
                    },
                    {
                        "title": "Actions & Movement",
                        "words": [
                            ("つくる", "作る", "to make", "verb", "ご飯を作ります。", "Gohan o tsukurimasu.", "I make a meal."),
                            ("あそぶ", "遊ぶ", "to play", "verb", "友達と遊びます。", "Tomodachi to asobimasu.", "I play with a friend."),
                            ("まつ", "待つ", "to wait", "verb", "ここで待ちます。", "Koko de machimasu.", "I wait here."),
                            ("あう", "会う", "to meet", "verb", "駅で会いましょう。", "Eki de aimashou.", "Let's meet at the station."),
                            ("でかける", "出かける", "to go out", "verb", "買い物に出かけます。", "Kaimono ni dekakemasu.", "I go out shopping."),
                        ],
                    },
                    {
                        "title": "Open, Close & Enter",
                        "words": [
                            ("かえる", "帰る", "to return home", "verb", "五時に帰ります。", "Go ji ni kaerimasu.", "I return home at five."),
                            ("いれる", "入れる", "to put in", "verb", "かばんに本を入れます。", "Kaban ni hon o iremasu.", "I put a book in the bag."),
                            ("だす", "出す", "to take out", "verb", "財布を出します。", "Saifu o dashimasu.", "I take out my wallet."),
                            ("あける", "開ける", "to open", "verb", "窓を開けます。", "Mado o akemasu.", "I open the window."),
                            ("しめる", "閉める", "to close", "verb", "ドアを閉めます。", "Doa o shimemasu.", "I close the door."),
                        ],
                    },
                    {
                        "title": "Know & Use",
                        "words": [
                            ("はいる", "入る", "to enter", "verb", "部屋に入ります。", "Heya ni hairimasu.", "I enter the room."),
                            ("でる", "出る", "to exit, leave", "verb", "家を出ます。", "Ie o demasu.", "I leave the house."),
                            ("つかう", "使う", "to use", "verb", "ペンを使います。", "Pen o tsukaimasu.", "I use a pen."),
                            ("わかる", "分かる", "to understand", "verb", "日本語が分かります。", "Nihongo ga wakarimasu.", "I understand Japanese."),
                            ("しる", "知る", "to know", "verb", "その人を知っています。", "Sono hito o shitte imasu.", "I know that person."),
                        ],
                    },
                ],
            },
            {
                "name": "Time & Calendar",
                "description": "Days, weeks, months, and seasons.",
                "lessons": [
                    {
                        "title": "Daily & Weekly",
                        "words": [
                            ("まいにち", "毎日", "every day", "noun", "毎日勉強します。", "Mainichi benkyou shimasu.", "I study every day."),
                            ("まいしゅう", "毎週", "every week", "noun", "毎週日曜日に休みます。", "Maishuu nichiyoubi ni yasumimasu.", "I rest every Sunday."),
                            ("まいつき", "毎月", "every month", "noun", "毎月本を買います。", "Maitsuki hon o kaimasu.", "I buy a book every month."),
                            ("まいとし", "毎年", "every year", "noun", "毎年日本へ行きます。", "Maitoshi Nihon e ikimasu.", "I go to Japan every year."),
                            ("あさ", "朝", "morning", "noun", "朝ご飯を食べます。", "Asa gohan o tabemasu.", "I eat breakfast."),
                        ],
                    },
                    {
                        "title": "Parts of the Day",
                        "words": [
                            ("ひる", "昼", "noon, daytime", "noun", "昼ご飯を食べます。", "Hiru gohan o tabemasu.", "I eat lunch."),
                            ("よる", "夜", "night", "noun", "夜は静かです。", "Yoru wa shizuka desu.", "It is quiet at night."),
                            ("ばん", "晩", "evening", "noun", "晩ご飯を作ります。", "Ban gohan o tsukurimasu.", "I make dinner."),
                            ("せんしゅう", "先週", "last week", "noun", "先週東京へ行きました。", "Senshuu Toukyou e ikimashita.", "I went to Tokyo last week."),
                            ("こんしゅう", "今週", "this week", "noun", "今週は忙しいです。", "Konshuu wa isogashii desu.", "I am busy this week."),
                        ],
                    },
                    {
                        "title": "Weeks & Months",
                        "words": [
                            ("らいしゅう", "来週", "next week", "noun", "来週試験があります。", "Raishuu shiken ga arimasu.", "There is an exam next week."),
                            ("せんげつ", "先月", "last month", "noun", "先月日本へ行きました。", "Sengetsu Nihon e ikimashita.", "I went to Japan last month."),
                            ("こんげつ", "今月", "this month", "noun", "今月は忙しいです。", "Kongetsu wa isogashii desu.", "I am busy this month."),
                            ("らいげつ", "来月", "next month", "noun", "来月旅行します。", "Raigetsu ryokou shimasu.", "I will travel next month."),
                            ("ようび", "曜日", "day of the week", "noun", "今日は何曜日ですか。", "Kyou wa nanyoubi desu ka.", "What day is today?"),
                        ],
                    },
                    {
                        "title": "Seasons & Monday",
                        "words": [
                            ("はる", "春", "spring", "noun", "春は暖かいです。", "Haru wa atatakai desu.", "Spring is warm."),
                            ("なつ", "夏", "summer", "noun", "夏は暑いです。", "Natsu wa atsui desu.", "Summer is hot."),
                            ("あき", "秋", "autumn", "noun", "秋は涼しいです。", "Aki wa suzushii desu.", "Autumn is cool."),
                            ("ふゆ", "冬", "winter", "noun", "冬は寒いです。", "Fuyu wa samui desu.", "Winter is cold."),
                            ("げつようび", "月曜日", "Monday", "noun", "月曜日に学校へ行きます。", "Getsuyoubi ni gakkou e ikimasu.", "I go to school on Monday."),
                        ],
                    },
                ],
            },
            {
                "name": "Counters & Quantities",
                "description": "Numbers, counters, and amounts.",
                "lessons": [
                    {
                        "title": "Numbers 6-10",
                        "words": [
                            ("ろく", "六", "six", "noun", "六時に起きます。", "Roku ji ni okimasu.", "I wake up at six."),
                            ("なな", "七", "seven", "noun", "七つあります。", "Nanatsu arimasu.", "There are seven."),
                            ("はち", "八", "eight", "noun", "八人います。", "Hachinin imasu.", "There are eight people."),
                            ("きゅう", "九", "nine", "noun", "九時に寝ます。", "Kyuu ji ni nemasu.", "I sleep at nine."),
                            ("じゅう", "十", "ten", "noun", "十ページ読みます。", "Juu peeji yomimasu.", "I read ten pages."),
                        ],
                    },
                    {
                        "title": "Large Numbers",
                        "words": [
                            ("ひゃく", "百", "hundred", "noun", "百円です。", "Hyaku en desu.", "It is one hundred yen."),
                            ("せん", "千", "thousand", "noun", "千円あります。", "Sen en arimasu.", "I have one thousand yen."),
                            ("まん", "万", "ten thousand", "noun", "一万円です。", "Ichiman en desu.", "It is ten thousand yen."),
                            ("すうじ", "数字", "number, numeral", "noun", "数字を書きます。", "Suuji o kakimasu.", "I write numbers."),
                            ("たくさん", "たくさん", "many, a lot", "adverb", "人がたくさんいます。", "Hito ga takusan imasu.", "There are many people."),
                        ],
                    },
                    {
                        "title": "Amounts",
                        "words": [
                            ("すこし", "少し", "a little", "adverb", "少し待ってください。", "Sukoshi matte kudasai.", "Please wait a little."),
                            ("ぜんぶ", "全部", "all, entire", "noun", "全部食べました。", "Zenbu tabemashita.", "I ate everything."),
                            ("はんぶん", "半分", "half", "noun", "半分ください。", "Hanbun kudasai.", "Half please."),
                            ("だいぶ", "だいぶ", "considerably", "adverb", "だいぶ分かりました。", "Daibu wakarimashita.", "I understood considerably."),
                            ("もっと", "もっと", "more", "adverb", "もっと食べます。", "Motto tabemasu.", "I will eat more."),
                        ],
                    },
                    {
                        "title": "Native Counters I",
                        "words": [
                            ("いちばん", "一番", "number one, most", "noun", "一番好きです。", "Ichiban suki desu.", "I like it the most."),
                            ("ふたつ", "二つ", "two (things)", "noun", "二つください。", "Futatsu kudasai.", "Two please."),
                            ("みっつ", "三つ", "three (things)", "noun", "三つあります。", "Mittsu arimasu.", "There are three."),
                            ("よっつ", "四つ", "four (things)", "noun", "四つ買います。", "Yottsu kaimasu.", "I buy four."),
                            ("いつつ", "五つ", "five (things)", "noun", "五つ持っています。", "Itsutsu motte imasu.", "I have five."),
                        ],
                    },
                    {
                        "title": "Native Counters II",
                        "words": [
                            ("むっつ", "六つ", "six (things)", "noun", "六つあります。", "Muttsu arimasu.", "There are six."),
                            ("ななつ", "七つ", "seven (things)", "noun", "七つ食べました。", "Nanatsu tabemashita.", "I ate seven."),
                            ("やっつ", "八つ", "eight (things)", "noun", "八つ買いました。", "Yattsu kaimashita.", "I bought eight."),
                            ("ここのつ", "九つ", "nine (things)", "noun", "九つあります。", "Kokonotsu arimasu.", "There are nine."),
                            ("とお", "十", "ten (things)", "noun", "十あります。", "Too arimasu.", "There are ten."),
                        ],
                    },
                ],
            },
            {
                "name": "N5 Core Mix",
                "description": "Pronouns, demonstratives, and essential phrases.",
                "lessons": [
                    {
                        "title": "People & Pronouns",
                        "words": [
                            ("あなた", "あなた", "you", "pronoun", "あなたは学生ですか。", "Anata wa gakusei desu ka.", "Are you a student?"),
                            ("かれ", "彼", "he", "pronoun", "彼は先生です。", "Kare wa sensei desu.", "He is a teacher."),
                            ("かのじょ", "彼女", "she", "pronoun", "彼女は日本人です。", "Kanojo wa nihonjin desu.", "She is Japanese."),
                            ("だれか", "誰か", "someone", "pronoun", "誰かいますか。", "Dareka imasu ka.", "Is someone there?"),
                            ("みんな", "みんな", "everyone", "pronoun", "みんな来ました。", "Minna kimashita.", "Everyone came."),
                        ],
                    },
                    {
                        "title": "This & That",
                        "words": [
                            ("これ", "これ", "this", "pronoun", "これは何ですか。", "Kore wa nan desu ka.", "What is this?"),
                            ("それ", "それ", "that", "pronoun", "それは本です。", "Sore wa hon desu.", "That is a book."),
                            ("あれ", "あれ", "that over there", "pronoun", "あれは駅です。", "Are wa eki desu.", "That over there is the station."),
                            ("この", "この", "this (modifier)", "determiner", "この本は面白いです。", "Kono hon wa omoshiroi desu.", "This book is interesting."),
                            ("その", "その", "that (modifier)", "determiner", "その人は誰ですか。", "Sono hito wa dare desu ka.", "Who is that person?"),
                        ],
                    },
                    {
                        "title": "Here & There",
                        "words": [
                            ("あの", "あの", "that (over there, modifier)", "determiner", "あの店は安いです。", "Ano mise wa yasui desu.", "That shop over there is cheap."),
                            ("ここ", "ここ", "here", "pronoun", "ここに座ってください。", "Koko ni suwatte kudasai.", "Please sit here."),
                            ("そこ", "そこ", "there", "pronoun", "そこに本があります。", "Soko ni hon ga arimasu.", "There is a book there."),
                            ("あそこ", "あそこ", "over there", "pronoun", "あそこは公園です。", "Asoko wa kouen desu.", "Over there is the park."),
                            ("どこか", "どこか", "somewhere", "pronoun", "どこかへ行きます。", "Dokoka e ikimasu.", "I will go somewhere."),
                        ],
                    },
                    {
                        "title": "Essential Phrases",
                        "words": [
                            ("はい", "はい", "yes", "interjection", "はい、分かりました。", "Hai, wakarimashita.", "Yes, I understand."),
                            ("いいえ", "いいえ", "no", "interjection", "いいえ、違います。", "Iie, chigaimasu.", "No, that is wrong."),
                            ("ありがとう", "ありがとう", "thank you", "interjection", "ありがとうございます。", "Arigatou gozaimasu.", "Thank you very much."),
                            ("すみません", "すみません", "excuse me, sorry", "interjection", "すみません、遅れました。", "Sumimasen, okuremashita.", "Sorry, I am late."),
                            ("おねがいします", "お願いします", "please", "interjection", "水をお願いします。", "Mizu o onegaishimasu.", "Water, please."),
                        ],
                    },
                ],
            },
        ],
    },
]


def sql_str(value: str) -> str:
    return value.replace("'", "''")


def collect_words(units: list[dict]) -> list[Word]:
    seen: set[str] = set()
    words: list[Word] = []
    for unit in units:
        for lesson in unit["lessons"]:
            for word in lesson["words"]:
                kana = word[0]
                if kana in seen:
                    continue
                seen.add(kana)
                words.append(word)
    return words


def build_vocab_values(units: list[dict]) -> str:
    rows = []
    for word in collect_words(units):
        kana, kanji, meaning, pos = word[0], word[1], word[2], word[3]
        kanji_sql = f"'{sql_str(kanji)}'" if kanji else "null"
        rows.append(
            f"    ('{sql_str(kana)}', {kanji_sql}, '{sql_str(meaning)}', "
            f"'{sql_str(pos)}', 'n5'::public.jlpt_level, 'published'::public.content_status)"
        )
    return ",\n".join(rows)


def build_example_seed_block(units: list[dict]) -> str:
    rows = []
    for word in collect_words(units):
        kana, _, _, _, jp, romaji, en = word
        rows.append(
            f"    ('{sql_str(kana)}', '{sql_str(jp)}', '{sql_str(romaji)}', '{sql_str(en)}')"
        )

    return f"""
insert into public.vocabulary_examples (
  vocabulary_id, japanese_text, romaji, english, order_index, status
)
select v.id, e.japanese_text, e.romaji, e.english, 0, 'published'
from public.vocabulary v
inner join (
  values
{",\n".join(rows)}
) as e(kana, japanese_text, romaji, english) on e.kana = v.kana
where v.jlpt_level = 'n5'
  and not exists (
    select 1 from public.vocabulary_examples existing
    where existing.vocabulary_id = v.id
      and existing.japanese_text = e.japanese_text
  );
"""


def build_curriculum_block(wave: dict) -> str:
    units = wave["units"]
    start_index = wave["start_order_index"]
    parts = [
        "  select id into region_id from public.regions where slug = 'mount-n5' limit 1;",
        "  if region_id is null then return; end if;",
    ]

    for offset, unit in enumerate(units):
        order_index = start_index + offset
        parts.append(
            f"""
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, '{sql_str(unit["name"])}', '{sql_str(unit["description"])}', {order_index}, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = '{sql_str(unit["name"])}'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = '{sql_str(unit["name"])}' limit 1;"""
        )
        for lesson in unit["lessons"]:
            title = lesson["title"]
            kana_list = [word[0] for word in lesson["words"]]
            kana_array = ", ".join(f"'{sql_str(kana)}'" for kana in kana_list)
            parts.append(
                f"""
  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', '{sql_str(title)}', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = '{sql_str(title)}'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = '{sql_str(title)}' limit 1;

    if lesson_id is not null then
      word_kana_list := array[{kana_array}];
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
  end if;"""
            )

    practice_kana = []
    for unit in units:
        for lesson in unit["lessons"]:
            if lesson["words"]:
                practice_kana.append(lesson["words"][0][0])

    practice_order = start_index + len(units)
    practice_unit_name = f"{wave['practice_title']} Unit"
    parts.append(
        f"""
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, '{sql_str(practice_unit_name)}', '{sql_str(wave["practice_description"])}', {practice_order}, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = '{sql_str(practice_unit_name)}'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = '{sql_str(practice_unit_name)}' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', '{sql_str(wave["practice_title"])}', '{sql_str(wave["practice_description"])}', 2, 20, 8, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = '{sql_str(wave["practice_title"])}'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = '{sql_str(wave["practice_title"])}' limit 1;

    if lesson_id is not null then
      word_kana_list := array[{", ".join(f"'{sql_str(kana)}'" for kana in practice_kana)}];
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
  end if;"""
    )

    return "\n".join(parts)


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


def count_lessons(units: list[dict]) -> int:
    return sum(len(unit["lessons"]) for unit in units)


def main() -> None:
    for wave in WAVES:
        out = MIGRATIONS / wave["filename"]
        sql = build_wave_sql(wave)
        out.write_text(sql, encoding="utf-8")
        words = collect_words(wave["units"])
        lessons = count_lessons(wave["units"])
        print(
            f"Wrote {out.name}: {len(words)} unique words, "
            f"{lessons} vocabulary lessons + 1 practice lesson"
        )


if __name__ == "__main__":
    main()
