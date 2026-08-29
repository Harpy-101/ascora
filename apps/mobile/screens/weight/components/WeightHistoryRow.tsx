import { Pressable, View } from "react-native";
import { WeightEntry } from "../types";
import { Text } from "@/components/ui/text";
import ThemedIcon from "@/components/ui/themed-icon";
import { ChevronRight } from "lucide-react-native";
import { usePreferences } from "@/contexts/user-prefrences-context";

type WeightHistoryRowProps = {
  entry: WeightEntry;
  previousEntry?: WeightEntry;
  onPress: () => void;
};

export default function WeightHistoryRow({
  entry,
  previousEntry,
  onPress,
}: WeightHistoryRowProps) {
  const { displayWeight, weightUnit } = usePreferences();

  const delta = previousEntry
    ? entry.weightInKg - previousEntry.weightInKg
    : null;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between py-4"
      accessibilityRole="button"
      accessibilityLabel={`Weight entry ${entry.weightInKg} kilograms`}
    >
      <View className="gap-1">
        <Text className="font-medium text-foreground">
          {formatWeightDate(entry.recordedAt)}
        </Text>

        {delta !== null && delta !== 0 ? (
          <Text className="text-xs text-muted-foreground">
            {delta > 0 ? "↑" : "↓"} {Math.abs(delta).toFixed(1)} kg
          </Text>
        ) : null}
      </View>

      <View className="flex-row items-center gap-3">
        <View className="items-end">
          <Text className="text-lg font-semibold text-foreground">
            {displayWeight(entry.weightInKg).toFixed(1)}
            <Text className="text-sm font-normal text-muted-foreground">
              {" "}
              {weightUnit}
            </Text>
          </Text>
        </View>

        <ThemedIcon
          icon={ChevronRight}
          size={18}
          colorToken="mutedForeground"
        />
      </View>
    </Pressable>
  );
}

function formatWeightDate(date: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
