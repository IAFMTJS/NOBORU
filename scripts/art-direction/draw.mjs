import { PALETTE, hashSeed, seededRandom } from "./palette.mjs";

export function svgWrap(width, height, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;
}

export function linearGradient(id, stops, attrs = "") {
  const stopEls = stops
    .map(([offset, color, opacity = 1]) =>
      `<stop offset="${offset}" stop-color="${color}" stop-opacity="${opacity}"/>`,
    )
    .join("");
  return `<linearGradient id="${id}" ${attrs}>${stopEls}</linearGradient>`;
}

export function radialGradient(id, stops, attrs = "") {
  const stopEls = stops
    .map(([offset, color, opacity = 1]) =>
      `<stop offset="${offset}" stop-color="${color}" stop-opacity="${opacity}"/>`,
    )
    .join("");
  return `<radialGradient id="${id}" ${attrs}>${stopEls}</radialGradient>`;
}

export function drawTorii(x, y, scale = 1, color = PALETTE.sakuraRed) {
  const w = 120 * scale;
  const h = 90 * scale;
  return `
    <g transform="translate(${x - w / 2}, ${y - h})">
      <rect x="0" y="0" width="${w}" height="${8 * scale}" rx="${4 * scale}" fill="${color}"/>
      <rect x="${10 * scale}" y="${8 * scale}" width="${8 * scale}" height="${h - 8 * scale}" fill="${color}"/>
      <rect x="${w - 18 * scale}" y="${8 * scale}" width="${8 * scale}" height="${h - 8 * scale}" fill="${color}"/>
      <rect x="${18 * scale}" y="${28 * scale}" width="${w - 36 * scale}" height="${6 * scale}" fill="${color}"/>
    </g>`;
}

export function drawLantern(x, y, scale = 1) {
  return `
    <g transform="translate(${x}, ${y})">
      <ellipse cx="0" cy="${18 * scale}" rx="${14 * scale}" ry="${4 * scale}" fill="${PALETTE.lanternAmber}" opacity="0.35"/>
      <rect x="${-10 * scale}" y="${-8 * scale}" width="${20 * scale}" height="${26 * scale}" rx="${6 * scale}" fill="${PALETTE.sakuraRed}" opacity="0.9"/>
      <rect x="${-6 * scale}" y="${-2 * scale}" width="${12 * scale}" height="${14 * scale}" rx="${3 * scale}" fill="${PALETTE.lanternAmber}" opacity="0.85"/>
      <line x1="0" y1="${-18 * scale}" x2="0" y2="${-8 * scale}" stroke="${PALETTE.goldLeaf}" stroke-width="${2 * scale}"/>
    </g>`;
}

export function drawPathStones(width, height, seed, options = {}) {
  const rand = seededRandom(hashSeed(seed));
  const count = options.count ?? Math.floor(height / 80);
  const cx = width * (options.centerX ?? 0.5);
  let parts = "";
  for (let i = 0; i < count; i += 1) {
    const t = i / Math.max(1, count - 1);
    const y = height * (0.92 - t * 0.84);
    const x = cx + Math.sin(t * Math.PI * 3 + rand() * 2) * width * 0.12;
    const r = 10 + rand() * 14;
    const glow = 0.35 + rand() * 0.45;
    parts += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${PALETTE.lanternAmber}" opacity="${glow.toFixed(2)}"/>`;
    parts += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * 0.55).toFixed(1)}" fill="${PALETTE.creamHighlight}" opacity="0.7"/>`;
  }
  return parts;
}

export function drawMountainSilhouette(width, height, baseY, color, peaks = 5) {
  let d = `M 0 ${baseY}`;
  for (let i = 0; i <= peaks; i += 1) {
    const x = (width / peaks) * i;
    const peakY = baseY - (height * 0.08 + (i % 2 === 0 ? 0.12 : 0.06) * height);
    d += ` L ${x.toFixed(0)} ${peakY.toFixed(0)}`;
  }
  d += ` L ${width} ${baseY} Z`;
  return `<path d="${d}" fill="${color}" opacity="0.85"/>`;
}

