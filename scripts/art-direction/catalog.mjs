/** Full art-direction asset catalog — art-direction/06_asset_inventory_and_naming.md */

function bgTrail(ids) {
  return ids.map((id) => ({ category: "backgrounds/trail", id }));
}
function bgCamp(ids) {
  return ids.map((id) => ({ category: "backgrounds/camp", id }));
}
function bgShrine(ids) {
  return ids.map((id) => ({ category: "backgrounds/shrine", id }));
}
function bgEvent(ids) {
  return ids.map((id) => ({ category: "backgrounds/events", id }));
}
function bgWeather(ids) {
  return ids.map((id) => ({ category: "backgrounds/weather", id }));
}
function bgUtility(ids) {
  return ids.map((id) => ({ category: "backgrounds/utility", id }));
}
function charBase(ids) {
  return ids.map((id) => ({ category: "characters/noboru/base", id }));
}
function charReaction(ids) {
  return ids.map((id) => ({ category: "characters/noboru/reactions", id }));
}
function charWeather(ids) {
  return ids.map((id) => ({ category: "characters/noboru/weather", id }));
}
function charCosmetic(ids) {
  return ids.map((id) => ({ category: "characters/noboru/cosmetics", id }));
}
function nav(ids) {
  return ids.map((id) => ({ category: "ui/navbars", id }));
}
function iconNav(ids) {
  return ids.map((id) => ({ category: "ui/icons/nav", id }));
}
function iconNode(ids) {
  return ids.map((id) => ({ category: "ui/icons/nodes", id }));
}
function iconUi(ids) {
  return ids.map((id) => ({ category: "ui/icons/ui", id }));
}
function panel(ids) {
  return ids.map((id) => ({ category: "ui/panels", id }));
}
function button(ids) {
  return ids.map((id) => ({ category: "ui/buttons", id }));
}
function progress(ids) {
  return ids.map((id) => ({ category: "ui/progress", id }));
}
function reward(ids) {
  return ids.map((id) => ({ category: "rewards", id }));
}
function item(ids) {
  return ids.map((id) => ({ category: "props/inventory", id }));
}
function particle(ids) {
  return ids.map((id) => ({ category: "props/particles", id }));
}

const NAV_ICON_BASES = [
  "icon-nav-camp-tent",
  "icon-nav-journey-mountain",
  "icon-nav-dojo-torii",
  "icon-nav-world-pagoda",
  "icon-nav-world-compass",
  "icon-nav-profile-person",
  "icon-nav-profile-fox",
  "icon-nav-study-book",
  "icon-nav-bag-backpack",
];

const NAV_ICON_VARIANTS = [
  "inactive",
  "active-amber",
  "active-blue",
  "active-green",
  "active-red",
  "active-gold",
  "active-violet",
];

