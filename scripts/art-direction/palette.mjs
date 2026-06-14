/** Palette from art-direction/00_global_visual_system.md */
export const PALETTE = {
  inkBlack: "#05080A",
  blueBlack: "#071018",
  forestNavy: "#0B1720",
  charcoal: "#111214",
  panelBlack: "#171716",
  lanternAmber: "#F6A83A",
  campfireOrange: "#FF6A2A",
  goldLeaf: "#D6A95C",
  creamHighlight: "#FFE6B3",
  parchment: "#C7A77A",
  sakuraRed: "#C94B3F",
  sakuraPink: "#E9A6A7",
  bambooGreen: "#8DD66A",
  moonBlue: "#52C7FF",
  iceBlue: "#BFD8F0",
  violetMagic: "#B979FF",
  emberRed: "#E5492E",
  textPrimary: "#F6EDE0",
  textMuted: "#77706A",
  foxWhite: "#F4F0EA",
  foxMarking: "#E5492E",
  scarfRed: "#C94B3F",
};

export function hashSeed(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
