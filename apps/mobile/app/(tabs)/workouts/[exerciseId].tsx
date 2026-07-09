import ExerciseDetailsScreen from "@/screens/exercise-details/ExerciseDetailsScreen";
import { useLocalSearchParams } from "expo-router";

export default function ExerciseDetails() {
  const params = useLocalSearchParams<{ exerciseId: string }>();

  return <ExerciseDetailsScreen exerciseId={params.exerciseId} />;
}
