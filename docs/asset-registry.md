# Noboru Asset Registry

Version: 1.0

Status: AUTHORITATIVE

This document is the central registry of approved production assets in Noboru. Every asset must have a `metadata.json` and a registry entry per [asset-pipeline.md](./asset-pipeline.md).

**Related documents:** [asset-pipeline.md](./asset-pipeline.md), [art-direction.md](./art-direction.md), [design-system.md](./design-system.md), [uiux.mdc](../.cursor/rules/uiux.mdc)

**Code registry:** `lib/assets/registry.ts`

---

## Registry Philosophy

From [asset-pipeline.md](./asset-pipeline.md):

- Every asset must be registered before production use
- Every asset must have `metadata.json` in its source folder
- No asset may skip: Concept → Specification → Creation → Review → Approval → Metadata → Registry → Production
- Assets are part of the product — not decoration

---

## Folder Structure

```
assets/                          # Source assets + metadata
├── ui/                          # Trail scroll, spine, auth atmosphere
├── regions/                     # Region hero banners
├── mascots/
├── icons/
└── marketing/

public/                          # Served assets (production paths)
├── ui/
├── regions/
├── mascots/
├── icons/
└── manifest.json

lib/assets/registry.ts           # Canonical path constants
lib/design-system/
├── trail-path-anchors.json      # Anchor source of truth (runtime + pipeline)
└── regions.ts                   # Region slug catalog
```

### Trail anchor contract

Each region owns a unique 14-point polyline in `lib/design-system/trail-path-anchors.json`:

- `spine.{dark|light}` — horizontal spine art (1536×1024) for Home/card previews
- `regions.{slug}.{dark|light}` — immersive scroll art (1536×5120) per region

Runtime: `getTrailMapPathAnchors({ regionSlug, mode, theme })`  
Pipeline: `generate-region-trail-scrolls.mjs`, `calibrate-trail-anchors.mjs`  
QA: `npm run assets:calibrate-trail:all`

---

## Registry Summary

| ID | Name | Category | Version | Status | Theme |
|----|------|----------|---------|--------|-------|
| `yama_main_light_v1` | Yama Main Light | mascots | v1 | approved | light |
| `yama_main_dark_v1` | Yama Main Dark | mascots | v1 | approved | dark |
| `yama_happy_dark_v2` | Yama Happy Dark | mascots | v2 | approved | dark |
| `yama_happy_light_v1` | Yama Happy Light | mascots | v1 | approved | light |
| `yama_celebrating_dark_v2` | Yama Celebrating Dark | mascots | v2 | approved | dark |
| `yama_celebrating_light_v1` | Yama Celebrating Light | mascots | v1 | approved | light |
| `yama_encouraging_dark_v2` | Yama Encouraging Dark | mascots | v2 | approved | dark |
| `yama_encouraging_light_v1` | Yama Encouraging Light | mascots | v1 | approved | light |
| `yama_thinking_dark_v2` | Yama Thinking Dark | mascots | v2 | approved | dark |
| `yama_thinking_light_v1` | Yama Thinking Light | mascots | v1 | approved | light |
| `yama_loading_dark_v2` | Yama Loading Dark | mascots | v2 | approved | dark |
| `yama_loading_light_v1` | Yama Loading Light | mascots | v1 | approved | light |
| `yama_victorious_dark_v1` | Yama Victorious Dark | mascots | v1 | approved | dark |
| `yama_victorious_light_v1` | Yama Victorious Light | mascots | v1 | approved | light |
| `yama_confused_dark_v1` | Yama Confused Dark | mascots | v1 | approved | dark |
| `yama_confused_light_v1` | Yama Confused Light | mascots | v1 | approved | light |
| `icon_app_light_v1` | App Icon Light | icons | v1 | approved | light |
| `icon_app_dark_v1` | App Icon Dark | icons | v1 | approved | dark |
| `icon_nav_home_v1` | Nav Home | icons | v1 | approved | both |
| `icon_nav_learn_v1` | Nav Learn | icons | v1 | approved | both |
| `icon_nav_review_v1` | Nav Review | icons | v1 | approved | both |
| `icon_nav_explore_v1` | Nav Explore | icons | v1 | approved | both |
| `icon_nav_profile_v1` | Nav Profile | icons | v1 | approved | both |
| `brand_wordmark_dark_v1` | Wordmark Dark | brand | v1 | approved | dark |
| `brand_wordmark_light_v1` | Wordmark Light | brand | v1 | approved | light |
| `ui_auth_atmosphere_dark_v1` | Auth Atmosphere Dark | ui | v1 | approved | dark |
| `ui_auth_atmosphere_light_v1` | Auth Atmosphere Light | ui | v1 | approved | light |
| `ui_trail_spine_dark_v1` | Trail Spine Dark | ui | v1 | approved | dark |
| `ui_trail_spine_light_v1` | Trail Spine Light | ui | v1 | approved | light |
| `ui_trail_scroll_foothills_dark_v2` | Trail Scroll Foothills Dark | ui | v2 | approved | dark |
| `ui_trail_scroll_foothills_light_v2` | Trail Scroll Foothills Light | ui | v2 | approved | light |
| `ui_trail_scroll_*_{dark,light}_v1` | Trail Scroll (8 regions) | ui | v1 | approved | both |
| `achievement_*_v1` (11 badges) | Achievement Badges | achievements | v1 | approved | both |
| `region_*_v1` (8 regions) | Region Heroes | regions | v1 | approved | both |
| `game_*_v1` (5 games) | Game Art | games | v1 | approved | both |
| `mockup_product_collection_v1` | Product Mockup Collection | marketing | v1 | approved | both |
| `mockup_home_learn_flow_dark_v1` | Home & Learn Flow Redesign | marketing | v1 | approved | dark |