export function drawFoxCharacter(width, height, mood = "neutral") {
  const cx = width * 0.5;
  const cy = height * 0.58;
  const s = Math.min(width, height) * 0.32;
  const eyeOpen = mood !== "happy" && mood !== "sleeping";
  const mouth =
    mood === "happy" || mood === "proud"
      ? `<path d="M ${cx - s * 0.12} ${cy + s * 0.08} Q ${cx} ${cy + s * 0.18} ${cx + s * 0.12} ${cy + s * 0.08}" stroke="${PALETTE.foxMarking}" stroke-width="2" fill="none"/>`
      : mood === "worried"
        ? `<ellipse cx="${cx}" cy="${cy + s * 0.12}" rx="${s * 0.06}" ry="${s * 0.04}" fill="${PALETTE.foxMarking}" opacity="0.7"/>`
        : `<line x1="${cx - s * 0.08}" y1="${cy + s * 0.1}" x2="${cx + s * 0.08}" y2="${cy + s * 0.1}" stroke="${PALETTE.foxMarking}" stroke-width="2"/>`;

  const eyes = eyeOpen
    ? `<ellipse cx="${cx - s * 0.14}" cy="${cy - s * 0.02}" rx="${s * 0.06}" ry="${s * 0.08}" fill="${PALETTE.lanternAmber}"/>
       <ellipse cx="${cx + s * 0.14}" cy="${cy - s * 0.02}" rx="${s * 0.06}" ry="${s * 0.08}" fill="${PALETTE.lanternAmber}"/>`
    : `<path d="M ${cx - s * 0.2} ${cy - s * 0.02} Q ${cx - s * 0.14} ${cy + s * 0.04} ${cx - s * 0.08} ${cy - s * 0.02}" stroke="${PALETTE.foxMarking}" stroke-width="2" fill="none"/>
       <path d="M ${cx + s * 0.08} ${cy - s * 0.02} Q ${cx + s * 0.14} ${cy + s * 0.04} ${cx + s * 0.2} ${cy - s * 0.02}" stroke="${PALETTE.foxMarking}" stroke-width="2" fill="none"/>`;

  return `
    <ellipse cx="${cx + s * 0.35}" cy="${cy + s * 0.35}" rx="${s * 0.35}" ry="${s * 0.22}" fill="${PALETTE.foxWhite}"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${s * 0.42}" ry="${s * 0.38}" fill="${PALETTE.foxWhite}"/>
    <polygon points="${cx - s * 0.18},${cy - s * 0.42} ${cx - s * 0.34},${cy - s * 0.78} ${cx - s * 0.02},${cy - s * 0.48}" fill="${PALETTE.foxWhite}"/>
    <polygon points="${cx + s * 0.18},${cy - s * 0.42} ${cx + s * 0.34},${cy - s * 0.78} ${cx + s * 0.02},${cy - s * 0.48}" fill="${PALETTE.foxWhite}"/>
    <path d="M ${cx - s * 0.08} ${cy - s * 0.32} L ${cx} ${cy - s * 0.52} L ${cx + s * 0.08} ${cy - s * 0.32} Z" fill="${PALETTE.foxMarking}"/>
    ${eyes}
    ${mouth}
    <path d="M ${cx - s * 0.28} ${cy + s * 0.02} Q ${cx} ${cy + s * 0.18} ${cx + s * 0.28} ${cy + s * 0.02}" fill="none" stroke="${PALETTE.scarfRed}" stroke-width="${s * 0.08}"/>
    <rect x="${cx + s * 0.08}" y="${cy + s * 0.02}" width="${s * 0.28}" height="${s * 0.32}" rx="${s * 0.06}" fill="${PALETTE.charcoal}" opacity="0.85"/>
  `;
}

