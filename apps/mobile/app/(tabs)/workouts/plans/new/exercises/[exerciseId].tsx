import { useWorkoutPlanForm } from "@/contexts/workout-plan-form-context";
import ExerciseDetailsScreen from "@/screens/exercise-details/ExerciseDetailsScreen";
import { useLocalSearchParams } from "expo-router";

export default function PlanCreationExerciseDetails() {
  const params = useLocalSearchParams<{ exerciseId: string }>();
  const { appendExercise } = useWorkoutPlanForm();

  return (
    <ExerciseDetailsScreen
      exerciseId={params.exerciseId}
      isAppendable={true}
      appendExercise={appendExercise}
    />
  );
}
