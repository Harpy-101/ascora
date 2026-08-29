import { usePreferences } from "@/contexts/user-prefrences-context";
import { WorkoutSummaryInsightData } from "../types";
import { View } from "react-native";
import InsightMetric from "./InsightMetric";

export function WorkoutSummaryMetrics({
  data,
}: {
  data: WorkoutSummaryInsightData;
}) {
  const { formatWeight } = usePreferences();

  return (
    <View className="mt-2 flex-row gap-5">
      <InsightMetric value={data.totalReps.toString()} label="Reps" />

      <InsightMetric
        value={data.completedSets.toString()}
        label={data.completedSets === 1 ? "Set" : "Sets"}
      />

      <InsightMetric
        value={formatWeight(data.totalVolumeKg, 0)}
        label="Volume"
      />
    </View>
  );
}
