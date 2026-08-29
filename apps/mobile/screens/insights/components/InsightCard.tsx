import { usePreferences } from "@/contexts/user-prefrences-context";
import { Insight } from "../types";
import { parseInsightData } from "../functions/parseInsightData";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import ThemedIcon from "@/components/ui/themed-icon";
import { ChevronRight } from "lucide-react-native";
import formatInsightType from "../functions/formatInsightType";
import InsightIcon from "./InsightIcon";
import InsightMetric from "./InsightMetric";

type InsightCardProps = {
  insight: Insight;
  onPress?: () => void;
};

export default function InsightCard({ insight, onPress }: InsightCardProps) {
  const { formatWeight } = usePreferences();

  const data = parseInsightData(insight);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="rounded-xl border border-border bg-card p-4"
    >
      <View className="flex-row items-start gap-3">
        <InsightIcon type={insight.insightType} />

        <View className="flex-1 gap-2">
          <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {formatInsightType(insight.insightType)}
          </Text>

          <Text className="font-semibold">{insight.title}</Text>

          <Text className="text-sm leading-5 text-muted-foreground">
            {insight.message}
          </Text>

          {data && insight.insightType === "workout_summary" && (
            <View className="mt-2 flex-row gap-6">
              <InsightMetric
                value={data.completedSets}
                label={data.completedSets === 1 ? "Set" : "Sets"}
              />

              <InsightMetric value={data.totalReps} label="Reps" />

              <InsightMetric
                value={formatWeight(data.totalVolumeKg, 0)}
                label="Volume"
              />
            </View>
          )}

          {/* <Text className="mt-1 text-xs text-muted-foreground">
            {formatInsightDate(
              insight.createdAt,
            )} */}
          {/* </Text> */}
        </View>

        {onPress && (
          <ThemedIcon
            icon={ChevronRight}
            size={18}
            colorToken="mutedForeground"
          />
        )}
      </View>
    </Pressable>
  );
}
