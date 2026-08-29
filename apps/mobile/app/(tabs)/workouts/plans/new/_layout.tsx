import { WorkoutPlanFormProvider } from "@/contexts/workout-plan-form-context";
import { Stack } from "expo-router";

export default function PlanCreationLayout() {
  return (
    <WorkoutPlanFormProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />

        <Stack.Screen name="exercises" />
      </Stack>
    </WorkoutPlanFormProvider>
  );
}
