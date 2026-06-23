# Shop feature

Trail merchant catalog backed by `shop_items` and `user_shop_purchases`.

## Wallet formulas

- **Gold (spendable):** `floor(totalEp / 10) − sum(gold_spent on purchases)`
- **Gems (spendable):** `floor(chestClaims / 2) + floor(currentLevel / 10) − sum(gems_spent on purchases)`

Total EP comes from [`elevationService.getSummary`](../../elevation/services/elevation.service.ts). Chest claim count from `user_chest_claims`.

Purchases that reference `collectible_slug` grant the collectible via [`collectibleService.grantBySlug`](../../collectibles/services/collectible.service.ts).
