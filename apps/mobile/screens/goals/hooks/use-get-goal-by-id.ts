import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import { useQuery } from "@tanstack/react-query";
import getGoalById from "../db/getGoalById";

export default function useGetGoalById(goalId: string) {
  const { user } = useCurrentUser();

  if (!user?.id) {
    throw new Error("User must be logged in");
  }

  return useQuery({
    queryKey: ["user-goal", user?.id, goalId],
    queryFn: async () => getGoalById({ userId: user.id, goalId: goalId }),
    staleTime: 0,
    refetchOnMount: "always",
    enabled: !!user.id && !!goalId,
  });
}