---

## Mascots

### yama_main_light_v1

| Field | Value |
|-------|-------|
| **ID** | `yama_main_light_v1` |
| **Name** | Yama Main Light |
| **Category** | mascots |
| **Version** | v1 |
| **Status** | approved |
| **Owner Agent** | Art Director Agent |
| **Created** | 2026-06-08 |
| **Updated** | 2026-06-08 |

**Source path:** `assets/mascots/yama_main_light_v1/`

**Public path:** `/mascots/yama_main_light_v1.webp`

**Registry key:** `ASSET_REGISTRY.mascots.yamaMainLight`

**Tags:** `yama`, `mascot`, `canonical`, `light-mode`, `kitsune`

**Usage locations:**

- Onboarding (Meet Yama screen)
- Home dashboard
- Loading screens
- Marketing materials
- Achievements

**Design notes:** Canonical MVP Yama. White kitsune, red scarf with mountain logo, red forehead sigil, golden swirl markings. No backpack or temple bell.

**Helper:** `getMascotPath("light")` returns this path.

---

### yama_main_dark_v1

| Field | Value |
|-------|-------|
| **ID** | `yama_main_dark_v1` |
| **Name** | Yama Main Dark |
| **Category** | mascots |
| **Version** | v1 |
| **Status** | approved |
| **Owner Agent** | Art Director Agent |
| **Created** | 2026-06-08 |
| **Updated** | 2026-06-08 |

**Source path:** `assets/mascots/yama_main_dark_v1/`

**Public path:** `/mascots/yama_main_dark_v1.webp`

**Registry key:** `ASSET_REGISTRY.mascots.yamaMainDark`

**Tags:** `yama`, `mascot`, `canonical`, `dark-mode`, `kitsune`

**Usage locations:**

- Onboarding (Meet Yama screen)
- Home dashboard
- Loading screens
- Marketing materials
- Achievements

**Design notes:** Canonical MVP Yama for dark mode. Dramatic painterly style with golden halo, torii silhouettes, and glowing mountain logo on pedestal.

**Helper:** `getMascotPath("dark")` returns this path (default for non-light themes).

---

## Icons

### icon_app_light_v1

| Field | Value |
|-------|-------|
| **ID** | `icon_app_light_v1` |
| **Name** | App Icon Light |
| **Category** | icons |
| **Version** | v1 |
| **Status** | approved |
| **Owner Agent** | Art Director Agent |
| **Created** | 2026-06-08 |
| **Updated** | 2026-06-08 |

