# Trail Scroll — Foothills — Mountain Dawn

**Status:** AUTHORITATIVE SPECIFICATION  
**Version:** v1  
**Asset ID:** `ui_trail_scroll_foothills_light_v1`  
**Category:** ui  
**Region:** Foothills (Region 1)  
**Theme:** Mountain Dawn (light mode)  
**owner_agent:** UI Art Agent  
**creation_agent:** UI Art Agent (+ Region Art Agent for environment, shrines, foothill landscape)  
**approved_by:** *(pending — Art Director Agent)*  
**Pipeline Stage:** Specification → Creation → Review → Approval  

**Governance:** [art-direction.md](../../../docs/art-direction.md) · [asset-pipeline.md](../../../docs/asset-pipeline.md) · [asset-registry.md](../../../docs/asset-registry.md)  
**Code Contract:** `lib/design-system/trail-path-anchors.ts` (`TRAIL_MAP_PATH_ANCHORS`, `TRAIL_SCROLL_ART_WIDTH`, `TRAIL_SCROLL_ART_HEIGHT`)

---

## Purpose

Replace procedural placeholder art with a single, continuous, hand-authored vertical trail illustration for the immersive Learn tab (Foothills region, light theme). The scroll is the primary visual canvas behind lesson nodes — not a tiled spine repeat, not a procedural gradient stack.

**Supersedes:** Output from `scripts/generate-trail-scroll-art.mjs` / `npm run assets:trail-scroll` (spine tiling + gradient compositing). That pipeline is **deprecated for production** once this asset passes acceptance criteria A–F. Approved art must be hand-authored by UI Art Agent + Region Art Agent per this spec — not regenerated from spine slices.

**Usage locations:**

- `features/learning/components/trail-first-learn-screen.tsx` (immersive Learn)
- `features/learning/components/trail/trail-map.tsx` (immersive mode)
- `components/media/trail-map-artwork.tsx` via `getTrailScrollArtPath("foothills", "light")`

---

## Deliverable Files

| File | Role | Required |
|------|------|----------|
| `ui_trail_scroll_foothills_light_v1.png` | Master source (lossless) | Yes |
| `ui_trail_scroll_foothills_light_v1.webp` | Production served asset | Yes |
| `metadata.json` | Pipeline metadata (update on approval) | Yes |
| `SPEC.md` | This specification | Yes |

**Public path (production):** `/ui/ui_trail_scroll_foothills_light_v1.webp`  
**Registry key:** `ASSET_REGISTRY.ui.trailScrollFoothillsLight`

---

## Dimensions & Format

| Property | Value | Rationale |
|----------|-------|-----------|
| **Width** | **1536 px** | Matches `TRAIL_SCROLL_ART_WIDTH` and approved `ui_trail_spine_light_v1` width — spine X-bends align 1:1 when spine is overlaid or referenced |
| **Height** | **5120 px** | Matches `TRAIL_SCROLL_ART_HEIGHT`; ~3.33:1 vertical scroll ratio; ~5× spine height for immersive pan without repetition |
| **Aspect ratio** | 3 : 10 (0.3) | Calibrated in `getImmersiveTrailLayout()` |
| **Source format** | PNG, 8-bit sRGB, no interlacing | Archival master |
| **Production format** | WebP, quality 85–90, optimized | Per asset-pipeline; target ≤ 800 KB |
| **Color space** | sRGB | Standard web delivery |
| **DPI** | 72 (screen) | Not print |

**Do not** deliver multiple slices, sprite sheets, or tileable segments. One continuous image only.

---

## Visual Mood — Foothills (Region 1)

Per [art-direction.md](../../../docs/art-direction.md) Region Art System:

| Attribute | Direction |
|-----------|-----------|
| **Mood** | Welcoming · Safe · Beginning |
| **Emotion** | Fresh optimism, calm focus, gentle wonder — never stress or urgency |
| **Keywords** | Elegant, warm, premium, adventurous, timeless |
| **Inspiration blend** | Breath of the Wild morning light · Japanese shrine approaches · Monument Valley clarity · Apple simplicity |

