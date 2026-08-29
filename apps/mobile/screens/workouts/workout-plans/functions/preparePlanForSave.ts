import convertWeightToKg from "@/lib/weight-convertion/convertWeightToKg";
import { WorkoutPlanFormValues } from "../validation/planExerciseSchema";
import { WeightUnit } from "@/contexts/user-prefrences-context";

export default function preparePlanForSave(
  values: WorkoutPlanFormValues,
  unit: WeightUnit,
) {
  return {
    name: values.name,
    description: values.description,
    exercises: values.exercises.map((exercise) => ({
      id: exercise.id,
      exerciseId: exercise.exerciseId,
      name: exercise.name,
      setNumber: exercise.setNumber,
      setCount: exercise.setCount,
      targetReps: exercise.targetReps,
      targetWeight: exercise.targetWeight
        ? convertWeightToKg(exercise.targetWeight, unit)
        : null,
    })),
  };
}
