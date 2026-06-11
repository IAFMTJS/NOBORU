-- N5 vocabulary expansion wave 1

insert into public.vocabulary (kana, kanji, meaning, part_of_speech, jlpt_level, status)
select v.kana, v.kanji, v.meaning, v.part_of_speech, v.jlpt_level, v.status
from (
  values
    ('かぞく', '家族', 'family', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おとうさん', 'お父さん', 'father', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おかあさん', 'お母さん', 'mother', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おにいさん', 'お兄さん', 'older brother', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おねえさん', 'お姉さん', 'older sister', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おとうと', '弟', 'younger brother', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いもうと', '妹', 'younger sister', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('こども', '子供', 'child', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おじいさん', 'おじいさん', 'grandfather', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おばあさん', 'おばあさん', 'grandmother', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('からだ', '体', 'body', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あたま', '頭', 'head', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('め', '目', 'eye', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みみ', '耳', 'ear', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はな', '鼻', 'nose', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くち', '口', 'mouth', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('て', '手', 'hand', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あし', '足', 'foot, leg', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かお', '顔', 'face', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ゆび', '指', 'finger', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('でんしゃ', '電車', 'train', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('バス', null, 'bus', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たくしー', 'タクシー', 'taxi', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じてんしゃ', '自転車', 'bicycle', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ちかてつ', '地下鉄', 'subway', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひこうき', '飛行機', 'airplane', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くるま', '車', 'car', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふね', '船', 'ship, boat', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きっぷ', '切符', 'ticket', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('のりば', '乗り場', 'bus stop, platform', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('のる', '乗る', 'to ride, get on', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おりる', '降りる', 'to get off', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あるく', '歩く', 'to walk', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はしる', '走る', 'to run', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('とまる', '止まる', 'to stop', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まがる', '曲がる', 'to turn', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みち', '道', 'road, street', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かど', '角', 'corner', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しんごう', '信号', 'traffic light', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うんてん', '運転', 'driving', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('てんき', '天気', 'weather', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あめ', '雨', 'rain', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ゆき', '雪', 'snow', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かぜ', '風', 'wind', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くもり', '曇り', 'cloudy', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('はれ', '晴れ', 'clear weather', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あつい', '暑い', 'hot (weather)', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さむい', '寒い', 'cold (weather)', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あたたかい', '暖かい', 'warm', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('すずしい', '涼しい', 'cool', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('やま', '山', 'mountain', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('かわ', '川', 'river', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('うみ', '海', 'sea, ocean', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('もり', '森', 'forest', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('き', '木', 'tree', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('そら', '空', 'sky', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('つき', '月', 'moon', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ほし', '星', 'star', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いわ', '岩', 'rock', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くさ', '草', 'grass', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あか', '赤', 'red', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あお', '青', 'blue', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きいろ', '黄色', 'yellow', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しろ', '白', 'white', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くろ', '黒', 'black', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みどり', '緑', 'green', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ちゃいろ', '茶色', 'brown', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ピンク', null, 'pink', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('オレンジ', null, 'orange', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('むらさき', '紫', 'purple', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('まるい', '丸い', 'round', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('しかく', '四角', 'square', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ながい', '長い', 'long', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みじかい', '短い', 'short', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひろい', '広い', 'wide, spacious', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('せまい', '狭い', 'narrow, cramped', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たかい', '高い', 'tall, high, expensive', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひくい', '低い', 'low', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふとい', '太い', 'thick', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ほそい', '細い', 'thin', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status)
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
    ('かぞく', '家族は五人です。', 'Kazoku wa gonin desu.', 'There are five people in my family.'),
    ('おとうさん', 'お父さんは会社へ行きます。', 'Otousan wa kaisha e ikimasu.', 'My father goes to work.'),
    ('おかあさん', 'お母さんは料理が上手です。', 'Okaasan wa ryouri ga jouzu desu.', 'My mother is good at cooking.'),
    ('おにいさん', 'お兄さんは大学生です。', 'Oniisan wa daigakusei desu.', 'My older brother is a university student.'),
    ('おねえさん', 'お姉さんは東京に住んでいます。', 'Oneesan wa Toukyou ni sunde imasu.', 'My older sister lives in Tokyo.'),
    ('おとうと', '弟は高校生です。', 'Otouto wa koukousei desu.', 'My younger brother is a high school student.'),
    ('いもうと', '妹と公園へ行きます。', 'Imouto to kouen e ikimasu.', 'I go to the park with my younger sister.'),
    ('こども', '子供が三人います。', 'Kodomo ga sannin imasu.', 'I have three children.'),
    ('おじいさん', 'おじいさんは元気です。', 'Ojiisan wa genki desu.', 'My grandfather is healthy.'),
    ('おばあさん', 'おばあさんの家へ行きます。', 'Obaasan no ie e ikimasu.', 'I go to my grandmother''s house.'),
    ('からだ', '体を大切にします。', 'Karada o taisetsu ni shimasu.', 'I take care of my body.'),
    ('あたま', '頭が痛いです。', 'Atama ga itai desu.', 'My head hurts.'),
    ('め', '目が大きいです。', 'Me ga ookii desu.', 'The eyes are big.'),
    ('みみ', '音楽を耳で聞きます。', 'Ongaku o mimi de kikimasu.', 'I listen to music with my ears.'),
    ('はな', '鼻が高いです。', 'Hana ga takai desu.', 'The nose is high.'),
    ('くち', '口を開けてください。', 'Kuchi o akete kudasai.', 'Please open your mouth.'),
    ('て', '手を洗います。', 'Te o araimasu.', 'I wash my hands.'),
    ('あし', '足が疲れました。', 'Ashi ga tsukaremashita.', 'My legs are tired.'),
    ('かお', '顔を洗います。', 'Kao o araimasu.', 'I wash my face.'),
    ('ゆび', '指が五本あります。', 'Yubi ga gohon arimasu.', 'I have five fingers.'),
    ('でんしゃ', '電車で学校へ行きます。', 'Densha de gakkou e ikimasu.', 'I go to school by train.'),
    ('バス', 'バスに乗ります。', 'Basu ni norimasu.', 'I ride the bus.'),
    ('たくしー', 'タクシーを呼びます。', 'Takushii o yobimasu.', 'I call a taxi.'),
    ('じてんしゃ', '自転車で公園へ行きます。', 'Jitensha de kouen e ikimasu.', 'I go to the park by bicycle.'),
    ('ちかてつ', '地下鉄は速いです。', 'Chikatetsu wa hayai desu.', 'The subway is fast.'),
    ('ひこうき', '飛行機で日本へ行きます。', 'Hikouki de Nihon e ikimasu.', 'I go to Japan by airplane.'),
    ('くるま', '車を運転します。', 'Kuruma o unten shimasu.', 'I drive a car.'),
    ('ふね', '船で島へ行きます。', 'Fune de shima e ikimasu.', 'I go to the island by ship.'),
    ('きっぷ', '切符を買います。', 'Kippu o kaimasu.', 'I buy a ticket.'),
    ('のりば', '乗り場はあそこです。', 'Noriba wa asoko desu.', 'The stop is over there.'),
    ('のる', '電車に乗ります。', 'Densha ni norimasu.', 'I get on the train.'),
    ('おりる', '次の駅で降ります。', 'Tsugi no eki de orimasu.', 'I get off at the next station.'),
    ('あるく', '駅まで歩きます。', 'Eki made arukimasu.', 'I walk to the station.'),
    ('はしる', '公園で走ります。', 'Kouen de hashirimasu.', 'I run in the park.'),
    ('とまる', 'ここで止まります。', 'Koko de tomarimasu.', 'It stops here.'),
    ('まがる', '右に曲がります。', 'Migi ni magarimasu.', 'Turn right.'),
    ('みち', 'この道をまっすぐ行きます。', 'Kono michi o massugu ikimasu.', 'Go straight on this road.'),
    ('かど', '角を左に曲がります。', 'Kado o hidari ni magarimasu.', 'Turn left at the corner.'),
    ('しんごう', '信号を渡ります。', 'Shingou o watarimasu.', 'I cross at the traffic light.'),
    ('うんてん', '運転は難しいです。', 'Unten wa muzukashii desu.', 'Driving is difficult.'),
    ('てんき', '今日の天気はいいです。', 'Kyou no tenki wa ii desu.', 'Today''s weather is good.'),
    ('あめ', '雨が降っています。', 'Ame ga futte imasu.', 'It is raining.'),
    ('ゆき', '雪が白いです。', 'Yuki ga shiroi desu.', 'The snow is white.'),
    ('かぜ', '風が強いです。', 'Kaze ga tsuyoi desu.', 'The wind is strong.'),
    ('くもり', '今日は曇りです。', 'Kyou wa kumori desu.', 'It is cloudy today.'),
    ('はれ', '明日は晴れです。', 'Ashita wa hare desu.', 'Tomorrow will be clear.'),
    ('あつい', '今日は暑いです。', 'Kyou wa atsui desu.', 'It is hot today.'),
    ('さむい', '冬は寒いです。', 'Fuyu wa samui desu.', 'Winter is cold.'),
    ('あたたかい', '春は暖かいです。', 'Haru wa atatakai desu.', 'Spring is warm.'),
    ('すずしい', '秋は涼しいです。', 'Aki wa suzushii desu.', 'Autumn is cool.'),
    ('やま', '山に登ります。', 'Yama ni noborimasu.', 'I climb the mountain.'),
    ('かわ', '川のそばを歩きます。', 'Kawa no soba o arukimasu.', 'I walk along the river.'),
    ('うみ', '海で泳ぎます。', 'Umi de oyogimasu.', 'I swim in the sea.'),
    ('もり', '森は静かです。', 'Mori wa shizuka desu.', 'The forest is quiet.'),
    ('き', '大きい木があります。', 'Ookii ki ga arimasu.', 'There is a big tree.'),
    ('そら', '空が青いです。', 'Sora ga aoi desu.', 'The sky is blue.'),
    ('つき', '月がきれいです。', 'Tsuki ga kirei desu.', 'The moon is beautiful.'),
    ('ほし', '星がたくさんあります。', 'Hoshi ga takusan arimasu.', 'There are many stars.'),
    ('いわ', '岩の上に座ります。', 'Iwa no ue ni suwarimasu.', 'I sit on the rock.'),
    ('くさ', '草が生えています。', 'Kusa ga haete imasu.', 'Grass is growing.'),
    ('あか', '赤が好きです。', 'Aka ga suki desu.', 'I like red.'),
    ('あお', '空は青いです。', 'Sora wa aoi desu.', 'The sky is blue.'),
    ('きいろ', '黄色の花です。', 'Kiiro no hana desu.', 'It is a yellow flower.'),
    ('しろ', '雪は白いです。', 'Yuki wa shiroi desu.', 'Snow is white.'),
    ('くろ', '黒い猫がいます。', 'Kuroi neko ga imasu.', 'There is a black cat.'),
    ('みどり', '緑の木があります。', 'Midori no ki ga arimasu.', 'There is a green tree.'),
    ('ちゃいろ', '茶色のかばんです。', 'Chairo no kaban desu.', 'It is a brown bag.'),
    ('ピンク', 'ピンクの花です。', 'Pinku no hana desu.', 'It is a pink flower.'),
    ('オレンジ', 'オレンジを食べます。', 'Orenji o tabemasu.', 'I eat an orange.'),
    ('むらさき', '紫の服を着ます。', 'Murasaki no fuku o kimasu.', 'I wear purple clothes.'),
    ('まるい', '丸いテーブルです。', 'Marui teeburu desu.', 'It is a round table.'),
    ('しかく', '四角い箱です。', 'Shikakui hako desu.', 'It is a square box.'),
    ('ながい', '長い道です。', 'Nagai michi desu.', 'It is a long road.'),
    ('みじかい', '短い鉛筆です。', 'Mijikai enpitsu desu.', 'It is a short pencil.'),
    ('ひろい', '部屋は広いです。', 'Heya wa hiroi desu.', 'The room is spacious.'),
    ('せまい', '道は狭いです。', 'Michi wa semai desu.', 'The road is narrow.'),
    ('たかい', 'この山は高いです。', 'Kono yama wa takai desu.', 'This mountain is tall.'),
    ('ひくい', 'テーブルは低いです。', 'Teeburu wa hikui desu.', 'The table is low.'),
    ('ふとい', '太い木があります。', 'Futoi ki ga arimasu.', 'There is a thick tree.'),
    ('ほそい', '細い道を歩きます。', 'Hosoi michi o arukimasu.', 'I walk on a narrow path.')
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
  select region_id, 'Family & Body', 'Family members and parts of the body.', 17, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Family & Body'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Family & Body' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Family Members I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Family Members I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Family Members I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['かぞく', 'おとうさん', 'おかあさん', 'おにいさん', 'おねえさん'];
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
    select unit_id, 'vocabulary', 'Family Members II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Family Members II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Family Members II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['おとうと', 'いもうと', 'こども', 'おじいさん', 'おばあさん'];
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
    select unit_id, 'vocabulary', 'Body Parts I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Body Parts I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Body Parts I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['からだ', 'あたま', 'め', 'みみ', 'はな'];
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
    select unit_id, 'vocabulary', 'Body Parts II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Body Parts II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Body Parts II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['くち', 'て', 'あし', 'かお', 'ゆび'];
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
  select region_id, 'Transport', 'Vehicles and getting around town.', 18, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Transport'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Transport' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Vehicles I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Vehicles I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Vehicles I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['でんしゃ', 'バス', 'たくしー', 'じてんしゃ', 'ちかてつ'];
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
    select unit_id, 'vocabulary', 'Vehicles II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Vehicles II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Vehicles II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['ひこうき', 'くるま', 'ふね', 'きっぷ', 'のりば'];
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
    select unit_id, 'vocabulary', 'Movement', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Movement'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Movement' limit 1;

    if lesson_id is not null then
      word_kana_list := array['のる', 'おりる', 'あるく', 'はしる', 'とまる'];
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
    select unit_id, 'vocabulary', 'Streets & Driving', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Streets & Driving'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Streets & Driving' limit 1;

    if lesson_id is not null then
      word_kana_list := array['まがる', 'みち', 'かど', 'しんごう', 'うんてん'];
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
  select region_id, 'Weather & Nature', 'Weather, seasons, and the natural world.', 19, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Weather & Nature'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Weather & Nature' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Weather I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Weather I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Weather I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['てんき', 'あめ', 'ゆき', 'かぜ', 'くもり'];
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
    select unit_id, 'vocabulary', 'Weather II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Weather II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Weather II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['はれ', 'あつい', 'さむい', 'あたたかい', 'すずしい'];
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
    select unit_id, 'vocabulary', 'Land & Water', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Land & Water'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Land & Water' limit 1;

    if lesson_id is not null then
      word_kana_list := array['やま', 'かわ', 'うみ', 'もり', 'き'];
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
    select unit_id, 'vocabulary', 'Sky & Earth', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Sky & Earth'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Sky & Earth' limit 1;

    if lesson_id is not null then
      word_kana_list := array['そら', 'つき', 'ほし', 'いわ', 'くさ'];
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
  select region_id, 'Colors & Shapes', 'Basic colors and shape descriptions.', 20, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Colors & Shapes'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Colors & Shapes' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Colors I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Colors I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Colors I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['あか', 'あお', 'きいろ', 'しろ', 'くろ'];
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
      word_kana_list := array['みどり', 'ちゃいろ', 'ピンク', 'オレンジ', 'むらさき'];
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
    select unit_id, 'vocabulary', 'Shapes & Size I', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Shapes & Size I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Shapes & Size I' limit 1;

    if lesson_id is not null then
      word_kana_list := array['まるい', 'しかく', 'ながい', 'みじかい', 'ひろい'];
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
    select unit_id, 'vocabulary', 'Shapes & Size II', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Shapes & Size II'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Shapes & Size II' limit 1;

    if lesson_id is not null then
      word_kana_list := array['せまい', 'たかい', 'ひくい', 'ふとい', 'ほそい'];
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
  select region_id, 'N5 Vocabulary Practice: Wave 1 Unit', 'Mixed recall across wave 1 N5 vocabulary.', 21, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Vocabulary Practice: Wave 1 Unit'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Vocabulary Practice: Wave 1 Unit' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', 'N5 Vocabulary Practice: Wave 1', 'Mixed recall across wave 1 N5 vocabulary.', 2, 20, 8, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'N5 Vocabulary Practice: Wave 1'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'N5 Vocabulary Practice: Wave 1' limit 1;

    if lesson_id is not null then
      word_kana_list := array['かぞく', 'おとうと', 'からだ', 'くち', 'でんしゃ', 'ひこうき', 'のる', 'まがる', 'てんき', 'はれ', 'やま', 'そら', 'あか', 'みどり', 'まるい', 'せまい'];
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
