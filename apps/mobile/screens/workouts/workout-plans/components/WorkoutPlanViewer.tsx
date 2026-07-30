import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { WorkoutPlanFormValues } from "../validation/planExerciseSchema";
import { Controller, useFormContext } from "react-hook-form";
import useCreateWorkoutPlan from "../new/hooks/use-create-workout-plan";
import { useRouter } from "expo-router";
import FormField from "@/screens/auth/components/FormField";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ThemedIcon from "@/components/ui/themed-icon";
import { Dumbbell, Plus } from "lucide-react-native";
import { PlanExerciseCard } from "./PlanExerciseCard";
import useUpdateWorkoutPlan from "../edit/hooks/use-update-workout-plan";
import { useWorkoutPlanForm } from "@/contexts/workout-plan-form-context";

type WorkoutPlanViewerProps = {
  mode: "edit" | "create";
  templateId?: string;
};

export default function WorkoutPlanViewer({
  mode,
  templateId,
}: WorkoutPlanViewerProps) {
  const router = useRouter();
  const form = useFormContext<WorkoutPlanFormValues>();

  const createPlan = useCreateWorkoutPlan();
  const updatePlan = useUpdateWorkoutPlan();

  const { exerciseFields, moveExercise, removeExercies } = useWorkoutPlanForm();
  // const { fields, remove, move } = useFieldArray({
  //   control: form.control,
  //   name: "exercises",
  // });

  const isSubmitting = createPlan.isPending;

  function openExercisePicker() {
    if (mode === "create") {
      router.push("/workouts/plans/new/exercises");
    } else if (mode === "edit") {
      if (!templateId) {
        throw new Error("Missing template id");
      }
      router.push({
        pathname: "/workouts/plans/[templateId]/edit/exercises",
        params: { templateId },
      });
    }
  }

  function onSubmit(values: WorkoutPlanFormValues) {
    console.log("Clicked on submit");
    if (mode === "create") {
      createPlan.mutate(values);
    } else if (mode === "edit") {
      if (!templateId) {
        throw new Error("Missing workout template id for update");
      }
      updatePlan.mutate({ payload: values, templateId: templateId });
      console.log("updated template");
    }
  }

  return (
    // <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-7 px-4 py-5 "
      >
        {/* <View className="flex-row items-center border-b border-border px-4 py-3">
          <Pressable
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="h-10 w-10 items-center justify-center rounded-full active:bg-muted"
          >
            <ThemedIcon icon={ChevronLeft} size={23} colorToken="foreground" />
          </Pressable>

          <View className="ml-2 flex-1">
            <Text className="text-lg font-semibold">New workout plan</Text>

            <Text className="text-xs text-muted-foreground">
              Build a reusable workout
            </Text>
          </View>
        </View> */}
        <View className="gap-4 ">
          <View className="gap-1">
            <Text className="font-semibold">Plan details</Text>

            <Text className="text-sm text-muted-foreground">
              Give this workout a name that is easy to recognize.
            </Text>
          </View>

          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormField label="Plan name" error={fieldState.error?.message}>
                <Input
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="For example, Upper body"
                  autoCapitalize="sentences"
                  returnKeyType="next"
                />
              </FormField>
            )}
          />

          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <FormField
                label="Description"
                //   optional
                error={fieldState.error?.message}
              >
                <Textarea
                  value={field.value ?? ""}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="What is this workout focused on?"
                />
              </FormField>
            )}
          />
        </View>

        <View className="gap-4">
          <View className="flex-row items-center justify-between gap-4">
            <View className="flex-1 gap-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-semibold">Exercises</Text>

                {exerciseFields.length > 0 ? (
                  <View className="rounded-full bg-muted px-2 py-0.5">
                    <Text className="text-xs font-medium text-muted-foreground">
                      {exerciseFields.length}
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text className="text-sm text-muted-foreground">
                Add exercises in the order you plan to perform them.
              </Text>
            </View>

            <Button size="sm" variant="outline" onPress={openExercisePicker}>
              <ThemedIcon icon={Plus} size={17} colorToken="foreground" />
              <Text>Add</Text>
            </Button>
          </View>

          {exerciseFields.length === 0 ? (
            <Pressable
              onPress={openExercisePicker}
              className="items-center gap-4 rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-10 active:bg-muted/40"
            >
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Dumbbell size={25} className="text-primary" />
              </View>

              <View className="items-center gap-1">
                <Text className="font-semibold">Add your first exercise</Text>

                <Text className="max-w-64 text-center text-sm leading-5 text-muted-foreground">
                  Search the exercise library and choose what belongs in this
                  workout.
                </Text>
              </View>
            </Pressable>
          ) : (
            <View className="gap-3">
              {exerciseFields.map((exercise, index) => (
                <PlanExerciseCard
                  key={exercise.id}
                  index={index}
                  form={form}
                  canMoveUp={index > 0}
                  canMoveDown={index < exerciseFields.length - 1}
                  onMoveUp={() => moveExercise(index, index - 1)}
                  onMoveDown={() => moveExercise(index, index + 1)}
                  onRemove={() => removeExercies(index)}
                />
              ))}

              <Button
                variant="outline"
                onPress={openExercisePicker}
                className="border-dashed"
              >
                <Plus size={18} className="text-foreground" />
                <Text>Add another exercise</Text>
              </Button>
            </View>
          )}

          {form.formState.errors.exercises?.message ? (
            <Text className="text-sm text-destructive">
              {form.formState.errors.exercises.message}
            </Text>
          ) : null}
        </View>

        <View className="rounded-2xl bg-muted/50 p-4">
          <Text className="font-medium">
            You can adjust it during a workout
          </Text>

          <Text className="mt-1 text-sm leading-5 text-muted-foreground">
            Starting this plan creates a separate workout. Changes made while
            training will not alter the saved plan.
          </Text>
        </View>

        {form.formState.errors.root?.server?.message ? (
          <View className="rounded-xl border border-destructive/30 bg-destructive/10 p-3">
            <Text className="text-sm text-destructive">
              {form.formState.errors.root.server.message}
            </Text>
          </View>
        ) : null}
        <View className=" bg-background/95">
          <Button
            disabled={isSubmitting}
            onPress={form.handleSubmit(onSubmit)}
            className="w-full"
          >
            <Text className="font-semibold">
              {isSubmitting ? "Saving plan..." : "Save plan"}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    // </SafeAreaView>
  );
}
