import UpdateGoalScreen from "@/screens/goals/update-goal/UpdateGoalScreen";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditGoal() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();

  console.log("goalId in root", goalId);
  return (
    <SafeAreaView edges={["left", "right", "top"]} style={{ flex: 1 }}>
      <UpdateGoalScreen goalId={goalId} />
    </SafeAreaView>
  );
}
