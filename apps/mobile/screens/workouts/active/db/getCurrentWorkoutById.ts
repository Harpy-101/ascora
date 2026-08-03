import { db } from "@/db/client";
import { workoutExercises, workouts, workoutSets } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function getCurrentWorkoutById(workoutId: string) {
  const rows = await db
    .select({
      workoutId: workouts.id,
      name: workouts.name,
      exId: workoutExercises.id,
      exerciseId: workoutExercises.exerciseId,
      exerciseName: workoutExercises.exerciseName,
      setId: workoutSets.id,
      setNumber: workoutSets.setNumber,
      setWeight: workoutSets.weightInKg,
      setReps: workoutSets.reps,
      isSetCompleted: workoutSets.completed,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workouts.id, workoutExercises.workoutId))
    .leftJoin(
      workoutSets,
      eq(workoutExercises.id, workoutSets.workoutExerciseId),
    )
    .where(eq(workouts.id, workoutId));

  if (rows.length === 0) {
    console.log("Found nothing");
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
        weight: string;
        reps: string;
        completed: boolean;
      }>;
    }
  >();

  for (const row of rows) {
    if (!row.exId || !row.exerciseId || !row.exerciseName) {
      continue;
    }

    let exercise = exerciseMap.get(row.exId);

    if (!exercise) {
      exercise = {
        id: row.exId,
        exerciseId: row.exerciseId,
        name: row.exerciseName,
        sets: [],
      };
      exerciseMap.set(row.exId, exercise);
    }

    if (row.setId && row.setNumber !== null) {
      exercise.sets.push({
        id: row.setId,
        setNumber: row.setNumber,
        reps: String(row.setReps),
        weight: String(row.setWeight),
        completed: row.isSetCompleted ?? false,
      });
    }
  }
  return {
    id: firstRow.workoutId,
    name: firstRow.name,
    exercises: Array.from(exerciseMap.values()),
  };
}
