import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteGoal from "../db/deleteGoal";
import { useRouter } from "expo-router";

export default function useDeleteGoal(goalId: string) {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  if (!user?.id) {
    throw new Error("User must be logged in");
  }

  return useMutation({
    mutationFn: async () => deleteGoal({ userId: user.id, goalId }),

    onError: (error) => {
      console.error("Error while trying to delete goal", error);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["user-goals", user?.id],
      });
      router.back();
    },
  });
}
