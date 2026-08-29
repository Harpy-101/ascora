import StartWorkoutScreen from "@/screens/workouts/start-workout/StartWorkoutScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StartWorkout() {
  return (
    <SafeAreaView edges={["right", "left", "top"]} style={{ flex: 1 }}>
      <StartWorkoutScreen />
    </SafeAreaView>
  );
}
