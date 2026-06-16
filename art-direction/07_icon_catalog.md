# 07 - Icon Catalog

Complete reference for every icon Noboru needs: asset name, function in the app, and visual direction for artists.

**Authority:** [08_visual_art_direction_master_spec.md](./08_visual_art_direction_master_spec.md) — overrides legacy mockup colors and naming in this file on conflict.

**Theme:** Noboru — Sacred Mountain Fantasy. **Dark mode is canonical** (lantern forest night); light mode is morning exploration (parchment journal).

**Naming (production):** `icon_{category}_{subject}_light_v1` and `icon_{category}_{subject}_dark_v1` — lowercase, underscore separators, per [assets.mdc](../.cursor/rules/assets.mdc).  
Example: `icon_nav_journey_mountain_light_v1.png`, `icon_nav_journey_mountain_dark_v1.png`.

**Style:** Fantasy game UI — hand-crafted symbols, shrine carvings, RPG inventory icons. Detailed silhouettes with slight depth and soft highlights — NOT thin outline, Material Icons, SF Symbols, flat SaaS glyphs, or emoji style.

**Background:** **Transparent only.** PNG or WebP with alpha. No baked backgrounds, gradients, or scene context in icon files.

**Variants:** Every icon requires **light and dark theme files** — identical design and silhouette; **only colors change** per master spec palettes. Do not ship separate per-skin color files (`-active-blue`, `-active-violet`, etc.); navbar skins tint the same base asset via UI tokens.

**Code registry:** `lib/assets/art-mappings.ts`, `lib/assets/lesson-node-assets.ts` (legacy kebab-case IDs — migrate to underscore + `_light`/`_dark` pairs)  
**Asset registry:** `docs/asset-registry.md`  
**Sibling checklist:** [06_asset_inventory_and_naming.md](./06_asset_inventory_and_naming.md)

---

## Icon color rules (binding)

Apply at export and in UI tinting. Full palettes: master spec § Color System.

| State | Hex | Use |
| --- | --- | --- |
| Inactive | `#8A857A` | Unselected nav, disabled UI glyphs |
| Hover / Active | `#D6A85F` | Lantern Gold — primary action, selected tab, CTA-adjacent icons |
| Completed | `#7B8D5A` | Moss Green — finished nodes, success checks, XP |
| Magic / Discovery | `#73A7D6` | Spirit Blue — lore, explore, listening, world map accents |
| Legendary | `#8A78C7` | Spirit Violet — rare rewards, gems, cosmic discover (dark mode primary) |
| Danger / Again | `#A94D3F` | Shrine Red — wrong answers, warnings (light); `#B05A4A` in dark |
| Companion accent | `#C96B3D` / `#D17A47` | Fox Orange — profile fox, camp warmth (light / dark) |
| Seasonal | `#D9A3A3` / `#C993A8` | Sakura Pink — event nodes, festival accents |

**Forbidden hex (never in icons):** `#00FFFF`, `#FF00FF`, `#0066FF`, `#00FF00`, `#FF0000` — these read as SaaS, RGB gaming, or cyberpunk.

**Light vs dark file palettes:** `_light` icons use light-mode surface and text contrast (`#2B2A26` strokes on warm parchment context); `_dark` icons use dark-mode contrast (`#F4EEDF` / `#C9C0AF` on lacquer context). Semantic accent hues above stay consistent across themes unless master spec accent table specifies a light/dark pair.

---

## 1. Bottom navigation icons

Primary 5-tab bar: Journey · Camp · Study · Bag · Profile.

