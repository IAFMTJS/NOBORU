# N5 art generation briefs — Realm of First Light

**Status:** Ready to generate (greybox spine signed off 2026-06-22)  
**Reference:** `Art Library/staging/n5-greybox.png` + `n5-greybox.json`  
**Authority:** [08_visual_art_direction_master_spec.md](../../art-direction/08_visual_art_direction_master_spec.md), [05_cursor_generation_brief.md](../../art-direction/05_cursor_generation_brief.md)

---

## Before you generate

1. Open **`Art Library/staging/n5-greybox.png`** — spine (white line), node dots (gold = landmark, green = lesson, orange = trial), dashed = reserved side-path slots.
2. Generate **one asset at a time**. Deliver **`_light_v1` + `_dark_v1`** pairs.
3. Save to **`Art Library/backgrounds/n5/`** (create folder) or **`Art Library/icons/landmarks/n5/`** for icons.
4. **Do not bake stepping stones or node rings** into backgrounds — UI draws those.
5. Keep a **clear path corridor** (~35–45% canvas width, centered on spine curve from greybox).

### Universal prompt prefix (prepend to every request)

> Premium AAA fantasy adventure environment for Noboru — stylized realism, mythological dreamlike Japan, NOT cartoon/chibi/kawaii/Duolingo/SaaS. Sacred mountain dawn ascent, valley mist, village warmth. Materials: wet stone, aged wood, paper lantern, moss, carved tablets, dark lacquer accents. Palette: Lantern Gold #D6A85F, Moss Green #7B8D5A, Spirit Blue #73A7D6 accents, forest depth #0D1320. No world tree, no roots, no vertical trunk, no neon, no cherry-blossom overload, no snow.

---

## Asset queue (priority order)

| # | Asset ID | Output files | Size (px) |
|---|----------|--------------|-----------|
| 1 | `bg_n5_realm_silhouette` | `bg_n5_realm_silhouette_light_v1.png`, `_dark_v1` | 1536 × 900 |
| 2 | `bg_n5_act1` | `bg_n5_act1_light_v1.png`, `_dark_v1` | 1536 × 1126 |
| 3 | `bg_n5_act2` | `bg_n5_act2_light_v1.png`, `_dark_v1` | 1536 × 1792 |
| 4 | `bg_n5_act3` | `bg_n5_act3_light_v1.png`, `_dark_v1` | 1536 × 1587 |
| 5 | Landmark icons (×9) | `icon_landmark_n5_{slug}_light_v1.png`, `_dark_v1` | 256 × 256, **transparent alpha** |
| 6 | `bg_portal_n5_n4` | `bg_portal_n5_n4_light_v1.png`, `_dark_v1` | 1536 × 1024 |

After generation: `node scripts/art-direction/strip-icon-backgrounds.mjs "Art Library/icons/landmarks/n5"` → `npm run assets:publish-source` → wire paths in `n5-world-art.constants.ts`.

---

## 1 — Realm silhouette (world map / overview)

**Band:** Full N5 scroll compressed — Acts I–III readable in one painterly wide shot.

**Dark prompt:**

> [Universal prefix] Wide panoramic mountain valley at dawn-from-below. Lowest third: enclosed misty grotto glow (Act I). Middle: warm lantern village roofs in morning light (Act II). Upper third: cedar slope rising to twin vermillion torii at summit (Act III). Winding stone path implied but not detailed. Atmospheric depth, soft volumetric mist. 1536×900, no UI, no characters, no text.

**Light variant:** Same composition — Mountain Dawn palette: warm cream sky, soft gold sunlight, pale mist instead of night depth.

---

## 2 — Act I slice (`bg_n5_act1`)

**Scroll band:** y 72%–94% (journey start → Kana Bridge)  
**Hero zones:** Ember Threshold (center-bottom), Script Sanctum (left grotto), Kana Bridge (rope bridge upper band)  
**Mood:** Dawn, soft mist, safe wonder, stream, single bell feeling  
**Time / weather:** Dawn · soft mist

**Dark prompt:**

> [Universal prefix] Vertical environment slice 1536×1126. Bottom: low stone lantern on wet path, ground mist, first expedition glow (Ember Threshold). Mid-left: shallow script sanctum grotto with carved hiragana tablets, spirit blue tablet glow — not a dungeon. Upper: rope kana bridge over stream, katakana carved on planks, reflections. Winding path corridor stays center 40% width — keep this zone low-detail for UI nodes. Cedar forest edges frame sides. Act I · Awakening.

**Light variant:** Morning mist, warmer sky gradient at top, same layout.

