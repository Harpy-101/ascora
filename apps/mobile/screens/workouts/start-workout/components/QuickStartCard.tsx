import ThemedIcon from "@/components/ui/themed-icon";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Dumbbell, Plus } from "lucide-react-native";

type QuickStartCardProps = {
  isStarting: boolean;
  disabled: boolean;
  onStart: () => void;
};

export default function QuickStartCard({
  isStarting,
  disabled,
  onStart,
}: QuickStartCardProps) {
  return (
    <View className="gap-5 rounded-2xl border border-border bg-card p-4">
      <View className="flex-row items-start gap-4">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <ThemedIcon icon={Dumbbell} size={23} colorToken="primary" />
        </View>

        <View className="flex-1 gap-1">
          <Text className="font-semibold">Empty workout</Text>

          <Text className="text-sm leading-5 text-muted-foreground">
            Add exercises and sets as you train without using a saved plan.
          </Text>
        </View>
      </View>

      <Button disabled={disabled} onPress={onStart}>
        <ThemedIcon icon={Plus} size={18} colorToken="primaryForeground" />

        <Text>
          {isStarting ? "Starting workout..." : "Start empty workout"}
        </Text>
      </Button>
    </View>
  );
}
