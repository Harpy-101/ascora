import { Text } from "@/components/ui/text";
import * as Haptics from "expo-haptics";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useWatch } from "react-hook-form";

export default function SetSetAsDoneButton({
  // completed,
  onPress,
  exerciseIndex,
  setIndex,
}: {
  completed: boolean;
  onPress: () => void;
  exerciseIndex: number;
  setIndex: number;
}) {
  const completed = useWatch({
    name: `exercises.${exerciseIndex}.sets.${setIndex}.completed`,
  });

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  async function handlePress() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = 0.85;
    scale.value = withSpring(1);
    onPress();
  }

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={animatedStyle}
        className={
          completed
            ? "h-9 w-9 items-center justify-center rounded-full bg-primary"
            : "h-9 w-9 items-center justify-center rounded-full border border-border"
        }
      >
        <Text
          className={completed ? "text-primary-foreground" : "text-foreground"}
        >
          ✓
        </Text>
      </Animated.View>
    </Pressable>
  );
}
