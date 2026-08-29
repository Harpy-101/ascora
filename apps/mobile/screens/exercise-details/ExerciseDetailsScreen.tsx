import { ScrollView, View } from "react-native";
import ExerciseDetailsTabs from "./components/ExerciseDetailsTabs";
import useExerciseDetails from "./hooks/use-exercise-details";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import ExerciseDetailsHeader from "./components/ExerciseDetailsHeader";
import { useRouter } from "expo-router";
import { ExerciseToAdd } from "@/contexts/workout-plan-form-context";

export default function ExerciseDetailsScreen({
  exerciseId,
  isAppendable,
  appendExercise,
}: {
  exerciseId: string;
  isAppendable: boolean;
  appendExercise: (exerciseId: ExerciseToAdd) => void;
}) {
  const router = useRouter();
  const { data, refetch, isPending, isError, error } =
    useExerciseDetails(exerciseId);

  if (isPending) return <Text>Loading exercise detrails...</Text>;

  if (isError) {
    return (
      <View>
        <Text>Failed to load exercise</Text>
        <Text className="text-sm text-muted-foreground">{error.message}</Text>
        <Button onPress={() => refetch()}>
          <Text>Try again</Text>
        </Button>
      </View>
    );
  }

  const exercise = data;

  function addExercise(exercise: { exerciseId: string; name: string }) {
    console.log("Prerssed");
    if (isAppendable) {
      appendExercise({
        exerciseId: exercise.exerciseId,
        name: exercise.name,
      });
      router.back();
    }
  }

  return (
    <ScrollView contentContainerClassName="gap-4">
      <ExerciseDetailsHeader
        {...exercise.data}
        onAddToWorkout={() => addExercise({ ...exercise.data })}
      />
      <ExerciseDetailsTabs {...exercise.data} />
    </ScrollView>
  );
}
