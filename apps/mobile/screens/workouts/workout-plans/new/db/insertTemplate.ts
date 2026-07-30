import { db } from "@/db/client";
import { WorkoutPlanFormValues } from "../../validation/planExerciseSchema";
import { workoutTemplates } from "@/db/schema/workoutTemplates";
import { createId } from "@/db/create-id";
import { workoutTemplateExercises } from "@/db/schema/workoutTemplateExercises";
import { workoutTemplateSets } from "@/db/schema";

export default async function inserTemplate(
  values: WorkoutPlanFormValues,
  userId: string,
) {
  console.log("workout plan inserted values:", { ...values });
  return db.transaction(async (tx) => {
    const now = new Date();
    const nowIso = now.toISOString();
    const templateId = createId();

    await tx.insert(workoutTemplates).values({
      id: templateId,
      ownerId: userId,
      name: values.name,
      description: values.description,
      createdAt: nowIso,
      updatedAt: nowIso,
    });

    for (const [index, exercise] of values.exercises.entries()) {
      await tx.insert(workoutTemplateExercises).values({
        id: exercise.id,
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.name,
        position: index + 1,
        templateId: templateId,
      });

      await tx.insert(workoutTemplateSets).values({
        id: createId(),
        position: 1,
        setCount: exercise.setCount,
        targetReps: exercise.targetReps,
        targetWeightInKg: exercise.targetWeight,
        templateExerciseId: exercise.id,
      });
    }

    return templateId;
  });
}
