import { useQuery } from "@tanstack/react-query";
import getWorkoutPlanListItems from "../db/getWorkoutPlanListItems";
import { useCurrentUser } from "@/lib/auth/context/current-user-context";

export default function useGetAllWorkoutPlans() {
  const { user } = useCurrentUser();

  if (!user?.id) {
    throw new Error("User must be logged in inorder to view workout plans");
  }

  return useQuery({
    queryKey: ["workout-plans", user?.id],
    queryFn: async () => getWorkoutPlanListItems(user.id),
    enabled: !!user?.id,
  });
}
