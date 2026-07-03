// import { Slug } from "./muscleToSlugTranslation";
// import { mapMuscleToSlug } from "./normalizeMuscleName";

// export type ActivationLevel = "primary" | "secondary" | "inactive";

// export function buildMuscleActivationMap({
//   primaryMuscles,
//   secondaryMuscles,
// }: {
//   primaryMuscles: string[];
//   secondaryMuscles: string[];
// }) {
//   const activationMap: Partial<Record<Slug, ActivationLevel>> = {};

//   for (const muscle of secondaryMuscles) {
//     const slug = mapMuscleToSlug(muscle);
//     if (slug) {
//       activationMap[slug] = "secondary";
//     }
//   }

//   for (const muscle of primaryMuscles) {
//     const slug = mapMuscleToSlug(muscle);
//     if (slug) {
//       activationMap[slug] = "primary";
//     }
//   }

//   const finalActivationMap = Object.entries(activationMap).map(
//     ([muscle, activationType]) => {
//       return {
//         slug: muscle,
//         color: activationType === "primary" ? "#059669" : "#F59E0B",
//       };
//     },
//   );

//   return finalActivationMap;
// }

import type { ExtendedBodyPart } from "react-muscle-highlighter";
import { mapMuscleToSlug } from "./normalizeMuscleName";

type BodySlug = NonNullable<ExtendedBodyPart["slug"]>;

export type ActivationLevel = "primary" | "secondary" | "inactive";

const MUSCLE_COLORS: Record<Exclude<ActivationLevel, "inactive">, string> = {
  primary: "#059669",
  secondary: "#F59E0B",
};

export function buildMuscleActivationMap({
  primaryMuscles,
  secondaryMuscles,
}: {
  primaryMuscles: string[];
  secondaryMuscles: string[];
}): ExtendedBodyPart[] {
  const activationMap = new Map<
    BodySlug,
    Exclude<ActivationLevel, "inactive">
  >();

  for (const muscle of secondaryMuscles) {
    const slug = mapMuscleToSlug(muscle) as BodySlug | null;

    if (slug) {
      activationMap.set(slug, "secondary");
    }
  }

  for (const muscle of primaryMuscles) {
    const slug = mapMuscleToSlug(muscle) as BodySlug | null;

    if (slug) {
      activationMap.set(slug, "primary");
    }
  }

  return Array.from(activationMap.entries()).map(([slug, activationType]) => ({
    slug,
    color: MUSCLE_COLORS[activationType],
  }));
}
