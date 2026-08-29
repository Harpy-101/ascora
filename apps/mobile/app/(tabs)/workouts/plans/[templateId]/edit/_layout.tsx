import ScreenErrorState from "@/components/screen-states/ScreenErrorState";
import ScreenLoadingState from "@/components/screen-states/ScreenLoadingStates";
import { usePreferences } from "@/contexts/user-prefrences-context";
import { WorkoutPlanFormProvider } from "@/contexts/workout-plan-form-context";
import useGetWorkoutPlanById from "@/screens/workouts/workout-plans/edit/hooks/use-get-workout-plan-by-id";
import planToFormValues from "@/screens/workouts/workout-plans/functions/planToFormValues";
import { Stack, useLocalSearchParams } from "expo-router";

export default function EditWorkoutPlanLayout() {
  const params = useLocalSearchParams<{ templateId: string }>();
  const { data, isLoading, error, refetch } = useGetWorkoutPlanById(
    params.templateId,
  );
  const { weightUnit } = usePreferences();

  if (error || !data) {
    return <ScreenErrorState error={error} onRetry={refetch} />;
  }

  if (isLoading) {
    return <ScreenLoadingState />;
  }

  const formData = planToFormValues(data, weightUnit);

  return (
    <WorkoutPlanFormProvider formValues={formData}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />

        <Stack.Screen name="exercises" />
      </Stack>
    </WorkoutPlanFormProvider>
  );
}
