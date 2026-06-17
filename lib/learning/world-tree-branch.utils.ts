/**
 * Maps CMS unit names to bible thematic category slugs.
 * Mirrors seed logic in 20260617240000_vocabulary_categories_and_learning_branches.sql.
 */
export function resolveThematicCategorySlugForUnitName(unitName: string): string {
  const name = unitName.toLowerCase();

  if (name.includes("greet") || name.includes("hello") || name.includes("polite")) {
    return "greetings";
  }
  if (name.includes("family") || name.includes("people") || name.includes("body")) {
    return "family";
  }
  if (
    name.includes("food") ||
    name.includes("meal") ||
    name.includes("drink") ||
    name.includes("restaurant") ||
    name.includes("kitchen")
  ) {
    return "food";
  }
  if (
    name.includes("travel") ||
    name.includes("transport") ||
    name.includes("station") ||
    name.includes("place") ||
    name.includes("direction") ||
    name.includes("city")
  ) {
    return "travel";
  }
  if (
    name.includes("number") ||
    name.includes("count") ||
    name.includes("time") ||
    name.includes("calendar") ||
    name.includes("date")
  ) {
    return "numbers";
  }
  if (
    name.includes("school") ||
    name.includes("student") ||
    name.includes("study") ||
    name.includes("class")
  ) {
    return "school";
  }
  if (
    name.includes("work") ||
    name.includes("job") ||
    name.includes("office") ||
    name.includes("business")
  ) {
    return "work";
  }
  if (name.includes("animal") || name.includes("nature")) {
    return "animals";
  }
  if (name.includes("shop") || name.includes("money") || name.includes("store")) {
    return "business";
  }

  return "daily-activities";
}

export function buildLearningBranchSlug(regionSlug: string, unitName: string): string {
  const normalized = unitName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${regionSlug}-${normalized}`;
}
