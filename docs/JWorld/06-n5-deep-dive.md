# N5 deep-dive — Realm of First Light

**Status:** Session 2 draft — **superseded for implementation by** [11-n5-complete-spec.md](./11-n5-complete-spec.md)  
**Parent:** [02-five-worlds.md](./02-five-worlds.md#n5--realm-of-first-light)  
**Rollout:** [10-n5-rollout-strategy.md](./10-n5-rollout-strategy.md) — N5 first, N4–N1 after validation

N5 is the **origin story** of Noboru: longest scroll, warmest palette, lowest stakes, highest wonder. One world, **three acts** — not three separate regions.

> **Content reuse:** Existing **lessons** and curriculum data are kept; they will be grouped under world `n5`. See [07-content-reuse.md](./07-content-reuse.md). Old CMS region names are **not** part of this model — [legacy-slugs.md](./legacy-slugs.md).

---

## Three acts (vertical structure)

| Act | Trail zones | Altitude feel | Curriculum focus |
|-----|-------------|---------------|------------------|
| **I — Awakening** | Ember Threshold → Script Sanctum → Kana Bridge | Below the village — soft glow, enclosed | Hiragana → katakana |
| **II — First steps** | Lantern Hamlet → Market Bend → Forest Crossing | Valley floor — open, friendly | Survival vocab, first grammar, daily life |
| **III — The climb begins** | Forest Torii → Kanji Grove → First Slope Shrine → Gate of Ascent | True incline — sky appears | Kanji clusters, listening, sentences, N5 trial |

**Scroll rule:** Act I is shortest but most magical; Act II is widest (branching hamlets); Act III is steepest. Total canvas target: **largest of all worlds** (~480vh+ in current stub — keep or increase).

---

## Eight landmarks (lesson-topic mapping)

Landmarks appear every ~5 lesson nodes (existing `LANDMARK_EVERY_N_LESSONS` cadence). Each is a **rest, story, and orientation** beat — not a lesson type.

| # | Landmark | JP name (working) | Act | Primary topics | Node kinds nearby |
|---|----------|-------------------|-----|----------------|-------------------|
| 1 | **Ember Threshold** | 灯の境 *Hi no Sakai* | I | Onboarding, first hiragana (あいうえお), “this is Japanese” | Script recognition, stroke intro |
| 2 | **Script Sanctum** | 文字の社 *Moji no Yashiro* | I | Hiragana completion, dakuten/handakana, katakana intro | Writing, matching, listening (syllables) |
| 3 | **Kana Bridge** | かな橋 *Kana-bashi* | I→II | Katakana mastery, loanwords, メニュー・コーヒー | Recognition, menu reading |
| 4 | **Lantern Hamlet** | 灯里 *Tōri* | II | Greetings, self-intro, です／ます, thank you / sorry | Vocabulary, micro-dialogue |
| 5 | **Market Bend** | 曲がり市 *Magari-ichi* | II | Numbers, counters (つ・人), time, prices, shopping | Vocabulary, listening (store) |
| 6 | **Forest Torii** | 森の鳥居 *Mori no Torii* | II→III | Particles (は・が・を・に), basic word order, question forms | Grammar, sentence build |
| 7 | **Kanji Grove** | 漢字の林 *Kanji no Hayashi* | III | First kanji (person, day, water, etc.), radicals intro | Kanji recognition, meaning match |
| 8 | **First Slope Shrine** | 初坂の祠 *Hatsu-saka no Hokora* | III | Listening passages, short reading, verb groups intro | Listening, reading, review |
| — | **Gate of Ascent** | 登り門 *Nobori-mon* | III (peak) | N5 Trial — vocabulary, kanji, grammar, listening synthesis | Boss gate → portal to N4 |

### Side paths (Act II lateral mechanic)

Branching **hamlet quarters** off landmark 4–5 — optional depth, not required for main spine:

| Quarter | Topics | Vibe |
|---------|--------|------|
| **Greeting Quarter** | おはよう, こんばんは, introductions, farewells | Open plaza, NPC lanterns |
| **Food Stall Row** | 食べ物, 飲み物, ください, 好き | Steam, red lanterns, menu boards |
| **Home Hearth Lane** | Family, rooms, あります／います, location | Warm interiors visible from path |

Return to main spine at Forest Torii (landmark 6). Side paths = bonus XP / cultural notes, not progression blockers.

---

## Landmark visual signatures (art hooks)

| Landmark | Silhouette | Light source | Yama pose (optional) |
|----------|------------|--------------|----------------------|
| Ember Threshold | Single stone lantern, low fog | First flame ignites as user completes あ row | Sniffing the air, tail low |
| Script Sanctum | Carved tablet wall, shallow cave-not-cave | Tablets glow spirit blue when correct | Paw on glowing character |
| Kana Bridge | Rope bridge over stream, katakana on planks | Reflections in water | Crossing ahead of user |
| Lantern Hamlet | 3–5 roofs, smoke from chimneys | Many small amber lanterns | Sitting on a post, watching |
| Market Bend | Stalls, noren curtains, stone steps | Paper lanterns + stall lamps | Interested in food stall |
| Forest Torii | Large vermillion torii, path narrows | Backlit forest depth | Paused, looking through gate |
| Kanji Grove | Cedar trees with carved pillars | Dappled moss green + gold | Pointing nose at kanji pillar |
| First Slope Shrine | Small hokora, mountain visible above | Single strong lantern | Sitting beside shrine |
| Gate of Ascent | Twin torii, mist beyond | Dawn breaking through | Beside user, forward gaze |

---

## Day in the life (learner scroll narrative)

You open Journey at **Market Bend**, where you left off yesterday — lesson 14 glows amber on the stone path, stalls half-lit in mountain dawn. The HUD shows N5 · Lantern Hamlet act, 14/48 lessons, and Yama’s ears perk up as you tap **Lesson 14 · Counters**. Five minutes later the path segment between Market Bend and Forest Torii lights up gold; a soft chime, not fanfare. You scroll up to peek at the torii — still locked, fogged, but you can read the requirement card: three more lessons. You dip into **Food Stall Row** for an optional dialogue node (ご注文は？), then return to the spine. Before closing the app you flick to world overview: N5’s realm silhouette is half-illuminated; N4 is a green shape in mist above. You’re not “on a tree branch.” You’re **somewhere real on the first mountain**, and the path ahead is already visible.

---

## N5 → N4 portal transition script

**Trigger:** N5 Trial cleared (`n5-final-trial`). Cinematic full-screen (art direction Region Transition pattern).

| Beat | Visual | Copy (UI) | Audio |
|------|--------|-----------|-------|
| 1 | Trial seal fades; path behind you fully lit | — | Shrine bell, single strike |
| 2 | Camera rises — valley you crossed visible below | **“The first light follows you now.”** | Wind rises |
| 3 | **Gate of Ascent** twin torii opens; mist beyond is **green**, not grey | Subtitle: *Hajimari no Sakai · complete* | Footsteps on stone |
| 4 | Yama walks through first; pauses, looks back | **“The forest deepens from here.”** (Yama — companion line, not tutorial voice) | Soft fox chuff |
| 5 | Beyond gate: **Mist Bridge** (N4 entry) materializes — bamboo silhouettes | Card: **Entering · Realm of the Green Ascent** | Bamboo creak, distant water |
| 6 | Fade to N4 world canvas at Mist Bridge threshold | Primary: **Step onto the bridge** · Secondary: **Stay a while** (returns to N5 summit) | N4 ambient bed fades in |

**Design rules:**

- No countdown, no pressure copy
- “Stay a while” respects learners who want to replay N5 side paths
- First N4 nodes visible but **dim** until user taps Step — preview without spoil
- Portal is a **torii**, never a tree portal or wormhole

---

## Mood board keywords (art agent brief)

Use with `art-direction/08_visual_art_direction_master_spec.md`. Generate **N5 realm pack** only — no N4 elements in N5 assets.

### Atmosphere

`mountain dawn` · `valley mist` · `first expedition` · `safe wonder` · `sacred ordinary` · `village warmth` · `gentle mystery`

### Environment

`cedar forest edge` · `stone stepping path` · `wooden village roofs` · `shallow sanctum grotto (not dungeon)` · `stream and rope bridge` · `market noren` · `vermillion torii` · `distant slope reveal`

### Light & color

`lantern gold #D6A85F` · `moss green #7B8D5A` · `spirit blue accents #73A7D6` · `fox orange companion #D17A47` · `warm cream path stones` · `dark blue-green forest depth #0D1320` · **no** neon · **no** cherry-blossom overload (save sakura for events)

### Materials

`wet stone` · `aged wood` · `paper lantern` · `carved script tablets` · `moss` · `woven noren` · `dark lacquer UI frames`

### References (mood, not copy)

Ghost of Tsushima — **Izuhara dawn** · Ghibli — **Kiki delivery route warmth** · Okami — **kamiki village scale** · Ori — **first biome hope** (palette only, not character style)

### Forbidden for N5

`underground root network` · `world tree` · `vertical trunk` · `chibi village` · `flat Duolingo hills` · `anime school` · `cyberpunk` · `snow` · `cloud sea` (reserved N3+)

### Asset list (priority order for pipeline)

1. N5 realm wide backdrop (Acts I–III readable in one painterly slice — for overview silhouette)
2. Act I — Script Sanctum environment slice
3. Act II — Lantern Hamlet + Market Bend slice
4. Act III — First Slope + Gate of Ascent slice
5. Eight landmark thumbnails (icon + small environment, transparent/icon per spec)
6. Portal transition matte — Gate of Ascent → Mist Bridge (single cinematic frame)

All assets: `_light` + `_dark` pairs → `Art Library/` per master spec.

---

## N5 guardian — Guardian of First Light

**Role:** Final trial presence at Gate of Ascent — **witness**, not enemy.

| Aspect | Detail |
|--------|--------|
| Form | Tall lantern-bearing spirit, face obscured by warm light (not oni) |
| Test framing | “Show what the first light taught you” |
| Failure tone | “The path remains. Rest, then try again.” |
| Success | Bow; torii opens; hands off lantern to float above user’s path (cosmetic buff optional later) |

Legacy slug: `n5-final-trial` / Foothills Guardian rename — see [05-sensory-guardians.md](./05-sensory-guardians.md).

---

## Open N5-specific questions

**Moved to** [11-n5-complete-spec.md](./11-n5-complete-spec.md#resolved-decisions-session-6) — resolved pending founder sign-off on that doc.

---

## Pattern for other worlds

**After N5 validates** — replicate [11-n5-complete-spec.md](./11-n5-complete-spec.md) structure as `12-n4-complete-spec.md`, etc. Do not start until [10-n5-rollout-strategy.md](./10-n5-rollout-strategy.md) phase 4.
