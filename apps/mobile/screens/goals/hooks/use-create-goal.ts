import { useMutation, useQueryClient } from "@tanstack/react-query";
import createNewGoal from "../db/createNewGoal";
import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import { GoalSchemaValues } from "../validation/goalSchema";
import { useRouter } from "expo-router";

export default function useCreateGoal() {
  const { user } = useCurrentUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: GoalSchemaValues) => {
      if (!user?.id) {
        throw new Error("User must be logged in");
      }
      return createNewGoal({ userId: user.id, values });
    },

    onError: (error) => {
      console.error(`Error while trying to create goal: ${error.message}`);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["user-goals", user?.id],
      });
      router.back();
    },
  });
}
