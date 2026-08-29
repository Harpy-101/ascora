import ScreenHeader from "@/components/ui/screen-header";
import NewWorkoutPlanScreen from "@/screens/workouts/workout-plans/new/NewWorkoutPlanScreen";
import { WorkoutPlanFormValues } from "@/screens/workouts/workout-plans/validation/planExerciseSchema";
import { useRouter } from "expo-router";
import { useFormContext } from "react-hook-form";
import { Alert, ScrollView } from "react-native";

export default function NewWorkoutPlan() {
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
    <ScrollView className="flex-1 p-4 gap-2">
      <ScreenHeader
        title="New Workout Plan"
        showBack
        onBack={() => handleBack()}
      />
      <NewWorkoutPlanScreen />
    </ScrollView>
  );
}
