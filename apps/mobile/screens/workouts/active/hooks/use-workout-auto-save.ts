import { WorkoutFormValues } from "@/lib/validation/exerciseSchemas";
import { useMutation } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import saveActiveWorkout from "../db/saveActiveWorkout";
import useAutoSave from "@/lib/auto-save/hooks/use-auto-save";
import { requestSync } from "@/sync/coordinator/syncCoordinator";
import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import prepareWorkoutForSave from "../functions/prepareWorkoutForSave";
import { usePreferences } from "@/contexts/user-prefrences-context";
import { WorkoutSaveValues } from "../types";

type UseWorkoutAutoSaveOptions = {
  workoutId: string;
  form: UseFormReturn<WorkoutFormValues>;
};

export default function useWorkoutAutoSave({
  workoutId,
  form,
}: UseWorkoutAutoSaveOptions) {
  const { weightUnit } = usePreferences();
  const { user } = useCurrentUser();
  const saveMutation = useMutation({
    mutationFn: async (values: WorkoutSaveValues) => {
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
      const preparedValues = prepareWorkoutForSave(values, weightUnit);
      await saveMutation.mutateAsync(preparedValues);
      if (!user?.id) {
        throw new Error("User must be logged in in order to sync data");
      }
      requestSync(user.id);
    },
  });
}
