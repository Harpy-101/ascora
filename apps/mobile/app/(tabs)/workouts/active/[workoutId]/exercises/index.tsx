import { useActiveWorkoutForm } from "@/contexts/active-workout-form-context";
import ExerciseLibraryScreen from "@/screens/exercise-library/ExerciseLibraryScreen";
import { Href, useLocalSearchParams } from "expo-router";

export default function ActiveWorkoutExerciseLibrary() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const { appendExercise } = useActiveWorkoutForm();

  function getExerciseDetailsHref(exerciseId: string): Href {
    return {
      pathname: "/workouts/active/[workoutId]/exercises/[exerciseId]",
      params: {
        exerciseId,
        workoutId,
      },
    };
  }
  return (
    <ExerciseLibraryScreen
      isAppendable={true}
      getExerciseDetailsHref={getExerciseDetailsHref}
      appendExercise={appendExercise}
    />
  );
}
