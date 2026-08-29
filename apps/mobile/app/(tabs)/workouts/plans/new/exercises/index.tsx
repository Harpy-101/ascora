import ScreenHeader from "@/components/ui/screen-header";
import { useWorkoutPlanForm } from "@/contexts/workout-plan-form-context";
import ExerciseLibraryScreen from "@/screens/exercise-library/ExerciseLibraryScreen";
import { Href } from "expo-router";
import { ScrollView } from "react-native";

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
    <ScrollView className="flex-1 p-4 ">
      <ScreenHeader title="Exercise Library" showBack />
      <ExerciseLibraryScreen
        isAppendable={true}
        getExerciseDetailsHref={getExerciseDetailsHref}
        appendExercise={appendExercise}
      />
    </ScrollView>
  );
}
