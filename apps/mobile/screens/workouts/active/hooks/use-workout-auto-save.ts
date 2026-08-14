import { WorkoutFormValues } from "@/lib/validation/exerciseSchemas";
import { useMutation } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import saveActiveWorkout from "../db/saveActiveWorkout";
import useAutoSave from "@/lib/auto-save/hooks/use-auto-save";
import { requestSync } from "@/sync/coordinator/syncCoordinator";
import { useCurrentUser } from "@/lib/auth/context/current-user-context";

type UseWorkoutAutoSaveOptions = {
  workoutId: string;
  form: UseFormReturn<WorkoutFormValues>;
};

export default function useWorkoutAutoSave({
  workoutId,
  form,
}: UseWorkoutAutoSaveOptions) {
  const { user } = useCurrentUser();
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
      if (!user?.id) {
        throw new Error("User must be logged in in order to sync data");
      }
      requestSync(user.id);
    },
  });
}
