import { WorkoutPlanFormProvider } from "@/contexts/workout-plan-form-context";
import { Stack } from "expo-router";

export default function PlanCreationLayout() {
  return (
    <WorkoutPlanFormProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Create workout plan",
          }}
        />

        <Stack.Screen
          name="exercises"
          options={{
            title: "Exercise library",
          }}
        />
      </Stack>
    </WorkoutPlanFormProvider>
  );
}
