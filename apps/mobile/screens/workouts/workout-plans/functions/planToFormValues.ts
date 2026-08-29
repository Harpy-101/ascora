import { WeightUnit } from "@/contexts/user-prefrences-context";
import { WorkoutPlanData } from "../edit/hooks/use-get-workout-plan-by-id";
import { WorkoutPlanFormValues } from "../validation/planExerciseSchema";
import convertWeightFromKg from "@/lib/weight-convertion/convertWeightFromKg";

export default function planToFormValues(
  workoutPlan: NonNullable<WorkoutPlanData>,
  unit: WeightUnit,
): WorkoutPlanFormValues {
  return {
    name: workoutPlan.name,
    description: workoutPlan.description,
    exercises: workoutPlan.exercises.map((exercise, idx) => ({
      id: exercise.id,
      exerciseId: exercise.exerciseId,
      name: exercise.name,
      setNumber: idx + 1,
      setCount: exercise.sets[0].setNumber,
      targetReps: exercise.sets[0].targetReps ?? null,
      targetWeight: exercise.sets[0].targetWeight
        ? convertWeightFromKg(exercise.sets[0].targetWeight, unit)
        : null,
    })),
  };
}
