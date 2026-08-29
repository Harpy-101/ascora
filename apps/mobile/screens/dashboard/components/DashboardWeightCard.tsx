import { WeightEntry } from "@/screens/weight/types";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import Sparkline from "@/components/charts/spark-line/SpartkLine";
import { usePreferences } from "@/contexts/user-prefrences-context";

type DashboardWeightCardProps = {
  entries: WeightEntry[];
};

export default function DashboardWeightCard({
  entries,
}: DashboardWeightCardProps) {
  const { displayWeight, weightUnit } = usePreferences();
  const router = useRouter();

  if (entries.length === 0) {
    return (
      <View className="rounded-2xl border border-border bg-card p-4">
        <Text className="font-semibold">No weight recorded</Text>

        <Text className="mt-1 text-sm text-muted-foreground">
          Log your weight to start tracking your trend.
        </Text>

        <Button className="mt-4" onPress={() => router.push("/weight/new")}>
          <Text>Log weight</Text>
        </Button>
      </View>
    );
  }

  const sorted = [...entries].sort(
    (a, b) =>
      new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  );

  const latest = sorted[0];

  const thirtyDayEntries = getEntriesFromLastDays(sorted, 30);

  const change = calculatePeriodChange(thirtyDayEntries);

  return (
    <Pressable
      onPress={() => router.push("/weight")}
      className="rounded-2xl border border-border bg-card p-4"
    >
      <View className="flex-row items-center">
        <View className="flex-1">
          <View className="flex-row items-baseline">
            <Text className="text-3xl font-semibold text-foreground">
              {displayWeight(latest.weightInKg).toFixed(1)}
            </Text>

            <Text className="ml-1 text-base text-muted-foreground">
              {weightUnit}
            </Text>
          </View>

          {change !== null && (
            <Text className="mt-1 text-sm text-muted-foreground">
              {change > 0 ? "↑" : change < 0 ? "↓" : "→"}{" "}
              {Math.abs(change).toFixed(1)} {weightUnit} in 30 days
            </Text>
          )}
        </View>

        <View className="w-36">
          <Sparkline
            data={thirtyDayEntries}
            getDate={(entry) => entry.recordedAt}
            getValue={(entry) => displayWeight(entry.weightInKg)}
          />
        </View>
      </View>
    </Pressable>
  );
}

function getEntriesFromLastDays(entries: WeightEntry[], days: number) {
  const cutoff = new Date();

  cutoff.setDate(cutoff.getDate() - days);

  return entries.filter((entry) => new Date(entry.recordedAt) >= cutoff);
}

function calculatePeriodChange(entries: WeightEntry[]) {
  if (entries.length < 2) {
    return null;
  }

  const sorted = [...entries].sort(
    (a, b) =>
      new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
  );

  const first = sorted[0];
  const latest = sorted[sorted.length - 1];

  return latest.weightInKg - first.weightInKg;
}
