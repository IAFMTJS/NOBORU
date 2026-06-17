"""Generate N5 grammar expansion wave 3 — final patterns toward 80 total."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "supabase" / "migrations" / "20260617220000_n5_grammar_expansion_wave3.sql"


def sql_str(value: str) -> str:
    return value.replace("'", "''")


GRAMMAR_POINTS = [
    {
        "title": "ないで (naide)",
        "meaning": "Without doing",
        "explanation": "Connects two actions: the second happens without the first being done.",
        "examples": [
            ("朝ご飯を食べないで学校へ行きます。", "Asagohan o tabenaide gakkou e ikimasu.", "I go to school without eating breakfast."),
            ("靴を脱がないで入らないでください。", "Kutsu o nuganaide hairanaide kudasai.", "Please do not enter without taking off your shoes."),
        ],
    },
    {
        "title": "てはいけない (te wa ikenai)",
        "meaning": "Must not do",
        "explanation": "Expresses prohibition in polite speech.",
        "examples": [
            ("ここで写真を撮ってはいけません。", "Koko de shashin o totte wa ikemasen.", "You must not take photos here."),
            ("走ってはいけません。", "Hashitte wa ikemasen.", "You must not run."),
        ],
    },
    {
        "title": "ほしい (hoshii)",
        "meaning": "Want (a thing)",
        "explanation": "Expresses desire for a noun; the wanter is usually the topic with は.",
        "examples": [
            ("新しいかばんがほしいです。", "Atarashii kaban ga hoshii desu.", "I want a new bag."),
            ("水がほしいです。", "Mizu ga hoshii desu.", "I want water."),
        ],
    },
    {
        "title": "じゃない (ja nai)",
        "meaning": "Is not (casual)",
        "explanation": "Casual negative form of です; also used in じゃありません.",
        "examples": [
            ("学生じゃないです。", "Gakusei ja nai desu.", "I am not a student."),
            ("今日は月曜日じゃありません。", "Kyou wa getsuyoubi ja arimasen.", "Today is not Monday."),
        ],
    },
    {
        "title": "のです (no desu)",
        "meaning": "Explanatory (it is that...)",
        "explanation": "Adds emphasis or gives background explanation for a situation.",
        "examples": [
            ("頭が痛いんです。", "Atama ga itai n desu.", "The thing is, my head hurts."),
            ("日本語を勉強しているんです。", "Nihongo o benkyou shite iru n desu.", "I am studying Japanese (you see)."),
        ],
    },
    {
        "title": "ないでください (naide kudasai)",
        "meaning": "Please do not",
        "explanation": "Polite request not to do something.",
        "examples": [
            ("ここでタバコを吸わないでください。", "Koko de tabako o suwanaide kudasai.", "Please do not smoke here."),
            ("忘れないでください。", "Wasurenaide kudasai.", "Please do not forget."),
        ],
    },
    {
        "title": "てもいい (te mo ii)",
        "meaning": "May do, it's okay to",
        "explanation": "Gives or asks permission to perform an action.",
        "examples": [
            ("写真を撮ってもいいですか。", "Shashin o totte mo ii desu ka.", "May I take a photo?"),
            ("ここに座ってもいいです。", "Koko ni suwatte mo ii desu.", "You may sit here."),
        ],
    },
    {
        "title": "だけ (dake)",
        "meaning": "Only, just",
        "explanation": "Limits the scope to one thing or amount.",
        "examples": [
            ("水だけ飲みます。", "Mizu dake nomimasu.", "I drink only water."),
            ("一人だけ来ました。", "Hitori dake kimashita.", "Only one person came."),
        ],
    },
    {
        "title": "しか〜ない (shika...nai)",
        "meaning": "Only (with negative)",
        "explanation": "Means only when paired with a negative verb.",
        "examples": [
            ("百円しかありません。", "Hyaku en shika arimasen.", "I only have one hundred yen."),
            ("日本語しか話せません。", "Nihongo shika hanasemasen.", "I can only speak Japanese."),
        ],
    },
    {
        "title": "いちばん (ichiban)",
        "meaning": "The most, number one",
        "explanation": "Superlative marker for comparisons within a group.",
        "examples": [
            ("りんごがいちばん好きです。", "Ringo ga ichiban suki desu.", "I like apples the most."),
            ("これがいちばん安いです。", "Kore ga ichiban yasui desu.", "This is the cheapest."),
        ],
    },
    {
        "title": "とき (toki)",
        "meaning": "When, at the time of",
        "explanation": "Indicates the time when something happens.",
        "examples": [
            ("子供のとき、よく泳ぎました。", "Kodomo no toki, yoku oyogimashita.", "When I was a child, I often swam."),
            ("暇なとき、本を読みます。", "Hima na toki, hon o yomimasu.", "When I am free, I read books."),
        ],
    },
    {
        "title": "くらい/ぐらい (kurai/gurai)",
        "meaning": "About, approximately",
        "explanation": "Expresses approximate degree, amount, or extent.",
        "examples": [
            ("一時間くらいかかります。", "Ichijikan kurai kakarimasu.", "It takes about one hour."),
            ("十人ぐらい来ました。", "Juunin gurai kimashita.", "About ten people came."),
        ],
    },
    {
        "title": "や (ya)",
        "meaning": "And (among others)",
        "explanation": "Lists examples without being exhaustive, unlike と.",
        "examples": [
            ("本やノートを買います。", "Hon ya nooto o kaimasu.", "I buy books and notebooks (among other things)."),
            ("りんごやバナナがあります。", "Ringo ya banana ga arimasu.", "There are apples, bananas, and so on."),
        ],
    },
    {
        "title": "など (nado)",
        "meaning": "And so on, such as",
        "explanation": "Indicates representative examples from a larger set.",
        "examples": [
            ("映画などを見ます。", "Eiga nado o mimasu.", "I watch movies and things like that."),
            ("東京や大阪などに行きました。", "Toukyou ya Oosaka nado ni ikimashita.", "I went to Tokyo, Osaka, and so on."),
        ],
    },
    {
        "title": "たことがある (ta koto ga aru)",
        "meaning": "Have done before",
        "explanation": "Expresses past experience of having done something.",
        "examples": [
            ("日本に行ったことがあります。", "Nihon ni itta koto ga arimasu.", "I have been to Japan before."),
            ("寿司を食べたことがあります。", "Sushi o tabeta koto ga arimasu.", "I have eaten sushi before."),
        ],
    },
    {
        "title": "なる (naru)",
        "meaning": "Become",
        "explanation": "Marks change of state; な-adjective + になる, い-adjective + くなる.",
        "examples": [
            ("先生になりたいです。", "Sensei ni naritai desu.", "I want to become a teacher."),
            ("寒くなりました。", "Samuku narimashita.", "It has become cold."),
        ],
    },
    {
        "title": "てみる (te miru)",
        "meaning": "Try doing",
        "explanation": "Attempt an action to see what it is like or what happens.",
        "examples": [
            ("この料理を食べてみます。", "Kono ryouri o tabete mimasu.", "I will try eating this dish."),
            ("日本語で話してみてください。", "Nihongo de hanashite mite kudasai.", "Please try speaking in Japanese."),
        ],
    },
    {
        "title": "でしょう (deshou)",
        "meaning": "Probably, I think",
        "explanation": "Expresses conjecture or seeks agreement from the listener.",
        "examples": [
            ("明日は雨でしょう。", "Ashita wa ame deshou.", "It will probably rain tomorrow."),
            ("いい天気でしょう。", "Ii tenki deshou.", "Nice weather, isn't it?"),
        ],
    },
    {
        "title": "ね (ne)",
        "meaning": "Right?, isn't it?",
        "explanation": "Sentence-ending particle seeking agreement or softening.",
        "examples": [
            ("いい天気ですね。", "Ii tenki desu ne.", "Nice weather, isn't it?"),
            ("難しいですね。", "Muzukashii desu ne.", "It's difficult, isn't it?"),
        ],
    },
    {
        "title": "よ (yo)",
        "meaning": "Emphasis particle",
        "explanation": "Adds emphasis or shares new information with the listener.",
        "examples": [
            ("これはおいしいですよ。", "Kore wa oishii desu yo.", "This is delicious, you know."),
            ("駅はあそこですよ。", "Eki wa asoko desu yo.", "The station is over there."),
        ],
    },
    {
        "title": "かな (kana)",
        "meaning": "I wonder",
        "explanation": "Expresses uncertainty or wondering to oneself.",
        "examples": [
            ("明日晴れるかな。", "Ashita hareru kana.", "I wonder if it will be clear tomorrow."),
            ("大丈夫かな。", "Daijoubu kana.", "I wonder if it will be okay."),
        ],
    },
    {
        "title": "どう (dou)",
        "meaning": "How",
        "explanation": "Asks about manner, state, or opinion.",
        "examples": [
            ("日本語はどうですか。", "Nihongo wa dou desu ka.", "How is your Japanese?"),
            ("この料理はどうですか。", "Kono ryouri wa dou desu ka.", "How is this dish?"),
        ],
    },
    {
        "title": "どれ (dore)",
        "meaning": "Which one (among three or more)",
        "explanation": "Interrogative for choosing from multiple items.",
        "examples": [
            ("どれが好きですか。", "Dore ga suki desu ka.", "Which one do you like?"),
            ("どれを買いますか。", "Dore o kaimasu ka.", "Which one will you buy?"),
        ],
    },
    {
        "title": "どの (dono)",
        "meaning": "Which + noun",
        "explanation": "Interrogative determiner placed before a noun.",
        "examples": [
            ("どの本がいいですか。", "Dono hon ga ii desu ka.", "Which book is good?"),
            ("どの駅ですか。", "Dono eki desu ka.", "Which station is it?"),
        ],
    },
    {
        "title": "いくつ (ikutsu)",
        "meaning": "How many, how old",
        "explanation": "Asks about countable quantity or age.",
        "examples": [
            ("りんごをいくつ買いますか。", "Ringo o ikutsu kaimasu ka.", "How many apples will you buy?"),
            ("いくつですか。", "Ikutsu desu ka.", "How old are you?"),
        ],
    },
    {
        "title": "いくら (ikura)",
        "meaning": "How much (price)",
        "explanation": "Asks about the price of something.",
        "examples": [
            ("これはいくらですか。", "Kore wa ikura desu ka.", "How much is this?"),
            ("全部でいくらですか。", "Zenbu de ikura desu ka.", "How much is it altogether?"),
        ],
    },
    {
        "title": "なぜ/どうして (naze/doushite)",
        "meaning": "Why",
        "explanation": "Asks for a reason; どうして is more common in conversation.",
        "examples": [
            ("どうして来ませんでしたか。", "Doushite kimasen deshita ka.", "Why didn't you come?"),
            ("なぜですか。", "Naze desu ka.", "Why is that?"),
        ],
    },
    {
        "title": "いつも (itsumo)",
        "meaning": "Always, usually",
        "explanation": "Indicates habitual or constant action.",
        "examples": [
            ("いつも七時に起きます。", "Itsumo shichiji ni okimasu.", "I always wake up at seven."),
            ("いつも電車で行きます。", "Itsumo densha de ikimasu.", "I usually go by train."),
        ],
    },
    {
        "title": "ときどき (tokidoki)",
        "meaning": "Sometimes",
        "explanation": "Indicates occasional frequency.",
        "examples": [
            ("ときどき映画を見ます。", "Tokidoki eiga o mimasu.", "I sometimes watch movies."),
            ("ときどき外食します。", "Tokidoki gaishoku shimasu.", "I sometimes eat out."),
        ],
    },
    {
        "title": "どんな (donna)",
        "meaning": "What kind of",
        "explanation": "Asks about the type or nature of something.",
        "examples": [
            ("どんな音楽が好きですか。", "Donna ongaku ga suki desu ka.", "What kind of music do you like?"),
            ("どんな人ですか。", "Donna hito desu ka.", "What kind of person are they?"),
        ],
    },
    {
        "title": "い-adjective + くて (kute)",
        "meaning": "Te-form of i-adjectives",
        "explanation": "Connects i-adjectives to other predicates or lists qualities.",
        "examples": [
            ("この部屋は広くて明るいです。", "Kono heya wa hirokute akarui desu.", "This room is spacious and bright."),
            ("安くておいしいです。", "Yasukute oishii desu.", "It is cheap and delicious."),
        ],
    },
    {
        "title": "な-adjective + で (de)",
        "meaning": "Te-form of na-adjectives",
        "explanation": "Connects na-adjectives to other predicates using で.",
        "examples": [
            ("この町は静かで便利です。", "Kono machi wa shizuka de benri desu.", "This town is quiet and convenient."),
            ("元気で優しい人です。", "Genki de yasashii hito desu.", "A healthy and kind person."),
        ],
    },
    {
        "title": "一緒に (issho ni)",
        "meaning": "Together",
        "explanation": "Indicates doing something jointly with another person.",
        "examples": [
            ("友達と一緒に行きます。", "Tomodachi to issho ni ikimasu.", "I go together with a friend."),
            ("家族と一緒に食べます。", "Kazoku to issho ni tabemasu.", "I eat together with my family."),
        ],
    },
    {
        "title": "なくてもいい (nakutemo ii)",
        "meaning": "Do not have to",
        "explanation": "Expresses that something is not necessary or not required.",
        "examples": [
            ("今日は来なくてもいいです。", "Kyou wa konakutemo ii desu.", "You do not have to come today."),
            ("食べなくてもいいです。", "Tabenakutemo ii desu.", "You do not have to eat."),
        ],
    },
]


def build_grammar_inserts() -> str:
    rows = []
    for gp in GRAMMAR_POINTS:
        rows.append(
            f"    ('{sql_str(gp['title'])}', '{sql_str(gp['meaning'])}', "
            f"'{sql_str(gp['explanation'])}', 'n5'::public.jlpt_level, 2, 'published'::public.content_status)"
        )
    return f"""
