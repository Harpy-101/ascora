import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import ThemedIcon from "@/components/ui/themed-icon";
import { RefreshCw } from "lucide-react-native";

type WorkoutPlansErrorStateProps = {
  onRetry: () => void;
};

export default function WorkoutPlansErrorState({
  onRetry,
}: WorkoutPlansErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-6">
      <Text className="text-lg font-semibold">Plans could not be loaded</Text>

      <Text className="text-center text-sm text-muted-foreground">
        Something went wrong while reading your saved workout plans.
      </Text>

      <Button variant="outline" onPress={onRetry}>
        <ThemedIcon icon={RefreshCw} size={17} colorToken="foreground" />
        <Text>Try again</Text>
      </Button>
    </View>
  );
}