export function drawNavIcon(kind, activeColor = PALETTE.lanternAmber, inactive = false) {
  const stroke = inactive ? PALETTE.textMuted : activeColor;
  const fill = inactive ? PALETTE.panelBlack : activeColor;
  switch (kind) {
    case "camp":
      return `<polygon points="32,18 48,38 16,38" fill="${fill}" opacity="0.9"/><rect x="28" y="38" width="8" height="10" fill="${stroke}"/>`;
    case "journey":
      return `<polygon points="16,40 32,14 48,40" fill="none" stroke="${stroke}" stroke-width="3"/><polygon points="24,40 32,26 40,40" fill="${fill}" opacity="0.8"/>`;
    case "dojo":
      return drawTorii(32, 44, 0.35, stroke);
    case "world":
      return `<rect x="22" y="18" width="20" height="24" fill="${fill}" opacity="0.85"/><polygon points="20,18 32,8 44,18" fill="${stroke}"/>`;
    case "profile":
      return `<circle cx="32" cy="24" r="10" fill="${fill}"/><ellipse cx="32" cy="42" rx="14" ry="10" fill="${fill}" opacity="0.85"/>`;
    case "compass":
      return `<circle cx="32" cy="32" r="18" fill="none" stroke="${stroke}" stroke-width="2"/><polygon points="32,16 36,32 32,28 28,32" fill="${fill}"/>`;
    case "book":
      return `<rect x="18" y="16" width="28" height="32" rx="3" fill="${fill}" opacity="0.85"/><line x1="32" y1="16" x2="32" y2="48" stroke="${stroke}" stroke-width="2"/>`;
    case "lock":
      return `<rect x="22" y="26" width="20" height="18" rx="4" fill="${fill}"/><path d="M26 26 v-6 a6 6 0 0 1 12 0 v6" fill="none" stroke="${stroke}" stroke-width="3"/>`;
    case "check":
      return `<circle cx="32" cy="32" r="18" fill="${PALETTE.bambooGreen}" opacity="0.85"/><path d="M22 32 L30 40 L44 24" fill="none" stroke="${PALETTE.inkBlack}" stroke-width="4"/>`;
    case "gem":
      return `<polygon points="32,12 48,32 32,52 16,32" fill="${PALETTE.violetMagic}" opacity="0.9"/>`;
    case "flame":
      return `<path d="M32 10 C26 24 22 28 22 36 C22 44 28 50 32 50 C36 50 42 44 42 36 C42 28 38 24 32 10 Z" fill="${PALETTE.campfireOrange}"/>`;
    case "coin":
      return `<circle cx="32" cy="32" r="16" fill="${PALETTE.goldLeaf}"/><circle cx="32" cy="32" r="10" fill="${PALETTE.lanternAmber}" opacity="0.7"/>`;
    case "settings":
      return `<circle cx="32" cy="32" r="8" fill="none" stroke="${stroke}" stroke-width="3"/><circle cx="32" cy="32" r="18" fill="none" stroke="${stroke}" stroke-width="2" stroke-dasharray="6 6"/>`;
    case "back":
      return `<path d="M36 16 L20 32 L36 48" fill="none" stroke="${stroke}" stroke-width="4"/>`;
    case "chevron":
      return `<path d="M20 22 L32 34 L44 22" fill="none" stroke="${stroke}" stroke-width="4"/>`;
    case "map":
      return `<path d="M16 18 L28 14 L44 20 L44 46 L28 50 L16 46 Z" fill="none" stroke="${stroke}" stroke-width="2"/>`;
    case "xp":
      return `<rect x="16" y="20" width="32" height="24" rx="6" fill="${PALETTE.lanternAmber}" opacity="0.85"/><text x="32" y="38" text-anchor="middle" font-size="14" font-family="sans-serif" fill="${PALETTE.inkBlack}">XP</text>`;
    case "bell":
      return `<path d="M32 14 C24 14 20 22 20 28 L16 40 L48 40 L44 28 C44 22 40 14 32 14 Z" fill="${fill}"/>`;
    case "globe":
      return `<circle cx="32" cy="32" r="18" fill="none" stroke="${stroke}" stroke-width="2"/><ellipse cx="32" cy="32" rx="8" ry="18" fill="none" stroke="${stroke}" stroke-width="1.5"/>`;
    case "boss":
      return `<circle cx="32" cy="32" r="20" fill="${PALETTE.emberRed}" opacity="0.9"/><circle cx="26" cy="28" r="3" fill="${PALETTE.inkBlack}"/><circle cx="38" cy="28" r="3" fill="${PALETTE.inkBlack}"/>`;
    case "vocabulary":
      return `<rect x="18" y="16" width="28" height="32" rx="3" fill="${fill}" opacity="0.85"/><text x="32" y="38" text-anchor="middle" font-size="16" font-family="serif" fill="${stroke}">語</text>`;
    case "kanji":
      return `<rect x="18" y="16" width="28" height="32" rx="3" fill="${fill}" opacity="0.85"/><text x="32" y="38" text-anchor="middle" font-size="16" font-family="serif" fill="${stroke}">字</text>`;
    case "listening":
      return `<circle cx="32" cy="32" r="18" fill="${fill}" opacity="0.85"/><path d="M28 24 L28 40 L38 32 Z" fill="${stroke}"/>`;
    case "lesson":
      return `<circle cx="32" cy="32" r="18" fill="${PALETTE.lanternAmber}" opacity="0.85"/>`;
    case "sakura":
      return `<circle cx="32" cy="32" r="8" fill="${PALETTE.sakuraPink}"/>`;
    case "summit":
      return `<polygon points="16,44 32,12 48,44" fill="${PALETTE.goldLeaf}"/>`;
    default:
      return `<circle cx="32" cy="32" r="16" fill="${fill}" opacity="0.8"/>`;
  }
}

