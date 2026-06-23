# N5 manual playthrough checklist

**World:** Realm of First Light (`n5`)  
**Spec:** [11-n5-complete-spec.md](./11-n5-complete-spec.md)  
**Use:** Founder QA before N4 work unlocks.

---

## Pre-flight

- [x] `npm run test` — 203+ tests (blueprint 300, comprehension SRS, trial pool audit)
- [x] `npm run audit:pedagogy` — 293 N5 path lessons; vocab/grammar/kana counts current (2026-06-24)
- [ ] `supabase db push` applied on target environment (includes shop, grammar dedupe, JWT backfill)
- [ ] Signed-in test account with fresh or reset progress (optional second pass for continuation)

---

## Act I — Awakening

| Step | Route / action | Pass | Notes |
|------|----------------|------|-------|
| 1 | `/tree` loads N5 canvas, HUD shows **Realm of First Light** | | |
| 2 | **Ember Threshold** — first node reachable | | |
| 3 | Complete Base Camp + hiragana row lessons | | |
| 4 | **Script Sanctum** landmark visible on spine | | |
| 5 | Hiragana practice + reading passages | | |
| 6 | **Script Keeper** trial (`foothills-guardian`) — pass/fail UX | | |
| 7 | Act chip shows **Act I · Awakening** during scroll | | |

---

## Act II — First steps

| Step | Route / action | Pass | Notes |
|------|----------------|------|-------|
| 8 | Katakana units unlock after Act I gate | | |
| 9 | **Lantern Hamlet** / **Market Bend** landmarks | | |
| 10 | Early vocab wave lessons playable | | |
| 11 | **Kana Warden** trial (`forest-spirit`) | | |
| 12 | **Forest Torii** visible at II→III transition | | |

---

## Act III — The climb begins

| Step | Route / action | Pass | Notes |
|------|----------------|------|-------|
| 13 | Kanji academy lessons + practice check | | |
| 14 | Grammar units (incl. は / です on trail) | | |
| 15 | Reading stories + dialogues | | |
| 16 | Listening exercises + challenge | | |
| 17 | **Trail Warden** (`mount-n5-proving-ground`) | | |
| 18 | **N5 Sentinel** boss trial | | |
| 19 | **Guardian of First Light** final trial | | |
| 20 | Portal `?unlock=n4` cinematic + N4 mist lift on world map | | |

---

## Cross-cutting

- [ ] Offline: download + complete one lesson offline
- [ ] Review queue receives items from completed lessons
- [ ] EP / quests update after lesson + trial
- [ ] Dark + light theme on journey backdrop
- [ ] No legacy region names in learner copy (`foothills`, `forest-trail`, `mount-n5`)

---

## Sign-off

| Role | Name | Date | Result |
|------|------|------|--------|
| Founder | | | Pass / Fail |
| QA | | | |

**Fail criteria:** Block N4 spec until all Act I–III critical steps pass.
