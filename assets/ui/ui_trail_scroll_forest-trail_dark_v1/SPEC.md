# Trail Scroll SPEC — Forest Trail

**Region:** forest-trail  
**Canvas:** 1536×5120  
**Anchor contract:** `regions.forest-trail.{dark|light}` in `lib/design-system/trail-path-anchors.json`

## Path character

Deep-left winding path through dense forest canopy. Lantern waypoints sit on the painted glow path.

## Acceptance

Path centerline at each of 14 anchors must fall within ±2% X and ±1.5% Y of the JSON coordinates. Verify with `npm run assets:calibrate-trail -- --region=forest-trail`.
