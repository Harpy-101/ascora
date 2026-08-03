import { db } from "@/db/client";
import { createId } from "@/db/create-id";
import {
  workoutExercises,
  workouts,
  workoutSets,
  workoutTemplateExercises,
  workoutTemplates,
  workoutTemplateSets,
} from "@/db/schema";
import { asc, eq, and } from "drizzle-orm";

export default async function startWorkoutFromTemplate(
  userId: string,
  templateId: string,
): Promise<{ workoutId: string }> {
  return db.transaction(async (tx) => {
    const templateRows = await tx
      .select({
        templateId: workoutTemplates.id,
        templateName: workoutTemplates.name,

        templateExerciseId: workoutTemplateExercises.id,
        exerciseId: workoutTemplateExercises.exerciseId,
        exerciseName: workoutTemplateExercises.exerciseName,
        exercisePosition: workoutTemplateExercises.position,

        setCount: workoutTemplateSets.setCount,
        targetWeight: workoutTemplateSets.targetWeightInKg,
        targetReps: workoutTemplateSets.targetReps,
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
      .where(
        and(
          eq(workoutTemplates.id, templateId),
          eq(workoutTemplates.ownerId, userId),
        ),
      )
      .orderBy(
        asc(workoutTemplateExercises.position),
        // asc(workoutTemplateSets.position),
      );

    if (templateRows.length === 0) {
      throw new Error("Workout template not found");
    }

    const firstRow = templateRows[0];

    /*
     * Materialize and validate the template exercises before
     * inserting the workout.
     */
    const templateExercises: Array<{
      exerciseId: string;
      exerciseName: string;
      position: number;
      setCount: number;
      targetWeight: number | null;
      targetReps: number | null;
    }> = [];

    for (const row of templateRows) {
      /*
       * Because these are left joins, a template with no exercises
       * produces one row with null exercise fields.
       */
      if (
        row.templateExerciseId === null ||
        row.exerciseId === null ||
        row.exerciseName === null ||
        row.exercisePosition === null
      ) {
        continue;
      }

      const setCount = row.setCount ?? 1;

      if (!Number.isInteger(setCount) || setCount < 1) {
        throw new Error(`Invalid set count for exercise "${row.exerciseName}"`);
      }

      templateExercises.push({
        exerciseId: row.exerciseId,
        exerciseName: row.exerciseName,
        position: row.exercisePosition,
        setCount,
        targetWeight: row.targetWeight,
        targetReps: row.targetReps,
      });
    }

    if (templateExercises.length === 0) {
      throw new Error("The workout template does not contain any exercises");
    }

    /*
     * Optionally prevent starting another workout when one is active.
     */
    // const existingActiveWorkout = await tx
    //   .select({
    //     id: workouts.id,
    //   })
    //   .from(workouts)
    //   .where(
    //     and(
    //       eq(workouts.userId, userId),
    //       eq(workouts.status, "active"),
    //     ),
    //   )
    //   .limit(1);

    // if (existingActiveWorkout.length > 0) {
    //   throw new Error("A workout is already in progress");
    // }

    const workoutId = createId();
    const now = new Date().toISOString();

    await tx.insert(workouts).values({
      id: workoutId,
      userId,

      name: firstRow.templateName,
      //   sourceTemplateId: templateId,

      status: "active",
      startedAt: now,
      updatedAt: now,
      createdAt: now,
      localDate: now,
    });

    /*
     * Create new workout exercise IDs. Do not reuse IDs from
     * workoutTemplateExercises.
     */
    const materializedExercises = templateExercises.map((templateExercise) => ({
      source: templateExercise,

      workoutExercise: {
        id: createId(),
        workoutId,
        exerciseId: templateExercise.exerciseId,
        exerciseName: templateExercise.exerciseName,
        position: templateExercise.position,
        createdAt: now,
      },
    }));

    await tx
      .insert(workoutExercises)
      .values(
        materializedExercises.map(({ workoutExercise }) => workoutExercise),
      );

    /*
     * A template stores one row containing setCount.
     *
     * The active workout stores one database row per actual set,
     * so expand setCount here.
     */
    const workoutSetRows = materializedExercises.flatMap(
      ({ source, workoutExercise }) =>
        Array.from({ length: source.setCount }, (_, setIndex) => ({
          id: createId(),
          workoutExerciseId: workoutExercise.id,

          setNumber: setIndex + 1,
          weightInKg: source.targetWeight ?? 0,
          reps: source.targetReps ?? 0,
          completed: false,
          createdAt: now,
        })),
    );

    await tx.insert(workoutSets).values(workoutSetRows);

    return {
      workoutId,
    };
  });
}
