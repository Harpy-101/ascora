import { View } from "react-native";
import WorkoutPlanViewer from "../components/WorkoutPlanViewer";

export default function NewWorkoutPlanScreen() {
  return (
    <View className="flex-1 pb-6">
      <WorkoutPlanViewer mode="create" />
    </View>
  );
}