| Base ID | Production files | Function | Appearance |
| --- | --- | --- | --- |
| `icon_nav_journey_mountain` | `_light_v1`, `_dark_v1` | **Journey tab** — main progression path, regions, lessons, checkpoints. | Three stylized mountain peaks in a row. Stone-grey silhouette with soft painterly depth; optional snow cap or mist at base. Inactive `#8A857A`; active Lantern Gold `#D6A85F` or Spirit Blue `#73A7D6` via UI tint on journey/moonlit nav shells. |
| `icon_nav_camp_tent` | `_light_v1`, `_dark_v1` | **Camp tab** — player HQ: daily goals, streak, quests, notifications, kitsune updates. | Triangular camp tent with a small flame or warm opening in negative space. Reads as “base camp” not a modern camping logo. Inactive muted; active Fox Orange `#C96B3D` / `#D17A47` or Lantern Gold edge glow. |
| `icon_nav_study_book` | `_light_v1`, `_dark_v1` | **Study tab** — dojo hub: vocabulary, kanji, grammar, listening, review queue. | Closed book or scroll with visible spine; optional bookmark tab. Scholarly, travel-worn — not a flat textbook glyph. Active Moss Green `#7B8D5A` or Lantern Gold on bamboo/dojo nav shells. |
| `icon_nav_bag_backpack` | `_light_v1`, `_dark_v1` | **Bag tab** — inventory, cosmetics, collected trail gear. | Travel backpack with straps and a flap; adventure-kit feel. Match the companion’s backpack motif. Active Lantern Gold or Fox Orange accent. |
| `icon_nav_profile_fox` | `_light_v1`, `_dark_v1` | **Profile tab (primary)** — stats, achievements, customization, account. | Kitsune head in three-quarter view: pointed ears, intelligent eyes, magical markings — stylized realism, not cartoon mascot. Active Lantern Gold `#D6A85F`. |
| `icon_nav_profile_person` | `_light_v1`, `_dark_v1` | **Profile tab (alternate)** — same as fox icon; used when fox reads too busy at small size. | Simple climber silhouette: head and shoulders, no facial detail. Conventional “account” symbol. |
| `icon_nav_dojo_torii` | `_light_v1`, `_dark_v1` | **Legacy / alternate Study or Dojo** — older nav concept before Study book icon. | Classic torii gate: wide top beam, two pillars, open center. Symmetrical silhouette. Active Moss Green or Lantern Gold. |
| `icon_nav_world_pagoda` | `_light_v1`, `_dark_v1` | **Legacy World tab** — explore / world map in early mockups. | Three-tier pagoda with curved roofs and small base platform. Reads as “temple district” or “world”. |
| `icon_nav_world_compass` | `_light_v1`, `_dark_v1` | **Discover / World / Explore** — discover articles, world hub. | Compass rose inside a thin ring; four or eight points. Optional subtle star flecks. Active Spirit Blue or Spirit Violet `#8A78C7` for legendary/cosmic nav shells. |

### Nav icon states (UI + theme)

| Layer | Rule |
| --- | --- |
| **Theme files** | Every nav icon: `_light_v1` + `_dark_v1` only. Same silhouette; palette swap per master spec light/dark backgrounds. |
| **Inactive** | Tint or paint at `#8A857A`. No glow. Clearly subordinate to active tab. |
| **Active** | Tint or paint at `#D6A85F` (default). Navbar shell may shift accent to Moss Green, Spirit Blue, Fox Orange, or Spirit Violet — applied in UI/CSS, not as separate exported color-skin PNGs. |
| **Active indicator** | Dot or underline beneath label — implemented in UI component, not baked into icon asset. |

**Legacy (migrate away):** Code may still reference kebab-case IDs such as `icon-nav-journey-mountain-active-amber`. Replace with base ID + theme pair + runtime token tint.

---

## 2. Trail & lesson node icons

Used on the journey map, lesson nodes, dojo hub tiles, world map gates, and game cards.

