import { Text } from "@/components/ui/text";
import { useState } from "react";
import { Dimensions, Keyboard, Pressable, View } from "react-native";
import { ChevronUp, Trash2 } from "lucide-react-native";
import SetSetAsDoneButton from "./lib/SetSetAsDoneButton";
import Animated, {
  Easing,
  FadeInRight,
  FadeOutLeft,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Input } from "@/components/ui/input";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { scheduleOnRN } from "react-native-worklets";

type Exercise = {
  id: string;
  name: string;
  lastPerformance?: string;
  pr?: string;
  sets: {
    id: string;
    setNumber: number;
    weight: string;
    reps: string;
    completed: boolean;
  }[];
};

export default function ExerciseAccordion({
  exercise,
}: {
  exercise: Exercise;
}) {
  const [sets, setSets] = useState(exercise.sets);
  const expanded = useSharedValue(false);

  const SCREEN_WIDTH = Dimensions.get("window").width;

  const accordionHeight = useSharedValue(0);
  const messuredHeight = useSharedValue(0);
  const contentProgress = useSharedValue(0);

  const HEIGHT_BUFFER = 12;

  const heightAnimationStyle = useAnimatedStyle(() => ({
    height: accordionHeight.value,
    overflow: "hidden",
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentProgress.value,
    transform: [{ translateY: (1 - contentProgress.value) * -8 }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${contentProgress.value * 180}deg` }],
  }));

  if (!exercise) {
    return null;
  }

  function toggleSetCompleted(setId: string) {
    Keyboard.dismiss();

    setSets((current) =>
      current.map((set) =>
        set.id === setId ? { ...set, completed: !set.completed } : set,
      ),
    );
  }

  function toggle() {
    const nextExpand = !expanded.value;
    expanded.value = nextExpand;

    accordionHeight.value = withTiming(
      nextExpand ? messuredHeight.value + HEIGHT_BUFFER : 0,
      {
        duration: 250,
        easing: Easing.inOut(Easing.quad),
      },
    );

    contentProgress.value = withTiming(nextExpand ? 1 : 0, {
      duration: 250,
      easing: Easing.inOut(Easing.quad),
    });
  }

  function addSet() {
    const newSet = {
      id: `temp-${Date.now()}`,
      setNumber: sets.length + 1,
      weight: "",
      reps: "",
      completed: false,
    };
    setSets((curr) => [...curr, newSet]);
  }

  function deleteSet(id: string) {
    setSets((current) =>
      current
        .filter((curr) => curr.id !== id)
        .map((set, index) => ({
          ...set,
          setNumber: index + 1,
        })),
    );
  }

  function SetRow({
    set,
    onDelete,
    onToggleCompleted,
  }: {
    set: Exercise["sets"][number];
    onDelete: () => void;
    onToggleCompleted: () => void;
  }) {
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

            <Input
              defaultValue={set.weight}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
              className="flex-1 text-center"
            />

            <Input
              defaultValue={set.reps}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
              className="flex-1 text-center"
            />

            <SetSetAsDoneButton
              completed={set.completed}
              onPress={onToggleCompleted}
            />
          </View>
        </ReanimatedSwipeable>
      </Animated.View>
    );
  }

  return (
    <View className="rounded-xl border border-border bg-card p-4">
      <Pressable
        onPress={toggle}
        className="flex-row items-center justify-between"
      >
        <View>
          <Text className="text-lg font-semibold">{exercise.name}</Text>

          <Text className="mt-1 text-sm text-muted-foreground">
            {`Last: ${exercise.lastPerformance ?? "No history"} · PR: ${
              exercise.pr ?? "None"
            }`}
          </Text>

          <View className="mt-2 flex-row gap-1">
            {sets.map((set) => (
              <View
                key={set.id}
                className={
                  set.completed
                    ? "h-2 w-2 rounded-full bg-primary"
                    : "h-2 w-2 rounded-full bg-muted"
                }
              />
            ))}
          </View>
        </View>

        <Animated.View style={iconStyle}>
          <ChevronUp color="white" />
        </Animated.View>
      </Pressable>

      <View className="relative">
        <View
          className="absolute left-0 right-0 opacity-0"
          pointerEvents="none"
          onLayout={(event) => {
            const newHeight = event.nativeEvent.layout.height;

            messuredHeight.value = newHeight;

            if (expanded.value) {
              accordionHeight.value = withTiming(newHeight + HEIGHT_BUFFER, {
                duration: 220,
                easing: Easing.inOut(Easing.quad),
              });
            }
          }}
        >
          <View className="mt-4 gap-3">
            <View className="flex-row items-center">
              <Text className="w-12 text-xs text-white">SET</Text>
              <Text className="flex-1 text-xs text-white">WEIGHT</Text>
              <Text className="flex-1 text-xs text-white">REPS</Text>
              <Text className="w-10 text-xs text-white">DONE</Text>
            </View>

            {sets.map((set) => (
              <View key={set.id} className="flex-row items-center gap-2">
                <Text className="w-12 text-card-foreground">
                  {set.setNumber}
                </Text>

                <Input
                  defaultValue={set.weight}
                  keyboardType="numeric"
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-foreground"
                />

                <Input
                  defaultValue={set.reps}
                  keyboardType="numeric"
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-foreground"
                />

                <SetSetAsDoneButton
                  completed={set.completed}
                  onPress={() => toggleSetCompleted(set.id)}
                />
              </View>
            ))}
          </View>

          <Pressable className="self-end rounded-full border border-border px-4 py-2">
            <Text className="text-sm text-foreground">+ Set</Text>
          </Pressable>
        </View>

        <Animated.View style={heightAnimationStyle}>
          <Animated.View style={contentStyle} className="mt-4 gap-3">
            <View className="flex-row">
              <Text className="w-12 text-xs text-white text-center">SET</Text>
              <Text className="flex-1 text-xs text-white text-center">
                WEIGHT
              </Text>
              <Text className="flex-1 text-xs text-white text-center">
                REPS
              </Text>
              <Text className="w-10 text-xs text-white text-center">DONE</Text>
            </View>

            {sets.map((set) => (
              <Animated.View
                key={set.id}
                layout={LinearTransition.duration(180)}
                exiting={FadeOutLeft.duration(220)}
                entering={FadeInRight.duration(220)}
              >
                <SetRow
                  set={set}
                  onToggleCompleted={() => toggleSetCompleted(set.id)}
                  onDelete={() => deleteSet(set.id)}
                />
              </Animated.View>
            ))}

            <Animated.View layout={LinearTransition.duration(180)}>
              <Pressable
                className="self-end rounded-full border border-border px-4 py-2"
                onPress={addSet}
              >
                <Text className="text-sm text-foreground">+ Set</Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}
