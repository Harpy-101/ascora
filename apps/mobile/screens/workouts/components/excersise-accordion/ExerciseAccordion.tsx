import { Text } from "@/components/ui/text";
import { Keyboard, Pressable, View } from "react-native";
import { ChevronDown } from "lucide-react-native";
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
import { Button } from "@/components/ui/button";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { WorkoutFormValues } from "@/lib/validation/exerciseSchemas";
import SetRow from "../SetRow";
import ExerciseAccordionDropDownMenu from "./ExerciseAccordionDropDownMenu";

export default function ExerciseAccordion({
  exerciseIndex,
  onRemoveExercise,
}: {
  exerciseIndex: number;
  onRemoveExercise: () => void;
}) {
  const { control, setValue } = useFormContext<WorkoutFormValues>();
  const {
    fields: setFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `exercises.${exerciseIndex}.sets`,
  });

  const exercise = useWatch({
    control,
    name: `exercises.${exerciseIndex}` as const,
  });

  const expanded = useSharedValue(false);
  const accordionHeight = useSharedValue(0);
  const messuredHeight = useSharedValue(0);
  const contentProgress = useSharedValue(0);

  const HEIGHT_BUFFER = 15;

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

  function toggleSetCompleted(setIndex: number) {
    Keyboard.dismiss();

    const current = exercise.sets[setIndex];

    setValue(
      `exercises.${exerciseIndex}.sets.${setIndex}.completed` as const,
      !current.completed,
      {
        shouldDirty: true,
        shouldValidate: false,
      },
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
    append({
      id: `temp-set-${Date.now()}`,
      setNumber: setFields.length + 1,
      weight: "",
      reps: "",
      completed: false,
    });
  }

  function deleteSet(setIndex: number) {
    remove(setIndex);
  }

  return (
    <View className="rounded-xl border border-border bg-card p-4">
      <View className="flex-row items-center">
        <Pressable
          onPress={toggle}
          className="flex-1 justify-center"
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* <View className="min-w-0"> */}
          <Text
            className="text-lg font-semibold "
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {exercise.name}
          </Text>

          <View className="mt-2 flex-row gap-1">
            {setFields.map((set) => (
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
          {/* </View> */}
        </Pressable>

        <View className="ml-2 shrink-0 flex-row items-center gap-2">
          <ExerciseAccordionDropDownMenu
            exerciseName={exercise.name}
            onRemoveExercise={onRemoveExercise}
          />
          {/* <Pressable onPress={onRemoveExercise}>
            <Ellipsis color="white" />
          </Pressable> */}
          <Pressable onPress={toggle} hitSlop={10}>
            <Animated.View style={iconStyle}>
              <ChevronDown color="white" />
            </Animated.View>
          </Pressable>
        </View>
      </View>

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

            {setFields.map((set, index) => (
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
                  onPress={() => toggleSetCompleted(index)}
                  setIndex={index}
                  exerciseIndex={exerciseIndex}
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

            {setFields.map((set, index) => (
              <Animated.View
                key={set.id}
                layout={LinearTransition.duration(180)}
                exiting={FadeOutLeft.duration(220)}
                entering={FadeInRight.duration(220)}
              >
                <SetRow
                  set={set}
                  onToggleCompleted={() => toggleSetCompleted(index)}
                  onDelete={() => deleteSet(index)}
                  exerciseIndex={exerciseIndex}
                  setIndex={index}
                />
              </Animated.View>
            ))}

            <Animated.View layout={LinearTransition.duration(180)}>
              <Button
                variant="outline"
                className="self-end px-4 py-2"
                onPress={addSet}
              >
                <Text className="text-sm">+ Set</Text>
              </Button>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}
