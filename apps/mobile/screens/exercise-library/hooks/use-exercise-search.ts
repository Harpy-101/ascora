import { useInfiniteQuery } from "@tanstack/react-query";
import searchExercises, { ExerciseSearchParams } from "../api/searchExercise";

export default function useExerciseSearch(filters: ExerciseSearchParams) {
  return useInfiniteQuery({
    queryKey: ["exercise-search", filters],
    queryFn: ({ pageParam }) =>
      searchExercises({ ...filters, after: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
