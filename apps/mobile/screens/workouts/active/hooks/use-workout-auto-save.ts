import { WorkoutFormValues } from "@/lib/validation/exerciseSchemas";
import { useMutation } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import saveActiveWorkout from "../db/saveActiveWorkout";
import useAutoSave from "@/lib/auto-save/hooks/use-auto-save";

type UseWorkoutAutoSaveOptions = {
  workoutId: string;
  form: UseFormReturn<WorkoutFormValues>;
};

export default function useWorkoutAutoSave({
  workoutId,
  form,
}: UseWorkoutAutoSaveOptions) {
  const saveMutation = useMutation({
    mutationFn: async (values: WorkoutFormValues) => {
      await saveActiveWorkout({ workoutId, values });
    },
    scope: { id: `workout-autosave:${workoutId}` },
    retry: 2,
    retryDelay: (attempt) => {
      return Math.min(500 * 2 ** attempt, 4000);
    },
  });

  return useAutoSave({
    form,
    save: async (values) => {
      await saveMutation.mutateAsync(values);
    },
  });
}