export function sceneVariantForId(id) {
  if (id.includes("camp")) return "camp";
  if (id.includes("shrine")) return "shrine";
  if (id.includes("sakura") || id.includes("event")) return "sakura";
  if (id.includes("boss") || id.includes("temple-peak-boss")) return "boss";
  if (id.includes("snow") || id.includes("winter")) return "snow";
  if (id.includes("bamboo")) return "bamboo";
  if (id.includes("shop") || id.includes("settings") || id.includes("social") || id.includes("memory")) return "utility";
  if (id.includes("world") || id.includes("panorama") || id.includes("long-region")) return "panorama";
  if (id.includes("forest")) return "forest";
  if (id.includes("scroll")) return "scroll";
  return "trail";
}

export function drawPhoneBackground(id, width = 1080, height = 1920) {
  const variant = sceneVariantForId(id);
  const defs = `
    ${linearGradient("sky", [
      [0, PALETTE.blueBlack],
      [0.55, PALETTE.forestNavy],
      [1, PALETTE.inkBlack],
    ])}
    ${radialGradient("glow", [
      [0, PALETTE.lanternAmber, 0.45],
      [1, PALETTE.lanternAmber, 0],
    ], 'cx="50%" cy="85%" r="45%"')}
  `;

  let accents = drawMountainSilhouette(width, height, height * 0.72, PALETTE.charcoal, 6);
  accents += drawPathStones(width, height, id, { count: 14 });
  accents += drawTorii(width * 0.72, height * 0.28, 1.4);
  accents += drawLantern(width * 0.18, height * 0.62, 1.2);
  accents += drawLantern(width * 0.82, height * 0.48, 1);

  if (variant === "camp") {
    accents += `<ellipse cx="${width * 0.5}" cy="${height * 0.82}" rx="${width * 0.18}" ry="${height * 0.04}" fill="${PALETTE.campfireOrange}" opacity="0.55"/>`;
    accents += `<rect x="${width * 0.38}" y="${height * 0.68}" width="${width * 0.24}" height="${height * 0.08}" rx="12" fill="${PALETTE.panelBlack}" opacity="0.7"/>`;
  }
  if (variant === "shrine") {
    accents += drawTorii(width * 0.5, height * 0.42, 2.2);
  }
  if (variant === "sakura") {
    accents += `<circle cx="${width * 0.2}" cy="${height * 0.2}" r="120" fill="${PALETTE.sakuraPink}" opacity="0.15"/>`;
  }
  if (variant === "boss") {
    accents += `<rect x="0" y="0" width="${width}" height="${height}" fill="${PALETTE.emberRed}" opacity="0.12"/>`;
  }
  if (variant === "snow") {
    accents += `<rect x="0" y="0" width="${width}" height="${height}" fill="${PALETTE.iceBlue}" opacity="0.08"/>`;
  }
  if (variant === "bamboo") {
    accents += `<rect x="${width * 0.1}" y="${height * 0.2}" width="18" height="${height * 0.5}" fill="${PALETTE.bambooGreen}" opacity="0.25"/>`;
  }

  return svgWrap(
    width,
    height,
    `<defs>${defs}</defs>
     <rect width="${width}" height="${height}" fill="url(#sky)"/>
     ${accents}
     <rect width="${width}" height="${height}" fill="url(#glow)"/>`,
  );
}