-- N5 grammar expansion wave 3
insert into public.grammar_points (title, meaning, explanation, jlpt_level, difficulty, status)
select g.title, g.meaning, g.explanation, g.jlpt_level, g.difficulty, g.status
from (
  values
{",\n".join(rows)}
) as g(title, meaning, explanation, jlpt_level, difficulty, status)
where not exists (
  select 1 from public.grammar_points existing where existing.title = g.title
);
"""


def build_grammar_examples() -> str:
    example_rows = []
    for gp in GRAMMAR_POINTS:
        for order_index, (jp, romaji, en) in enumerate(gp["examples"]):
            example_rows.append(
                f"    ('{sql_str(gp['title'])}', '{sql_str(jp)}', '{sql_str(romaji)}', '{sql_str(en)}', {order_index})"
            )
    return f"""
insert into public.grammar_examples (grammar_id, japanese_text, romaji, english, order_index, status)
select g.id, e.japanese_text, e.romaji, e.english, e.order_index, 'published'::public.content_status
from public.grammar_points g
inner join (
  values
{",\n".join(example_rows)}
) as e(title, japanese_text, romaji, english, order_index) on e.title = g.title
where g.jlpt_level = 'n5'
  and not exists (
    select 1 from public.grammar_examples existing
    where existing.grammar_id = g.id and existing.japanese_text = e.japanese_text
  );
