import type {
  DiscoverArticle,
  DiscoverCategory,
  DiscoverCategorySlug,
} from "@/features/discover/types/discover.types";

export const DISCOVER_CATEGORIES: DiscoverCategory[] = [
  {
    slug: "culture",
    label: "Culture",
    glyph: "雅",
    iconSlug: "discover",
    tagline: "Customs, seasons, and everyday life along the trail.",
  },
  {
    slug: "history",
    label: "History",
    glyph: "史",
    iconSlug: "discover",
    tagline: "Moments that shaped the mountains and cities you will visit.",
  },
  {
    slug: "folklore",
    label: "Folklore",
    glyph: "話",
    iconSlug: "discover",
    tagline: "Stories whispered at village hearths and forest shrines.",
  },
  {
    slug: "food",
    label: "Food",
    glyph: "食",
    iconSlug: "discover",
    tagline: "Regional flavors that reward curious climbers.",
  },
  {
    slug: "anime",
    label: "Anime",
    glyph: "映",
    iconSlug: "discover",
    tagline: "How modern stories echo older Japanese themes.",
  },
  {
    slug: "mythology",
    label: "Mythology",
    glyph: "神",
    iconSlug: "discover",
    tagline: "Kami, creation tales, and symbols on the path.",
  },
];

export const DISCOVER_ARTICLES: Record<DiscoverCategorySlug, DiscoverArticle[]> = {
  culture: [
    {
      id: "omotenashi",
      category: "culture",
      title: "Omotenashi",
      japaneseTitle: "おもてなし",
      summary:
        "Japanese hospitality is attentive without being loud — a mindset you will notice in shops, ryokan, and mountain huts.",
      readMinutes: 4,
      sections: [
        {
          heading: "More than polite service",
          body: "Omotenashi is often translated as hospitality, but the word points to anticipating a guest's needs before they ask. A server may rotate your cup so the front faces you, or a shopkeeper may quietly wrap a gift so rain will not reach it. The goal is not performance — it is care.",
        },
        {
          heading: "On the trail",
          body: "When you rest at a mountain lodge, small gestures matter: slippers offered at the door, tea served without hurry, directions drawn on a map because someone noticed you studying it. Learning Japanese helps you return that care with a sincere arigatō gozaimasu.",
        },
        {
          heading: "Try this phrase",
          body: "お邪魔します (ojamashimasu) — literally “I am disturbing you” — is said when entering someone's home or workspace. It shows awareness that you are entering another person's space.",
        },
      ],
    },
    {
      id: "seasonal-awareness",
      category: "culture",
      title: "Living by the Seasons",
      japaneseTitle: "季節",
      summary:
        "Japan's calendar is woven into food, festivals, and even grammar — spring cherry blossoms are not decoration, they are a shared clock.",
      readMinutes: 3,
      sections: [
        {
          body: "Season words appear in haiku, menus, and packaging. A dessert might be labeled 春限定 (haru gentei, spring limited) not as marketing alone, but because ingredients peak at a specific time.",
        },
        {
          body: "Mountain regions change character by season: summer festivals, autumn foliage pilgrimages, winter silence. Climbers who notice these rhythms read the landscape the way locals do.",
        },
      ],
    },
  ],
  history: [
    {
      id: "edo-roads",
      category: "history",
      title: "Roads of the Edo Period",
      japaneseTitle: "江戸の道",
      summary:
        "Before bullet trains, networked highways connected castle towns, shrines, and mountain passes — many modern trails follow those older routes.",
      readMinutes: 4,
      sections: [
        {
          body: "During the Edo period (1603–1868), the shogunate maintained five major highways. Travel was regulated, but pilgrimage and trade still moved people across Japan. Post towns offered lodging, food, and gossip — early versions of today's trail towns.",
        },
        {
          body: "When you walk a forest section on Noboru's journey, imagine couriers, monks, and merchants sharing the same mud and stone. Place names along real trails often end in 宿 (shuku) or 坂 (saka), hints of those stopping points.",
        },
      ],
    },
    {
      id: "meiji-opening",
      category: "history",
      title: "Meiji Modernization",
      summary:
        "The late 1800s brought rapid reform: a unified education system, railway expansion, and new words for old ideas.",
      readMinutes: 3,
      sections: [
        {
          body: "Japan opened to intensive Western influence while trying to preserve identity. Schools taught standardized Japanese, which helped national communication but also shifted regional dialects toward Tokyo norms.",
        },
        {
          body: "Many kanji compounds created in this era name modern concepts — 電話 (denwa, telephone), 学校 (gakkō, school). Recognizing this layer helps you see history inside vocabulary lists.",
        },
      ],
    },
  ],
  folklore: [
    {
      id: "tanuki-tricksters",
      category: "folklore",
      title: "Tanuki Shape-Shifters",
      japaneseTitle: "狸",
      summary:
        "Raccoon dogs appear in statues outside shops and in stories where mischief teaches humility.",
      readMinutes: 3,
      sections: [
        {
          body: "Tanuki are real animals, but folklore gives them oversized scrotums and transformation magic — often played for comedy. Stories reward cleverness but punish arrogance.",
        },
        {
          body: "Ceramic tanuki statues holding sake bottles greet visitors at inns. They signal luck and abundance. Spotting one on a real hike is a small reminder that Japanese landscapes are layered with narrative.",
        },
      ],
    },
    {
      id: "yuki-onna",
      category: "folklore",
      title: "Yuki-onna",
      japaneseTitle: "雪女",
      summary:
        "The snow woman appears in mountain tales where beauty and danger share the same breath.",
      readMinutes: 4,
      sections: [
        {
          body: "On winter nights, travelers might meet a pale woman who vanishes in the wind. Versions of the story differ: sometimes she spares the kind, sometimes she freezes the cruel. The moral is respect for mountain weather.",
        },
        {
          body: "Folklore like this encoded survival knowledge before weather apps. Noboru's fogged peaks borrow that mood — mystery is not only decoration, it is memory of real risk.",
        },
      ],
    },
  ],
  food: [
    {
      id: "onigiri-trail-food",
      category: "food",
      title: "Onigiri on the Trail",
      japaneseTitle: "おにぎり",
      summary:
        "Rice balls are portable, humble, and endlessly varied — the climber's sandwich.",
      readMinutes: 3,
      sections: [
        {
          body: "Onigiri wrap seasoned rice around fillings like umeboshi plum, salmon, or kombu. Convenience stores sell them nationwide, but mountain huts may offer handmade versions.",
        },
        {
          body: "The word breaks down as お (honorific) + 握り (nigiri, grip). Learning food words is practical: reading labels and ordering at rest stops builds confidence faster than abstract drills alone.",
        },
      ],
    },
    {
      id: "regional-noodles",
      category: "food",
      title: "Regional Noodles",
      summary:
        "From Hokkaido miso ramen to Kyushu tonkotsu, broth styles map geography.",
      readMinutes: 4,
      sections: [
        {
          body: "Long winters favor rich miso bases in the north; warmer coasts popularized pork-bone broth. Local specialties give you conversation topics with hosts after a long climb.",
        },
        {
          body: "When studying vocabulary, group words by scene: 麺 (men, noodles), スープ (sūpu, soup), 辛い (karai, spicy). Scene-based memory mirrors how travelers actually eat.",
        },
      ],
    },
  ],
  anime: [
    {
      id: "shonen-effort",
      category: "anime",
      title: "Effort Themes in Shōnen Stories",
      japaneseTitle: "少年漫画",
      summary:
        "Many popular series echo older values: practice, teamwork, and returning after failure.",
      readMinutes: 4,
      sections: [
        {
          body: "Training arcs are not filler — they mirror martial-arts cinema and folklore cycles where heroes lose, learn, and climb again. Phrases like まだまだ (mada mada, not yet / still a long way) show up in both anime and real encouragement.",
        },
        {
          body: "Using anime as study fuel works best when you pause for repeated lines, shadow pronunciation, and note grammar patterns instead of relying on subtitles alone.",
        },
      ],
    },
    {
      id: "slice-of-life",
      category: "anime",
      title: "Slice of Life and Everyday Japanese",
      summary:
        "Quiet series often teach classroom Japanese, seasonal festivals, and family speech levels.",
      readMinutes: 3,
      sections: [
        {
          body: "Shows set in schools or neighborhoods repeat high-frequency grammar: te-form requests, casual particles, mealtime set phrases. The pacing leaves room to listen.",
        },
        {
          body: "Pair a slice-of-life episode with Noboru vocabulary from the same scene type — a cafeteria episode with food words, a festival episode with season terms.",
        },
      ],
    },
  ],
  mythology: [
    {
      id: "amaterasu-cave",
      category: "mythology",
      title: "Amaterasu and the Cave",
      japaneseTitle: "天照大神",
      summary:
        "A central Shinto myth explains light, laughter, and why ritual performance matters.",
      readMinutes: 4,
      sections: [
        {
          body: "The sun goddess Amaterasu withdrew into a cave, plunging the world into darkness. Other kami gathered outside; a lively dance drew her curiosity back to the entrance. Light returned when she stepped out.",
        },
        {
          body: "Shrines along real trails often stage festivals with dance and music — echoes of that story. Torii gates mark thresholds between everyday space and sacred presence.",
        },
      ],
    },
    {
      id: "mountain-kami",
      category: "mythology",
      title: "Mountain Kami",
      japaneseTitle: "山の神",
      summary:
        "Peaks are not empty scenery — many are worshipped as living spirits requiring respect.",
      readMinutes: 3,
      sections: [
        {
          body: "Before industrial mountaineering, climbing could be pilgrimage. Purification, quiet speech, and offerings at summit shrines expressed relationship with the mountain, not conquest.",
        },
        {
          body: "When Noboru marks a summit, it nods to that tradition: ascent as partnership with the trail, not domination of it.",
        },
      ],
    },
  ],
};

export function getDiscoverCategory(slug: string): DiscoverCategory | null {
  return DISCOVER_CATEGORIES.find((category) => category.slug === slug) ?? null;
}

export function getDiscoverArticles(category: DiscoverCategorySlug): DiscoverArticle[] {
  return DISCOVER_ARTICLES[category] ?? [];
}

export function getDiscoverArticle(
  category: DiscoverCategorySlug,
  articleId: string,
): DiscoverArticle | null {
  return getDiscoverArticles(category).find((article) => article.id === articleId) ?? null;
}