| Base ID | Function | Appearance |
| --- | --- | --- |
| `icon_node_lesson_camp` | **Available or in-progress lesson** — generic lesson node on the trail. | Small tent or campfire mark (camp motif at node scale). Lantern Gold center glow when current. Circular node frame in UI. |
| `icon_node_vocabulary` | **Vocabulary lesson** — word recognition and meaning drills. | Open book or flashcard with a single Japanese character (e.g. 語) or speech bubble with kana. Readable at node size. |
| `icon_node_kanji` | **Kanji lesson** — character study and writing. | Single bold kanji stroke or brush character on a dark practice tile; optional Fox Orange stroke trail. |
| `icon_node_listening` | **Listening lesson** — audio comprehension. | Ear + sound wave, or concentric arcs from a small speaker circle. Spirit Blue or Fox Orange accent on speaker when isolated. |
| `icon_node_boss_mask` | **Trial / boss node** — JLPT trials, memory dungeon, hard gates. | Traditional festival mask (kitsune or oni-inspired) with strong brows and Shrine Red / Lantern Gold accents. Ominous but not horror. |
| `icon_node_lock` | **Locked node or region** — content not yet reachable. | Padlock or closed shrine gate. Inactive `#8A857A`; no warm glow. Clear silhouette on fogged trail backgrounds. |
| `icon_node_complete_check` | **Completed lesson or checkpoint** — finished node, shrine checkpoint. | Circle with Moss Green `#7B8D5A` checkmark, or a filled lantern that reads “lit”. Success without neon saturation. |
| `icon_node_event_sakura` | **Seasonal event node** — Sakura Festival side path. | Sakura Pink `#D9A3A3` / `#C993A8` blossom cluster (3–5 petals) with soft glow. Distinct from regular lesson nodes. |
| `icon_node_region_foot_hills` | **Foothills region gate / landmark** — first region, base camp trail. | Gentle rolling hills with a small torii or village lantern at the base. Forest Green `#5E7357` / earth tones. |
| `icon_node_region_forest` | **Lantern Forest / Forest Trail region gate** — mid-journey woodland. | Dense cedar silhouettes with a narrow path cut through. Deep green-blue atmosphere, warm lantern accents. |
| `icon_node_region_temple_peak` | **Temple Peak region gate** — advanced mountain temple zone. | Steep peak with Shrine Red torii or temple roof at summit. Mist at base. |
| `icon_node_region_summit` | **Master Summit / endgame** — final region, leaderboard peak. | Highest snow-capped peak with Lantern Gold light or flag at top. Aspirational; may use Spirit Violet for legendary endgame shells. |

### Node state treatments (UI layer or asset variants)

| State | Function | Appearance |
| --- | --- | --- |
| Locked | User cannot enter. | `icon_node_lock` at `#8A857A` or dimmed node icon behind fog. |
| Available | Can start. | Full-color icon with soft Lantern Gold `#D6A85F` edge glow. |
| In progress | Started but not finished. | Same as available but brighter pulse; optional small kitsune peek (character asset, not icon). |
| Completed | Finished. | `icon_node_complete_check` at Moss Green `#7B8D5A`. |
| Boss | Trial gate. | `icon_node_boss_mask` with Shrine Red ember glow. |
| Event | Limited-time path. | `icon_node_event_sakura` with Sakura Pink particles. |

---

## 3. General UI icons

Used in HUDs, headers, settings rows, shop currency, lesson chrome, and list rows. Registry: `UI_ICON_ASSETS` in `lib/assets/art-mappings.ts`.

