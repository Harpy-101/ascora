import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import ThemedIcon from "@/components/ui/themed-icon";
import { Dumbbell, Plus } from "lucide-react-native";
import { View } from "react-native";

type WorkoutPlansEmptyStateProps = {
  onCreatePlan: () => void;
};

export default function WorkoutPlansEmptyState({
  onCreatePlan,
}: WorkoutPlansEmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-5 px-6 py-16">
      <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <ThemedIcon icon={Dumbbell} size={29} colorToken="foreground" />
      </View>

      <View className="items-center gap-2">
        <Text className="text-xl font-semibold">
          Build your first workout plan
        </Text>

        <Text className="max-w-xs text-center text-sm leading-5 text-muted-foreground">
          Save your exercises, sets, and targets once, then use the plan
          whenever you start a workout.
        </Text>
      </View>

      <Button onPress={onCreatePlan}>
        <ThemedIcon icon={Plus} size={18} colorToken="primaryForeground" />
        <Text>Create a workout plan</Text>
      </Button>
    </View>
  );
}
