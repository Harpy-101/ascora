import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { WorkoutFormValues } from "@/lib/validation/exerciseSchemas";
import { useFormContext, useWatch } from "react-hook-form";
// import { NotebookPen } from "lucide-react-native";
import ExerciseList from "../components/ExerciseList";
import { Href, useRouter } from "expo-router";
import AutosaveIndicator from "@/lib/auto-save/components/AutosaveIndicator";
import useWorkoutAutoSave from "./hooks/use-workout-auto-save";
import completeWorkout from "./db/completeWorkout";
import prepareWorkoutForSave from "./functions/prepareWorkoutForSave";
import { usePreferences } from "@/contexts/user-prefrences-context";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { calculateWorkoutStats } from "./functions/calculateWorkoutStats";

type ActiveWorkoutScreenProps = {
  workoutId: string;
  getExerciseLibraryUrl: () => Href;
};

export default function ActiveWorkoutScreen({
  getExerciseLibraryUrl,
  workoutId,
}: ActiveWorkoutScreenProps) {
  const { weightUnit } = usePreferences();
  const router = useRouter();
  const form = useFormContext<WorkoutFormValues>();
  const { handleSubmit } = useFormContext<WorkoutFormValues>();
  const queryClient = useQueryClient();

  const autoSave = useWorkoutAutoSave({
    workoutId,
    form,
  });

  async function onSubmit(values: WorkoutFormValues) {
    console.log("form values", values);
    autoSave.pause();
    try {
      await autoSave.settleForFinalSave();
      const normolizedValues = prepareWorkoutForSave(values, weightUnit);
      await completeWorkout({ workoutId, values: normolizedValues });
      await queryClient.invalidateQueries({ queryKey: ["active-workout"] });
      router.back();
    } catch (error) {
      autoSave.resume();
      throw new Error(`Error while trying to complete workout: ${error}`);
    }
  }

  const exercises = useWatch({ control: form.control, name: "exercises" });

  const stats = useMemo(() => calculateWorkoutStats(exercises), [exercises]);

  function onInvalid(errors: unknown) {
    console.log("invalid workout", errors);
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerClassName="gap-4 p-4"
      >
        <Pressable onPress={() => Keyboard.dismiss()} className="gap-4">
          <AutosaveIndicator
            status={autoSave.status}
            lastSavedAt={autoSave.lastSavedAt}
            onRetry={() => {
              void autoSave.retry();
            }}
          />

          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium">Progress</Text>

              <Text className="text-sm text-muted-foreground">
                {stats.completedSets} / {stats.totalSets}
              </Text>
            </View>

            <View className="h-2 overflow-hidden rounded-full bg-muted">
              <View
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${stats.progressPercent}%`,
                }}
              />
            </View>
          </View>

          <View className="flex-row gap-2">
            <View className="flex-1 rounded-xl border border-border bg-card p-3">
              <Text className="text-xs text-muted-foreground text-center">
                Volume
              </Text>
              <Text className="text-lg font-semibold text-center">
                {stats.volume.toLocaleString(undefined, {
                  maximumFractionDigits: 1,
                })}{" "}
              </Text>
            </View>

            <View className="flex-1 rounded-xl border border-border bg-card p-3">
              <Text className="text-xs text-muted-foreground text-center">
                Exercises
              </Text>
              <Text className="text-lg font-semibold text-center">
                {stats.completedExercises} / {stats.totalExercises}
              </Text>
            </View>

            <View className="flex-1 rounded-xl border border-border bg-card p-3">
              <Text className="text-xs text-muted-foreground text-center">
                Rest
              </Text>
              <Text className="text-lg font-semibold text-center">01:30</Text>
            </View>
          </View>

          <View className="mt-4">
            <ExerciseList getExerciseLibraryUrl={getExerciseLibraryUrl} />
          </View>

          <Button onPress={handleSubmit(onSubmit, onInvalid)}>
            <Text>Finish Workout</Text>
          </Button>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
