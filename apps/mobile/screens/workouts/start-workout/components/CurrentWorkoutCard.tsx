import { View } from "react-native";
import { Activity, ArrowRight } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import ThemedIcon from "@/components/ui/themed-icon";

type ActiveWorkoutSummary = {
  id: string;
  name: string | null;
  startedAt?: string | null;
};

type CurrentWorkoutCardProps = {
  workout: ActiveWorkoutSummary;
  onContinue: () => void;
};

export default function CurrentWorkoutCard({
  workout,
  onContinue,
}: CurrentWorkoutCardProps) {
  return (
    <View className="gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-4">
      <View className="flex-row items-start gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary">
          <ThemedIcon
            icon={Activity}
            size={21}
            colorToken="primaryForeground"
          />
        </View>

        <View className="flex-1 gap-1">
          <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Workout in progress
          </Text>

          <Text className="text-lg font-semibold">
            {workout.name ?? "Current workout"}
          </Text>

          <Text className="text-sm text-muted-foreground">
            Your progress is saved and ready to continue.
          </Text>
        </View>
      </View>

      <Button onPress={onContinue}>
        <Text>Continue workout</Text>

        <ThemedIcon
          icon={ArrowRight}
          size={18}
          colorToken="primaryForeground"
        />
      </Button>
    </View>
  );
}
