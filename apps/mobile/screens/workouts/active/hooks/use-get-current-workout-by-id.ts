import { useQuery } from "@tanstack/react-query";
import getCurrentWorkoutById from "../db/getCurrentWorkoutById";

export default function useGetCurrentWorkoutById(workoutId: string) {
  return useQuery({
    queryKey: ["current-workout", workoutId],
    queryFn: async () => {
      const res = await getCurrentWorkoutById(workoutId);
      console.log("Res:", res);
      return res;
    },
    staleTime: 0,
    refetchOnMount: "always",
    enabled: !!workoutId,
  });
}
