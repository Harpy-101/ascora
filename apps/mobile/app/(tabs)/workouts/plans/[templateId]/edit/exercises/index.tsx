import ScreenHeader from "@/components/ui/screen-header";
import { useWorkoutPlanForm } from "@/contexts/workout-plan-form-context";
import ExerciseLibraryScreen from "@/screens/exercise-library/ExerciseLibraryScreen";
import { Href, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

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
    <ScrollView className="flex-1 p-4">
      <ScreenHeader title="Exercise Library" showBack />
      <ExerciseLibraryScreen
        isAppendable={true}
        getExerciseDetailsHref={getExerciseDetailsHref}
        appendExercise={appendExercise}
      />
    </ScrollView>
  );
}