| Base ID | Function | Appearance |
| --- | --- | --- |
| `icon_ui_back` | **Back navigation** — return to previous screen. | Left-pointing chevron or arrow with a short tail. Painterly stroke; text-primary contrast on current theme surface. |
| `icon_ui_close` | **Close / dismiss** — bottom sheets, modals, region picker. | X mark or close cross; rounded line caps. Same weight as back arrow. |
| `icon_ui_chevron_right` | **Forward navigation** — list rows, trail ledger signposts, “open detail”. Rotated 90° for expand/collapse. | Single chevron pointing right. Subtle Lantern Gold highlight on leading edge when interactive. |
| `icon_ui_chevron_left` | **Previous** — review card back, carousel prev. *(Planned.)* | Mirror of chevron-right. |
| `icon_ui_menu_dots` | **Overflow menu** — memory book options, more actions. | Three horizontal or vertical dots; evenly spaced. Inactive `#8A857A`. |
| `icon_ui_settings` | **Settings / gear** — profile settings link, trail preferences. | Six-tooth gear or shrine maintenance wrench stylized as round gear. Small, not industrial. |
| `icon_ui_map` | **World map** — journey map toggle, region overview, explore hub. | Folded map or mountain contour lines inside a square. Spirit Blue accent optional. |
| `icon_ui_speaker` | **Play audio** — vocabulary pronunciation, lesson listening, dialogue playback. | Speaker cone with 1–2 sound arcs. Fox Orange fill when “playing” (optional semantic tint, not a third file). |
| `icon_ui_microphone` | **Record / speak** — conversation lesson “tap to speak”. | Studio mic or handheld mic silhouette inside a circle (circle may be UI, not asset). |
| `icon_ui_eye_preview` | **Preview / inspect** — cosmetic preview, item examine. | Open eye with lash line or lantern “reveal” eye motif. |
| `icon_ui_flame_streak` | **Daily streak** — camp streak panel, journey HUD, profile stats. | Upward flame teardrop; Fox Orange core `#C96B3D`, soft outer glow. Prefer dedicated heart icons below for lesson lives. |
| `icon_ui_heart_full` | **Life / heart remaining** — lesson hearts, out-of-hearts state. | Filled heart with Shrine Red core; soft lantern glow inside. |
| `icon_ui_heart_empty` | **Life lost** — heart lost feedback, depleted lives. | Heart outline only; `#8A857A` or desaturated Shrine Red, no fill. |
| `icon_ui_gem` | **Gems / premium currency** — HUD gem count, shop prices, checkpoint rewards. | Faceted crystal with Spirit Violet `#8A78C7` body and raised-surface highlight. Readable at 14px. |
| `icon_ui_coin` | **Coins / soft currency** — shop, collectibles, general store prices. | Round coin with subtle mountain or torii emboss. Lantern Gold `#D6A85F`. |
| `icon_ui_xp` | **Experience points** — XP gains, lesson rewards, progress dashboard. | Lightning bolt or upward star burst in Moss Green `#7B8D5A`. Reads as “progress gained” not electricity. |
| `icon_ui_check` | **Success / complete** — quest done, offline item available, region 100%. | Checkmark tick; Moss Green or Lantern Gold. Short, bold stroke. |
| `icon_ui_cross` | **Wrong / Again** — incorrect answer, review “Again” rating. | X mark; Shrine Red `#A94D3F`. Pair with supportive kitsune reaction, not alarm UI. |
| `icon_ui_notification_bell` | **Notifications** — camp alerts, reminders. Also mapped as “clock” in code for timed rewards. | Hanging shrine bell or simple bell with clapper. |
| `icon_ui_globe_language` | **Language / community** — language setting, community hub, discover. | Globe with meridian lines or torii-in-circle world mark. Spirit Blue accents. |
| `icon_ui_account` | **Account row** — settings account section, linked provider. | Person silhouette or kitsune head in circle — smaller than nav profile icon. |
| `icon_ui_search` | **Search** — kanji/vocabulary list search. *(Planned.)* | Magnifying glass with thin handle; Lantern Gold rim light on focus. |
| `icon_ui_offline_mountain` | **Offline mode** — no connection banner, offline continuity screen. *(Planned.)* | Soft cloud overlapping a mountain peak; painterly, gently glowing. Not a generic wifi-off symbol. |
| `icon_ui_warning` | **Critical notice** — rare blocking warnings, data loss confirm. *(Planned.)* | Amber lantern with exclamation, or small torii caution mark. Shrine Red accent; supportive, not aggressive triangle. |
| `icon_ui_plus` | **Add / unlock** — “new region unlocked” badge, add to review queue. *(Planned.)* | Simple plus with equal arm length; Lantern Gold stroke. |
| `icon_ui_minus` | **Remove / decrease** — quantity stepper. *(Planned.)* | Simple minus line. |
| `icon_ui_slider` | **Audio / volume** — settings sound row. *(Planned.)* | Horizontal slider track with round thumb, or three vertical bars. |
| `icon_ui_download` | **Offline download** — settings “download content”. *(Planned.)* | Down arrow into a tray or backpack. |
| `icon_ui_sync` | **Sync progress** — settings sync now, background sync. *(Planned.)* | Circular arrows around a small mountain or torii. |
| `icon_ui_trash` | **Destructive delete** — clear cache, remove item. *(Planned.)* | Trash brazier or paper burn bowl — thematic, not plastic bin. |
| `icon_ui_edit` | **Edit profile** — display name, title. *(Planned.)* | Brush pen or small scroll with pencil. |
| `icon_ui_share` | **Share progress** — social share sheet. *(Planned.)* | Outward arrows or folded paper sent on wind. |
| `icon_ui_star` | **Mastery / favorite** — kanji mastery indicator, bookmark article. *(Planned.)* | Five-point star or single gold star; filled vs outline via UI state. |
| `icon_ui_star_empty` | **Not mastered / unmarked** — kanji in progress. *(Planned.)* | Star outline at `#8A857A`. |
| `icon_ui_leaf` | **Review “Easy”** — SRS easy rating (paired with review button art). | Small green leaf or bamboo leaf; Moss Green `#7B8D5A`, calm “effortless recall” feel. |