export const ART_CATALOG = [
  ...bgTrail([
    "bg-trail-foot-hills-night",
    "bg-trail-forest-current-night",
    "bg-trail-temple-peak-locked",
    "bg-trail-temple-peak-boss",
    "bg-trail-long-region",
    "bg-trail-world-overview",
    "bg-trail-multi-region-panorama",
    "bg-trail-mini-compact",
    "bg-trail-scroll-foothills",
    "bg-trail-scroll-forest-trail",
    "bg-trail-scroll-mount-n5",
    "bg-trail-scroll-mount-n4",
    "bg-trail-scroll-mount-n3",
    "bg-trail-scroll-mount-n2",
    "bg-trail-scroll-mount-n1",
    "bg-trail-scroll-master-summit",
  ]),
  ...bgWeather([
    "bg-weather-trail-sunny",
    "bg-weather-trail-rainy",
    "bg-weather-trail-night",
    "bg-weather-trail-snowy",
    "bg-time-trail-morning",
    "bg-time-trail-afternoon",
    "bg-time-trail-evening",
    "bg-time-trail-night",
  ]),
  ...bgCamp([
    "bg-camp-home-night",
    "bg-camp-daily-quests",
    "bg-camp-loading",
    "bg-camp-offline",
  ]),
  ...bgShrine([
    "bg-shrine-achievements",
    "bg-shrine-checkpoint",
    "bg-shrine-lesson-complete-path",
    "bg-shrine-region-transition-torii",
  ]),
  ...bgEvent([
    "bg-event-sakura-trail",
    "bg-event-sakura-map",
    "bg-event-sakura-rewards",
    "bg-event-bamboo-forest-unlocked",
  ]),
  ...bgUtility([
    "bg-shop-general-store-dark",
    "bg-avatar-cosmetics-preview",
    "bg-memory-book-frame",
    "bg-settings-dark-panel",
    "bg-social-leaderboard-dark",
  ]),
  ...charBase([
    "char-noboru-sitting-campfire",
    "char-noboru-standing-traveler",
    "char-noboru-walking-backpack",
    "char-noboru-reading-book",
    "char-noboru-meditating-dojo",
    "char-noboru-telescope-world",
    "char-noboru-running-ember",
    "char-noboru-hero-profile",
    "char-noboru-winter-staff",
    "char-noboru-from-behind-region-transition",
    "char-noboru-peeking-locked-detail",
  ]),
  ...charReaction([
    "char-noboru-reaction-teaching",
    "char-noboru-reaction-happy",
    "char-noboru-reaction-proud",
    "char-noboru-reaction-worried",
    "char-noboru-reaction-excited",
    "char-noboru-reaction-oops",
    "char-noboru-reaction-encouraging",
    "char-noboru-reaction-out-of-hearts",
    "char-noboru-reaction-mastery",
  ]),
  ...charWeather([
    "char-noboru-weather-sunny",
    "char-noboru-weather-rainy-umbrella",
    "char-noboru-weather-night-lantern",
    "char-noboru-weather-snowy-cloak",
  ]),
  ...charCosmetic([
    "char-noboru-cosmetic-scarf-crimson",
    "char-noboru-cosmetic-backpack-bamboo",
    "char-noboru-cosmetic-fox-mask",
    "char-noboru-cosmetic-preview-base",
  ]),
  ...nav([
    "nav-dark-camp-lantern-active-camp",
    "nav-light-sakura-parchment-active-camp",
    "nav-moonlit-journey-active-journey",
    "nav-bamboo-dojo-active-dojo",
    "nav-pink-sakura-world-active-world",
    "nav-cosmic-world-active-world",
    "nav-rope-scroll-dojo-active-dojo",
    "nav-snow-journey-active-journey",
    "nav-ember-camp-active-camp",
    "nav-premium-gold-profile-active-profile",
    "nav-app-dark-active-journey",
    "nav-app-dark-active-camp",
    "nav-app-dark-active-study",
    "nav-app-dark-active-bag",
    "nav-app-dark-active-profile",
  ]),
  ...NAV_ICON_BASES.flatMap((base) =>
    NAV_ICON_VARIANTS.map((variant) => ({
      category: "ui/icons/nav",
      id: `${base}-${variant}`,
    })),
  ),
  ...iconNode([
    "icon-node-lesson-camp",
    "icon-node-vocabulary",
    "icon-node-kanji",
    "icon-node-listening",
    "icon-node-boss-mask",
    "icon-node-lock",
    "icon-node-complete-check",
    "icon-node-event-sakura",
    "icon-node-region-foot-hills",
    "icon-node-region-forest",
    "icon-node-region-temple-peak",
    "icon-node-region-summit",
  ]),
  ...iconUi([
    "icon-ui-close",
    "icon-ui-back",
    "icon-ui-menu-dots",
    "icon-ui-chevron-right",
    "icon-ui-settings",
    "icon-ui-speaker",
    "icon-ui-microphone",
    "icon-ui-eye-preview",
    "icon-ui-flame-streak",
    "icon-ui-gem",
    "icon-ui-coin",
    "icon-ui-xp",
    "icon-ui-heart-full",
    "icon-ui-heart-empty",
    "icon-ui-check",
    "icon-ui-cross",
    "icon-ui-notification-bell",
    "icon-ui-globe-language",
    "icon-ui-account",
    "icon-ui-map",
  ]),
  ...panel([
    "panel-dark-glass-small",
    "panel-dark-glass-medium",
    "panel-dark-glass-large",
    "panel-dark-glass-bottom-sheet",
    "panel-parchment-memory-page",
    "panel-wood-daily-quest-board",
    "panel-rope-scroll",
    "panel-premium-gold-frame",
    "panel-ice-blue-card",
    "panel-sakura-pink-card",
  ]),
  ...button([
    "button-primary-red-default",
    "button-primary-red-hover",
    "button-primary-red-pressed",
    "button-secondary-dark-default",
    "button-secondary-dark-hover",
    "button-gold-outline-default",
    "button-small-icon-dark",
    "button-review-again",
    "button-review-hard",
    "button-review-good",
    "button-review-easy",
  ]),
  ...progress([
    "progress-amber-thin",
    "progress-red-event",
    "progress-green-complete",
    "progress-xp-level",
    "progress-streak-milestones",
    "scroll-indicator-trail-vertical",
  ]),
  ...reward([
    "reward-xp-badge",
    "reward-gem-purple",
    "reward-lantern",
    "reward-level-medallion-24",
    "reward-badge-kanji-explorer",
    "reward-title-path-master",
    "reward-trail-bamboo-forest",
  ]),
  ...item([
    "item-lantern",
    "item-dango",
    "item-onigiri",
    "item-daruma",
    "item-scroll",
    "item-omamori",
    "item-sakura",
    "item-fan",
    "item-fox-mask",
    "item-stone-lantern",
    "item-scarf-crimson",
    "item-backpack-bamboo",
    "item-sakura-petals-trail",
  ]),
  ...particle([
    "particle-sakura-petals",
    "particle-snowflake",
    "particle-ember",
    "particle-spark",
    "particle-rain-streak",
    "particle-magic-ring",
    "particle-golden-star",
  ]),
  { category: "brand", id: "brand-wordmark-noboru" },
  { category: "brand", id: "icon-app-dark" },
  { category: "brand", id: "icon-app-light" },
];