**Environmental storytelling (Foothills):**

- Gentle rolling foothill slopes bathed in early-morning light
- Worn earth-and-stone trail ascending continuously
- Wildflower meadows at path edges (soft pinks, whites, muted yellows)
- Stone **lanterns** (tōrō) at path bends — gentle warm glow, lesson-node anchors
- **Small shrines** (hokora / miniature torii) nestled off-trail, never blocking the path
- Light morning mist in lower valleys; dissipating toward the summit
- Distant layered mountain silhouettes in soft atmospheric perspective
- Optional: a single distant torii gate near the summit — symbolic threshold, not a second path

**Forbidden moods:** harsh midday bleach, neon saturation, competitive/ranked aesthetics, corporate flat SaaS gradients.

---

## Composition — Single Continuous Vertical Ascent

### Orientation

- **Bottom of image (y ≈ 93–100%):** Trail base / foothill meadow entry — where the climb begins
- **Top of image (y ≈ 0–6%):** Foothills summit overlook — first region milestone, soft dawn glow at peak
- **Scroll direction:** User scrolls **upward** to advance; art reads bottom → top as ascent

### Path Geometry — Mandatory Anchor Alignment

The glowing trail path **must** pass through every anchor below. These are percentage coordinates relative to the full 1536×5120 canvas (origin top-left). The path centerline at each anchor must fall within **±2% X** and **±1.5% Y** of the listed value.

Anchors are defined in `TRAIL_MAP_PATH_ANCHORS` and shared with card-layout spine art:

| # | X % | Y % | Role |
|---|-----|-----|------|
| 1 | 50 | 93 | **Base** — trail entry, widest clearing |
| 2 | 43 | 88 | Bend left — first lantern waypoint |
| 3 | 35 | 82 | Bend left — wildflower meadow edge |
| 4 | 30 | 74 | Deep left bend — small shrine visible right |
| 5 | 36 | 66 | Return right — lantern waypoint |
| 6 | 46 | 59 | Center-right traverse |
| 7 | 56 | 52 | Right bend — meadow overlook |
| 8 | 64 | 45 | Far right — lantern waypoint |
| 9 | 58 | 38 | Return left |
| 10 | 48 | 31 | Center traverse — mist thinning |
| 11 | 40 | 24 | Left bend — stone steps begin |
| 12 | 44 | 17 | S-curve — lantern waypoint |
| 13 | 52 | 11 | Approach summit ridge |
| 14 | 50 | 6 | **Summit** — peak lantern / overlook platform |

**Total anchor count:** 14 (within required 14–16 range). Lesson nodes interpolate along the path between anchors via `getImmersiveTrailLayout()`; do not add competing alternate paths.

### Glowing Trail Path

Match the approved spine treatment in `assets/ui/ui_trail_spine_light_v1/`:

- Warm **Lantern Gold** core (`#D4A84B` – `#E8C468`) with soft outer bloom — slightly softer than dark variant
- Path width: ~3–4% of canvas width at base, tapering slightly toward summit
- Soft painterly edges — not vector-hard, not neon tube
- Subtle warm sparkle along path (sparse; must not compete with lesson node UI)
- Path must remain **visually continuous** for the full 93% → 6% vertical span with no breaks, overlaps, or parallel trails

### Lantern Waypoints (14)

Each of the 14 anchors above must have a **visible stone lantern** (or lantern cluster) placed on the path edge at that coordinate. Lanterns are the physical anchor for lesson nodes:

- Lantern post height: ~2–3% of canvas height
- Warm interior glow visible but subdued in daylight
- Lanterns increase slightly in craftsmanship detail toward the summit (beginner → milestone progression)
- Leave **clear space** (~6% canvas width radius) around each lantern for lesson node chips — avoid busy detail in those zones

