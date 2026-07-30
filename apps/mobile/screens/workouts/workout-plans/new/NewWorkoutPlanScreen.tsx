import { Alert, Pressable, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useFormContext } from "react-hook-form";
import { useRouter } from "expo-router";

import { Text } from "@/components/ui/text";
import { WorkoutPlanFormValues } from "../validation/planExerciseSchema";
import ThemedIcon from "@/components/ui/themed-icon";
import WorkoutPlanViewer from "../components/WorkoutPlanViewer";

export default function NewWorkoutPlanScreen() {
  const router = useRouter();
  const form = useFormContext<WorkoutPlanFormValues>();

  function handleBack() {
    if (!form.formState.isDirty) {
      router.back();
      return;
    }

    Alert.alert("Discard this plan?", "Your unsaved changes will be lost.", [
      {
        text: "Keep editing",
        style: "cancel",
      },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => router.back(),
      },
    ]);
  }

  return (
    <View className="flex-1">
      <View className="flex-row items-center border-b border-border px-4 py-3">
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
      </View>
      <WorkoutPlanViewer mode="create" />
    </View>
  );
}
