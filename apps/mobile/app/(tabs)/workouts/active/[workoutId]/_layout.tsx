import ScreenErrorState from "@/components/screen-states/ScreenErrorState";
import ScreenLoadingState from "@/components/screen-states/ScreenLoadingStates";
import { ActiveWorkoutFormProvider } from "@/contexts/active-workout-form-context";
import useGetCurrentWorkoutById from "@/screens/workouts/active/hooks/use-get-current-workout-by-id";
import { Stack, useLocalSearchParams } from "expo-router";

export default function ActiveWorkoutLayout() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  console.log("current workout id in the index fgile", workoutId);

  const { data, isLoading, isFetchedAfterMount, error, refetch } =
    useGetCurrentWorkoutById(workoutId || "");

  if (!workoutId) {
    return (
      <ScreenErrorState
        title="Invalid workout"
        message="The workout ID is missing."
      />
    );
  }

  if (isLoading || !isFetchedAfterMount) {
    return <ScreenLoadingState message="Loading workout..." />;
  }

  if (!data) {
    console.error("Got error", error?.message);
    return (
      <ScreenErrorState
        title="Could not load workout"
        error={error}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <ActiveWorkoutFormProvider formValues={data}>
      <Stack />
    </ActiveWorkoutFormProvider>
  );
}
