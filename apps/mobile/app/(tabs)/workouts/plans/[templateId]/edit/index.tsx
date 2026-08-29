import ScreenHeader from "@/components/ui/screen-header";
import WorkoutPlanViewer from "@/screens/workouts/workout-plans/components/WorkoutPlanViewer";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";

export default function EditWorkoutPlan() {
  const params = useLocalSearchParams<{ templateId: string }>();

  return (
    <ScrollView className="flex-1 p-4">
      <ScreenHeader title="Edit Workout Plan" showBack />
      <View className="pb-6">
        <WorkoutPlanViewer mode="edit" templateId={params.templateId} />
      </View>
    </ScrollView>
  );
}
