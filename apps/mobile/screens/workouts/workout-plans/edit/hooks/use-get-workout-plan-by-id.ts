import { useCurrentUser } from "@/lib/auth/context/current-user-context";
import { useQuery } from "@tanstack/react-query";
import getWorkoutPlanById from "../db/getWorkoutPlanById";

export default function useGetWorkoutPlanById(templateId: string) {
  const { user } = useCurrentUser();

  return useQuery({
    queryKey: ["workout-plan", user?.id, templateId],
    queryFn: async () => getWorkoutPlanById(templateId),
    enabled: !!user?.id && !!templateId,
  });
}
