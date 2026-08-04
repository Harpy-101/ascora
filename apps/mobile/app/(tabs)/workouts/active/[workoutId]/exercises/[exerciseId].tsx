import { useActiveWorkoutForm } from "@/contexts/active-workout-form-context";
import ExerciseDetailsScreen from "@/screens/exercise-details/ExerciseDetailsScreen";
import { useLocalSearchParams } from "expo-router";

export default function ActiveWorkoutExerciseDetails() {
  const params = useLocalSearchParams<{ exerciseId: string }>();
  const { appendExercise } = useActiveWorkoutForm();

  return (
    <ExerciseDetailsScreen
      exerciseId={params.exerciseId}
      isAppendable={true}
      appendExercise={appendExercise}
    />
  );
}
