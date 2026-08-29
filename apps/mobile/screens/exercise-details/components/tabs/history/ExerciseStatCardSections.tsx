import { View } from "react-native";
import { ExerciseHistoryMetrics } from "../../../types";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { usePreferences } from "@/contexts/user-prefrences-context";

type ExerciseStatSectionProps = {
  metrics: ExerciseHistoryMetrics;
};

type StatCardData = {
  label: string;
  value: number | null;
  unit: string;
  description: string;
};

export default function ExerciseStatCardSection({
  metrics,
}: ExerciseStatSectionProps) {
  const { displayWeight, weightUnit } = usePreferences();
  const secondaryStats: StatCardData[] = [
    {
      label: "Best session",
      value:
        metrics.bestSessionVolume && displayWeight(metrics.bestSessionVolume),
      unit: weightUnit,
      description: "Highest total volume in one workout",
    },
    {
      label: "Best set",
      value: metrics.bestSetVolume && displayWeight(metrics.bestSetVolume),
      unit: weightUnit,
      description: "Highest volume in a single set",
    },
    {
      label: "Total volume",
      value: metrics.totalVolume && displayWeight(metrics.totalVolume),
      unit: weightUnit,
      description: "All-time logged volume",
    },
  ];

  return (
    <View className="gap-3">
      <Card className="overflow-hidden rounded-2xl border border-border bg-card">
        <View className="absolute left-0 top-0 h-[180%] w-1 bg-primary" />

        <CardContent className="gap-3 p-4">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1 gap-1">
              <Text className="text-sm font-medium text-muted-foreground">
                Estimated 1RM
              </Text>

              <Text className="text-xs text-muted-foreground">
                Your strongest estimated single-rep performance
              </Text>
            </View>

            <View className="rounded-full bg-primary/10 px-3 py-1">
              <Text className="text-xs font-semibold text-primary">PR</Text>
            </View>
          </View>

          <MetricValue
            value={
              metrics.bestEstimatedOneRepMax &&
              displayWeight(metrics.bestEstimatedOneRepMax)
            }
            unit={weightUnit}
          />
        </CardContent>
      </Card>

      <View className="flex-row gap-3">
        {secondaryStats.slice(0, 2).map((stat) => (
          <SmallStatCard key={stat.label} stat={stat} />
        ))}
      </View>

      <SmallStatCard stat={secondaryStats[2]} fullWidth />
    </View>
  );
}

function SmallStatCard({
  stat,
  fullWidth = false,
}: {
  stat: StatCardData;
  fullWidth?: boolean;
}) {
  return (
    <Card
      className={
        fullWidth
          ? "rounded-2xl border border-border bg-card"
          : "flex-1 rounded-2xl border border-border bg-card"
      }
    >
      <CardContent className="gap-3 p-4">
        <View className="gap-1">
          <Text className="text-sm font-medium text-muted-foreground">
            {stat.label}
          </Text>

          <Text className="text-xs leading-4 text-muted-foreground">
            {stat.description}
          </Text>
        </View>

        <MetricValue value={stat.value} unit={stat.unit} compact />
      </CardContent>
    </Card>
  );
}

function MetricValue({
  value,
  unit,
  compact = false,
}: {
  value: number | null;
  unit: string;
  compact?: boolean;
}) {
  if (value == null) {
    return (
      <Text className="text-lg font-semibold text-muted-foreground">
        No data
      </Text>
    );
  }

  return (
    <View className="flex-row items-end gap-1">
      <Text
        className={
          compact
            ? "text-2xl font-bold tracking-tight text-foreground"
            : "text-4xl font-bold tracking-tight text-foreground"
        }
      >
        {formatNumber(value)}
      </Text>

      <Text className="mb-1 text-sm font-medium text-muted-foreground">
        {unit}
      </Text>
    </View>
  );
}

function formatNumber(value: number) {
  if (value >= 10000) {
    return new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }

  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 1,
  }).format(value);
}
