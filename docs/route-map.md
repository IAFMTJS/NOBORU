# Noboru Secondary Route Map

Version: 1.0

Status: AUTHORITATIVE (VISUAL MD FILES migration)

Primary navigation is fixed at five tabs: **Journey · Camp · Study · Bag · Profile**.

All other learner routes are **secondary destinations** — reachable from Camp hotspots, Study hub, or Profile — never as a sixth bottom-nav tab.

---

## Primary tabs

| Route | Tab | Feature owner |
|-------|-----|---------------|
| `/learn` | Journey | `features/journey/` |
| `/camp` | Camp | `features/camp/` |
| `/study` | Study | `features/dojo/` (Study hub screen) |
| `/bag` | Bag | `features/inventory/` |
| `/profile` | Profile | `features/profile/` |

---

## Secondary routes (by entry point)

### From Camp (`/camp`)

| Route | Screen | Entry |
|-------|--------|-------|
| `/shop` | Merchant encounter (Doc 12 Screen 15) | Merchant hotspot |
| `/quests` or quest sheet | Quest board (Screen 12) | Quest board hotspot |
| Streak shrine overlay | Streak shrine (Screen 13) | Shrine hotspot |
| Chest ceremony | Reward chest (Screen 14) | Chest hotspot |

### From Study (`/study`)

| Route | Content |
|-------|---------|
| `/vocabulary` | Vocabulary browse |
| `/kanji` | Kanji browse |
| `/grammar` | Grammar browse |
| `/listening` | Listening hub |
| `/reading` | Reading hub |
| `/review` | Review session |
| `/games` | Educational mini-games |
| `/trials` | Boss trials |

### From Profile (`/profile`)

| Route | Screen |
|-------|--------|
| `/achievements` | Achievement shrine (Screen 19) | Camp shrine hotspot **or** Profile |
| `/memory-book` | Memory book (Screen 18) |
| `/collections` | Collections museum (Screen 20) |
| `/progress` | Statistics (Screen 25) |
| `/settings` | Settings (Screen 26) |
| `/notifications` | Notifications (Screen 27) |

### From Profile or Camp

| Route | Screen |
|-------|--------|
| `/community` | Friends (Screen 23) |
| `/leaderboard` | Leaderboard (Screen 22) |
| `/events` | Events (Screen 21) |

### Discovery (demoted hub)

| Route | Notes |
|-------|-------|
| `/world` | Region overview / lore — secondary only; links back to Journey scroll, not a primary tab |
| `/explore` | Redirect → `/world` |

---

## Legacy redirects

| Legacy | Target |
|--------|--------|
| `/home` | `/learn` |
| `/dojo` | `/study` |
| `/quests` | `/camp?quests=1` |
| `/world/shop` | `/shop` |
| `/world/inventory` | `/bag` |

---

## Journey deep links

| Pattern | Purpose |
|---------|---------|
| `/learn` | Default journey scroll; centers on current node |
| `/learn?region={slug}` | Scroll journey to region gate (no per-region page) |
| `/learn?node={nodeId}` | Scroll journey to specific trail node (post-lesson return) |
| `/learn/.../lesson` | Lesson player |

---

## Rules

1. Never add a sixth primary bottom-nav item.
2. Secondary screens use in-world presentation — no `ScreenHeader` + card dashboard patterns.
3. Back navigation returns to the entry point (Camp, Study, Profile, or Journey), not `/world` as a hub.

---

END OF route-map.md
