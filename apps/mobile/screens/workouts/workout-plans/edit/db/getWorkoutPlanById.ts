import { db } from "@/db/client";
import {
  workoutTemplateExercises,
  workoutTemplates,
  workoutTemplateSets,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function getWorkoutPlanById(templateId: string) {
  const rows = await db
    .select({
      templateId: workoutTemplates.id,
      name: workoutTemplates.name,
      description: workoutTemplates.description,

      templateExerciseId: workoutTemplateExercises.id,
      exerciseId: workoutTemplateExercises.exerciseId,
      exerciseName: workoutTemplateExercises.exerciseName,

      setId: workoutTemplateSets.id,
      setNumber: workoutTemplateSets.setCount,
      targetReps: workoutTemplateSets.targetReps,
      targetWeight: workoutTemplateSets.targetWeightInKg,
    })
    .from(workoutTemplates)
    .leftJoin(
      workoutTemplateExercises,
      eq(workoutTemplates.id, workoutTemplateExercises.templateId),
    )
    .leftJoin(
      workoutTemplateSets,
      eq(workoutTemplateExercises.id, workoutTemplateSets.templateExerciseId),
    )
    .where(eq(workoutTemplates.id, templateId));

  if (rows.length === 0) {
    return null;
  }

  const firstRow = rows[0];

  const exerciseMap = new Map<
    string,
    {
      id: string;
      exerciseId: string;
      name: string;
      sets: Array<{
        id: string;
        setNumber: number;
        targetReps: number | null;
        targetWeight: number | null;
      }>;
    }
  >();

  for (const row of rows) {
    if (!row.exerciseId || !row.templateExerciseId || !row.exerciseName) {
      continue;
    }

    let exercise = exerciseMap.get(row.templateExerciseId);

    if (!exercise) {
      exercise = {
        id: row.templateExerciseId,
        exerciseId: row.exerciseId,
        name: row.exerciseName,
        sets: [],
      };

      exerciseMap.set(row.templateExerciseId, exercise);
    }

    if (row.setId && row.setNumber !== null) {
      exercise.sets.push({
        id: row.setId,
        setNumber: row.setNumber,
        targetReps: row.targetReps,
        targetWeight: row.targetWeight,
      });
    }
  }

  return {
    id: firstRow.templateId,
    name: firstRow.name,
    description: firstRow.description,
    exercises: Array.from(exerciseMap.values()),
  };
}
