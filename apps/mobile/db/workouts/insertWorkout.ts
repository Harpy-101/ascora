import { WorkoutFormValues } from "@/lib/validation/exerciseSchemas";
import { db } from "../client";
import { workouts } from "../schema/workouts";
import { createId } from "../create-id";
import { getLocalDateString } from "../getLocalDateString";
import { workoutExercises } from "../schema/workoutExercises";
import { workoutSets } from "../schema/workoutSets";

const testUserId = "c0ced31d-e024-4191-9aea-a4a087f7a6f5";

export default async function insertWorkout(values: WorkoutFormValues) {
  return db.transaction(async (tx) => {
    const now = new Date();
    const nowIso = now.toISOString();
    const workoutId = createId();

    await tx.insert(workouts).values({
      id: workoutId,
      name: values.name,
      userId: testUserId,

      startedAt: nowIso,
      endedAt: nowIso,

      localDate: getLocalDateString(now),

      status: "completed",
      syncStatus: "pending",

      createdAt: nowIso,
      updatedAt: nowIso,
    });

    for (const [index, exercise] of values.exercises.entries()) {
      const workoutExerciseId = createId();
      await tx.insert(workoutExercises).values({
        id: workoutExerciseId,
        workoutId: workoutId,
        position: index + 1,
        exerciseId: exercise.id,
        createdAt: nowIso,
      });

      const setRows = exercise.sets.map((set) => ({
        id: createId(),
        workoutExerciseId: workoutExerciseId,
        setNumber: set.setNumber,
        weightInKg: Number(set.weight),
        reps: Number(set.reps),
        completed: set.completed,
        createdAt: nowIso,
      }));

      if (setRows.length > 0) {
        await tx.insert(workoutSets).values(setRows);
      }
    }

    return workoutId;
  });
}
