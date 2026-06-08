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
├── mascots/
│   ├── yama_main_light_v1/
│   │   └── metadata.json
│   └── yama_main_dark_v1/
│       └── metadata.json
├── icons/
│   ├── icon_app_light_v1/
│   │   └── metadata.json
│   └── icon_app_dark_v1/
│       └── metadata.json
└── marketing/
    └── metadata.json

public/                          # Served assets (production paths)
├── mascots/
├── icons/
└── manifest.json

lib/assets/registry.ts         # Canonical path constants
```

---

## Registry Summary

| ID | Name | Category | Version | Status | Theme |
|----|------|----------|---------|--------|-------|
| `yama_main_light_v1` | Yama Main Light | mascots | v1 | approved | light |
| `yama_main_dark_v1` | Yama Main Dark | mascots | v1 | approved | dark |
| `icon_app_light_v1` | App Icon Light | icons | v1 | approved | light |
| `icon_app_dark_v1` | App Icon Dark | icons | v1 | approved | dark |
| `mockup_product_collection_v1` | Product Mockup Collection | marketing | v1 | approved | both |

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

**Note:** Marketing mockups are design references — not served in production UI. They guide screen layout, spacing, and component placement.

---

## Code Registry

`lib/assets/registry.ts` exports canonical public paths:

```typescript
export const ASSET_REGISTRY = {
  mascots: {
    yamaMainLight: "/mascots/yama_main_light_v1.webp",
    yamaMainDark: "/mascots/yama_main_dark_v1.webp",
  },
  icons: {
    appLight: "/icons/icon_app_light_v1.webp",
    appDark: "/icons/icon_app_dark_v1.webp",
  },
} as const;
```

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

Optional fields: `design_notes`, `files`, `dependencies`

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

From [asset-pipeline.md](./asset-pipeline.md) — not yet registered:

| Category | Folder | Examples |
|----------|--------|----------|
| Avatars | `assets/avatars/` | User avatar options |
| Achievements | `assets/achievements/` | Badge artwork per achievement |
| Regions | `assets/regions/` | Region hero illustrations |
| Backgrounds | `assets/backgrounds/` | Screen backgrounds |
| Enemies / Bosses | `assets/enemies/`, `assets/bosses/` | Trial boss artwork |
| Loading | `assets/loading/` | Yama loading states |
| Events | `assets/events/` | Seasonal event art |
| UI | `assets/ui/` | Illustrations for empty states |

When new assets are approved:

1. Add `metadata.json` to source folder
2. Copy production files to `public/`
3. Add entry to `lib/assets/registry.ts`
4. Update this document

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
