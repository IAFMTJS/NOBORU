export type RandomEventSlug =
  | "hidden_shrine"
  | "wandering_merchant"
  | "spirit_encounter"
  | "lucky_fox"
  | "lost_scroll";

export type RandomEventDefinition = {
  slug: RandomEventSlug;
  title: string;
  description: string;
  minDaysBetween: number;
  epBonus: number;
};

export const RANDOM_EVENTS: RandomEventDefinition[] = [
  {
    slug: "hidden_shrine",
    title: "Hidden Shrine",
    description: "A rare shrine appears on the trail.",
    minDaysBetween: 14,
    epBonus: 25,
  },
  {
    slug: "wandering_merchant",
    title: "Wandering Merchant",
    description: "A merchant offers a glimpse of rare cosmetics.",
    minDaysBetween: 21,
    epBonus: 0,
  },
  {
    slug: "spirit_encounter",
    title: "Spirit Encounter",
    description: "A mountain spirit challenges your recall.",
    minDaysBetween: 10,
    epBonus: 15,
  },
  {
    slug: "lucky_fox",
    title: "Lucky Fox",
    description: "Yama found a lucky charm. Bonus EP today.",
    minDaysBetween: 7,
    epBonus: 20,
  },
  {
    slug: "lost_scroll",
    title: "Lost Scroll",
    description: "Ancient lore discovered on the path.",
    minDaysBetween: 14,
    epBonus: 10,
  },
];
