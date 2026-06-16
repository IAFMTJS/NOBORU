# Journey Art Production Brief

Version: 1.0  
Status: Art pipeline reference for mockup alignment  
Contract: `features/journey/docs/journey-mockup-contract.md`

## Production Order

**Path first, art second.** Spine coordinates in `lib/design-system/journey-path-contracts.json` are authoritative. Artists paint around the path corridor — never invent a path that conflicts with contracts.

## Art Families

### 1. Trail Scroll Backgrounds (per region)

| Asset ID (target) | Region | State | Temp mapping |
|-------------------|--------|-------|--------------|
| `bg-trail-foothills-scroll-dark` | foothills | default | existing scroll art in registry |
| `bg-trail-forest-scroll-dark` | forest | default | existing scroll art |
| `bg-trail-temple-peak-scroll-dark` | temple_peak | default | existing scroll art |
| `bg-trail-summit-scroll-dark` | summit | default | existing scroll art |
| `bg-trail-*-locked` | all | locked fog | `FOG_ASSETS.locked_region` |
| `bg-trail-temple-peak-boss` | temple_peak | boss | `FOG_ASSETS.boss_atmosphere` |
| `bg-shrine-region-transition-torii` | transition | cinematic | `NARRATIVE_GATE_ASSETS.torii_transition` |

**Canvas:** 1536 × 5120 px (see `journey-path-contracts.json`)  
**Style:** Painterly night forest/mountain; warm lantern pools; visible stone staircase corridor along spine  
**Do:** depth layers (foreground trees, mid path, distant peaks), torii/shrine motifs, lantern light  
**Don't:** flat wallpaper, path off-center from contract spine, cool cyberpunk palette

### 2. Node Icon Set

| Asset ID (target) | State/kind | Temp mapping |
|-------------------|------------|--------------|
| `icon-node-lesson-camp` | available/in_progress | `LESSON_NODE_ASSETS.available` |
| `icon-node-complete-check` | completed/checkpoint | `LESSON_NODE_ASSETS.completed` |
| `icon-node-lock` | locked | `LESSON_NODE_ASSETS.locked` |
| `icon-node-vocabulary` | vocabulary | existing |
| `icon-node-kanji` | kanji | existing |
| `icon-node-listening` | listening | existing |
| `icon-node-boss-mask` | trial/boss | existing |
| `icon-node-event-sakura` | event | existing |
| `icon-node-region-*` | landmarks | existing region icons |

**Style:** Circular illustrated seals, warm amber ring for active, green for complete, grey lock for locked  
**Size targets:** 68px current, 52px default, 44px locked (see `journey-mockup.constants.ts`)

### 3. HUD Chrome

| Asset | Purpose | Temp |
|-------|---------|------|
| Chip backgrounds | streak/gem pills | CSS glass (`bg-black/35`) |
| Avatar frame | profile link | CSS `border-primary/30` |

Final art optional — CSS glass sufficient for v1 if contrast passes checklist.

### 4. Atmosphere Overlays

| Overlay | Density tiers | Temp |
|---------|---------------|------|
| Fog (locked) | low / heavy / sacred | `FOG_ASSETS.locked_region` + gradients |
| Embers (boss) | full / reduced / off | CSS `bg-red-600/20 blur` on trial nodes |
| Sakura petals (event) | full / reduced / off | pink branch glow on `EventTrailBranch` |
| Rain/snow | per weather zone | `JourneyWeatherLayers` existing |

### 5. Nav Skin — Journey Active

| Asset | Target | Temp |
|-------|--------|------|
| `nav-moonlit-journey-active-journey` | warm amber bar texture | existing webp + amber token override in `immersive-nav.constants.ts` |

## Swap Procedure (Temp → Final)

1. Art Director approves asset against mockup contract checklist  
2. Register in `assets/art/manifest.json` and `docs/asset-registry.md`  
3. Update mapping in `lib/assets/lesson-node-assets.ts` or `lib/assets/art-mappings.ts`  
4. Run visual regression snapshots per state  
5. No component changes required if asset IDs stay stable

## Artist Do / Don't

**Do**
- Paint the path as a real stone staircase/trail
- Use warm functional glow on active segments only
- Keep Japanese mountain night atmosphere consistent across regions
- Vary region color temperature (foothills village, forest green, temple red, summit ice)

**Don't**
- Thin abstract glowing lines without stone texture
- Flat SaaS card stacks without illustrated world
- Cool blue as primary Journey accent (reserved for nav inactive / water motifs only)
- Chibi or gacha visual language
