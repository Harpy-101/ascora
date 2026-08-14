import { workoutExercises, workouts, workoutSets } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { DbTransaction } from "../types";

export default async function readWorkoutForSync(
  tx: DbTransaction,
  workoutId: string,
) {
  const rows = await tx
    .select({
      id: workouts.id,
      name: workouts.name,
      status: workouts.status,
      startedAt: workouts.startedAt,
      completedAt: workouts.endedAt,

      exId: workoutExercises.id,
      exerciseId: workoutExercises.exerciseId,
      exerciseName: workoutExercises.exerciseName,
      exercisePosition: workoutExercises.position,

      setId: workoutSets.id,
      setNumber: workoutSets.setNumber,
      weightInKg: workoutSets.weightInKg,
      reps: workoutSets.reps,
      completed: workoutSets.completed,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workouts.id, workoutExercises.workoutId))
    .leftJoin(
      workoutSets,
      eq(workoutExercises.id, workoutSets.workoutExerciseId),
    )
    .where(eq(workouts.id, workoutId))
    .orderBy(asc(workoutExercises.position), asc(workoutSets.setNumber));

  const firstRow = rows[0];

  if (!firstRow) {
    throw new Error(`Workout ${workoutId} not found`);
  }

  const exerciseMap = new Map<
    string,
    {
      id: string;
      exerciseId: string;
      exerciseName: string;
      position: number;
      sets: {
        id: string;
        setNumber: number;
        weightInKg: number | null;
        reps: number | null;
        completed: boolean;
      }[];
    }
  >();

  for (const row of rows) {
    if (!row.exId) {
      continue;
    }

    let exercise = exerciseMap.get(row.exId);

    if (!exercise) {
      exercise = {
        id: row.exId,
        exerciseId: row.exerciseId!,
        exerciseName: row.exerciseName!,
        position: row.exercisePosition!,
        sets: [],
      };

      exerciseMap.set(row.exId, exercise);
    }

    if (row.setId) {
      exercise.sets.push({
        id: row.setId,
        setNumber: row.setNumber!,
        weightInKg: row.weightInKg,
        reps: row.reps,
        completed: row.completed!,
      });
    }
  }

  return {
    id: firstRow.id,
    name: firstRow.name,
    status: firstRow.status,
    startedAt: firstRow.startedAt,
    completedAt: firstRow.completedAt,
    exercises: [...exerciseMap.values()],
  };
}
