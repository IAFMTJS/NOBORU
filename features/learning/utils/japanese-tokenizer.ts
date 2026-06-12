const PARTICLE_SPLIT =
  /(?=[はがをにのでともへか]|です|ます|ません|ましょう)|(?<=は|が|を|に|で|の|と|も|へ|か|です|ます|ません|ましょう)/;

export function tokenizeJapaneseSentence(text: string): string[] {
  const cleaned = text.replace(/[。、！？\s]+$/g, "").trim();
  if (!cleaned) return [];

  const tokens = cleaned
    .split(PARTICLE_SPLIT)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);

  return tokens.length >= 2 ? tokens : [cleaned];
}