### Layer Depth (Z-order in illustration)

1. Sky / distant mountains (deepest)
2. Mid-ground slopes, forests, morning mist
3. Trail surface and embankments
4. Lanterns, wildflowers, shrine props
5. Path glow (brightest element on the trail itself)

UI lesson nodes render **above** this artwork; do not paint fake UI buttons or lesson numbers into the art.

---

## Color Palette — Mountain Dawn

Align with `app/globals.css` light tokens and [uiux.mdc](../../../.cursor/rules/uiux.mdc) Mountain Dawn:

| Token | Hex | Usage in this asset |
|-------|-----|---------------------|
| Background | `#F7F8FA` | Sky gradient base, atmospheric haze |
| Surface | `#FFFFFF` | Cloud wisps, light mist |
| Card | `#FFFFFF` | Highlight tones on stone, shrine white wash |
| Foreground | `hsl(220 18% 12%)` | Deep accents in vegetation shadows |
| Mountain Red | `#D64045` | **Accent only** — shrine cord, single wildflower species, distant torii hint; never dominate |
| Lantern Gold | `#D4A84B` – `#F0D998` | Path glow, lantern interiors |
| Dawn Sky | `#B8CCE8` – `#E8EFF8` | Upper sky gradient — fresh morning |
| Forest Green | `#4A7C59` – `#6B9B7A` | Foothill vegetation, meadow grass |
| Stone Gray | `#8B939E` – `#A8B0BA` | Trail bed, lantern stone |
| Wildflower Accent | `#D4A574` / `#E8C4A0` | Foothills region token — meadow wildflowers |
| Warm Highlight | `#FFF8F0` | Sun-kissed ridge tops, summit glow |

**Lighting:** Natural dawn atmosphere — soft golden-hour warmth from east, long gentle shadows. Fresh, clean, optimistic. No harsh white blowout, no oversaturated greens.

---

## Reference Assets — Must Match

| Asset | Path | Match criteria |
|-------|------|----------------|
| **Trail spine (light)** | `assets/ui/ui_trail_spine_light_v1/ui_trail_spine_light_v1.png` | Path glow color, width, painterly style, bend X-positions at equivalent Y% |
| **Yama (light)** | `assets/mascots/yama_main_light_v1/` | Same illustration family — soft gradients, premium painterly, not anime |
| **Region hero** | `assets/regions/region_foothills_v1/` (if present) | Foothills color accent and landmark vocabulary |
| **Product mockup** | `assets/marketing/mockup_product_light_v1.png` | Light mode atmosphere, Learn tab feel |
| **Dark scroll spec** | `assets/ui/ui_trail_scroll_foothills_dark_v1/SPEC.md` | **Same composition and anchor layout** — theme differs only in palette and lighting |

The scroll art is the **vertical extension** of the spine into a full environment. Light and dark variants must be **compositionally identical**; only atmosphere, palette, and lighting differ.

---

## Safe Zones & UI Integration

| Zone | Guidance |
|------|----------|
| **Horizontal margins** | Keep critical path and lanterns within x: 22–78% to survive narrow viewports and `object-cover` cropping |
| **Top 4%** | Softer sky — room for region header / safe area |
| **Bottom 6%** | Trail fade into meadow — room for bottom nav clearance |
| **Node overlay areas** | Low visual noise within 48×48 pt equivalent around each anchor |
| **Scrim compatibility** | Art must read clearly under `from-background/10 via-transparent to-background/40` gradient scrim |

---

## Style Rules

**Required:**

- Stylized illustration (Nintendo charm + Japanese atmosphere + Apple simplicity)
- Soft linework, soft gradients, light texture only
- Readable at mobile scroll speed — no micro-detail clutter
- One continuous hand-authored composition

**Forbidden:**

