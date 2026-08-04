import ActiveWorkoutScreen from "@/screens/workouts/active/ActiveWorkoutScreen";
import { Href, useLocalSearchParams } from "expo-router";

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
    <ActiveWorkoutScreen
      getExerciseLibraryUrl={getExerciseLibraryUrl}
      workoutId={workoutId}
    />
  );
}
