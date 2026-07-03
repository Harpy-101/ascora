import { ASCEND_MUSCLE_TO_SLUG, Slug } from "./muscleToSlugTranslation";

export function normalizeMuscleName(name: string) {
  return name.trim().toUpperCase();
}

export function mapMuscleToSlug(name: string): Slug | null {
  return ASCEND_MUSCLE_TO_SLUG[normalizeMuscleName(name)] ?? null;
}

export function mapMusclesToSlugs(names: string[]): Slug[] {
  const slugs = new Set<Slug>();

  for (const name of names) {
    const slug = mapMuscleToSlug(name);

    if (slug) {
      slugs.add(slug);
    } else {
      console.warn(`Unmapped muscle name: ${name}`);
    }
  }

  return Array.from(slugs);
}