---

## 3 — Act II slice (`bg_n5_act2`)

**Scroll band:** y 37%–72%  
**Hero zones:** Lantern Hamlet (left, 3–5 roofs), Market Bend (right, stalls & noren)  
**Mood:** Morning, clear/light mist, village warmth, usable Japanese  
**Time / weather:** Morning · clear with light mist

**Dark prompt:**

> [Universal prefix] Vertical environment slice 1536×1792. Lower section: Lantern Hamlet — 3–5 wooden village roofs, chimney smoke, many small amber paper lanterns along path. Middle: winding stone market bend with stall awnings, noren curtains, stone steps — shopping quarter feel. Path corridor center 40% width remains readable for lesson nodes. Upper section transitions toward denser cedar as torii approaches. Act II · First steps. No side-path buildings blocking center corridor (reserved slots sit off-spine).

**Light variant:** Mountain Dawn — brighter stall lanterns, cream stone path.

---

## 4 — Act III slice (`bg_n5_act3`)

**Scroll band:** y 6%–37%  
**Hero zones:** Forest Torii, Kanji Grove, First Slope Shrine, Gate of Ascent  
**Mood:** Late morning, wind on slope, sky visible, climb begins  
**Time / weather:** Late morning · wind, open sky

**Dark prompt:**

> [Universal prefix] Vertical environment slice 1536×1587. Bottom third: large vermillion forest torii beside path, backlit cedar depth (Forest Torii). Mid: kanji grove — cedar trees with moss-covered carved pillars, dappled moss green and gold light. Upper-mid: small hokora shrine, mountain slope visible above (First Slope Shrine). Top: twin torii Gate of Ascent, dawn light breaking through mist beyond — N4 transition tease (green mist hint only, subtle). Steepest ascent feeling. Path corridor center 40% clear. Act III · The climb begins.

**Light variant:** Brighter sky at summit, sharper slope readability.

---

## 5 — Landmark icons (×9)

**Format:** 256×256 PNG, transparent background, fantasy game UI style (shrine carving / quest marker depth — not thin outline).  
**Post-process:** `strip-icon-backgrounds.mjs` required.

| Slug | Subject | Prompt addendum |
|------|---------|-----------------|
| `ember-threshold` | Single stone lantern, low fog | Small flame, wet stone base |
| `script-sanctum` | Tablet wall, shallow cave mouth | One glowing hiragana tablet, spirit blue |
| `kana-bridge` | Rope bridge segment | Katakana on plank, stream below implied |
| `lantern-hamlet` | Cluster of 3 roofs + lantern | Warm amber windows |
| `market-bend` | Stall + noren | Stone steps, paper lantern |
| `forest-torii` | Large vermillion torii | Forest silhouette behind |
| `kanji-grove` | Cedar + carved pillar | One prominent kanji carved in wood |
| `first-slope-shrine` | Small hokora | Mountain peek above roofline |
| `gate-of-ascent` | Twin torii | Dawn rays through, mist beyond |

Example full icon prompt:

> [Universal prefix] Single landmark icon, centered, 256×256, transparent background. [Subject from table]. Fantasy game quest marker style — carved stone and wood depth, soft lantern glow, no text labels, no border frame.

---

## 6 — Portal matte N5 → N4 (`bg_portal_n5_n4`)

**Use:** Full-screen transition after `n5-final-trial` (see [06 portal script](./06-n5-deep-dive.md#n5--n4-portal-transition-script)).

**Dark prompt:**

> [Universal prefix] Cinematic 1536×1024. Gate of Ascent twin torii open, valley of Realm of First Light visible below — fully lit path receding. Beyond gate: green mist (N4 tease), bamboo silhouettes in distance, Mist Bridge suggestion. Dawn breaking through torii. No characters. No UI chrome. Emotional beat: first light complete, forest deepens ahead.

---

## Acceptance (per asset)

- [ ] `_light` + `_dark` pair delivered
- [ ] Path corridor readable at 390px viewport when composited on skeleton
- [ ] No world-tree / trunk / root imagery
- [ ] Icons pass transparency audit
- [ ] Landmark set pieces match hero zone anchors in `n5-greybox.json` (±10% vertical)

---

## Related

- [12-n5-art-and-node-placement.md](./12-n5-art-and-node-placement.md) — pipeline & acceptance
- [11-n5-complete-spec.md](./11-n5-complete-spec.md) — art minimum set
- [06-n5-deep-dive.md](./06-n5-deep-dive.md) — landmark silhouettes & mood board
