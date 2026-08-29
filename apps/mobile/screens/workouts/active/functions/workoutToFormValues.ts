import { WeightUnit } from "@/contexts/user-prefrences-context";
import { WorkoutFormValues } from "@/lib/validation/exerciseSchemas";
import { CurrentWorkoutData } from "../hooks/use-get-current-workout-by-id";
import convertWeightFromKg from "@/lib/weight-convertion/convertWeightFromKg";

export default function workoutToFormValues(
  workout: NonNullable<CurrentWorkoutData>,
  unit: WeightUnit,
): WorkoutFormValues {
  return {
    name: workout.name,
    notes: "",

    exercises: workout.exercises.map((exercise) => ({
      id: exercise.id,
      exerciseId: exercise.exerciseId,
      name: exercise.name,

      sets: exercise.sets.map((set) => ({
        id: set.id,
        setNumber: set.setNumber,

        weight:
          set.weight == null
            ? ""
            : convertWeightFromKg(Number(set.weight), unit).toFixed(1),

        reps: set.reps?.toString() ?? "",

        completed: set.completed,
      })),
    })),
  };
}
