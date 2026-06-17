import WorkoutsScreen from "@/screens/workouts/WorkoutScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkoutsTab() {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1 }}>
      <WorkoutsScreen />
    </SafeAreaView>
  );
}