---

## 4. Review (SRS) rating icons

Used on spaced-repetition answer buttons. Full button assets exist (`button-review-*`); these describe the icon portion inside each button.

| Base ID | Function | Appearance |
| --- | --- | --- |
| `icon_review_again` | **Again** — complete failure, shortest interval. | Shrine Red `#A94D3F` X or cross, same family as `icon_ui_cross`. Circular button background in composed asset. |
| `icon_review_hard` | **Hard** — difficult recall. | Fox Orange dash or downward triangle; “struggled but remembered”. |
| `icon_review_good` | **Good** — correct with effort. | Moss Green `#7B8D5A` checkmark; warm success, not neon. |
| `icon_review_easy` | **Easy** — effortless recall. | Moss Green leaf or double chevron up; positive “too easy” signal. |

---

## 5. Inventory item icons

Painterly item art at grid scale (bag, shop, rewards). Base IDs use `item_` prefix; each item ships `_light_v1` + `_dark_v1` in `props/inventory/`.

| Base ID | Function | Appearance |
| --- | --- | --- |
| `item_lantern` | **Lantern consumable** — reveals path, focus buff, common reward. | Hand lantern with brass frame, Lantern Gold glowing core, small handle. Light bleeds slightly outside silhouette. |
| `item_stone_lantern` | **Stone lantern** — shrine prop, trail decoration, rare collectable. | Grey granite tōrō: platform, post, hat roof. Moss optional. |
| `item_dango` | **Dango snack** — consumable, camp food. | Three pastel rice dumplings (Sakura Pink / cream / Moss Green) on a bamboo skewer. |
| `item_onigiri` | **Onigiri** — rice ball consumable. | White rice triangle with black nori strip; subtle grain texture. |
| `item_daruma` | **Daruma doll** — luck item, collectible. | Round Shrine Red doll, blank or filled eye, weighted base curve. |
| `item_scroll` | **Scroll** — quest item, knowledge boost. | Rolled parchment with red cord or wax seal; fibrous paper edge. |
| `item_omamori` | **Omamori charm** — protection buff, shrine reward. | Brocade pouch with Lantern Gold thread and hanging string; red or gold dominant. |
| `item_sakura` | **Sakura charm** — seasonal item, event currency. | Branch with 2–3 Sakura Pink blossoms or a single petal cluster. |
| `item_fan` | **Folding fan** — cosmetic, summer event. | Tan or ivory folded sensu fan with faint pattern ribs. |
| `item_fox_mask` | **Fox mask cosmetic** — equip on companion. | White kitsune mask with magical markings, tied with cord. |
| `item_scarf_crimson` | **Crimson scarf cosmetic** — companion neck gear. | Flowing Shrine Red fabric scarf, folded display shape. |
| `item_backpack_bamboo` | **Bamboo backpack cosmetic** — companion back gear. | Woven bamboo pack with leather straps. |
| `item_sakura_petals_trail` | **Sakura trail effect** — cosmetic path particles. | Scattered Sakura Pink petals in a small swirl — icon shows trail preview. |

### Inventory UI states (optional asset variants)

