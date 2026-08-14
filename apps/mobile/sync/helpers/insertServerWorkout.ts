import { workoutExercises, workouts, workoutSets } from "@/db/schema";
import { DbTransaction, WorkoutSyncPayload } from "../types";

export default async function insertServerWorkout(
  tx: DbTransaction,
  payload: WorkoutSyncPayload,
  serverVersion: number,
  userId: string,
) {
  const nowIso = new Date().toISOString();
  await tx.insert(workouts).values({
    id: payload.id,
    userId,
    name: payload.name,
    startedAt: payload.startedAt,
    status: payload.status,
    endedAt: payload.completedAt,
    createdAt: nowIso,
    localDate: nowIso,
    updatedAt: nowIso,
    serverVersion: serverVersion,
  });

  if (payload.exercises.length > 0) {
    for (const exercise of payload.exercises) {
      await tx.insert(workoutExercises).values({
        id: exercise.id,
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        position: exercise.position,
        createdAt: nowIso,
        workoutId: payload.id,
      });

      if (exercise.sets.length > 0) {
        const sets = exercise.sets.map((s) => {
          return {
            id: s.id,
            setNumber: s.setNumber!,
            weightInKg: s.weightInKg,
            reps: s.reps,
            completed: s.completed,
            workoutExerciseId: exercise.id,
            createdAt: nowIso,
          };
        });

        await tx.insert(workoutSets).values(sets);
      }
    }
  }
}
