import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import { useQuery } from "@tanstack/react-query";
import getGoals from "../db/getGoals";

export default function useGoals() {
  const { user } = useCurrentUser();

  if (!user?.id) {
    throw new Error("User must be logged in");
  }

  return useQuery({
    queryKey: ["user-goals", user.id],
    queryFn: async () => getGoals({ userId: user.id }),
    enabled: !!user?.id,
  });
}

export type GoalData = ReturnType<typeof useGoals>["data"];