| State | Function | Appearance |
| --- | --- | --- |
| Locked | Not yet owned. | Grey silhouette at `#8A857A`, padlock overlay or heavy dim. |
| Owned | In bag, not selected. | Full-color item on dark square card. |
| Selected | Inspecting in detail panel. | Brighter border glow; item enlarged in panel. |
| Equipped | Worn on Noboru. | Small check or “equipped” ribbon on card corner. |

---

## 6. Reward & celebration badge icons

Used in level-up ceremony, lesson complete, achievement unlock, checkpoint shrine, and shop highlights.

| Base ID | Function | Appearance |
| --- | --- | --- |
| `reward_xp_badge` | **XP reward burst** — lesson complete, small achievements. | Rounded badge or medallion with “XP” or star burst; Moss Green `#7B8D5A` and Lantern Gold trim. |
| `reward_level_medallion_24` | **Level up** — level-up ceremony overlay. Template: center number is dynamic in UI. | Circular Lantern Gold medallion with rope border, mountain engraving, level number in center. Ceremonial weight. |
| `reward_badge_kanji_explorer` | **Achievement badge** — kanji milestones, trophy HUD icon. | Circular gold/bronze medal with brush kanji or mountain kanji motif. |
| `reward_gem_purple` | **Gem reward** — rare achievement, checkpoint. | Hero version of `icon_ui_gem`; Spirit Violet `#8A78C7` facets, soft sparkles. |
| `reward_lantern` | **Item reward** — streak rewards, checkpoint drops. | Hero lantern with stronger Lantern Gold glow than `item_lantern`. |
| `reward_title_path_master` | **Title unlock** — long streak, N5 complete. | Horizontal title ribbon or hanging plaque: 「Path Master」 aesthetic. |
| `reward_trail_bamboo_forest` | **New trail / region unlock** — bamboo forest path reward. | Mini landscape: bamboo stalks + narrow trail receding. Moss Green atmosphere. |

### Achievement shrine badges (per achievement slug)

Each achievement needs a unique plaque icon for the shrine wall. Current code reuses reward art; production should replace with dedicated badges.

| Base ID | Function | Appearance |
| --- | --- | --- |
| `achievement_badge_first_step` | First app milestone. | Single footprint in stone or first trail marker flag. |
| `achievement_badge_first_lesson` | First lesson completed. | Small torii with one lit lantern. |
| `achievement_badge_ten_lessons` | Ten lessons completed. | Bronze medallion with “10” or ten tick marks. |
| `achievement_badge_hundred_words` | 100 words learned. | Vocabulary scroll unfurled with many lines. |
| `achievement_badge_fifty_kanji` | 50 kanji learned. | Brush and single bold kanji 習 or 学. |
| `achievement_badge_seven_day_streak` | 7-day streak. | Lit lantern with small flame count 7. |
| `achievement_badge_n5_completed` | Mount N5 region cleared. | Mountain peak with N5 plaque. |
| `achievement_badge_memory_master` | Memory game mastery. | Bamboo gate with subtle spiral motif. |
| `achievement_badge_game_champion` | Games leaderboard win. | Trophy cup with Spirit Violet gem accent. |
| `achievement_badge_perfect_recall` | Perfect review session. | Spirit Violet gem inside Lantern Gold ring. |
| `achievement_badge_dungeon_delver` | Memory dungeon cleared. | Boss mask smaller variant on stone plaque. |
| `achievement_badge_mountain` | Shrine milestone — 100 lessons. | Mountain silhouette in Lantern Gold ring. |
| `achievement_badge_torii` | Shrine milestone — torii theme. | Shrine Red torii in circle frame. |
| `achievement_badge_fox` | Shrine milestone — companion theme. | Kitsune head in Lantern Gold ring. |
| `achievement_badge_companion` | Shrine milestone — companion bond. | Fox and lantern together. |

---

## 7. Onboarding & learning-goal icons

Currently Lucide placeholders in code; need custom Noboru icons for onboarding cards. Each ships `_light_v1` + `_dark_v1`.