- Tiling, seamless repeats, or duplicated vertical segments
- Visible seams or loop points when scrolling
- Procedural noise stacks, gradient-only placeholders, or AI-slop texture
- Generic anime character art, chibi, or moe aesthetic
- Mascot (Yama) painted into the scroll — Yama is UI-layer only
- Text, numbers, lesson titles, or UI chrome baked into art
- Watermarks, signatures, or stock-photo elements
- Competing bright paths or branch trails
- Crypto/gacha/corporate-dashboard aesthetic

---

## Acceptance Criteria (Art Director Approval)

All criteria must pass before status advances from `review` → `approved` → `production`.

### A. Technical

1. Dimensions exactly **1536 × 5120 px** (verified in image metadata).
2. Source PNG and production WebP delivered with correct `category_name_variant_version` filenames.
3. WebP optimized, ≤ 800 KB, no visible compression artifacts on path glow.
4. `metadata.json` updated with `status`, `files`, `dimensions`, and `design_notes`.

### B. Path & Anchor Alignment

5. All **14 anchors** pass coordinate verification (±2% X, ±1.5% Y) via overlay test against `TRAIL_MAP_PATH_ANCHORS`.
6. Single continuous glowing path from base (y ≈ 93%) to summit (y ≈ 6%) with no gaps or branches.
7. Path glow visually matches `ui_trail_spine_light_v1` in color, width, and painterly treatment.

### C. Foothills Identity

8. Mood reads **welcoming, safe, beginning** within 3 seconds.
9. Required elements present: trail, wildflowers, lanterns (14), small shrine(s).
10. Region accent aligns with Foothills amber (`region-tokens.ts`) without breaking Mountain Dawn palette.

### D. Composition Quality

11. **No tiling or repeating segments** — verified by visual scan at 100% and 200% zoom along full height.
12. No visible seams when image is placed in a vertical scroll container (`overflow-y: auto`).
13. Summit reads as destination; base reads as departure — clear upward narrative.
14. Lantern waypoint clear zones allow lesson node overlay without visual collision.

### E. Brand & Style

15. Passes art-direction **success test**: immediately recognizable as Noboru, not generic anime/crypto/SaaS.
16. Passes art-direction **failure test**: would not belong equally in a random mobile gacha or language-drill app.
17. Light mode feels fresh, clean, optimistic — not flat, washed out, or childish.

### F. Pipeline & Pair Consistency

18. Registry entry added to `docs/asset-registry.md` and `lib/assets/registry.ts` on production promotion.
19. Art Director Agent sign-off documented in metadata `design_notes` or review comment.
20. **Composition matches dark variant** (`ui_trail_scroll_foothills_dark_v1`) — same anchor positions, landmarks, and path geometry; only theme/lighting differs.

---

## Creation Workflow

```
Art Director Agent (this SPEC)
        ↓
Region Art Agent — environment, shrines, foothill landscape
        ↓
UI Art Agent — path glow, lantern placement, anchor calibration, export
        ↓
Art Director Agent — acceptance review (criteria A–F)
        ↓
Asset Pipeline Agent — metadata, registry, public/ deploy
```

**Recommended order:** Complete dark variant first, then derive light variant from approved composition.

---

## Versioning

- **v1:** Initial production scroll (this spec).
- **v2:** Reserved for major composition, anchor, or dimension changes only.
- Current procedural placeholder files are **superseded** upon v1 approval — mark deprecated in registry, do not delete until production swap verified.

---

## Known Limitations

- Single region (Foothills) only; other regions require separate `ui_trail_scroll_{region}_{theme}_v1` specs.
- Anchor set is shared with card-layout spine; if spine anchors change in `trail-path-anchors.ts`, this asset requires v2.
- `object-cover` on narrow viewports may crop horizontal edges — path must stay within safe x-range (22–78%).

---

*Art Director Agent — Noboru Visual Authority*  
*Created: 2026-06-12*
