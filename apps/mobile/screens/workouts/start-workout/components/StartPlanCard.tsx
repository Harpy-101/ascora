import { View } from "react-native";
import { Play } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import ThemedIcon from "@/components/ui/themed-icon";

type WorkoutPlanSummary = {
  id: string;
  name: string;
  description: string | null;
  exerciseCount?: number;
};

type StartPlanCardProps = {
  plan: WorkoutPlanSummary;
  isStarting: boolean;
  disabled: boolean;
  onStart: () => void;
};

export default function StartPlanCard({
  plan,
  isStarting,
  disabled,
  onStart,
}: StartPlanCardProps) {
  return (
    <View className="flex-row items-center gap-4 rounded-2xl border border-border bg-card p-4">
      <View className="flex-1 gap-1">
        <Text className="font-semibold">{plan.name}</Text>

        {plan.description ? (
          <Text
            numberOfLines={2}
            className="text-sm leading-5 text-muted-foreground"
          >
            {plan.description}
          </Text>
        ) : null}

        {plan.exerciseCount !== undefined ? (
          <Text className="mt-1 text-xs text-muted-foreground">
            {plan.exerciseCount}{" "}
            {plan.exerciseCount === 1 ? "exercise" : "exercises"}
          </Text>
        ) : null}
      </View>

      <Button size="sm" disabled={disabled} onPress={onStart}>
        <ThemedIcon icon={Play} size={16} colorToken="primaryForeground" />

        <Text>{isStarting ? "Starting..." : "Start"}</Text>
      </Button>
    </View>
  );
}