**Source path:** `assets/icons/icon_app_light_v1/`

**Public path:** `/icons/icon_app_light_v1.webp`

**Registry key:** `ASSET_REGISTRY.icons.appLight`

**Tags:** `app-icon`, `light-mode`, `yama`, `pwa`

**Usage locations:**

- PWA manifest (`public/manifest.json`)
- App store listing
- Favicon (light variant)

**Manifest reference:**

```json
{
  "src": "/icons/icon_app_light_v1.webp",
  "sizes": "512x512",
  "type": "image/webp",
  "purpose": "any maskable"
}
```

---

### icon_app_dark_v1

| Field | Value |
|-------|-------|
| **ID** | `icon_app_dark_v1` |
| **Name** | App Icon Dark |
| **Category** | icons |
| **Version** | v1 |
| **Status** | approved |
| **Owner Agent** | Art Director Agent |
| **Created** | 2026-06-08 |
| **Updated** | 2026-06-08 |

**Source path:** `assets/icons/icon_app_dark_v1/`

**Public path:** `/icons/icon_app_dark_v1.webp`

**Registry key:** `ASSET_REGISTRY.icons.appDark`

**Tags:** `app-icon`, `dark-mode`, `yama`, `pwa`

**Usage locations:**

- PWA manifest (`public/manifest.json`)
- App store listing
- Favicon (dark variant)

**Manifest reference:**

```json
{
  "src": "/icons/icon_app_dark_v1.webp",
  "sizes": "512x512",
  "type": "image/webp",
  "purpose": "any maskable"
}
```

---

## Marketing

### mockup_product_collection_v1

| Field | Value |
|-------|-------|
| **ID** | `mockup_product_collection_v1` |
| **Name** | Product Mockup Collection |
| **Category** | marketing |
| **Version** | v1 |
| **Status** | approved |
| **Owner Agent** | Frontend Agent |
| **Created** | 2026-06-08 |
| **Updated** | 2026-06-08 |

**Source path:** `assets/marketing/`

**Tags:** `mockup`, `ui-reference`, `product-design`

**Usage locations:**

- [uiux.mdc](../.cursor/rules/uiux.mdc) — screen design reference
- [design-system.md](./design-system.md) — component layout reference
- Development reference for UI implementation

**Files:**

| File | Description |
|------|-------------|
| `mockup_product_dark_v1.png` | Primary product mockup — dark mode |
| `mockup_product_light_v1.png` | Primary product mockup — light mode |
| `mockup_supplementary_dark_v1.png` | Supplementary screens — dark mode |
| `mockup_home_learn_flow_dark_v1.png` | Home base camp + trail-first Learn flow (5 screens) |

**Note:** Marketing mockups are design references — not served in production UI. They guide screen layout, spacing, and component placement.

---

### mockup_home_learn_flow_dark_v1

| Field | Value |
|-------|-------|
| **ID** | `mockup_home_learn_flow_dark_v1` |
| **Name** | Home & Learn Flow Redesign |
| **Category** | marketing |
| **Version** | v1 |
| **Status** | approved |
| **Owner Agent** | Frontend Agent |
| **Created** | 2026-06-11 |
| **Updated** | 2026-06-11 |

**Source path:** `assets/marketing/mockup_home_learn_flow_dark_v1.png`

**Tags:** `mockup`, `ui-reference`, `home`, `learn`, `trail-map`, `dark-mode`

**Usage locations:**

- Home base camp (`features/learning/components/trail/expedition-hero.tsx`)
- Trail-first Learn tab (`features/learning/components/trail-first-learn-screen.tsx`)
- [phase-a-visuals-plan.md](./phase-a-visuals-plan.md)

**Screens covered:**

| Panel | Description |
|-------|-------------|
| Home | Base camp greeting, continue card, today's quests, streak/XP stats |
| Learn | Full-screen trail map as default view |
| Node detail | Lesson focus sheet on node tap |
| Region select | Bottom sheet region picker |
| Trail overview | All regions progress list |

---

## UI

### ui_trail_spine_dark_v1

