import { ScrollView, View } from "react-native";
import { ExerciseResultItem } from "./components/ExerciseIResulttem";
import { Href, useRouter } from "expo-router";
import ExerciseSearchField from "./components/ExerciseSearchField";
import { useEffect, useReducer, useState } from "react";
import {
  exerciseFiltersReducer,
  initialExerciseFilters,
} from "./functions/exerciseFiltersReducer";
import useDebounce from "./hooks/use-debounce";

import FilterRow from "./components/FilterRow";
import useExerciseSearch from "./hooks/use-exercise-search";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ExerciseToAdd } from "@/contexts/workout-plan-form-context";

type ExerciseLibraryScreenProps = {
  isAppendable: boolean;
  getExerciseDetailsHref: (exerciseId: string) => Href;
  appendExercise: (exercise: ExerciseToAdd) => void;
};

export default function ExerciseLibraryScreen({
  appendExercise,
  getExerciseDetailsHref,
  isAppendable,
}: ExerciseLibraryScreenProps) {
  const router = useRouter();

  // const { appendExercise } = useActiveWorkoutForm();
  // const { appendExercise } = useWorkoutPlanForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, dispatch] = useReducer(
    exerciseFiltersReducer,
    initialExerciseFilters,
  );
  const {
    data,
    isPending,
    isError,
    error,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useExerciseSearch(filters);

  const exercises = data?.pages.flatMap((page) => page.data) ?? [];

  const debouncedSearchTerm = useDebounce({
    value: searchTerm,
    delay: 500,
  });

  useEffect(() => {
    const normelizedSearchTerm = debouncedSearchTerm.trim();

    dispatch({
      type: "setSearch",
      search: normelizedSearchTerm,
    });
  }, [debouncedSearchTerm]);

  function addExercise(exercise: { exerciseId: string; name: string }) {
    if (isAppendable) {
      appendExercise({
        exerciseId: exercise.exerciseId,
        name: exercise.name,
      });
    }

    router.back();
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerClassName="gap-4"
      >
        <View className="flex-1 gap-4">
          <ExerciseSearchField
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        <FilterRow selectedBodyParts={filters.bodyParts} dispatch={dispatch} />

        <View className="gap-4">
          {isPending ? (
            <Text>Loading exercises...</Text>
          ) : isError ? (
            <Text>Failed to load exercises: {error.message}</Text>
          ) : exercises.length === 0 ? (
            <Text>No exercises found.</Text>
          ) : (
            exercises.map((e) => (
              <ExerciseResultItem
                key={e.exerciseId}
                id={e.exerciseId}
                name={e.name}
                imageUrl={e.imageUrl}
                primaryMuscle={e.bodyParts[0]?.toLowerCase() ?? "unknown"}
                equipment={e.equipments[0]?.toLowerCase() ?? "unknown"}
                onAdd={() => addExercise(e)}
                onPress={() => {
                  console.log(
                    "exercise details href:",
                    getExerciseDetailsHref(e.exerciseId),
                  );
                  router.push(getExerciseDetailsHref(e.exerciseId));
                }}
              />
            ))
          )}

          {hasNextPage ? (
            <Button
              disabled={isFetchingNextPage}
              onPress={() => fetchNextPage()}
            >
              <Text>
                {isFetchingNextPage ? "Loading more..." : "Load more"}
              </Text>
            </Button>
          ) : null}

          {isFetching && !isFetchingNextPage ? (
            <Text>Refreshing...</Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
