import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkoutPlanFormValues } from "../../validation/planExerciseSchema";
import inserTemplate from "../db/insertTemplate";
import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import { useRouter } from "expo-router";
import preparePlanForSave from "../../functions/preparePlanForSave";
import { usePreferences } from "@/contexts/user-prefrences-context";

export default function useCreateWorkoutPlan() {
  const { weightUnit } = usePreferences();
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: WorkoutPlanFormValues) => {
      if (!user?.id) throw new Error("User must be logged in");
      const mappedValues = preparePlanForSave(values, weightUnit);
      return inserTemplate(mappedValues, user.id);
    },
    onError: (error) => {
      console.error("Failed to create workout plan:", error);
    },
    onSuccess: (templateId) => {
      queryClient.invalidateQueries({ queryKey: ["workout-plans", user?.id] });
      router.back();
      console.log("Inserted templates successfully:", templateId);
    },
  });
}