| Field | Value |
|-------|-------|
| **ID** | `ui_trail_spine_dark_v1` |
| **Name** | Trail Spine Dark |
| **Category** | ui |
| **Version** | v1 |
| **Status** | approved |
| **Owner Agent** | UI Art Agent |
| **Creation Agent** | UI Art Agent |
| **Approved By** | Art Director Agent |
| **Created** | 2026-06-11 |
| **Updated** | 2026-06-12 |

**Source path:** `assets/ui/ui_trail_spine_dark_v1/`

**Public path:** `/ui/ui_trail_spine_dark_v1.webp`

**Registry key:** `ASSET_REGISTRY.ui.trailSpineDark`

**Tags:** `ui`, `trail`, `dark-mode`

**Usage locations:**

- Trail map (horizontal spine)
- Learning path screen
- Expedition hero

**Helper:** `getTrailSpineArtPath("dark")` returns this path.

---

### ui_trail_spine_light_v1

| Field | Value |
|-------|-------|
| **ID** | `ui_trail_spine_light_v1` |
| **Name** | Trail Spine Light |
| **Category** | ui |
| **Version** | v1 |
| **Status** | approved |
| **Owner Agent** | UI Art Agent |
| **Creation Agent** | UI Art Agent |
| **Approved By** | Art Director Agent |
| **Created** | 2026-06-11 |
| **Updated** | 2026-06-12 |

**Source path:** `assets/ui/ui_trail_spine_light_v1/`

**Public path:** `/ui/ui_trail_spine_light_v1.webp`

**Registry key:** `ASSET_REGISTRY.ui.trailSpineLight`

**Tags:** `ui`, `trail`, `light-mode`

**Usage locations:**

- Trail map (horizontal spine)
- Learning path screen
- Expedition hero

**Helper:** `getTrailSpineArtPath("light")` returns this path.

---

### ui_trail_scroll_foothills_dark_v2

| Field | Value |
|-------|-------|
| **ID** | `ui_trail_scroll_foothills_dark_v2` |
| **Name** | Trail Scroll Foothills Dark |
| **Category** | ui |
| **Version** | v2 |
| **Status** | review |
| **Owner Agent** | UI Art Agent |
| **Creation Agent** | UI Art Agent |
| **Approved By** | *(pending — omit from metadata until Art Director QA)* |
| **Created** | 2026-06-11 |
| **Updated** | 2026-06-12 |

**Source path:** `assets/ui/ui_trail_scroll_foothills_dark_v2/`

**Public path:** `/ui/ui_trail_scroll_foothills_dark_v2.webp`

**Registry key:** `ASSET_REGISTRY.ui.trailScrollFoothillsDark` (via `getTrailScrollArtPath("foothills", "dark")`)

**Dependencies:** `ui_trail_spine_dark_v1`

**Dimensions:** 1536 × 5120

**Tags:** `ui`, `trail`, `scroll`, `foothills`, `dark-mode`, `immersive`

**Usage locations:**

- Trail-first Learn screen (immersive mode)
- Trail map immersive scroll

**Pipeline:** Scene converter (`scripts/convert-scene-assets.mjs`) — not sticker pipeline.

**Helper:** `getTrailScrollArtPath("foothills", "dark")` returns this path.

**Design notes:** Foothills uses v2 in code (`TRAIL_SCROLL_VERSION_BY_REGION`). v1 superseded but may remain in `public/` until archived.

---

### ui_trail_scroll_foothills_light_v2

| Field | Value |
|-------|-------|
| **ID** | `ui_trail_scroll_foothills_light_v2` |
| **Name** | Trail Scroll Foothills Light |
| **Category** | ui |
| **Version** | v2 |
| **Status** | review |
| **Owner Agent** | UI Art Agent |
| **Creation Agent** | UI Art Agent |
| **Approved By** | *(pending)* |
| **Created** | 2026-06-11 |
| **Updated** | 2026-06-12 |

**Source path:** `assets/ui/ui_trail_scroll_foothills_light_v2/`

**Public path:** `/ui/ui_trail_scroll_foothills_light_v2.webp`

**Registry key:** `ASSET_REGISTRY.ui.trailScrollFoothillsLight` (via `getTrailScrollArtPath("foothills", "light")`)

**Helper:** `getTrailScrollArtPath("foothills", "light")` returns this path.

