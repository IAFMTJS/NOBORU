export type MockLessonNode = {
  id: string;
  label: string;
  subtitle: string;
  kind: "lesson" | "checkpoint" | "trial" | "landmark";
  state: "completed" | "in_progress" | "available" | "locked";
  iconBase: string;
  yPercent: number;
  xPercent: number;
};

export const MOCK_PLAYER = {
  displayName: "Kaito",
  level: 12,
  streak: 14,
  gems: 370,
  xp: 4440,
  regionName: "Foot Hills",
} as const;

export const MOCK_JOURNEY_NODES: MockLessonNode[] = [
  {
    id: "n1",
    label: "Lesson 1",
    subtitle: "Hiragana · あ row",
    kind: "lesson",
    state: "completed",
    iconBase: "icons/icon_node_lesson_camp",
    yPercent: 88,
    xPercent: 52,
  },
  {
    id: "n2",
    label: "Lesson 2",
    subtitle: "Hiragana · か row",
    kind: "lesson",
    state: "completed",
    iconBase: "icons/icon_node_lesson_camp",
    yPercent: 78,
    xPercent: 48,
  },
  {
    id: "n3",
    label: "Lesson 3",
    subtitle: "Greetings",
    kind: "lesson",
    state: "in_progress",
    iconBase: "icons/icon_node_vocabulary",
    yPercent: 68,
    xPercent: 54,
  },
  {
    id: "n4",
    label: "Checkpoint",
    subtitle: "Torii rest",
    kind: "checkpoint",
    state: "available",
    iconBase: "icons/icon_node_complete_check",
    yPercent: 58,
    xPercent: 50,
  },
  {
    id: "n5",
    label: "Lesson 5",
    subtitle: "Kanji · 一 二 三",
    kind: "lesson",
    state: "locked",
    iconBase: "icons/icon_node_kanji",
    yPercent: 48,
    xPercent: 46,
  },
  {
    id: "n6",
    label: "Trial",
    subtitle: "Forest guardian",
    kind: "trial",
    state: "locked",
    iconBase: "icons/icon_node_boss_mask",
    yPercent: 36,
    xPercent: 52,
  },
];

export const MOCK_QUESTS = [
  {
    id: "q1",
    title: "Complete 3 lessons",
    progress: "2/3",
    iconBase: "icons/icon_quest_lesson",
    reward: "+50 XP",
  },
  {
    id: "q2",
    title: "Review 20 cards",
    progress: "12/20",
    iconBase: "icons/icon_quest_review",
    reward: "+30 XP",
  },
  {
    id: "q3",
    title: "Learn 10 new words",
    progress: "6/10",
    iconBase: "icons/icon_quest_words",
    reward: "Gem pouch",
  },
] as const;

export const MOCK_STUDY_LESSON = {
  title: "Kanji Study",
  subtitle: "Lesson 14 · Mount N5",
  description: "Learn 8 new kanji characters with stroke order and readings.",
  duration: "5 min",
  xp: 20,
  previewKanji: "山",
  previewReading: "やま · サン",
} as const;

export const MOCK_BAG_ITEMS = [
  {
    id: "b1",
    name: "Stone lantern",
    qty: 1,
    iconBase: "props/item_stone_lantern",
    rarity: "common" as const,
  },
  {
    id: "b2",
    name: "Bamboo pack",
    qty: 1,
    iconBase: "props/item_backpack_bamboo",
    rarity: "uncommon" as const,
  },
  {
    id: "b3",
    name: "Dango",
    qty: 3,
    iconBase: "props/item_dango",
    rarity: "common" as const,
  },
  {
    id: "b4",
    name: "Daruma",
    qty: 1,
    iconBase: "props/item_daruma",
    rarity: "rare" as const,
  },
  {
    id: "b5",
    name: "Paper fan",
    qty: 2,
    iconBase: "props/item_fan",
    rarity: "common" as const,
  },
  {
    id: "b6",
    name: "Lantern",
    qty: 1,
    iconBase: "props/item_lantern",
    rarity: "uncommon" as const,
  },
] as const;

export const MOCK_PROFILE_STATS = [
  { label: "Lessons", value: "42" },
  { label: "Kanji", value: "103" },
  { label: "Streak", value: "14 days" },
  { label: "Rank", value: "Trail Walker" },
] as const;

export const MOCK_COMPONENT_ICONS = [
  { id: "nav-journey", base: "icons/icon_nav_journey_mountain" },
  { id: "nav-camp", base: "icons/icon_nav_camp_tent" },
  { id: "nav-study", base: "icons/icon_nav_dojo_torii" },
  { id: "nav-bag", base: "icons/icon_nav_bag_backpack" },
  { id: "nav-profile", base: "icons/icon_nav_profile_fox" },
  { id: "node-vocab", base: "icons/icon_node_vocabulary" },
  { id: "node-kanji", base: "icons/icon_node_kanji" },
  { id: "node-listening", base: "icons/icon_node_listening" },
  { id: "ui-gem", base: "icons/icon_ui_gem" },
  { id: "ui-flame", base: "icons/icon_ui_flame_streak" },
] as const;

export const MOCK_ACHIEVEMENTS = [
  {
    id: "a1",
    base: "achievements/achievement_badge_first_lesson",
    label: "First Step",
  },
  {
    id: "a2",
    base: "achievements/achievement_badge_ten_lessons",
    label: "Trail Walker",
  },
  {
    id: "a3",
    base: "achievements/achievement_badge_torii",
    label: "Torii Gate",
  },
] as const;

export type PrototypeScreenTab =
  | "journey"
  | "camp"
  | "study"
  | "bag"
  | "profile"
  | "kit";

export const PROTOTYPE_SCREEN_TABS: ReadonlyArray<{
  id: PrototypeScreenTab;
  label: string;
  showBottomNav?: boolean;
}> = [
  { id: "journey", label: "Journey", showBottomNav: true },
  { id: "camp", label: "Camp", showBottomNav: true },
  { id: "study", label: "Study", showBottomNav: true },
  { id: "bag", label: "Bag", showBottomNav: true },
  { id: "profile", label: "Profile", showBottomNav: true },
  { id: "kit", label: "Kit", showBottomNav: false },
];

export const PROTOTYPE_NAV_TAB_MAP: Record<
  "journey" | "camp" | "study" | "bag" | "profile",
  PrototypeScreenTab
> = {
  journey: "journey",
  camp: "camp",
  study: "study",
  bag: "bag",
  profile: "profile",
};
