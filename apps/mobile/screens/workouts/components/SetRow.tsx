import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Exercise } from "../types";
import { scheduleOnRN } from "react-native-worklets";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Dimensions, Pressable, View } from "react-native";
import { Trash2 } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import SetSetAsDoneButton from "./excersise-accordion/lib/SetSetAsDoneButton";
import { useFormContext } from "react-hook-form";
import { WorkoutFormValues } from "@/lib/validation/exerciseSchemas";
import ControlledInput from "./ControlledInput";

export default function SetRow({
  set,
  onDelete,
  onToggleCompleted,
  exerciseIndex,
  setIndex,
}: {
  set: Exercise["sets"][number];
  onDelete: () => void;
  onToggleCompleted: () => void;
  exerciseIndex: number;
  setIndex: number;
}) {
  const SCREEN_WIDTH = Dimensions.get("window").width;

  const { control } = useFormContext<WorkoutFormValues>();

  const deleteProgress = useSharedValue(0);

  const rowDeleteStyle = useAnimatedStyle(() => ({
    opacity: 1 - deleteProgress.value,
    transform: [{ translateX: deleteProgress.value * SCREEN_WIDTH }],
  }));

  function handleDelete() {
    deleteProgress.value = withTiming(1, { duration: 180 }, (finisehd) => {
      if (finisehd) {
        scheduleOnRN(onDelete);
      }
    });
  }

  return (
    <Animated.View style={rowDeleteStyle}>
      <ReanimatedSwipeable
        overshootRight={false}
        friction={2}
        rightThreshold={40}
        renderRightActions={() => (
          <Pressable
            onPress={handleDelete}
            className="ml-2 w-20 items-center justify-center rounded-md bg-destructive"
          >
            <Trash2 size={18} color="white" />
          </Pressable>
        )}
      >
        <View className="flex-row items-center gap-2 bg-card">
          <Text className="w-12 text-card-foreground text-center">
            {set.setNumber}
          </Text>

          <ControlledInput
            control={control}
            name={`exercises.${exerciseIndex}.sets.${setIndex}.weight`}
          />

          <ControlledInput
            control={control}
            name={`exercises.${exerciseIndex}.sets.${setIndex}.reps`}
          />

          <SetSetAsDoneButton
            completed={set.completed}
            onPress={onToggleCompleted}
            exerciseIndex={exerciseIndex}
            setIndex={setIndex}
          />
        </View>
      </ReanimatedSwipeable>
    </Animated.View>
  );
}
