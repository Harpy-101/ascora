import { WorkoutFormValues } from "@/lib/validation/exerciseSchemas";

type WorkoutStats = {
  totalSets: number;
  completedSets: number;
  progressPercent: number;
  totalExercises: number;
  completedExercises: number;
  volume: number;
};

export function calculateWorkoutStats(
  exercises: WorkoutFormValues["exercises"],
): WorkoutStats {
  const totalSets = exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0,
  );

  const completedSets = exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.filter((set) => set.completed).length,
    0,
  );

  const completedExercises = exercises.filter((exercise) => {
    if (exercise.sets.length === 0) {
      return false;
    }

    return exercise.sets.every((set) => set.completed);
  }).length;

  const volume = exercises.reduce((workoutTotal, exercise) => {
    const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
      if (!set.completed) {
        return setTotal;
      }

      const weight = Number(set.weight);
      const reps = Number(set.reps);

      if (!Number.isFinite(weight) || !Number.isFinite(reps)) {
        return setTotal;
      }

      return setTotal + weight * reps;
    }, 0);

    return workoutTotal + exerciseVolume;
  }, 0);

  const progressPercent =
    totalSets === 0 ? 0 : (completedSets / totalSets) * 100;

  return {
    totalSets,
    completedSets,
    progressPercent,
    totalExercises: exercises.length,
    completedExercises,
    volume,
  };
}
