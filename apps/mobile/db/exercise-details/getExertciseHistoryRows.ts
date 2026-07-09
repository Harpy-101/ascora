import { and, asc, eq } from "drizzle-orm";
import { db } from "../client";
import { workoutExercises, workouts, workoutSets } from "../schema";

export type ExerciseHistorySetRow = {
  workoutId: string;
  workoutStartedAt: string;
  workoutEndedAt: string | null;
  workoutExerciseId: string;
  setId: string;
  setIndex: number;
  weight: number | null;
  reps: number | null;
};

export default async function getExerciseHistoryRows(
  exerciseId: string,
): Promise<ExerciseHistorySetRow[]> {
  return db
    .select({
      workoutId: workouts.id,
      workoutStartedAt: workouts.startedAt,
      workoutEndedAt: workouts.endedAt,
      workoutExerciseId: workoutExercises.id,
      setId: workoutSets.id,
      setIndex: workoutSets.setNumber,
      weight: workoutSets.weightInKg,
      reps: workoutSets.reps,
    })
    .from(workoutSets)
    .innerJoin(
      workoutExercises,
      eq(workoutSets.workoutExerciseId, workoutExercises.id),
    )
    .innerJoin(workouts, eq(workoutExercises.workoutId, workouts.id))
    .where(
      and(
        eq(workoutExercises.exerciseId, exerciseId),
        eq(workouts.status, "completed"),
      ),
    )
    .orderBy(asc(workouts.startedAt), asc(workoutSets.setNumber));
}