---

### Trail scroll — all regions

`TRAIL_SCROLL_REGION_SLUGS` in `lib/assets/registry.ts` lists all 8 regions: `foothills`, `forest-trail`, `mount-n5` … `master-summit`. Public path pattern: `/ui/ui_trail_scroll_{slug}_{theme}_v1.webp` (foothills uses v2).

---

### ui_auth_atmosphere_dark_v1 / ui_auth_atmosphere_light_v1

| Field | Value |
|-------|-------|
| **Category** | ui |
| **Status** | approved |
| **Public paths** | `/ui/ui_auth_atmosphere_dark_v1.webp`, `/ui/ui_auth_atmosphere_light_v1.webp` |
| **Usage** | `components/layout/auth-atmosphere.tsx`, `app/(auth)/layout.tsx` |
| **Helper** | `getAuthAtmospherePath(theme)` |

---

### brand_wordmark_dark_v1 / brand_wordmark_light_v1

| Field | Value |
|-------|-------|
| **Category** | brand |
| **Status** | approved |
| **Public paths** | `/brand/brand_wordmark_dark_v1.webp`, `/brand/brand_wordmark_light_v1.webp` |
| **Usage** | `components/brand/noboru-wordmark.tsx`, auth + onboarding |
| **Helper** | `getWordmarkPath(theme)` |
| **Pipeline** | Sticker (`npm run assets:stickers`) |

---

## Achievements

Eleven illustrated badges in `assets/achievements/` and `public/achievements/`. Mapped by slug in `getAchievementArtPath()`.

| Slug | Asset ID |
|------|----------|
| `first-step` | `achievement_first_step_v1` |
| `first-lesson` | `achievement_first_lesson_v1` |
| `ten-lessons` | `achievement_trail_walker_v1` |
| `hundred-words` | `achievement_word_collector_v1` |
| `fifty-kanji` | `achievement_kanji_scholar_v1` |
| `seven-day-streak` | `achievement_steady_climber_v1` |
| `n5-completed` | `achievement_n5_summit_v1` |
| `memory-master` | `achievement_memory_master_v1` |
| `game-champion` | `achievement_game_champion_v1` |
| `perfect-recall` | `achievement_perfect_recall_v1` |
| `dungeon-delver` | `achievement_dungeon_delver_v1` |

**Usage:** `features/achievements/components/achievement-badge.tsx`

**Pipeline:** Sticker (`npm run assets:stickers`)

---

## Regions

Eight region hero illustrations in `assets/regions/` and `public/regions/`. Mapped by slug in `getRegionArtPath()`.

| Slug | Asset ID |
|------|----------|
| `foothills` | `region_foothills_v1` |
| `forest-trail` | `region_forest_trail_v1` |
| `mount-n5` … `mount-n1` | `region_mount_n5_v1` … `region_mount_n1_v1` |
| `master-summit` | `region_master_summit_v1` |

**Usage:** Home hero, Learn trail fallback, progress dashboard, profile, region picker

**Pipeline:** Scene converter (backgrounds preserved)

---

## Games

| Slug | Asset ID | Usage |
|------|----------|-------|
| `word-match` | `game_word_match_v1` | Explore + Games hub |
| `vocabulary-rush` | `game_vocabulary_rush_v1` | Explore + Games hub |
| `kanji-hunter` | `game_kanji_hunter_v1` | Explore + Games hub |
| `memory-dungeon` | `game_memory_dungeon_v1` | Explore + Games hub |
| `reading-challenge` | `game_reading_challenge_v1` | Explore (coming soon) |

**Helper:** `getGameArtPath(slug)`

---

## Yama Expressions

Expression sprites (light + dark) registered in `ASSET_REGISTRY.mascots` and resolved via `getYamaExpressionPath(expression, theme)`.

Expressions: `happy`, `celebrating`, `encouraging`, `thinking`, `loading`, `victorious`, `confused` (+ aliases `supportive`, `studying` → encouraging/thinking).

Dark v2 expressions supersede dark v1 files still present in `public/mascots/`.

**Pipeline:** Sticker (`npm run assets:stickers`)

---

## Navigation Icons

