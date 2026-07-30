import { useWorkoutPlanForm } from "@/contexts/workout-plan-form-context";
import ExerciseLibraryScreen from "@/screens/exercise-library/ExerciseLibraryScreen";
import { Href } from "expo-router";

export default function PlanCreationExerciseLibrary() {
  const { appendExercise } = useWorkoutPlanForm();

  function getExerciseDetailsHref(exerciseId: string): Href {
    return {
      pathname: "/workouts/plans/new/exercises/[exerciseId]",
      params: {
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
