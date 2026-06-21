# Asset Delivery

Guidelines for image and media delivery in Noboru. Aligns with `next.config.ts` (`formats: ["image/avif", "image/webp"]`) and the asset pipeline rules in `assets.mdc`.

## Format priority

| Use case | Primary | Fallback | Notes |
|----------|---------|----------|-------|
| UI icons (learner) | WebP/AVIF transparent | PNG | Light + dark pairs required |
| Region / world art | AVIF | WebP | Hero backgrounds only on route |
| Character art | WebP | PNG | Keep source PNG in Art Library |
| Audio (lesson) | MP3/OGG | — | Prefetch via `offlineClient.prefetchAudio` |

## Responsive sizes (`next/image`)

| Surface | `sizes` | Max width |
|---------|---------|-----------|
| Bottom nav icons | `48px` | 96 |
| List row thumbnails | `(max-width: 640px) 64px, 80px` | 160 |
| Lesson teach cards | `(max-width: 640px) 100vw, 480px` | 960 |
| World / region hero | `(max-width: 768px) 100vw, 1200px` | 1920 |
| Yama presence | `(max-width: 640px) 120px, 160px` | 320 |

## Compression targets

- Icons: visually lossless at quality 85–90
- Backgrounds: quality 75–82; verify on mobile OLED
- Never ship unoptimized PNG on critical paths when WebP/AVIF exists

## CDN

- Static assets under `public/` and approved `assets/` paths via Vercel CDN
- `Art Library/` sources ingested into production asset paths before deploy
- Remote patterns: add explicitly in `next.config.ts` when introducing new hosts

## Estimated savings (art-heavy routes)

| Route | Current (est.) | After pipeline | Saving |
|-------|----------------|----------------|--------|
| `/tree` world art | ~2.5 MB PNG | ~0.9 MB AVIF/WebP | ~1.6 MB |
| `/camp` Yama + panels | ~800 KB | ~350 KB | ~450 KB |
| Study hubs | ~400 KB | ~180 KB | ~220 KB |

## Checklist for new assets

1. Light + dark variant where applicable
2. Transparent background for icons
3. Register in `docs/asset-registry.md`
4. Use `ArtLibraryImage` or `next/image` — never raw `<img>` for learner UI art
5. Lazy-load below-fold decorative art