Custom WebP nav icons: `icon_nav_{home,learn,review,explore,profile}_v1`. Resolved via `getNavIconPath(tab)`.

**Usage:** `components/layout/bottom-nav.tsx`

**Pipeline:** Sticker (`npm run assets:stickers`)

---

## Code Registry

`lib/assets/registry.ts` exports canonical public paths:

```typescript
export const ASSET_REGISTRY = {
  mascots: { /* main + 16 expressions */ },
  icons: { /* app + 5 nav */ },
  games: { /* 5 game art */ },
  brand: { wordmarkDark, wordmarkLight },
  ui: {
    trailSpineDark, trailSpineLight,
    trailScrollFoothillsDark, trailScrollFoothillsLight,
    authAtmosphereDark, authAtmosphereLight,
  },
  achievements: { /* 11 badges */ },
  regions: { /* 8 region heroes */ },
} as const;

export const TRAIL_SCROLL_REGION_SLUGS = [
  "foothills", "forest-trail", "mount-n5", "mount-n4",
  "mount-n3", "mount-n2", "mount-n1", "master-summit",
] as const;
```

**Helpers:** `getMascotPath`, `getYamaExpressionPath`, `getAchievementArtPath`, `getGameArtPath`, `getNavIconPath`, `getRegionArtPath`, `getTrailSpineArtPath`, `getTrailScrollArtPath`, `getWordmarkPath`, `getAuthAtmospherePath`

**Rule:** UI components must import paths from `ASSET_REGISTRY` — never hardcode asset paths.

---

## Metadata Schema

Required fields per [asset-pipeline.md](./asset-pipeline.md):

```json
{
  "id": "",
  "name": "",
  "version": "",
  "category": "",
  "owner_agent": "",
  "created_at": "",
  "updated_at": "",
  "status": "",
  "tags": [],
  "usage_locations": []
}
```

Optional fields: `design_notes`, `files`, `dependencies`, `creation_agent`, `approved_by`, `dimensions`

**Agent chain:** UI domain assets use `owner_agent` (domain owner, e.g. UI Art Agent), `creation_agent` (UI Art Agent for UI art), and `approved_by` (Art Director Agent). Procedural compositing is executed by Asset Pipeline Agent scripts — document in `design_notes`, not as `creation_agent`. Do not set `owner_agent` to Art Director Agent alone — that omits the creating agent.

### Status Values

`draft` → `review` → `approved` → `production` → `deprecated` → `archived`

Only `approved` and `production` assets may appear in this registry.

---

## Naming Convention

Format: `category_name_variant_version`

Examples:

- `yama_main_light_v1`
- `icon_app_dark_v1`
- `mockup_product_dark_v1`
- `achievement_first_step_v1` (future)
- `region_mount_n5_v1` (future)

**Forbidden names:** `final.png`, `final2.png`, `new_final_v7.png`

---

## Future Asset Categories

From [asset-pipeline.md](./asset-pipeline.md) — scaffold folders exist but not yet populated:

| Category | Folder | Status |
|----------|--------|--------|
| Avatars | `assets/avatars/` | empty |
| Backgrounds | `assets/backgrounds/` | empty |
| Enemies / Bosses | `assets/enemies/`, `assets/bosses/` | empty |
| Loading | `assets/loading/` | empty (Yama loading expression used instead) |
| Events / Seasons | `assets/events/`, `assets/seasons/` | empty |

**Shipped categories:** mascots, icons, brand, ui, achievements, regions, games, marketing.

---

## Asset Usage Rules

From [uiux.mdc](../.cursor/rules/uiux.mdc):

- Yama appears as companion, explorer, encourager, guidepost
- Yama never appears as lecturer or authority figure
- Theme-appropriate mascot: light theme → light Yama, dark theme → dark Yama
- Loading states may use Yama illustrations
- Achievement unlocks may feature Yama celebration poses (future variants)

---

## Admin Asset Management

From [admin-panel-spec.md](./admin-panel-spec.md):

Admin asset manager supports:

- Upload
- Edit metadata
- Approve
- Archive
- Yama variant management

Admin operations update both `assets/` metadata and `public/` served files.

---

END OF asset-registry.md
