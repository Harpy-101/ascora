import NewGoalScreen from "@/screens/goals/new-goal/NewGoalScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewGoal() {
  return (
    <SafeAreaView edges={["left", "right", "top"]} style={{ flex: 1 }}>
      <NewGoalScreen />
    </SafeAreaView>
  );
}
