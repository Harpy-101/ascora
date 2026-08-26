import GoalsScreen from "@/screens/goals/GoalsScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Goals() {
  return (
    <SafeAreaView edges={["top", "right", "left"]} style={{ flex: 1 }}>
      <GoalsScreen />
    </SafeAreaView>
  );
}
