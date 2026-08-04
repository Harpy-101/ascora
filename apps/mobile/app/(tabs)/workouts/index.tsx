import { ActiveWorkoutFormProvider } from "@/contexts/active-workout-form-context";
import WorkoutsScreen from "@/screens/workouts/WorkoutScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkoutsTab() {
  return (
    <ActiveWorkoutFormProvider>
      <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1 }}>
        <WorkoutsScreen />
      </SafeAreaView>
    </ActiveWorkoutFormProvider>
  );
}
