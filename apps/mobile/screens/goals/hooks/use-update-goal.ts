import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateGoal from "../db/updateGoal";
import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import { GoalSchemaValues } from "../validation/goalSchema";
import { useRouter } from "expo-router";

export default function useUpdateGoal({ goalId }: { goalId: string }) {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  if (!user?.id) {
    throw new Error("User must be logged in");
  }
  return useMutation({
    mutationFn: async (values: GoalSchemaValues) =>
      updateGoal({ userId: user.id, goalId, values }),

    onError: (error) => {
      console.log(`Error while trying to update goal: ${error.message}`);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["user-goals", user.id],
      });
      router.back();
    },
  });
}
