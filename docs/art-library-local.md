# Art Library (local masters)

High-resolution PNG/JPEG source art lives in **`Art Library/`** on your machine only. It is **not** tracked in git.

## What is in the repo

| Path | Role |
|------|------|
| `Art Library/` | Local workspace for generation, review, and archival (gitignored) |
| `public/art-library/` | Published WebP served by the app and validated in CI |

## Workflow

1. Generate or save art to `Art Library/<category>/` (see `assets.mdc` naming).
2. Post-process icons if needed (`strip-icon-backgrounds.mjs`, etc.).
3. Publish production assets:
   ```bash
   npm run assets:publish-library
   ```
4. Commit the updated `public/art-library/**/*.webp` files.
5. Run `npm run assets:validate` before pushing.

## CI and deploy

GitHub Actions and Vercel use committed WebP under `public/art-library/` only. No Git LFS checkout is required.

## Backing up masters

Keep `Art Library/` backed up locally or in team storage (cloud drive, NAS, etc.). The repo does not store PNG masters.
