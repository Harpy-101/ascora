import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateWorkoutPlan from "../db/updateWorkoutPlan";
import { WorkoutPlanFormValues } from "../../validation/planExerciseSchema";
import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import { useRouter } from "expo-router";

type UseUpdateWorkoutPlanValues = {
  templateId: string;
  payload: WorkoutPlanFormValues;
};

export default function useUpdateWorkoutPlan() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ payload, templateId }: UseUpdateWorkoutPlanValues) => {
      if (!user?.id) {
        throw new Error("User must be logged in");
      }
      return updateWorkoutPlan(templateId, payload, user.id);
    },
    onError: (error) => {
      console.error(
        `Error while trying to update workout plan; ${error.message}`,
      );
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["workout-plan", user?.id, vars.templateId],
      });
      queryClient.invalidateQueries({ queryKey: ["workout-plans", user?.id] });
      router.back();
    },
  });
}
