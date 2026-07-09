import { useQuery } from "@tanstack/react-query";
import { getExerciseDetails } from "../api/getExerciseDetails";

export default function useExerciseDetails(exerciseId: string) {
  return useQuery({
    queryKey: ["exercise-details", exerciseId],
    queryFn: () => getExerciseDetails(exerciseId),
    enabled: !!exerciseId,
    staleTime: 1000 * 60 * 60 * 24,
  });
}
