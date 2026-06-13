export type VisualTier = "high" | "medium" | "low";

export function resolveVisualTier(): VisualTier {
  if (typeof window === "undefined") return "high";

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

  if (cores >= 8 && memory >= 6) return "high";
  if (cores >= 4 && memory >= 3) return "medium";
  return "low";
}

export function glassClass(tier: VisualTier): string {
  switch (tier) {
    case "high":
      return "backdrop-blur-md bg-card/80";
    case "medium":
      return "backdrop-blur-sm bg-card/90";
    case "low":
      return "bg-card/95";
  }
}
