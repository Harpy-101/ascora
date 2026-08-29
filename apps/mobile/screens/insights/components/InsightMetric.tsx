import { View } from "react-native";

import { Text } from "@/components/ui/text";

type InsightMetricProps = {
  value: string | number;
  label: string;
};

export default function InsightMetric({ value, label }: InsightMetricProps) {
  return (
    <View className="gap-0.5">
      <Text className="font-semibold text-foreground">{value}</Text>

      <Text className="text-xs text-muted-foreground">{label}</Text>
    </View>
  );
}
