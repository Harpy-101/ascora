import { db } from "@/db/client";
import { workoutExercises, workouts, workoutSets } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import markAggregateForSync from "./markAggregateForSync";
import { WorkoutSaveValues } from "../types";

type SaveActiveWorkoutParams = {
  workoutId: string;
  values: WorkoutSaveValues;
  intent?: "save" | "complete";
};

export default async function saveActiveWorkout({
  workoutId,
  values,
  intent,
}: SaveActiveWorkoutParams): Promise<void> {
  const nowIso = new Date().toISOString();
  await db.transaction(async (tx) => {
    /*
     * 1. Confirm the workout exists and is still active.
     */
    const [workout] = await tx
      .select({
        id: workouts.id,
        status: workouts.status,
        userId: workouts.userId,
        serverVersion: workouts.serverVersion,
      })
      .from(workouts)
      .where(eq(workouts.id, workoutId))
      .limit(1);

    if (!workout) {
      throw new Error("Workout not found");
    }

    if (workout.status !== "active") {
      throw new Error("Only active workouts can be saved");
    }

    if (intent === "save" && workout.status !== "active") {
      return;
    }

    if (intent === "complete" && workout.status !== "active") {
      throw new Error("Only an active workout can be completed");
    }

    /*
     * 2. Load all existing exercise rows.
     */
    const existingExercises = await tx
      .select({
        id: workoutExercises.id,
        workoutId: workoutExercises.workoutId,
      })
      .from(workoutExercises)
      .where(eq(workoutExercises.workoutId, workoutId));

    const existingExerciseMap = new Map(
      existingExercises.map((exercise) => [exercise.id, exercise]),
    );

    /*
     * 3. Load all existing sets belonging to those exercises.
     */
    const existingExerciseIds = existingExercises.map(
      (exercise) => exercise.id,
    );

    const existingSets =
      existingExerciseIds.length === 0
        ? []
        : await tx
            .select({
              id: workoutSets.id,
              workoutExerciseId: workoutSets.workoutExerciseId,
            })
            .from(workoutSets)
            .where(inArray(workoutSets.workoutExerciseId, existingExerciseIds));

    const existingSetMap = new Map(existingSets.map((set) => [set.id, set]));

    /*
     * These sets track the rows that still exist in the submitted form.
     */
    const retainedExerciseIds = new Set<string>();
    const retainedSetIds = new Set<string>();

    /*
     * 4. Update the parent workout.
     */
    await tx
      .update(workouts)
      .set({
        name: values.name,
        // notes: values.notes ?? null,
        updatedAt: new Date().toISOString(),
        ...(intent === "complete"
          ? {
              status: "completed",
              endedAt: nowIso,
            }
          : {}),
      })
      .where(and(eq(workouts.id, workoutId), eq(workouts.status, "active")));

    /*
     * 5. Insert or update exercises and their sets.
     */
    for (
      let exerciseIndex = 0;
      exerciseIndex < values.exercises.length;
      exerciseIndex += 1
    ) {
      const exercise = values.exercises[exerciseIndex];

      retainedExerciseIds.add(exercise.id);

      const existingExercise = existingExerciseMap.get(exercise.id);

      if (existingExercise) {
        await tx
          .update(workoutExercises)
          .set({
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.name,
            position: exerciseIndex + 1,
          })
          .where(
            and(
              eq(workoutExercises.id, exercise.id),
              eq(workoutExercises.workoutId, workoutId),
            ),
          );
      } else {
        await tx.insert(workoutExercises).values({
          id: exercise.id,
          workoutId,
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.name,
          position: exerciseIndex + 1,
          createdAt: nowIso,
        });
      }

      for (let setIndex = 0; setIndex < exercise.sets.length; setIndex += 1) {
        const set = exercise.sets[setIndex];

        retainedSetIds.add(set.id);

        const existingSet = existingSetMap.get(set.id);

        const setValues = {
          workoutExerciseId: exercise.id,
          setNumber: setIndex + 1,
          weightInKg: set.weightKg,
          reps: set.reps,
          // weightInKg: toNullableNumber(set.weightKg),
          // reps: toNullableInteger(set.reps),
          completed: set.completed,
          createdAt: nowIso,
        };

        if (existingSet) {
          /*
           * Prevent accidentally moving an existing set between
           * exercises through a malformed form payload.
           */
          if (existingSet.workoutExerciseId !== exercise.id) {
            throw new Error("A workout set belongs to another exercise");
          }

          await tx
            .update(workoutSets)
            .set(setValues)
            .where(eq(workoutSets.id, set.id));
        } else {
          await tx.insert(workoutSets).values({
            id: set.id,
            ...setValues,
          });
        }
      }
    }

    /*
     * 6. Delete sets removed from the form.
     *
     * This is necessary even when their exercise remains.
     */
    const removedSetIds = existingSets
      .filter((set) => !retainedSetIds.has(set.id))
      .map((set) => set.id);

    if (removedSetIds.length > 0) {
      await tx
        .delete(workoutSets)
        .where(inArray(workoutSets.id, removedSetIds));
    }

    /*
     * 7. Delete exercises removed from the form.
     *
     * If workout_sets has ON DELETE CASCADE, any remaining child
     * sets are removed automatically.
     */
    const removedExerciseIds = existingExercises
      .filter((exercise) => !retainedExerciseIds.has(exercise.id))
      .map((exercise) => exercise.id);

    if (removedExerciseIds.length > 0) {
      await tx
        .delete(workoutExercises)
        .where(
          and(
            eq(workoutExercises.workoutId, workoutId),
            inArray(workoutExercises.id, removedExerciseIds),
          ),
        );
    }

    await markAggregateForSync(tx, {
      userId: workout.userId,
      aggregateType: "workout",
      aggregateId: workoutId,
      operation: "upsert",
      baseServerVersion: workout.serverVersion,
      nowIso,
    });
  });
}
