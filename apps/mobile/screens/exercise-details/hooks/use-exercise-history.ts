import { useQuery } from "@tanstack/react-query";
import getExerciseHistoryById from "@/db/exercise-details/getExerciseHistoryById";

export default function useExerciseHistory(exerciseId: string) {
  return useQuery({
    queryKey: ["exercise-history", exerciseId],
    queryFn: () => getExerciseHistoryById(exerciseId),
    enabled: !!exerciseId,
  });
}
