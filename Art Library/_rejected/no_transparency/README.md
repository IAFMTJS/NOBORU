# Quarantined — no true transparency

These PNGs failed strict audit (`scripts/art-direction/audit-transparency.mjs`):

- **0% alpha** — RGB/RGBA with no transparent pixels (baked backgrounds)
- **Corner test failed** — opaque corners indicate a full canvas background

They cannot be used as overlay icons. Regenerate with transparent background or discard.

Do not move back into `icons/`, `props/`, or `achievements/` without passing audit.
