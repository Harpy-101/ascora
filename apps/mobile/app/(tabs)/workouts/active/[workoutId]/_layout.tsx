import ScreenErrorState from "@/components/screen-states/ScreenErrorState";
import ScreenLoadingState from "@/components/screen-states/ScreenLoadingStates";
import { ActiveWorkoutFormProvider } from "@/contexts/active-workout-form-context";
import { usePreferences } from "@/contexts/user-prefrences-context";
import workoutToFormValues from "@/screens/workouts/active/functions/workoutToFormValues";
import useGetCurrentWorkoutById from "@/screens/workouts/active/hooks/use-get-current-workout-by-id";
import { Stack, useLocalSearchParams } from "expo-router";

export default function ActiveWorkoutLayout() {
  const { weightUnit } = usePreferences();
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();

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
    <ActiveWorkoutFormProvider
      formValues={workoutToFormValues(data, weightUnit)}
    >
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="[exerciseId]" options={{ headerShown: false }} />
      </Stack>
    </ActiveWorkoutFormProvider>
  );
}
