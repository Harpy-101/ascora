import { View } from "react-native";
import useExerciseHistory from "../hooks/use-exercise-history";
import { Text } from "@/components/ui/text";
import ExerciseStatCardSection from "./tabs/history/ExerciseStatCardSections";
import ExerciseProgressionChartWithSelect from "./tabs/history/ExerciseProgressionChartWithControls";

export default function ExerciseHistoryTab({
  exerciseId,
}: {
  exerciseId: string;
}) {
  const {
    data: history,
    isPending,
    isError,
    error,
  } = useExerciseHistory(exerciseId);

  if (isPending) return <Text>Loading history...</Text>;

  if (isError) {
    return <Text>{error.message}</Text>;
  }

  if (!history || !history.metrics) {
    return null;
  }

  return (
    <View className="gap-4">
      <ExerciseStatCardSection metrics={history.metrics} />

      <ExerciseProgressionChartWithSelect progression={history.progression} />
    </View>
  );
}