export function drawTrailScroll(id, width = 1536, height = 5120) {
  const region = id.replace("bg-trail-scroll-", "");
  const defs = linearGradient("scrollSky", [
    [0, PALETTE.inkBlack],
    [0.35, PALETTE.forestNavy],
    [1, PALETTE.blueBlack],
  ]);
  let accents = drawMountainSilhouette(width, height, height * 0.18, PALETTE.charcoal, 8);
  accents += drawPathStones(width, height, `${id}-path`, { count: 48, centerX: 0.5 });
  accents += drawTorii(width * 0.5, height * 0.12, 2);
  accents += `<text x="${width / 2}" y="${height * 0.95}" text-anchor="middle" font-size="48" fill="${PALETTE.parchment}" opacity="0.35" font-family="serif">${region.replace(/-/g, " ")}</text>`;
  if (region.includes("summit") || region.includes("n1")) {
    accents += `<rect x="0" y="0" width="${width}" height="${height}" fill="${PALETTE.emberRed}" opacity="0.08"/>`;
  }
  return svgWrap(
    width,
    height,
    `<defs>${defs}</defs><rect width="${width}" height="${height}" fill="url(#scrollSky)"/>${accents}`,
  );
}

export function drawCharacterAsset(id, size = 512) {
  const mood = id.includes("happy") || id.includes("proud") || id.includes("mastery")
    ? "happy"
    : id.includes("worried") || id.includes("out-of-hearts") || id.includes("oops")
      ? "worried"
      : id.includes("sleeping") || id.includes("sitting-campfire")
        ? "sleeping"
        : "neutral";
  return svgWrap(size, size, drawFoxCharacter(size, size, mood));
}

export function drawIconAsset(id, size = 128) {
  const inactive = id.includes("inactive");
  let kind = "camp";
  let color = PALETTE.lanternAmber;
  if (id.includes("journey")) {
    kind = "journey";
    color = PALETTE.moonBlue;
  } else if (id.includes("dojo")) {
    kind = "dojo";
    color = PALETTE.bambooGreen;
  } else if (id.includes("world")) {
    kind = id.includes("compass") ? "compass" : "world";
    color = PALETTE.violetMagic;
  } else if (id.includes("profile")) {
    kind = "profile";
    color = PALETTE.goldLeaf;
  } else if (id.includes("vocabulary")) kind = "vocabulary";
  else if (id.includes("kanji")) kind = "kanji";
  else if (id.includes("listening")) kind = "listening";
  else if (id.includes("boss")) kind = "boss";
  else if (id.includes("lock")) kind = "lock";
  else if (id.includes("complete")) kind = "check";
  else if (id.includes("gem")) kind = "gem";
  else if (id.includes("flame")) kind = "flame";
  else if (id.includes("coin")) kind = "coin";
  else if (id.includes("settings")) kind = "settings";
  else if (id.includes("back")) kind = "back";
  else if (id.includes("chevron")) kind = "chevron";
  else if (id.includes("map")) kind = "map";
  else if (id.includes("xp")) kind = "xp";
  else if (id.includes("bell") || id.includes("notification")) kind = "bell";
  else if (id.includes("globe")) kind = "globe";
  else if (id.includes("summit")) kind = "summit";
  else if (id.includes("sakura")) kind = "sakura";
  else if (id.includes("lesson")) kind = "lesson";

  return svgWrap(
    size,
    size,
    `<rect width="${size}" height="${size}" rx="${size * 0.18}" fill="${PALETTE.panelBlack}" opacity="0.001"/>
     <g transform="scale(${size / 64})">${drawNavIcon(kind, color, inactive)}</g>`,
  );
}

