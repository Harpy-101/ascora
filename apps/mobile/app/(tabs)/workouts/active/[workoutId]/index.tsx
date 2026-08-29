import ScreenHeader from "@/components/ui/screen-header";
import ActiveWorkoutScreen from "@/screens/workouts/active/ActiveWorkoutScreen";
import { Href, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActiveWorkout() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  console.log("current workout id in the index fgile", workoutId);

  function getExerciseLibraryUrl(): Href {
    return {
      pathname: "/workouts/active/[workoutId]/exercises",
      params: {
        workoutId: workoutId,
      },
    };
  }

  return (
    <SafeAreaView edges={["left", "right", "top"]} style={{ flex: 1 }}>
      <ScrollView>
        <ScreenHeader title="Workout" showBack />
        <ActiveWorkoutScreen
          getExerciseLibraryUrl={getExerciseLibraryUrl}
          workoutId={workoutId}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