"""


def build_grammar_curriculum() -> str:
    lessons_per_unit = 4
    unit_blocks = []
    for unit_index in range(0, len(GRAMMAR_POINTS), lessons_per_unit):
        chunk = GRAMMAR_POINTS[unit_index : unit_index + lessons_per_unit]
        unit_num = unit_index // lessons_per_unit + 1
        unit_name = f"Grammar Patterns IV — Part {unit_num}"
        unit_order = 25 + unit_index // lessons_per_unit
        lesson_blocks = []
        for gp in chunk:
            lesson_blocks.append(
                f"""
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', '{sql_str(gp["title"])}', '{sql_str(gp["meaning"])}', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = '{sql_str(gp["title"])}'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = '{sql_str(gp["title"])}' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = '{sql_str(gp["title"])}' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;"""
            )
        unit_blocks.append(
            f"""
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, '{sql_str(unit_name)}', 'Completing N5 grammar patterns and particles.', {unit_order}, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = '{sql_str(unit_name)}'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = '{sql_str(unit_name)}' limit 1;

  if unit_id is not null then
{"".join(lesson_blocks)}
  end if;"""
        )

    return f"""
do $grammar_curriculum_wave3$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  grammar_id uuid;
begin
  select id into region_id from public.regions where slug = 'mount-n5' limit 1;
  if region_id is null then return; end if;
{"".join(unit_blocks)}
end;
$grammar_curriculum_wave3$;
"""


def main() -> None:
    sql = (
        "-- N5 grammar expansion wave 3\n\n"
        + build_grammar_inserts()
        + "\n"
        + build_grammar_examples()
        + "\n"
        + build_grammar_curriculum()
    )
    OUT.write_text(sql, encoding="utf-8")
    print(f"Wrote {OUT.name}: {len(GRAMMAR_POINTS)} grammar points")


if __name__ == "__main__":
    main()
