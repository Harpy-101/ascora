import { db } from "@/db/client";
import {
  workoutTemplateExercises,
  workoutTemplates,
  workoutTemplateSets,
} from "@/db/schema";
import { WorkoutPlanFormValues } from "../../validation/planExerciseSchema";
import { and, eq } from "drizzle-orm";
import { createId } from "@/db/create-id";

export default async function updateWorkoutPlan(
  templateId: string,
  payload: WorkoutPlanFormValues,
  userId: string,
) {
  const nowIso = new Date().toISOString();

  return db.transaction(async (tx) => {
    const [updatedTemplate] = await tx
      .update(workoutTemplates)
      .set({
        name: payload.name,
        description: payload.description,
        updatedAt: nowIso,
      })
      .where(
        and(
          eq(workoutTemplates.id, templateId),
          eq(workoutTemplates.ownerId, userId),
        ),
      )
      .returning();

    if (!updatedTemplate) {
      throw new Error("Couldn't find the template");
    }

    await tx
      .delete(workoutTemplateExercises)
      .where(eq(workoutTemplateExercises.templateId, templateId));

    for (const exercise of payload.exercises) {
      const [insertedExercise] = await tx
        .insert(workoutTemplateExercises)
        .values({
          exerciseId: exercise.exerciseId,
          id: exercise.id,
          templateId: templateId,
          exerciseName: exercise.name,
          position: exercise.setNumber,
        })
        .returning({
          id: workoutTemplateExercises.id,
        });

      await tx.insert(workoutTemplateSets).values({
        id: createId(),
        position: 1,
        setCount: exercise.setCount,
        templateExerciseId: insertedExercise.id,
        targetReps: exercise.targetReps,
        targetWeightInKg: exercise.targetWeight,
      });
    }
  });
}