export function drawNavTexture(id, width = 960, height = 200) {
  const isSakura = id.includes("sakura");
  const isSnow = id.includes("snow");
  const isGold = id.includes("gold") || id.includes("premium");
  const base = isSakura ? PALETTE.parchment : isSnow ? PALETTE.iceBlue : PALETTE.charcoal;
  const accent = isGold ? PALETTE.goldLeaf : isSakura ? PALETTE.sakuraPink : isSnow ? PALETTE.moonBlue : PALETTE.lanternAmber;
  return svgWrap(
    width,
    height,
    `<defs>${linearGradient("bar", [
      [0, base, 0.95],
      [1, PALETTE.inkBlack, 0.98],
    ])}</defs>
     <rect width="${width}" height="${height}" rx="36" fill="url(#bar)" stroke="${accent}" stroke-width="2" opacity="0.95"/>
     <ellipse cx="80" cy="${height - 20}" rx="60" ry="18" fill="${accent}" opacity="0.25"/>
     ${drawFoxCharacter(120, height, "neutral")}`,
  );
}

export function drawRewardAsset(id, size = 256) {
  const label = id.replace("reward-", "").slice(0, 12);
  return svgWrap(
    size,
    size,
    `<circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.38}" fill="${PALETTE.goldLeaf}" opacity="0.85"/>
     <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.28}" fill="${PALETTE.lanternAmber}" opacity="0.55"/>
     <text x="${size / 2}" y="${size / 2 + 8}" text-anchor="middle" font-size="22" fill="${PALETTE.inkBlack}" font-family="sans-serif">${label}</text>`,
  );
}

export function drawBrandWordmark(width = 640, height = 192) {
  return svgWrap(
    width,
    height,
    `<rect width="${width}" height="${height}" fill="none"/>
     <text x="${width / 2}" y="${height * 0.62}" text-anchor="middle" font-size="72" font-family="serif" fill="${PALETTE.lanternAmber}" letter-spacing="8">NOBORU</text>
     <text x="${width / 2}" y="${height * 0.82}" text-anchor="middle" font-size="22" fill="${PALETTE.parchment}" opacity="0.7">登る</text>`,
  );
}

export function drawAssetSvg(entry) {
  const { category, id } = entry;
  if (category.startsWith("backgrounds/trail") && id.startsWith("bg-trail-scroll-")) {
    return drawTrailScroll(id);
  }
  if (category.startsWith("backgrounds/")) {
    return drawPhoneBackground(id);
  }
  if (category.startsWith("characters/")) {
    return drawCharacterAsset(id);
  }
  if (category.startsWith("ui/navbars")) {
    return drawNavTexture(id);
  }
  if (category.startsWith("ui/icons") || category.startsWith("ui/progress")) {
    return drawIconAsset(id, category.includes("nav") ? 128 : 128);
  }
  if (category.startsWith("rewards")) {
    return drawRewardAsset(id);
  }
  if (category === "brand") {
    return drawBrandWordmark();
  }
  if (category.startsWith("props/")) {
    return drawIconAsset(id.replace("item-", "icon-"), 128);
  }
  if (category.startsWith("ui/panels") || category.startsWith("ui/buttons")) {
    return svgWrap(512, 256, `<rect width="512" height="256" rx="24" fill="${PALETTE.charcoal}" stroke="${PALETTE.goldLeaf}" stroke-width="2"/>`);
  }
  return drawPhoneBackground(id);
}
