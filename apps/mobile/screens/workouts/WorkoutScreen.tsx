import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { NotebookPen } from "lucide-react-native";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WorkoutFormSchema,
  WorkoutFormValues,
} from "@/lib/validation/exerciseSchemas";
import ExerciseList from "./components/ExerciseList";

const mockExercises = [
  {
    id: "bench",
    name: "Bench Press",
    lastPerformance: "90kg × 5",
    pr: "100kg × 3",
    sets: [
      {
        id: "1",
        setNumber: 1,
        weight: "90",
        reps: "5",
        completed: true,
      },
      {
        id: "2",
        setNumber: 2,
        weight: "90",
        reps: "5",
        completed: true,
      },
      {
        id: "3",
        setNumber: 3,
        weight: "90",
        reps: "",
        completed: false,
      },
    ],
  },
];

export default function WorkoutsScreen() {
  const form = useForm({
    resolver: zodResolver(WorkoutFormSchema),
    defaultValues: {
      name: "Push Strength",
      notes: "",
      exercises: mockExercises,
    },
    mode: "onBlur",
    shouldFocusError: false,
  });

  function onSubmit(values: WorkoutFormValues) {
    console.log("form values", values);
  }

  function onInvalid(errors: unknown) {
    console.log("invalid workout", errors);
  }

  return (
    <FormProvider {...form}>
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
            <View className="flex-row justify-between">
              <Text variant="h1">Workouts</Text>
              <Button variant="outline" size="icon">
                <NotebookPen size={18} color="white" />
              </Button>
            </View>

            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm font-medium">Progress</Text>
                <Text className="text-sm text-muted-foreground"> 2 / 3</Text>
              </View>

              <View className="h-2 overflow-hidden rounded-full bg-muted">
                <View className="h-full w-[67%] rounded-full bg-primary" />
              </View>
            </View>

            <View className="flex-row gap-2">
              <View className="flex-1 rounded-xl border border-border bg-card p-3">
                <Text className="text-xs text-muted-foreground text-center">
                  Volume
                </Text>
                <Text className="text-lg font-semibold text-center">
                  1,080 kg
                </Text>
              </View>

              <View className="flex-1 rounded-xl border border-border bg-card p-3">
                <Text className="text-xs text-muted-foreground text-center">
                  Exercises
                </Text>
                <Text className="text-lg font-semibold text-center">1 / 4</Text>
              </View>

              <View className="flex-1 rounded-xl border border-border bg-card p-3">
                <Text className="text-xs text-muted-foreground text-center">
                  Rest
                </Text>
                <Text className="text-lg font-semibold text-center">01:30</Text>
              </View>
            </View>

            <View className="mt-4">
              <ExerciseList />
            </View>

            <Button onPress={form.handleSubmit(onSubmit, onInvalid)}>
              <Text>Finish Workout</Text>
            </Button>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </FormProvider>
  );
}