| Base ID | Function | Appearance |
| --- | --- | --- |
| `icon_onboard_anime` | Learning goal: Anime. | Retro TV or film reel with Sakura Pink accent — not generic flat TV. |
| `icon_onboard_travel` | Learning goal: Travel. | Paper plane or walking boots with mountain backdrop silhouette. |
| `icon_onboard_culture` | Learning goal: Culture. | Torii or tea bowl on a small tray. |
| `icon_onboard_work` | Learning goal: Work. | Briefcase with subtle mountain line emboss. |
| `icon_onboard_jlpt` | Learning goal: JLPT exam prep. | Graduation scroll or certificate with JLPT text hint. |
| `icon_jlpt_n5` | Placement level N5. | Circular badge “N5” with Moss Green beginner glow. |
| `icon_jlpt_n4` | Placement level N4. | Badge “N4” — Mountain Sage `#8A9B78` / Moonlit Sage `#8EAA8B`. |
| `icon_jlpt_n3` | Placement level N3. | Badge “N3” — Lantern Gold intermediate. |
| `icon_jlpt_n2` | Placement level N2. | Badge “N2” — Fox Orange advanced. |
| `icon_jlpt_n1` | Placement level N1. | Badge “N1” — Shrine Red + Lantern Gold master. |
| `icon_jlpt_beginner` | Absolute beginner. | Empty trail sign or base-camp flag. |
| `icon_onboard_time_5` … `icon_onboard_time_60` | Daily goal duration options. | Clock face or trail distance post with minute label; 5/10/20/30/60 variants. |
| `icon_theme_dawn` | Light mode preview (settings). | Sun rising over mountain — palette preview using `#F4EFE3` main background and Forest Green accents. |
| `icon_theme_night` | Dark mode preview (settings). | Moon and stars over mountain — palette preview using `#0D1320` main background and Lantern Gold accents. |

---

## 8. Discover category icons

Discover hub categories currently share the compass icon; dedicated icons improve scanability.

| Base ID | Function | Appearance |
| --- | --- | --- |
| `icon_discover_culture` | Culture articles. | Folding fan + tea cup, or seasonal motif 雅. |
| `icon_discover_history` | History articles. | Ancient scroll or castle silhouette 史. |
| `icon_discover_folklore` | Folklore stories. | Fox fire (kitsunebi) or storytelling lantern 話. |
| `icon_discover_food` | Food articles. | Bowl of ramen or onigiri pair 食. |
| `icon_discover_anime` | Anime articles. | Film strip with mountain backdrop 映. |
| `icon_discover_mythology` | Mythology articles. | Shimenawa rope circle or kami symbol 神. |

---

## 9. World hub & feature tiles

Icons for Explore, Games, Shop, Social, Collections, and Dojo area tiles (many reuse node/nav icons).

| Base ID | Function | Appearance |
| --- | --- | --- |
| `icon_hub_vocabulary` | Vocabulary hall. | Same as `icon_node_vocabulary`. |
| `icon_hub_grammar` | Grammar shrine. | Same as `icon_node_kanji` or small torii with grammar scroll. |
| `icon_hub_kanji` | Kanji grounds. | Same as `icon_node_kanji`. |
| `icon_hub_listening` | Listening pavilion. | Same as `icon_node_listening`. |
| `icon_hub_reading` | Reading library. | Open book with vertical Japanese text lines. |
| `icon_hub_hiragana` | Hiragana dojo. | あ character on practice tile. |
| `icon_hub_katakana` | Katakana dojo. | ア character on practice tile. |
| `icon_hub_review` | Review queue. | Stack of cards with clock or loop arrow. |
| `icon_game_word_match` | Word Match game. | Two matching cards with connecting line. |
| `icon_game_vocabulary_rush` | Vocabulary Rush. | Same as `icon_ui_xp` with speed lines. |
| `icon_game_kanji_hunter` | Kanji Hunter. | Target reticle over kanji. |
| `icon_game_memory_dungeon` | Memory Dungeon. | Same as `icon_node_boss_mask`. |
| `icon_game_reading_challenge` | Reading Challenge. | Same as `icon_node_listening` + book. |
| `icon_shop_items` | Shop tab: Items. | Coin bag or merchant lantern. |
| `icon_shop_cosmetics` | Shop tab: Cosmetics. | Fox mask + scarf combo small. |
| `icon_shop_trails` | Shop tab: Trails. | Winding path with Lantern Gold sparkle. |
| `icon_shop_special` | Shop tab: Special. | Star in Lantern Gold frame; Spirit Violet for legendary offers. |
| `icon_social_friends` | Friends list. | Two small climber silhouettes or kitsune avatars. |
| `icon_social_leaderboard` | Leaderboard. | Podium with mountain peak on step 1. |
| `icon_collections_museum` | Collections museum. | Display case with gem or artifact. |

