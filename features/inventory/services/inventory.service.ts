import type {
  InventoryItemViewModel,
  InventoryViewModel,
} from "@/features/inventory/types/inventory.types";

const PLACEHOLDER_INVENTORY: InventoryItemViewModel[] = [
  {
    id: "lantern",
    name: "Lantern",
    description: "A warm light that reveals the path ahead.",
    category: "consumable",
    iconLabel: "🏮",
    quantity: 3,
  },
  {
    id: "onigiri",
    name: "Onigiri",
    description: "Trail rations for a steady climb.",
    category: "consumable",
    iconLabel: "🍙",
    quantity: 5,
  },
  {
    id: "dango",
    name: "Dango",
    description: "Sweet reward after a long lesson.",
    category: "consumable",
    iconLabel: "🍡",
    quantity: 2,
  },
  {
    id: "daruma",
    name: "Daruma",
    description: "A charm for focused study sessions.",
    category: "consumable",
    iconLabel: "🎎",
    quantity: 1,
  },
  {
    id: "fox-scarf",
    name: "Fox Scarf",
    description: "A cozy scarf for Yama on cold summits.",
    category: "cosmetic",
    iconLabel: "🧣",
    quantity: 1,
    equipped: true,
  },
  {
    id: "summit-banner",
    name: "Summit Banner",
    description: "Profile banner celebrating your highest peak.",
    category: "cosmetic",
    iconLabel: "⛰️",
    quantity: 1,
  },
  {
    id: "shrine-bell",
    name: "Shrine Bell",
    description: "A gentle chime when you complete daily quests.",
    category: "cosmetic",
    iconLabel: "🔔",
    quantity: 1,
  },
  {
    id: "lantern-trail",
    name: "Lantern Trail",
    description: "Warm amber glow along your path at night.",
    category: "trail",
    iconLabel: "🏮",
    quantity: 1,
    equipped: true,
  },
  {
    id: "sakura-trail",
    name: "Sakura Petals",
    description: "Soft petals drift along your climb during spring.",
    category: "trail",
    iconLabel: "🌸",
    quantity: 1,
  },
  {
    id: "ember-trail",
    name: "Ember Path",
    description: "Glowing embers mark each completed step.",
    category: "trail",
    iconLabel: "✨",
    quantity: 1,
  },
];

class InventoryService {
  getInventory(): InventoryViewModel {
    return { items: PLACEHOLDER_INVENTORY };
  }
}

export const inventoryService = new InventoryService();
