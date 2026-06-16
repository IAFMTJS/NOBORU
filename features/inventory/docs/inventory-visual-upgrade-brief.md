# Inventory Visual Upgrade Brief

Status: In implementation

## Purpose

Bring the live `Bag` screen in line with the canonical inventory mockup material language and hierarchy.

## Required Art Updates

- Replace current `inventory_backpack` backdrop with a painterly camp-and-bag composition where the open backpack reads clearly in the foreground.
- Add a subtle warm lantern light pass for the top header zone and lower detail zone so key UI reads as part of the scene.
- Provide slot frame textures for:
  - default slot
  - selected slot (warm glow edge)
  - equipped slot (badge-safe lower corner)
- Refresh icon paintovers for inventory props to improve tactile readability on dark surfaces:
  - `item-lantern`
  - `item-dango`
  - `item-onigiri`
  - `item-daruma`
  - `item-scroll`
  - `item-omamori`
  - `item-sakura`
  - `item-fan`
  - `item-fox-mask`
  - `item-stone-lantern`
- Keep all item silhouettes distinct at 40-56px display sizes.

## UI Material Alignment

- Section containers should read as dark glass with thin warm borders and restrained inner depth.
- Glow must remain functional (selection, active action), never ambient decoration.
- Detail card should feel like a premium inspected pocket surface with clear action hierarchy.

## Navigation Alignment

- Bag active nav state should use warm amber progression cues (label, indicator, ring, particles) consistent with the mountain-night glow language.

## Acceptance Criteria

- User can identify selected item and quantity in under 1 second.
- Equipped status is visible in both slot and detail panel.
- Item detail panel supports `Use` / `Use Multiple` / `Equip` actions as applicable.
- Capacity pressure is visible before full state (`80%+`).
- Screen atmosphere matches canonical dark painterly world with warm functional highlights.