---

## 10. Camp & quest icons

| Base ID | Function | Appearance |
| --- | --- | --- |
| `icon_quest_lesson` | Daily quest: complete lessons. | Small tent node + progress ring. |
| `icon_quest_words` | Daily quest: learn new words. | Book + plus sign. |
| `icon_quest_review` | Daily quest: review cards. | Card stack + circular arrow. |
| `icon_chest_closed` | Reward chest unavailable. | Wooden chest, dark metal bands, no glow. |
| `icon_chest_available` | Reward chest ready to open. | Same chest with Lantern Gold seam glow. |
| `icon_quest_board_pin` | Quest board empty pin. | Rusted nail or rope loop on wood. |

---

## 11. Brand & app icons

| Base ID | Function | Appearance |
| --- | --- | --- |
| `brand_wordmark_noboru` | Logo lockup — splash, auth, onboarding. | “NOBORU” lettering with 登る subtitle; mountain-inspired serif or custom display type. |
| `icon_app_dark` | PWA / home screen (dark). | Noboru mountain mark or kitsune emblem on `#0D1320` main background (baked only for app icon asset, not UI glyphs). |
| `icon_app_light` | PWA / home screen (light). | Same mark on `#F4EFE3` main background. |

---

## 12. Social & status micro-icons

Small indicators — can be CSS circles in UI, but painterly variants optional.

| Base ID | Function | Appearance |
| --- | --- | --- |
| `icon_status_online` | Friend online. | Small Moss Green `#7B8D5A` lantern dot. |
| `icon_status_offline` | Friend offline. | `#8A857A` dot or unlit lantern. |
| `icon_status_busy` | Friend in lesson. | Lantern Gold dot or book icon overlay. |
| `icon_rank_1` | Leaderboard first place. | Lantern Gold crown or summit flag. |
| `icon_rank_2` | Second place. | Moonlit Sage torii mark. |
| `icon_rank_3` | Third place. | Bronze stone lantern. |

---

## Variant & export checklist

When delivering icons to production:

1. **Theme pair:** Every icon identity ships `*_light_v1` + `*_dark_v1` — same silhouette, palette swap only.
2. **Transparency:** Alpha PNG or WebP only for UI glyphs. No baked backgrounds (exception: PWA `icon_app_*` may bake main background `#F4EFE3` / `#0D1320`).
3. **Semantic states:** Inactive `#8A857A`, active `#D6A85F`, completed `#7B8D5A`, magic `#73A7D6`, legendary `#8A78C7`, danger `#A94D3F` — apply via UI tinting; do not multiply export files per skin color.
4. **Format:** Raster PNG/WebP @2x for painterly icons. Vector only if texture/depth is preserved — never flat outline SVG packs.
5. **Size:** Design at 48×48px canvas minimum; nav icons must read at 24px display.
6. **Forbidden colors:** Never `#00FFFF`, `#FF00FF`, `#0066FF`, `#00FF00`, `#FF0000`.
7. **Registry:** Register new IDs in `docs/asset-registry.md` and wire theme-aware paths in `lib/assets/art-mappings.ts` before shipping.
8. **True alpha:** Run `node scripts/art-direction/strip-icon-backgrounds.mjs "Art Library/icons"` on every generated icon batch — verify `RGBA` mode before review.

**Total unique icon identities:** ~120 base IDs × 2 theme files ≈ **240 production icon files** (plus composed button assets that embed icons).
