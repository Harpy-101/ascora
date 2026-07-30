import { useWorkoutPlanForm } from "@/contexts/workout-plan-form-context";
import ExerciseLibraryScreen from "@/screens/exercise-library/ExerciseLibraryScreen";
import { Href, useLocalSearchParams } from "expo-router";

export default function PlanEditExerciseLibrary() {
  const { appendExercise } = useWorkoutPlanForm();
  const { templateId } = useLocalSearchParams<{ templateId: string }>();

  function getExerciseDetailsHref(exerciseId: string): Href {
    return {
      pathname: "/workouts/plans/[templateId]/edit/exercises/[exerciseId]",
      params: {
        templateId,
        exerciseId,
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
