import { WeightUnit } from "@/contexts/user-prefrences-context";
import { WorkoutFormValues } from "@/lib/validation/exerciseSchemas";
import convertWeightToKg from "@/lib/weight-convertion/convertWeightToKg";
import { WorkoutSaveValues } from "../types";

export default function prepareWorkoutForSave(
  values: WorkoutFormValues,
  unit: WeightUnit,
): WorkoutSaveValues {
  return {
    name: values.name,
    notes: values.notes,

    exercises: values.exercises.map((exercise) => ({
      id: exercise.id,
      exerciseId: exercise.exerciseId,
      name: exercise.name,

      sets: exercise.sets.map((set) => ({
        id: set.id,
        setNumber: set.setNumber,

        weightKg:
          set.weight.trim() === ""
            ? null
            : convertWeightToKg(Number(set.weight), unit),

        reps: set.reps.trim() === "" ? null : Number(set.reps),

        completed: set.completed,
      })),
    })),
  };
}
