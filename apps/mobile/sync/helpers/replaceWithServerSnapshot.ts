import { workoutExercises, workouts, workoutSets } from "@/db/schema";
import { AggregateType, DbTransaction, WorkoutSyncPayload } from "../types";
import { and, eq } from "drizzle-orm";

export default async function replaceWithServerSnapshot(
  tx: DbTransaction,
  aggregateType: AggregateType,
  aggregateId: string,
  serverVersion: number,
  payload: WorkoutSyncPayload,
  userId: string,
) {
  const nowIso = new Date().toISOString();

  await tx
    .update(workouts)
    .set({
      name: payload.name,
      status: payload.status,
      startedAt: payload.startedAt,
      endedAt: payload.completedAt,
      serverVersion,
      updatedAt: nowIso,
    })
    .where(and(eq(workouts.id, aggregateId), eq(workouts.userId, userId)));

  await tx
    .delete(workoutExercises)
    .where(eq(workoutExercises.workoutId, aggregateId));

  if (payload.exercises.length > 0) {
    for (const exercise of payload.exercises) {
      await tx.insert(workoutExercises).values({
        id: exercise.id,
        workoutId: aggregateId,
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        position: exercise.position,
        createdAt: nowIso,
      });

      if (exercise.sets.length > 0) {
        const sets = exercise.sets.map((s) => {
          return {
            id: s.id,
            workoutExerciseId: exercise.id,
            setNumber: s.setNumber!,
            weightInKg: s.weightInKg,
            reps: s.reps,
            completed: s.completed,
            createdAt: nowIso,
          };
        });

        await tx.insert(workoutSets).values(sets);
      }
    }
  }
}
